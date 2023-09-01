import {Box, Chip, Fab, IconButton, Stack, TextField, Typography} from '@mui/material'
import {useTranslation} from 'next-i18next'
import React, {useEffect, useRef, useState} from 'react';
import dynamic from "next/dynamic";
import {useRequest, useRequestMutation} from "@lib/axios";
import {getBirthdayFormat, useMedicalEntitySuffix} from "@lib/hooks";
import {useAppSelector} from "@lib/redux/hooks";
import {dashLayoutSelector} from "@features/base";
import {consultationSelector} from "@features/toolbar";
import {ChatMsg} from "@features/ChatMsg";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

function ChatDiscussionDialog({...props}) {
    const {data} = props;

    const {appointment, exam, reasons, app_uuid, setOpenChat, patient} = data
    const {trigger: triggerChat} = useRequestMutation(null, "/chat/ai");
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {medicalProfessionalData} = useAppSelector(dashLayoutSelector);
    const {patientAntecedent} = useAppSelector(consultationSelector);

    const [text, setText] = useState<string>("");
    const [messages, setMessages] = useState<any[]>([]);
    const [loadingResponse, setLoadingResponse] = useState<boolean>(false);
    const [loadingContainer, setLoadingContainer] = useState<boolean>(true);

    const listRef = useRef<any>();

    const suggestions = [
        {name: 'opinion', message: 'opinion'},
        {name: 'health', message: 'askHealth'},
        {name: 'advice', message: 'fiveadvice'},
    ]

    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})

    const {data: httpChatResponse} = useRequest({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/patients/${appointment.patient.uuid}/chat`
    }, SWRNoValidateConfig);
    const msgGenerator = (todo: string) => {
        let msg = '';
        if (medicalProfessionalData) {
            msg = `${t('chat.im')} ${medicalProfessionalData[0]?.medical_professional.specialities[0].speciality.name}, ${t('chat.mypatient')} ${appointment.patient.firstName} ${appointment.patient.lastName}`;
            if (appointment.patient.birthdate)
                msg += ` ${getBirthdayFormat(appointment.patient, t).trim()} `;
            if (appointment.patient.gender)
                msg += ` ${t('chat.sexe')} ${appointment.patient.gender === 'F' ? t('chat.feminine') : t('chat.male')}`;

            msg += ` ${t('chat.date')} ${appointment.day_date}`
            if (exam.motif.length > 0) {
                msg += ` ${t('chat.reason')} ${reasons.find((reason: {
                    uuid: any;
                }) => reason.uuid === exam.motif[0]).name}` //UUID
            }
            if (localStorage.getItem("Modeldata" + app_uuid) !== null) {
                let txtModel = ''
                const models = JSON.parse(localStorage.getItem("Modeldata" + app_uuid) as string);
                Object.keys(models).forEach(key => {
                    if (models[key])
                        txtModel += ` ${key}=${models[key]}`;
                })
                if (txtModel.length > 0) msg += ` ${t('chat.with')} ${txtModel}`
            }

            if (exam.notes)
                msg += `. ${t('chat.observation')}: ${exam.notes}`
            if (exam.diagnosis)
                msg += `. ${t('chat.diagnostic')}: ${exam.diagnosis}`
            if (exam.disease && exam.disease.length > 0) {
                msg += ` ${t('chat.disease')}:`
                exam.disease.forEach(((disease: string) => msg += ` ${disease},`))
            }
            if (Object.keys(patientAntecedent).length > 0) {
                msg += ` .${t('chat.antecedents')}`
                Object.keys(patientAntecedent).forEach(antecedent => {
                    msg += `-${antecedent}: (`
                    patientAntecedent[antecedent].forEach((pa: { name: any; }) => {
                        msg += ` ${pa.name},`
                    })
                    msg = msg.replace(/.$/, ")")
                })
            }
            if (appointment.patient.treatment.length > 0) {
                msg += ` ${t('chat.treatment')}:`
                appointment.patient.treatment.forEach((treatment: { name: any; }) => msg += ` -${treatment.name}`)
            }
            if (appointment.patient.requestedAnalyses.length > 0) {
                msg += `. ${t('chat.analyses')}:`
                appointment.patient.requestedAnalyses.forEach((analyse: { hasAnalysis: any[]; }) => {
                    analyse.hasAnalysis.forEach(ha => {
                        msg += ` -${ha.analysis.name}`
                    })
                })
            }
            if (appointment.patient.requestedImaging.length > 0) {
                msg += `. ${t('chat.mi')}:`
                appointment.patient.requestedImaging?.forEach((ri: { [x: string]: any[]; }) => {
                    ri['medical-imaging']?.forEach(mi => {
                        msg += ` - ${mi['medical-imaging'].name}`
                    })
                })
            }

            msg += `. ${t('chat.note')} ,; ${todo} `
        }

        return msg;
    }
    const sendToAI = (todo: string, msg: { from: string, to: string, message: string }) => {
        setLoadingResponse(true)
        const form = new FormData();
        form.append('message', msgGenerator(todo));
        triggerChat({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/appointments/${app_uuid}/chat`,
            data: form
        }).then((r) => {
            const res = (r?.data as HttpResponse).data;
            setMessages([{from: 'chat', to: 'me', message: res.message}, msg, ...messages])
            setLoadingResponse(false)
        })
    }
    const send = () => {
        setMessages([{from: 'me', to: 'chat', message: text}, ...messages])
        sendToAI(text, {from: 'me', to: 'chat', message: text})
        setText('');
    }

    useEffect(() => {
        if (listRef.current)
            setLoadingContainer(false);
    }, [listRef])

    useEffect(() => {
        if (httpChatResponse) {
            let _messages: { from: string, to: string, message: string }[] = [];
            const data = (httpChatResponse as HttpResponse).data;
            data.map((msg: { request: any; message: any; }) => {
                _messages = [
                    {from: 'chat', to: 'me', message: msg.message},
                    {
                        from: 'me',
                        to: 'chat',
                        message: msg.request.split(',;')[msg.request.split(',;').length - 1]
                    },
                    ..._messages

                ]
            });
            setMessages([..._messages])
        }
    }, [httpChatResponse])
    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <Stack>
            <IconButton onClick={() => {
                setOpenChat(false)
            }} sx={{
                display: {sm: "none"},
                position: "absolute",
                right: 20,
                top: 15
            }}>
                <CloseRoundedIcon/>
            </IconButton>
            {!loadingContainer && <div style={{
                width: "100%",
                padding: 10,
                height: window.innerHeight - listRef.current.clientHeight - 2,
                overflowY: "auto",
                flexDirection: "column-reverse",
                display: "flex"
            }}>
                {
                    loadingResponse &&
                    <Typography fontSize={12} color={"grey"} mb={1}
                                ml={2}>{t('chat.wait')}</Typography>
                }
                {messages.map((msg,index) => (
                    <Box key={`msg-${index}`}>
                        {
                            msg.from !== "chat" ? <ChatMsg
                                    avatar={''}
                                    side={'right'}
                                    messages={[msg.message]}
                                /> :
                                <ChatMsg
                                    avatar={''}
                                    side={'left'}
                                    messages={[msg.message]}
                                />
                        }
                    </Box>
                ))}

            </div>}
            <Box padding={2} ref={listRef} style={{
                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
            }}>
                {suggestions.map((suggestion,index) => (
                    <Chip key={`${suggestion} ${index}`}
                          disabled={loadingResponse}
                          style={{marginRight: 5, marginBottom: 5}}
                          onClick={() => {
                              setMessages([{
                                  from: 'me',
                                  to: 'chat',
                                  message: t(`chat.${suggestion.message}`)
                              }, ...messages])

                              sendToAI(t(`chat.${suggestion.message}`), {
                                  from: 'me',
                                  to: 'chat',
                                  message: t(`chat.${suggestion.message}`)
                              })
                          }} label={t(`chat.${suggestion.name}`)}/>
                ))}

                <Stack direction={"row"} spacing={2} pt={1} alignItems={"center"}>
                    <TextField
                        fullWidth
                        size="small"
                        value={text}
                        inputProps={{style: {background: "white"}}}
                        onChange={event => {
                            setText(event.target.value)
                        }}
                        onKeyDown={(e) => {
                            if (e.keyCode === 13) {
                                send();
                            }
                        }}
                        placeholder={"Aaa..."}/>
                    <Fab color="primary"
                         size={"small"}
                         style={{height: 0}}
                         disabled={loadingResponse || text.length === 0}
                         onClick={() => {
                             send();
                         }}>
                        <SendRoundedIcon/>
                    </Fab>
                </Stack>
            </Box>
        </Stack>


    )
}

export default ChatDiscussionDialog

import {Box, Chip, Fab, IconButton, Stack, TextField} from '@mui/material'
import {useTranslation} from 'next-i18next'
import React, {useEffect, useRef, useState} from 'react';
import dynamic from "next/dynamic";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {ChatMsg} from "@features/ChatMsg";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import moment from "moment-timezone";
import {Player} from "@lottiefiles/react-lottie-player";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

function ChatDiscussionDialog({...props}) {
    const {data} = props;

    const {
        app_uuid,
        setOpenChat,
        setInfo,
        setState,
        patient,
        router,
        setOpenDialog
    } = data
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const listRef = useRef<any>();

    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})

    const [text, setText] = useState<string>("");
    const [messages, setMessages] = useState<any[]>([]);
    const [loadingResponse, setLoadingResponse] = useState<boolean>(false);
    const [loadingContainer, setLoadingContainer] = useState<boolean>(true);

    const suggestions = [
        {name: 'opinion', message: 'opinion', isDocument: false},
        {name: 'health', message: 'askHealth', isDocument: false},
        {name: 'advice', message: 'fiveadvice', isDocument: false},
        {name: 'certif', message: 'certif_content', isDocument: true},
        {name: 'rapportInit', message: 'ri_content', isDocument: true},
        {name: 'ro', message: 'ro_content', isDocument: true}
    ]

    const {trigger: triggerChat} = useRequestQueryMutation("/chat/ai");
    const {trigger: triggerDocumentChat} = useRequestQueryMutation("/chat/document");
    const {data: httpChatResponse} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/patients/${patient}/chat`
    }, SWRNoValidateConfig);
    /*
        const msgGenerator = (todo: string) => {
            let msg = '';
            if (medicalProfessionalData) {
                const name = medicalProfessionalData[0].medical_professional.publicName;
                msg = `${name}, ${t('chat.im')} ${medicalProfessionalData[0]?.medical_professional.specialities[0].speciality.name}, ${t('chat.mypatient')} ${appointment.patient.firstName} ${appointment.patient.lastName}`;
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
                msg += `.${todo} (sachant que, Votre réponse en Html dont chaque phrase dans une balise p et le contenu ne doit contient aucune information sur le patient ne sera divulguée pour respecter sa confidentialité et avec la langue francaises seulement. )`
            }

            return msg;
        }
    */
    const sendToAI = (todo: string, short: string, msg: {
        from: string,
        to: string,
        message: string
    }, isDocument: boolean) => {
        setLoadingResponse(true)
        const form = new FormData();
        form.append('message', `${todo} .Votre réponse en Html dont chaque phrase dans une balise p`);
        form.append('short', short ? short : todo);
        form.append('isDocument', isDocument.toString());
        triggerChat({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/appointments/${app_uuid}/chat`,
            data: form
        }, {
            onSuccess: (r: any) => {
                const res = (r?.data as HttpResponse).data;
                setMessages([{
                    from: 'chat',
                    to: 'me',
                    message: res.message,
                    short: short ? short : ""
                }, msg, ...messages])
                setLoadingResponse(false)
            }
        });
    }
    const send = () => {
        setMessages([{from: 'me', to: 'chat', message: text}, ...messages])
        sendToAI(text, text, {from: 'me', to: 'chat', message: text}, false)
        setText('');
    }
    const saveDoc = (msg: { text: string; short: string; }) => {
        const form = new FormData();

        form.append("content", msg.text);
        form.append("title", msg.short);

        triggerDocumentChat({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/appointments/${app_uuid}/certificates/${router.locale}`,
            data: form
        }, {
            onSuccess: (r: any) => {
                const res = (r?.data as HttpResponse).data;
                setInfo("document_detail");
                setState({
                    certifUuid: res.uuid,
                    uuid: res.uuid,
                    content: msg.text,
                    doctor: '',
                    patient: null,
                    birthdate: '',
                    cin: '',
                    createdAt: moment().format('DD/MM/YYYY'),
                    description: "",
                    title: msg.short,
                    days: '',
                    name: "certif",
                    type: "write_certif",
                });
                setOpenDialog(true);
            }
        });
    }

    useEffect(() => {
        if (listRef.current)
            setLoadingContainer(false);
    }, [listRef])

    useEffect(() => {
        if (httpChatResponse) {
            let _messages: { from: string, to: string, message: string, short?: string }[] = [];
            const data = (httpChatResponse as HttpResponse).data;
            data.map((msg: {
                short: string;
                request: string; message: string;
            }) => {
                _messages = [
                    {from: 'chat', to: 'me', message: msg.message, short: msg.short ? msg.short : msg.request},
                    {
                        from: 'me',
                        to: 'chat',
                        message: msg.short ? msg.short : msg.request
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
                    <Player
                        autoplay
                        loop={true}
                        src="/static/lotties/typing.json"
                        style={{
                            height: "35px",
                            width: "85px",
                            transform: "scale(1.2)",
                            margin: 0
                        }}
                    />
                }
                {messages.map((msg, index) => (
                    <Box key={`msg-${index}`}>
                        {
                            msg.from !== "chat" ? <ChatMsg
                                    avatar={''}
                                    side={'right'}
                                    t={t}
                                    messages={[{text: msg.message}]}
                                /> :
                                <ChatMsg
                                    avatar={''}
                                    side={'left'}
                                    t={t}
                                    messages={[{text: msg.message, short: msg.short}]}
                                    saveDoc={() => {
                                        saveDoc({text: msg.message, short: msg.short})
                                    }}
                                />
                        }
                    </Box>
                ))}

            </div>}
            <Box padding={2} ref={listRef} style={{
                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
            }}>
                {suggestions.map((suggestion, index) => (
                    <Chip key={`${suggestion} ${index}`}
                          disabled={loadingResponse}
                          style={{marginRight: 5, marginBottom: 5}}
                          onClick={() => {
                              setMessages([{
                                  from: 'me',
                                  to: 'chat',
                                  message: t(`chat.${suggestion.name}`)
                              }, ...messages])

                              sendToAI(t(`chat.${suggestion.message}`),
                                  t(`chat.${suggestion.name}`),
                                  {
                                      from: 'me',
                                      to: 'chat',
                                      message: t(`chat.${suggestion.name}`)
                                  }, suggestion.isDocument)
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

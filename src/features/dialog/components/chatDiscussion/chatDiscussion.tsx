import {Box, Chip, Fab, IconButton, Stack, TextField} from '@mui/material'
import {useTranslation} from 'next-i18next'
import React, {useEffect, useRef, useState} from 'react';
import dynamic from "next/dynamic";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {ChatMsg} from "@features/ChatMsg";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {Player} from "@lottiefiles/react-lottie-player";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {Session} from "next-auth";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

function ChatDiscussionDialog({...props}) {
    const {data} = props;

    const {
        app_uuid,
        setOpenChat,
        setOpenDialog,
        session,
        setInfo,
        setState,
        patient
    } = data

    const {data: user} = session as Session;
    const general_information = (user as UserDataResponse).general_information;

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
    const {data: httpChatResponse} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/patients/${patient.uuid}/chat`
    }, ReactQueryNoValidateConfig);

    const sendToAI = (todo: string, short: string, msg: {
        from: string,
        to: string,
        message: string
    }, isDocument: boolean) => {
        setLoadingResponse(true)
        const form = new FormData();
        form.append('message', `${todo} .( La réponse fournie doit etre en Html dont chaque phrase dans une balise p )`);
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
        setOpenDialog(true)
        setInfo("write_certif");
        setState({
            name: `${general_information.firstName} ${general_information.lastName}`,
            days: '',
            content: msg.text,
            title: msg.short,
            patient: `${patient.firstName} ${patient.lastName}`,
            brithdate: `${patient.birthdate}`,
            cin: patient.idCard ? `${patient.idCard}` : ""
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

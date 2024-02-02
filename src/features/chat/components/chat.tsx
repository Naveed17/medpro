import React, {useEffect, useState} from 'react';
import {
    Avatar,
    Button,
    Collapse,
    Drawer,
    Fab,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    Stack,
    TextField,
    Tooltip,
    Typography,
    useTheme
} from "@mui/material";
import ChatStyled from "@features/chat/components/overrides/chatStyled";
import {useTranslation} from "next-i18next";
import IconUrl from '@themes/urlIcon';
import moment from "moment/moment";
import {Types} from "ably";
import Fade from "@mui/material/Fade";
import Popper, {PopperPlacementType} from '@mui/material/Popper';
import {debounce} from "lodash";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {Editor} from "@tinymce/tinymce-react";
import {tinymcePlugins} from "@lib/constants";
import {useAppSelector} from "@lib/redux/hooks";
import {PatientDetail} from "@features/dialog";
import {configSelector} from "@features/base";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import useUsers from "@lib/hooks/rest/useUsers";
import PresenceMessage = Types.PresenceMessage;

interface IPatient {
    uuid: string,
    firstName: string,
    lastName: string
}

interface IDiscussion {
    id: string,
    members: { uuid: string, name: string }[],
    lastMessageTimestamp: number
    lastSender: string,
    lastMessage: string
}

const Chat = ({...props}) => {

    const {
        channel,

        medicalEntityHasUser,
        presenceData,
        setHasMessage
    } = props;

    const {users} = useUsers();

    const {data: session} = useSession();
    const theme = useTheme();
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {data: user} = session as Session;
    const general_information = (user as UserDataResponse).general_information;

    const {t} = useTranslation("common", {keyPrefix: "chat"});
    const {direction} = useAppSelector(configSelector);

    const {trigger: triggerSearchPatient} = useRequestQueryMutation("/patients/search");

    const [message, setMessage] = useState("");
    const [patientDetailDrawer, setPatientDetailDrawer] = useState(false);
    const [patientId, setPatientId] = useState("");
    const [lastMessages, setLastMessages] = useState<any>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [open, setOpen] = useState(false);
    const [placement, setPlacement] = useState<PopperPlacementType>();
    const [patients, setPatients] = useState<IPatient[]>([]);
    const [discussions, setDiscussions] = useState<IDiscussion[]>([]);
    const [selectedDiscussion, setSelectedDiscussion] = useState("");
    const [showUsers, setShowUsers] = useState(false);
    const [messages, setMessages] = useState([]);

    const {trigger: createDiscussion} = useRequestQueryMutation("/chat/new");
    const {trigger: getDiscussion} = useRequestQueryMutation("/chat/messages");

    const refList = document.getElementById("chat-list")

    const {data: httpDiscussionsList, mutate} = useRequestQuery({
            method: "GET",
            url: `/-/chat/api/discussion/${medicalEntityHasUser}`
        }
    )

    const scrollToTop = () => {
        if (refList)
            refList.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
    }

    const hasMessages = (uuid: string) => {
        return lastMessages && Object.keys(lastMessages).find(lm => lm === uuid)
    }

    const handleOnChange = (text: string) => {

        triggerSearchPatient({
            method: "GET",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/patients/${router.locale}?name=${text}&withPagination=false`
        }, {
            onSuccess: (res) => {
                let _patients: IPatient[] = [];
                res.data.data.map((p: PatientModel) => _patients.push({
                    uuid: p.uuid,
                    firstName: p.firstName,
                    lastName: p.lastName
                }));
                setPatients(_patients)
            }
        });
    }

    const debouncedOnChange = debounce(handleOnChange, 500);

    const handleClick = (newPlacement: PopperPlacementType) => (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setOpen((prev) => placement !== newPlacement || !prev);
        setPlacement(newPlacement);
    };

    const checkTags = () => {
        const tags = document.getElementsByClassName("tag");
        Array.from(tags).forEach((tag: any) => {
            tag.style.background = "#b1e8ff";
            tag.style.borderRadius = "5px";
            tag.style.cursor = "pointer";
            tag.onclick = () => {
                setPatientDetailDrawer(true)
                setPatientId(tag.id)
            }
        });

    }

    const addDiscussion = (user: UserModel) => {
        createDiscussion({
            method: "POST",
            data: {
                "members": [{
                    uuid: medicalEntityHasUser,
                    name: `${general_information.firstName} ${general_information.lastName}`
                }, {
                    uuid: user.uuid,
                    name: `${user?.FirstName} ${user?.lastName}`
                }]
            },
            url: `/-/chat/api/discussion`
        }, {
            onSuccess: (res) => {
                setSelectedDiscussion(res.data)
                mutate()
            }
        })

    }

    const getMessages = (id:string) => {
        getDiscussion({
            method: "GET",
            url: `/-/chat/api/message/${id}`
        }, {
            onSuccess: (res) => {
                setMessages(res.data.reverse())
            }
        })
    }

    useEffect(() => {
        setHasMessage(false);
        checkTags()
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (refList)
            refList.scrollTo({
                top: refList.scrollHeight,
                behavior: 'smooth',
            });
        checkTags()
    }, [messages]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const _local = localStorage.getItem("chat")
        if (_local) {
            setLastMessages(JSON.parse(_local))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localStorage.getItem("chat")]);

    useEffect(() => {
        if (httpDiscussionsList)
            setDiscussions(httpDiscussionsList)
    }, [httpDiscussionsList])

    return (
        <ChatStyled>
            <Grid container>
                <Grid item xs={12} md={4}>
                    <Paper className='user-wrapper' component={Stack} spacing={2}>
                        <Stack direction={"row"} spacing={1} justifyContent={"space-between"} alignItems={"center"}>
                            <Stack direction={"row"} spacing={1} alignItems={"center"}>
                                <IconUrl path={"chat"} width={20} height={20}/>
                                <Typography fontWeight={"bold"}>Chat</Typography>
                            </Stack>
                            <Tooltip title={"nouveau message"}>
                                <IconButton onClick={() => setShowUsers((prev) => !prev)}>
                                    <IconUrl path={"ic-edit"}/>
                                </IconButton>
                            </Tooltip>
                        </Stack>

                        <Collapse in={showUsers} style={{margin: 0}}>
                            {users.filter((user: UserModel) => user.uuid !== medicalEntityHasUser && !hasMessages(user.uuid)).map((user: UserModel) => (
                                <Stack
                                    className={`user-item`}
                                    sx={{cursor: 'pointer'}}
                                    spacing={.5} key={user.uuid}
                                    onClick={() => {
                                        addDiscussion(user)
                                        setShowUsers(false)
                                    }}>
                                    <Stack direction={"row"} spacing={1} alignItems={"center"}>
                                        <Typography fontWeight={500}
                                                    variant='body2'>{`${user.FirstName} ${user.lastName}`}</Typography>
                                        <div style={{
                                            width: 5,
                                            height: 5,
                                            background: `${presenceData.find((data: PresenceMessage) => data.clientId === user.uuid) && presenceData.find((data: PresenceMessage) => data.clientId === user.uuid).data === "actif" ? "#1BC47D" : "#DDD"}`,
                                            borderRadius: 10
                                        }}/>
                                    </Stack>
                                </Stack>
                            ))}
                        </Collapse>

                        <div style={{borderBottom: "1px solid #DDD"}}></div>
                        {discussions && discussions.map((disc) => (
                            <Stack
                                sx={{cursor: 'pointer'}}
                                spacing={.5} key={disc.id}
                                className={`user-item ${disc.id === selectedDiscussion ? "selected" : ""}`}
                                onClick={() => {
                                    setSelectedDiscussion(disc.id)
                                    getMessages(disc.id)
                                }}>
                                <Stack direction={"row"} spacing={1} alignItems={"center"}>
                                    <Typography fontWeight={500}
                                                variant='body2'>{disc.members.filter(m => m.uuid !== medicalEntityHasUser)[0].name}</Typography>
                                    <div style={{
                                        width: 5,
                                        height: 5,
                                        borderRadius: 10,
                                        background: `${presenceData.find((data: PresenceMessage) => data.clientId === disc.members.filter(m => m.uuid !== medicalEntityHasUser)[0].uuid) && presenceData.find((data: PresenceMessage) => data.clientId === disc.members.filter(m => m.uuid !== medicalEntityHasUser)[0].uuid).data === "actif" ? "#1BC47D" : "#DDD"}`,
                                    }}/>
                                </Stack>

                                <Typography variant='caption' fontSize={9}
                                            color="text.secondary">{disc.lastMessage.replace(/<[^>]+>/g, '')}</Typography>
                                <Typography variant='caption' fontSize={9}
                                            color="text.secondary">{disc.lastMessageTimestamp ? moment.duration(moment().diff(new Date(disc.lastMessageTimestamp))).humanize() : "New"}</Typography>
                            </Stack>
                        ))}

                        {/*
                        {lastMessages && Object.keys(lastMessages).sort((a, b) => comparerParDate(a, b)).map((user: string) => (
                            <Stack
                                className={`user-item ${user === selectedUser?.uuid ? "selected" : ""}`}
                                sx={{cursor: 'pointer'}}
                                spacing={.5} key={user}
                                onClick={() => {
                                    setSelectedUser(users.find((_user: UserModel) => _user.uuid === user))
                                    const localMsgs = localStorage.getItem("chat") && JSON.parse(localStorage.getItem("chat") as string)
                                    if (localMsgs) {
                                        const _msgs = Object.keys(localMsgs).find(key => key === user)
                                        if (_msgs) updateMessages(localMsgs[user])
                                        else updateMessages([])
                                    }
                                }
                                }>
                                <Stack direction={"row"} spacing={1} alignItems={"center"}>
                                    <Typography fontWeight={500} variant='body2'>{getUserName(user)}</Typography>
                                    <div style={{
                                        width: 5,
                                        height: 5,
                                        borderRadius: 10,
                                        background: `${presenceData.find((data: PresenceMessage) => data.clientId === user) && presenceData.find((data: PresenceMessage) => data.clientId === user).data === "actif" ? "#1BC47D" : "#DDD"}`
                                    }}/>
                                </Stack>

                                <Typography variant='caption' fontSize={9}
                                            color="text.secondary">{getLastMessage(user, "data").replace(/<[^>]+>/g, '')}</Typography>
                                <Typography variant='caption' fontSize={9}
                                            color="text.secondary">{getLastMessage(user, "date")}</Typography>
                            </Stack>
                        ))}
*/}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Paper className='chat-wrapper'>
                        {selectedDiscussion ?
                            <>
                                <Stack alignItems="center">
                                    <Fab variant="extended" onClick={scrollToTop} className='prev-msgs'
                                         size="small">{t('prev_msgs')}</Fab>
                                </Stack>
                                <List id={"chat-list"} className='chat-list'>
                                    {messages.map((message: Message, index: number) => (
                                        <ListItem key={index} alignItems="flex-start"
                                                  className={message?.from !== medicalEntityHasUser ? "left" : "right"}>
                                            {message.from !== medicalEntityHasUser && <ListItemAvatar>
                                                <Avatar sx={{bgcolor: theme.palette.primary.main}}>{'X'}</Avatar>

                                            </ListItemAvatar>}
                                            <ListItemText
                                                primary={
                                                    <Typography fontSize={8} gutterBottom>
                                                        {message?.from === medicalEntityHasUser ? t("you") : <>{'selectedUser?.FirstName'}</>}
                                                        {
                                                            message.date && <span
                                                                className='time'>{moment.duration(moment().diff(message.date)).humanize()}</span>
                                                        }
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Stack spacing={1}>
                                                        <Typography
                                                            sx={{display: 'inline', wordWrap: "break-word"}}
                                                            component="span"
                                                            color="text.primary"
                                                        >
                                                            <div dangerouslySetInnerHTML={{__html: message.data}}></div>

                                                        </Typography>
                                                        {/*{message?.from === medicalEntityHasUser ?
                                                            <Typography variant="caption" component={Stack} direction='row' alignItems='center' spacing={.5}>
                                                                <DoneAllIcon color='primary' sx={{ fontSize: 12 }} />
                                                                <Typography fontSize={9} color="text.secondary">{t("seen")}</Typography>
                                                            </Typography>
                                                            :
                                                            <Fab className='thumb' variant='extended' size='small'>
                                                                <ThumbUpIcon sx={{ fontSize: 16, color: "success.main" }} />
                                                                <span style={{ marginLeft: 8 }}>1</span>
                                                            </Fab>
                                                        }*/}
                                                    </Stack>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>

                                <div style={{position: "relative"}}>
                                    <Editor
                                        value={message}
                                        tinymceScriptSrc={'/tinymce/tinymce.min.js'}
                                        onEditorChange={(event) => {
                                            setMessage(event)
                                        }}

                                        init={{
                                            branding: false,
                                            statusbar: false,
                                            menubar: false,
                                            height: 120,
                                            toolbar: false,
                                            plugins: tinymcePlugins,
                                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                        }}/>
                                    <Popper
                                        // Note: The following zIndex style is specifically for documentation purposes and may not be necessary in your application.
                                        sx={{zIndex: 1200,}}
                                        open={open}
                                        anchorEl={anchorEl}
                                        placement={placement}
                                        transition>
                                        {({TransitionProps}) => (
                                            <Fade {...TransitionProps} timeout={350}>
                                                <Paper style={{padding: 10}}>
                                                    <Stack spacing={1}>
                                                        <Typography fontSize={11}
                                                                    color={"grey"}>Patient</Typography>
                                                        <TextField placeholder={"Aaa"} onChange={(ev) => {
                                                            debouncedOnChange(ev.target.value)
                                                        }}/>
                                                        {patients.map(patient => (
                                                            <Typography onClick={() => {
                                                                setMessage((prev) => `${prev} <span class="tag" id="${patient.uuid}">@${patient.firstName} ${patient.lastName} </span><span class="afterTag">, </span>`)
                                                                setOpen(false)
                                                            }}
                                                                        key={patient.uuid}>{`${patient.firstName} ${patient.lastName}`}</Typography>))}
                                                    </Stack>
                                                </Paper>
                                            </Fade>
                                        )}
                                    </Popper>
                                    <Button size={"small"}
                                            style={{position: "absolute", bottom: 10, left: 10, fontStyle: "italic"}}
                                            color={"black"} onClick={handleClick('top')}>@patient</Button>

                                    <Fab
                                        disabled={!message}
                                        onClick={() => {
                                            channel.publish(selectedDiscussion, JSON.stringify({
                                                message,
                                                from: medicalEntityHasUser,
                                                user: `${general_information.firstName} ${general_information.lastName}`
                                            }))
                                            setTimeout(()=>{
                                                mutate()
                                                getMessages(selectedDiscussion)
                                            },2000)
                                            setMessage("")
                                        }
                                        }
                                        size={"small"}
                                        disableRipple
                                        style={{position: "absolute", bottom: 10, right: 10}}
                                        variant='extended' className='send-msg'>
                                        <IconUrl path="ic-send-up"/>
                                        <span>{t("send")}</span>
                                    </Fab>
                                </div>

                                {/*<TextField
                                    onChange={(ev) => {
                                        setMessage(ev.target.value)
                                    }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">
                                            <Stack direction='row' alignItems='center' spacing={.3}>

                                                <IconButton component="label" size='small'>
                                                    <IconUrl path="ic-upload-chat" />
                                                    <InputStyled
                                                        id="contained-button-img"
                                                        type="file"
                                                    />
                                                </IconButton>
                                                <IconButton component="label" size='small'>
                                                    <IconUrl path="ic-attach-file" />
                                                    <InputStyled
                                                        id="contained-button-file"
                                                        type="file"
                                                    />
                                                </IconButton>

                                            </Stack>
                                        </InputAdornment>,
                                        endAdornment:
                                            <InputAdornment position="end">

                                            </InputAdornment>
                                    }}
                                    multiline
                                    rows={4}
                                    fullWidth
                                    placeholder={t("msg_placeholder")}
                                    value={message}/>*/}
                            </> : <div className='no-chat'>
                                <Stack>
                                    <div style={{justifyContent: "center", display: "flex"}}>
                                        <IconUrl path={"ic-no-msg"}/>
                                    </div>
                                    <Typography fontSize={18} textAlign={"center"}
                                                fontWeight={"bold"}>{t('noDes')}</Typography>
                                    <Typography fontSize={12} textAlign={"center"}
                                                color={theme.palette.grey["400"]}>{t('chooseUser1')}</Typography>
                                    <Typography fontSize={12} textAlign={"center"}
                                                color={theme.palette.grey["400"]}>{t('chooseUser2')}</Typography>
                                </Stack>
                            </div>
                        }
                    </Paper>
                </Grid>
            </Grid>

            <Drawer
                anchor={"right"}
                open={patientDetailDrawer}
                dir={direction}
                onClose={() => {
                    setPatientDetailDrawer(false);
                }}>
                <PatientDetail
                    onCloseDialog={() => {
                        setPatientDetailDrawer(false);
                    }}
                    onAddAppointment={() => console.log("onAddAppointment")}
                    patientId={patientId}
                />
            </Drawer>
        </ChatStyled>
    );
}


export default Chat;

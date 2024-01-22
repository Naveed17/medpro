import React, {useEffect, useState} from 'react';
import {
    Avatar,
    Fab,
    Grid,
    InputAdornment,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    Stack,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import ChatStyled from "@features/chat/components/overrides/chatStyled";
import {useTranslation} from "next-i18next";
import IconUrl from '@themes/urlIcon';
import moment from "moment/moment";
import {Types} from "ably";
import PresenceMessage = Types.PresenceMessage;

const Chat = ({...props}) => {

    const {
        channel,
        messages,
        updateMessages,
        selectedUser,
        setSelectedUser,
        medicalEntityHasUser,
        saveInbox,
        presenceData,
        setHasMessage,
        users
    } = props;

    const theme = useTheme();
    const {t} = useTranslation("common", {keyPrefix: "chat"});

    const [message, setMessage] = useState("");
    const [lastMessages, setLastMessages] = useState(null);

    const refList = document.getElementById("chat-list")

    const scrollToTop = () => {
        if (refList)
            refList.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
    }

    const getUserName = (key: string) => {
        const _user = users.find((user:UserModel) => user.uuid === key)
        return `${_user.FirstName} ${_user.lastName}`
    }

    const getLastMessage = (key: string, data: string) => {
        let _res = "";

        if (lastMessages) {
            const _msgs: Message[] = lastMessages[key]
            if(_msgs){
                if (data === "data")
                _res = `${_msgs[_msgs.length - 1].from} ${key} ${_msgs[_msgs.length - 1].data}`
            if (data === "date")
                _res = `${moment.duration(moment().diff(_msgs[_msgs.length - 1].date)).humanize()}`
            } else _res = "-"
        }

        return _res
    }

    const hasMessages =(uuid:string) =>{
        return lastMessages && Object.keys(lastMessages).find(lm => lm === uuid)
    }

    useEffect(() => {
        setHasMessage(false);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (refList)
            refList.scrollTo({
                top: refList.scrollHeight,
                behavior: 'smooth',
            });
    }, [messages]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const _local = localStorage.getItem("chat")
        if (_local) {
            setLastMessages(JSON.parse(_local))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localStorage.getItem("chat")]);

    return (
        <ChatStyled>
            <Grid container>
                <Grid item xs={12} md={4}>
                    <Paper className='user-wrapper' component={Stack} spacing={2}>
                        <Typography>Users</Typography>
                        {users.filter((user: UserModel) => user.uuid !== medicalEntityHasUser && !hasMessages(user.uuid)).map((user: UserModel) => (
                            <Stack
                                className={`user-item ${user.uuid === selectedUser?.uuid ? "selected" : ""}`}
                                sx={{cursor: 'pointer'}}
                                spacing={.5} key={user.uuid}
                                onClick={() => {
                                    setSelectedUser(user)
                                    const localMsgs = localStorage.getItem("chat") && JSON.parse(localStorage.getItem("chat") as string)
                                    if (localMsgs) {
                                        const _msgs = Object.keys(localMsgs).find(key => key === user.uuid)
                                        if (_msgs) updateMessages(localMsgs[user.uuid])
                                        else updateMessages([])
                                    }
                                }
                                }>
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
                        <Typography>Messages</Typography>
                        {lastMessages && Object.keys(lastMessages).map((user: string) => (
                            <Stack
                                className={`user-item ${user === selectedUser?.uuid ? "selected" : ""}`}
                                sx={{cursor: 'pointer'}}
                                spacing={.5} key={user}
                                onClick={() => {
                                    setSelectedUser(users.find((_user:UserModel) => _user.uuid === user))
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
                                <Typography variant='body2' color="text.secondary"
                                            className='ellipsis'>{getLastMessage(user, "data")}</Typography>
                                <Typography variant='caption' fontSize={9}
                                            color="text.secondary">{getLastMessage(user, "date")}</Typography>
                            </Stack>
                        ))}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Paper className='chat-wrapper'>
                        {selectedUser ?
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
                                                <Avatar
                                                    sx={{bgcolor: theme.palette.primary.main}}>{selectedUser?.FirstName?.charAt(0)}</Avatar>

                                            </ListItemAvatar>}
                                            <ListItemText
                                                primary={
                                                    <Typography fontSize={8} gutterBottom>
                                                        {message?.from === medicalEntityHasUser ? t("you") : selectedUser && <>{selectedUser?.FirstName} {selectedUser?.lastName}</>}
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
                                                            {message.data}
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
                                <TextField
                                    onChange={(ev) => {
                                        setMessage(ev.target.value)
                                    }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">
                                            {/* <Stack direction='row' alignItems='center' spacing={.3}>
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
                                            </Stack>*/}
                                        </InputAdornment>,
                                        endAdornment:
                                            <InputAdornment position="end">
                                                <Fab
                                                    disabled={!message || !presenceData.find((data: PresenceMessage) => data.clientId === selectedUser.uuid)}
                                                    onClick={() => {
                                                        saveInbox({
                                                            from: medicalEntityHasUser,
                                                            to: selectedUser.uuid,
                                                            data: message,
                                                            date: new Date()
                                                        }, selectedUser.uuid)
                                                        channel.publish(selectedUser.uuid, message)
                                                        setMessage("")
                                                    }
                                                    }
                                                    disableRipple
                                                    variant='extended' className='send-msg'>
                                                    <IconUrl path="ic-send-up"/>
                                                    <span>{t("send")}</span>
                                                </Fab>
                                            </InputAdornment>
                                    }}
                                    multiline
                                    rows={4}
                                    fullWidth
                                    placeholder={t("msg_placeholder")}
                                    value={message}/>
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
        </ChatStyled>
    );
}


export default Chat;

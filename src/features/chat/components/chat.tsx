import React, { useState } from 'react';
import { Avatar, Fab, Grid, IconButton, InputAdornment, List, ListItem, ListItemAvatar, ListItemText, Paper, Stack, TextField, Typography } from "@mui/material";
import ChatStyled from "@features/chat/components/overrides/chatStyled";
import { useRequestQuery } from "@lib/axios";
import { useMedicalEntitySuffix } from "@lib/hooks";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import IconUrl from '@themes/urlIcon';
import { InputStyled } from "@features/tabPanel";
const Chat = ({ ...props }) => {
    const { t } = useTranslation("common", { keyPrefix: "chat" });
    const {
        channel, messages, updateMessages, medicalEntityHasUser, saveInbox
    } = props;

    const [selectedUser, setSelectedUser] = useState<UserModel | null>(null);
    const [message, setMessage] = useState("");

    const router = useRouter();

    const { urlMedicalEntitySuffix } = useMedicalEntitySuffix();

    const { data: httpUsersResponse, mutate } = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehus/${router.locale}`
    }, { refetchOnWindowFocus: false });

    const users = ((httpUsersResponse as HttpResponse)?.data ?? []) as UserModel[];
    return (
        <ChatStyled>
            <Grid container>
                <Grid item xs={12} md={4}>
                    <Paper className='user-wrapper' component={Stack} spacing={2}>
                        {users.map(user => (
                            <Stack
                                className={`user-item ${user.uuid === selectedUser?.uuid ? "selected" : ""}`}
                                sx={{ cursor: 'pointer' }}
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
                                }

                            >
                                <Typography fontWeight={500} variant='body2'>{`${user.FirstName} ${user.lastName}`}</Typography>
                                <Typography variant='body2' color="text.secondary" className='ellipsis'>I'd like to upgrade to the premiumddddddddddd</Typography>
                                <Typography variant='caption' fontSize={9} color="text.secondary">Chat started just now</Typography>
                            </Stack>
                        ))}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Paper className='chat-wrapper'>
                        {selectedUser &&
                            <>
                                <Stack alignItems="center">
                                    <Fab variant="extended" className='prev-msgs' size="small">{t('prev_msgs')}</Fab>
                                </Stack>
                                <List className='chat-list'>
                                    {messages.map((message: Message, index: number) => (
                                        <ListItem alignItems="flex-start" className={message?.from === medicalEntityHasUser ? "left" : "right"}>
                                            <ListItemAvatar>
                                                <Avatar alt="Med" src="/static/icons/Med-logo.png"
                                                    sx={{
                                                        bgcolor: message.from !== medicalEntityHasUser ? 'error.darker' : "text.primary"
                                                    }
                                                    }
                                                />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Typography fontSize={8} gutterBottom>
                                                        {message?.from === medicalEntityHasUser ? t("you") : selectedUser && <>{selectedUser?.FirstName} {selectedUser?.lastName}</>}
                                                        <span className='time'>8m</span>
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Stack spacing={1}>
                                                        <Typography
                                                            sx={{ display: 'inline', wordWrap: "break-word" }}
                                                            component="span"
                                                            color="text.primary"
                                                        >
                                                            {message.data}
                                                        </Typography>
                                                        {message?.from === medicalEntityHasUser ?
                                                            <Typography variant="caption" component={Stack} direction='row' alignItems='center' spacing={.5}>
                                                                <DoneAllIcon color='primary' sx={{ fontSize: 12 }} />
                                                                <Typography fontSize={9} color="text.secondary">{t("seen")}</Typography>
                                                            </Typography>
                                                            :
                                                            <Fab className='thumb' variant='extended' size='small'>
                                                                <ThumbUpIcon sx={{ fontSize: 16, color: "success.main" }} />
                                                                <span style={{ marginLeft: 8 }}>1</span>
                                                            </Fab>
                                                        }
                                                    </Stack>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                                <TextField
                                    onChange={(ev) => { setMessage(ev.target.value) }}
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
                                                <Fab
                                                    disabled={!message}
                                                    onClick={() => {
                                                        saveInbox([...messages, { from: medicalEntityHasUser, to: selectedUser.uuid, data: message }], selectedUser.uuid)
                                                        channel.publish(selectedUser.uuid, message)
                                                        setMessage("")
                                                    }
                                                    }
                                                    disableRipple
                                                    variant='extended' className='send-msg' >
                                                    <IconUrl path="ic-send-up" />
                                                    <span>{t("send")}</span>
                                                </Fab>
                                            </InputAdornment>
                                    }}
                                    multiline
                                    rows={4}
                                    fullWidth
                                    placeholder={t("msg_placeholder")}
                                    value={message} />
                            </>
                        }
                    </Paper>
                </Grid>
            </Grid>
        </ChatStyled >
    );
}


export default Chat;

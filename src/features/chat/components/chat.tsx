import React, {useState} from 'react';
import {Avatar, Button, Grid, Stack, TextField, Typography} from "@mui/material";
import Add from "@mui/icons-material/Add";
import ChatStyled from "@features/chat/components/overrides/chatStyled";
import {useRequestQuery} from "@lib/axios";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useRouter} from "next/router";
import {Box} from "@mui/system";

const Chat = ({...props}) => {

    const {
        channel,messages,updateMessages,medicalEntityHasUser,saveInbox
    } = props;
    const [selectedUser, setSelectedUser] = useState<UserModel | null>(null);
    const [message, setMessage] = useState("");

    const router = useRouter();

    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {data: httpUsersResponse, mutate} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehus/${router.locale}`
    }, {refetchOnWindowFocus: false});

    const users = ((httpUsersResponse as HttpResponse)?.data ?? []) as UserModel[];

    return (
        <ChatStyled>
            {users.map(user => (<Box key={user.uuid}>
                <Typography>{`${user.FirstName} ${user.lastName}`}</Typography>
                <Button onClick={()=> {
                    setSelectedUser(user)
                    const localMsgs = localStorage.getItem("chat") && JSON.parse(localStorage.getItem("chat") as string)
                    if (localMsgs) {
                        const _msgs = Object.keys(localMsgs).find(key => key === user.uuid)
                        if (_msgs) updateMessages(localMsgs[user.uuid])
                        else updateMessages([])
                    }
                }
                }>Connect</Button>
            </Box>))}

            {selectedUser && <Typography>Send to {`${selectedUser.FirstName} ${selectedUser.lastName}`}</Typography>}
            <TextField onChange={(ev)=>{setMessage(ev.target.value)}}
                       placeholder={"Aaa"}
                       value={message}/>
            {selectedUser &&<Button onClick={() => {
                saveInbox([...messages,{from:medicalEntityHasUser,to:selectedUser.uuid,data:message}],selectedUser.uuid)
                channel.publish(selectedUser.uuid, message)
            }}>Send</Button>}
            {messages.map((message:Message,index:number) => (<Typography key={index} textAlign={message.from === medicalEntityHasUser ? "left":"right"}>{message.data}</Typography>))}
        </ChatStyled>
    );
}


export default Chat;

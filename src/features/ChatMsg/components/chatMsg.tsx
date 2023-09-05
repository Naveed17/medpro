import React from 'react';
import {Avatar, Button, Grid, Stack, Typography} from "@mui/material";
import MsgStyled from "@features/ChatMsg/components/overrides/msgStyled";
import Add from "@mui/icons-material/Add";

const ChatMsg = ({...props}) => {
    const {
        messages,
        side,
        GridContainerProps,
        GridItemProps,
        saveDoc,t
    } = props;

    return (
        <MsgStyled
            container
            spacing={2}
            justify={side === 'right' ? 'flex-end' : 'flex-start'}
            {...GridContainerProps}
        >
            {side === 'left' && (
                <Grid item {...GridItemProps}>
                    <Avatar
                        style={{width: 30, height: 30}}
                        src={'/static/mock-images/avatars/avatar_dr.png'}
                    />
                </Grid>
            )}
            <Grid item xs={side === 'left' ? 8 : 11}>

                {messages.map((msg: any, i: number) => {
                    return (
                        // eslint-disable-next-line react/no-array-index-key
                        <div key={i} className={`${side}Row`}>
                            <div className={`msg ${side}`} dangerouslySetInnerHTML={{__html: msg.text}} />
                        </div>
                    );
                })}
                {side === 'left' && <Stack direction={"row"} justifyContent={"end"}><Button
                    onClick={saveDoc}
                    size="small"
                    startIcon={<Add/>}>
                    {t('chat.asDoc')}
                </Button></Stack>}
            </Grid>
        </MsgStyled>
    );
}


export default ChatMsg;
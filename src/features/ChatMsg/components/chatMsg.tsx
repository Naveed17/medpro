import React from 'react';
import {Avatar, Grid, Typography} from "@mui/material";
import MsgStyled from "@features/ChatMsg/components/overrides/msgStyled";

const ChatMsg = ({...props}) => {
    const {
        messages,
        side,
        GridContainerProps,
        GridItemProps,
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
                        <div key={msg.id || i} className={`${side}Row`}>
                            <Typography
                                align={'left'}
                                className={`msg ${side}`}>
                                {msg}
                            </Typography>
                        </div>
                    );
                })}
            </Grid>
        </MsgStyled>
    );
}


export default ChatMsg;
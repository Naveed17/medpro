import {Stack, Typography, useMediaQuery} from "@mui/material";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import moment from "moment-timezone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import React from "react";
import {MobileContainer} from "@lib/constants";

function DocumentContent({...props}) {
    const {t, data, date, resize} = props;
    const isMobile = useMediaQuery(`(max-width:${MobileContainer}px)`);

    return (
        <Stack {...(!resize ? {direction: "column"} : {alignItems: "flex-start", m: 1})}>
            <Typography
                className={"sub-title ellipsis"} variant='subtitle2'
                whiteSpace={"nowrap"}
                sx={{cursor: "pointer", maxWidth: isMobile ? 80 : 120}}
                textAlign={"left"}
                fontSize={13}>
                {t(data.title)}
            </Typography>
            <Stack {...(!resize && {justifyItems: "flex-start", margin: 0})} direction={"row"} spacing={1}>
                {date && <>
                    <EventRoundedIcon style={{fontSize: 15, color: "grey"}}/>
                    <Typography
                        whiteSpace={"nowrap"}
                        fontSize={12}
                        {...(!resize && {sx: {marginTop: 0}})}
                        sx={{color: "grey", cursor: "pointer", width: 120}}>
                        {moment(data.createdAt, 'DD-MM-YYYY HH:mm').add(1, "hour").format('DD-MM-YYYY')}
                    </Typography>
                </>}

                <AccessTimeIcon style={{fontSize: 15, color: "grey"}}/>
                <Typography whiteSpace={"nowrap"} fontSize={12}
                            sx={{marginTop: 0, color: "grey", cursor: "pointer"}}>
                    {moment(data.createdAt, 'DD-MM-YYYY HH:mm').add(1, "hour").format('HH:mm')}
                </Typography>
            </Stack>
        </Stack>)
}

export default DocumentContent;

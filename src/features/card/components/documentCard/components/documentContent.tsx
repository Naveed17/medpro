import {IconButton, Stack, Typography, useTheme} from "@mui/material";
import moment from "moment-timezone";
import React, {useState} from "react";
import Icon from "@themes/urlIcon";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {AppointmentStatus, CalendarContextMenu} from "@features/calendar";
import {prepareContextMenu} from "@lib/hooks";

function DocumentContent({...props}) {
    const {t, data, date, resize, width = null, handleMoreAction} = props;
    const theme = useTheme();

    return (
        <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
            <Stack {...(!resize ? {direction: "column"} : {alignItems: "flex-start", m: 1})}>
                <Typography
                    className={"sub-title ellipsis"} style={{width: width ? width : "5rem"}} variant='subtitle2'
                    whiteSpace={"nowrap"}
                    sx={{
                        cursor: "pointer", textOverflow: "ellipsis",
                        overflow: "hidden"
                    }}
                    textAlign={"left"}
                    fontSize={13}>
                    {t(data.title)}
                </Typography>
                <Stack {...(!resize && {justifyItems: "flex-start", margin: 0})} direction={"row"} alignItems={"center"}
                       spacing={1}>
                    {date && <Stack direction={"row"} alignItems={"center"} spacing={1}>
                        <Icon path="ic-agenda" height={11} width={11} color={theme.palette.text.primary}/>
                        <Typography
                            variant="body2"> {moment(data.createdAt, 'DD-MM-YYYY HH:mm').add(1, "hour").format('DD-MM-YYYY')}</Typography>
                    </Stack>}

                    <Icon path="ic-time" height={11} width={11} color={theme.palette.text.primary}/>
                    <Typography
                        variant="body2">{moment(data.createdAt, 'DD-MM-YYYY HH:mm').add(1, "hour").format('HH:mm')}</Typography>
                </Stack>

            </Stack>


            {handleMoreAction && <IconButton
                aria-label="settings"
                onClick={event => {
                    event.stopPropagation();
                    handleMoreAction(event, data);
                }}>
                <Icon path="more-vert"/>
            </IconButton>}
        </Stack>)
}

export default DocumentContent;

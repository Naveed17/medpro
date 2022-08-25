import {Typography, IconButton, Stack, Box} from "@mui/material";
import RootStyled from './overrides/rootStyled';
import {Label} from "@features/label";
import IconUrl from "@themes/urlIcon";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import React from "react";

function AppointmentListMobile({...props}) {
    const {event, OnSelectEvent} = props;

    const handleEventClick = () => {
        OnSelectEvent(Object.assign(event, {
            extendedProps: {
                description: event.description,
                meeting: event.meeting,
                motif: event.motif,
                patient: event.patient,
                status: event.status,
                time: event.time
            }
        }));
    }

    return (
        <RootStyled
            sx={{
                "&:before": {
                    bgcolor: event.borderColor,
                    width: ".4rem"
                },
            }}
        >
            <Stack direction="row" spacing={2}>
                <Box className="card-main" onClick={handleEventClick}>
                    <Typography variant={"subtitle2"} color="primary.main" className="title">
                        <>
                            {event.meeting ? <IconUrl path="ic-video"/> : null}
                            <span>{event.title}</span>
                        </>
                    </Typography>
                    <Box className="time-badge-main">
                        <Typography variant={"subtitle2"} color="text.secondary">
                            <AccessTimeOutlinedIcon/>
                            <span>
                                {new Date(event.time).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                              </span>
                        </Typography>
                        <Label variant='filled'
                               color={
                                   event?.status.key === "CONFIRMED"
                                       ? "success"
                                       : event?.status.key === "CANCELED"
                                           ? "error"
                                           : "primary"
                               }>
                            {event.status.value}
                        </Label>
                    </Box>
                    <Typography variant={"subtitle2"} color="text.primary" mt={1}>
                        {event.motif.name}
                    </Typography>
                </Box>
                <Box className="action">
                    <IconButton size="small">
                        <MoreVertIcon/>
                    </IconButton>
                </Box>
            </Stack>
        </RootStyled>
    )
}

export default AppointmentListMobile;

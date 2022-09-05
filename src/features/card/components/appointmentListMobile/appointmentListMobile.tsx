import {Typography, IconButton, Stack, Box} from "@mui/material";
import RootStyled from './overrides/rootStyled';
import {Label} from "@features/label";
import IconUrl from "@themes/urlIcon";
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import React, {useState} from "react";
import {Popover} from "@features/popover";
import Icon from "@themes/urlIcon";
import {CalendarContextMenu} from "@features/calendar";

function AppointmentListMobile({...props}) {
    const {event, OnSelectEvent} = props;
    const [openTooltip, setOpenTooltip] = useState(false);

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
                    content: '""',
                    height: "108px",
                    position: "absolute",
                    mt: "-.5rem",
                    left: "1rem",
                    borderTopLeftRadius : 4,
                    borderBottomLeftRadius : 4,
                    background: event.borderColor,
                    width: 4
                },
            }}>
            <Box sx={{display: "flex"}}>
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
                               sx={{ml: 1}}
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
                    <Popover
                        open={openTooltip}
                        handleClose={() => setOpenTooltip(false)}
                        menuList={CalendarContextMenu}
                        onClickItem={() => setOpenTooltip(false)}
                        button={
                            <IconButton
                                onClick={() => {
                                    setOpenTooltip(true);
                                }}
                                sx={{display: "block", ml: "auto"}}
                                size="small"
                            >
                                <Icon path="more-vert"/>
                            </IconButton>
                        }
                    />
                </Box>
            </Box>
        </RootStyled>
    )
}

export default AppointmentListMobile;

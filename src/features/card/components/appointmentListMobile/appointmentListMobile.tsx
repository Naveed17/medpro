import {Box, IconButton, Typography} from "@mui/material";
import RootStyled from './overrides/rootStyled';
import {Label} from "@features/label";
import IconUrl from "@themes/urlIcon";
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import React, {useState} from "react";
import {Popover} from "@features/popover";
import {CalendarContextMenu} from "@features/calendar";

function AppointmentListMobile({...props}) {
    const {event, OnSelectEvent, OnMenuActions} = props;
    const [openTooltip, setOpenTooltip] = useState(false);

    const handleEventClick = () => {
        OnSelectEvent(Object.assign({...event}, {
            extendedProps: {
                ...event
            }
        }));
    }

    const handleMenuClick = (data: { title: string; icon: string; action: string }) => {
        setOpenTooltip(false)
        OnMenuActions(data.action, Object.assign(event, {
            extendedProps: {
                ...event
            }
        }));
    }

    const getColor = () => {
        if (event?.status.key === "CONFIRMED")
            return "success"
        else if (event?.status.key === "CANCELED" || event?.status.key === "PATIENT_CANCELED")
            return "error";
        else
            return "primary"
    }

    return (
        <RootStyled
            sx={{
                "&:before": {
                    mt: "-.5rem",
                    background: event.borderColor
                }
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
                               color={getColor()}>
                            {event.status.value}
                        </Label>
                    </Box>
                    <Typography variant={"subtitle2"} color="text.primary" mt={1}>
                        {event.motif?.map((reason: ConsultationReasonModel) => reason.name).join(", ")}
                    </Typography>
                </Box>
                <Box className="action">
                    <Popover
                        open={openTooltip}
                        handleClose={() => setOpenTooltip(false)}
                        menuList={CalendarContextMenu}
                        onClickItem={handleMenuClick}
                        button={
                            <IconButton
                                onClick={() => {
                                    setOpenTooltip(true);
                                }}
                                sx={{display: "block", ml: "auto"}}
                                size="small"
                            >
                                <IconUrl path="more-vert"/>
                            </IconButton>
                        }
                    />
                </Box>
            </Box>
        </RootStyled>
    )
}

export default AppointmentListMobile;

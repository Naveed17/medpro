import {Box, IconButton, Typography} from "@mui/material";
import RootStyled from './overrides/rootStyled';
import {Label} from "@features/label";
import IconUrl from "@themes/urlIcon";
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import React, {useState} from "react";
import {Popover} from "@features/popover";
import {AppointmentStatus, CalendarContextMenu} from "@features/calendar";
import {prepareContextMenu} from "@lib/hooks";

function AppointmentListMobile({...props}) {
    const {event, OnSelectEvent, OnMenuActions, roles} = props;

    const [openTooltip, setOpenTooltip] = useState(false);

    const handleEventClick = () => {
        OnSelectEvent(Object.assign({...event}, {
            extendedProps: {
                ...event
            }
        }));
    }

    const handleMenuClick = (data: { title: string; icon: string; action: string }) => {
        setOpenTooltip(false);
        OnMenuActions(
            data.action,
            {
                title: `${event?.patient.firstName}  ${event?.patient.lastName}`,
                publicId: event.id,
                extendedProps: {
                    ...event
                }
            }
        );
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
                    <Typography fontSize={14} variant={"body2"} color="primary.main" className="title">
                        {event.title}
                    </Typography>
                    <Box className="time-badge-main">
                        {new Date(event.time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        }) !== "00:00" && <Typography fontSize={14} variant={"body2"} color="text.secondary">
                            <AccessTimeOutlinedIcon sx={{width: 18, height: 18}}/>
                            <span>
                                {new Date(event.time).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </Typography>}
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
                        menuList={CalendarContextMenu.filter(dataFilter =>
                            !prepareContextMenu(dataFilter.action, {
                                ...event,
                                status: event?.status
                            } as EventModal, roles))}
                        onClickItem={handleMenuClick}
                        button={
                            <IconButton
                                onClick={() => setOpenTooltip(true)}
                                sx={{display: "block", ml: "auto"}}
                                size="small">
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

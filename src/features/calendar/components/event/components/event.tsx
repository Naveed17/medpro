import {Box, Chip, Popover, Typography} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import React from "react";
import DangerIcon from "@themes/overrides/icons/dangerIcon";
import {useRouter} from "next/router";
import SalleIcon from "@themes/overrides/icons/salleIcon";
import CabinetIcon from "@themes/overrides/icons/cabinetIcon";
import {AppointmentPatientCard} from "@features/card";
import EventStyled from './overrides/eventStyled';
import Icon from "@themes/urlIcon";
import moment from "moment-timezone";
import {IconsTypes} from "@features/calendar";

function Event({...props}) {
    const {event, view, t} = props;

    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);
    const appointment = event.event._def.extendedProps;

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <EventStyled
                sx={{
                    ...(appointment.status.key === "CANCELED" && {
                            backgroundColor: "error.light",
                        }
                    ), ...(appointment.status.key === "ON_GOING" && {
                            backgroundColor: "success.light",
                        }
                    ), ...(appointment.status.key === "PENDING" && {
                            backgroundColor: "warning.light",
                        }
                    ), ...(appointment.status.key === "WAITING_ROOM" && {
                            backgroundColor: "secondary.lighter",
                            "& .ic-waiting .MuiSvgIcon-root": {
                                width: 16,
                                height: 16,
                                ml: ".5rem"
                            }
                        }
                    ), ...(appointment.hasErrors.length > 0 && {
                            "& .MuiSvgIcon-root": {
                                width: 10,
                                height: 10,
                                ml: ".5rem"
                            }
                        }
                    ),
                    "&:before": {
                        background: event.borderColor,
                    },
                }}
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                className="fc-event-main-box">
                {appointment.new && <Box className="badge"/>}
                <Typography variant="body2"
                            {...((appointment.status.key === "WAITING_ROOM" &&
                                    appointment.hasErrors.length === 0) &&
                                {className: "ic-waiting"})}
                            component={"span"}
                            color="text.primary">
                    {appointment.hasErrors.length > 0 ?
                        <DangerIcon/> :
                        appointment.status.key === "WAITING_ROOM" ?
                            <SalleIcon/> :
                            !appointment.overlapEvent && <AccessTimeIcon color={"disabled"} className="ic-time"/>}

                    {!appointment.overlapEvent &&
                        <span> {appointment.time.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                        })}
                        </span>}
                </Typography>

                <Typography variant="body2" component={"span"} sx={{
                    span: {
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                    }
                }} color="primary" noWrap>
                    {!appointment.overlapEvent && IconsTypes[appointment.type.icon]}
                    <span {...(appointment.overlapEvent && {style: {marginLeft: ".5rem"}})}>{event.event._def.title}</span>
                    {view === "timeGridDay" && (
                        <>
                            {appointment.patient?.contact.length > 0 && <>
                                <Icon path="ic-phone"/>
                                {appointment.patient?.contact[0]?.code} {appointment.patient?.contact[0].value}
                            </>}
                            {appointment.motif && <>{" Motif: "}{appointment.motif?.name}</>}
                        </>
                    )}
                </Typography>
            </EventStyled>
            <Popover
                id="mouse-over-popover"
                sx={{
                    pointerEvents: 'none',
                    zIndex: 900
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: view === "timeGridDay" ? 'bottom' : 'top',
                    horizontal: view === "timeGridDay" ? 'left' : moment(appointment.time).weekday() > 4 ? -305 : 'right'
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <>
                    {appointment.new &&
                        <Chip label={t("event.new", {ns: 'common'})}
                              sx={{
                                  position: "absolute",
                                  right: 4,
                                  top: 4,
                                  fontSize: 10
                              }}
                              size="small"
                              color={"primary"}/>}
                    <AppointmentPatientCard
                        style={{width: "300px", border: "none"}}
                        data={appointment}/>
                </>
            </Popover>
        </>
    )
}

export default Event;

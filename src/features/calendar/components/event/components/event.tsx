import {Box, Chip, Popover, Typography} from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import React from "react";
import DangerIcon from "@themes/overrides/icons/dangerIcon";
import SalleIcon from "@themes/overrides/icons/salleIcon";
import {AppointmentPopoverCard} from "@features/card";
import EventStyled from './overrides/eventStyled';
import Icon from "@themes/urlIcon";
import moment from "moment-timezone";
import {IconsTypes} from "@features/calendar";
import CancelCircleIcon from "@themes/overrides/icons/cancelCircleIcon";

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
                    ...(appointment.status.key === "ON_GOING" && {
                            backgroundColor: "success.light",
                        }
                    ), ...(appointment.status.key === "WAITING_ROOM" && {
                            "& .ic-waiting .MuiSvgIcon-root": {
                                width: 16,
                                height: 16
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
                    {!appointment.overlapEvent && appointment?.status.icon}
                    {appointment.hasErrors.length > 0 && <DangerIcon/>}

                    {/*{!appointment.overlapEvent &&
                        <span> {appointment.time.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                        })}
                        </span>}*/}
                </Typography>

                <Typography variant="body2" component={"span"} sx={{
                    span: {
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                    }
                }} color="primary" noWrap>
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
                    <AppointmentPopoverCard
                        style={{width: "300px", border: "none"}}
                        data={appointment}/>
                </>
            </Popover>
        </>
    )
}

export default Event;

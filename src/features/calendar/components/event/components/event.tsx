import {Avatar, Box, Chip, Popover, Typography} from "@mui/material";
import React from "react";
import DangerIcon from "@themes/overrides/icons/dangerIcon";
import {AppointmentPopoverCard} from "@features/card";
import EventStyled from './overrides/eventStyled';
import Icon from "@themes/urlIcon";
import moment from "moment-timezone";

function Event({...props}) {
    const {event, view, t, isMobile} = props;

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
                    "&:before": {
                        background: event.borderColor,
                    },
                }}
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                {...(!isMobile && {onMouseEnter: handlePopoverOpen})}
                {...(!isMobile && {onMouseLeave: handlePopoverClose})}
                className="fc-event-main-box">
                {appointment.new && <Box className="badge"/>}
                <Typography variant="body2"
                            {...((appointment.status.key === "WAITING_ROOM" &&
                                    appointment.hasErrors.length === 0) &&
                                {className: "ic-waiting"})}
                            component={"span"}
                            color="text.primary">
                    {appointment?.status.icon}
                    {appointment.hasErrors.length > 0 && <DangerIcon className={"ic-danger"}/>}
                </Typography>

                <Typography variant="body2" component={"span"} sx={{
                    span: {
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        ...(appointment.isOnline && {width: "98%"})
                    }
                }} color="primary" noWrap>
                    <>{event.event._def.title}</>
                    {view === "timeGridDay" && (
                        <>
                            {appointment.patient?.contact.length > 0 && <>
                                <Icon path="ic-phone"/>
                                {appointment.patient?.contact[0]?.code} {appointment.patient?.contact[0].value}
                            </>}
                            {appointment.motif.length > 0 && <span
                                style={{marginLeft: 4}}>{"Motif: "}{appointment.motif?.map((reason: ConsultationReasonModel) => reason.name).join(", ")}</span>}
                        </>
                    )}
                </Typography>
                {appointment.isOnline && <Avatar
                    className={"online-appointment"}
                    alt="Online appointment"
                    src="/static/icons/Med-logo_.svg"
                />}
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
                        {...{t}}
                        style={{width: "300px", border: "none"}}
                        data={appointment}/>
                </>
            </Popover>
        </>
    )
}

export default Event;

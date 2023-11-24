import {Avatar, Box, IconButton, Stack, Typography} from "@mui/material";
import React from "react";
import DangerIcon from "@themes/overrides/icons/dangerIcon";
import EventStyled from './overrides/eventStyled';
import Icon from "@themes/urlIcon";
import moment from "moment-timezone";
import {convertHexToRGBA} from "@lib/hooks";
import {alpha, Theme} from "@mui/material/styles";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import DeletedPatientIcon from "@themes/overrides/icons/deletedPatientIcon";

function Event({...props}) {
    const {isBeta, event, view, open} = props;
    const appointment = event.event._def.extendedProps;

    return (
        <>
            <EventStyled
                sx={{
                    ...((isBeta && !appointment?.payed) && {backgroundColor: (theme: Theme) => alpha(theme.palette.expire.main, 0.2)}),
                    ...(appointment?.patient?.isArchived && {
                        backgroundColor: (theme: Theme) => alpha(theme.palette.grey['A100'], 0.5),
                        opacity: 0.5
                    }),
                    ...(appointment.motif.length > 0 && {background: (theme: Theme) => `linear-gradient(90deg, ${isBeta && !appointment?.payed ? alpha(theme.palette.expire.main, 0.2) : 'rgba(255,0,0,0)'} 97.5%, ${appointment.motif.map((motif: ConsultationReasonModel) => `${convertHexToRGBA(motif.color, 0.8)} 5%`).join(",")})`}),
                    "&:before": {
                        background: event.borderColor
                    },
                    ...(appointment.dur > 15 && {
                        "&.fc-event-main-box": {
                            alignItems: 'flex-start'
                        }
                    })
                }}
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                className="fc-event-main-box">
                <Stack height={1} width={1} spacing={.5}>
                    {
                        appointment.dur > 15 && (
                            <Stack direction='row' alignItems={'center'} pl={.5}>
                                <Typography variant="body2" color="text.primary">
                                    {moment(appointment.time).format("HH:mm")}
                                </Typography>
                                {appointment.new && <Box className="badge"/>}
                                {!appointment?.patient?.isArchived ? <Typography
                                        variant="body2"
                                        {...((appointment.status.key === "WAITING_ROOM" &&
                                                appointment.hasErrors.length === 0) &&
                                            {className: "ic-waiting"})}
                                        component={"span"}
                                        color="text.primary">
                                        {appointment?.status.icon}
                                        {appointment.hasErrors.length > 0 && <DangerIcon className={"ic-danger"}/>}
                                    </Typography>
                                    :
                                    <DeletedPatientIcon/>
                                }
                            </Stack>
                        )
                    }
                    <Stack direction='row' alignItems={appointment.dur > 15 ? "flex-start" : 'center'} width={1}
                           height={1}>
                        {appointment.dur <= 15 && (
                            <>
                                {appointment.new && <Box className="badge"/>}
                                {!appointment?.patient?.isArchived ? <Typography
                                        variant="body2"
                                        {...((appointment.status.key === "WAITING_ROOM" &&
                                                appointment.hasErrors.length === 0) &&
                                            {className: "ic-waiting"})}
                                        component={"span"}
                                        color="text.primary">
                                        {appointment?.status.icon}
                                        {appointment.hasErrors.length > 0 && <DangerIcon className={"ic-danger"}/>}
                                    </Typography>
                                    :
                                    <DeletedPatientIcon/>
                                }
                            </>
                        )}

                        <Typography
                            pl={appointment.dur > 15 ? 0.5 : 0}
                            variant="body2"
                            component={"span"}
                            sx={{
                                span: {
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    ...((appointment.isOnline || appointment.motif.length > 0) && {width: "96%"}),
                                    ...((appointment.hasErrors.length > 0 && (appointment.isOnline || appointment.motif.length > 0)) && {width: "94%"})
                                }
                            }}
                            color={"text.primary"}
                            fontWeight={600}
                            noWrap>
                            <span>{event.event._def.title}</span>
                            {view === "timeGridDay" && (
                                <>
                                    {appointment.patient?.contact?.length > 0 && <>
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
                        <IconButton className="btn-rdv" sx={{
                            alignSelf: appointment.dur > 15 ? "flex-end" : 'flex-start',
                            mr: appointment.motif.length > 0 ? .5 : 0
                        }}>
                            <PlayCircleIcon/>
                        </IconButton>
                    </Stack>
                </Stack>
            </EventStyled>
        </>
    )
}

export default Event;

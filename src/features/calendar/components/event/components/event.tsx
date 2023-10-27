import {Avatar, Box, Typography} from "@mui/material";
import React, {useEffect} from "react";
import DangerIcon from "@themes/overrides/icons/dangerIcon";
import EventStyled from './overrides/eventStyled';
import Icon from "@themes/urlIcon";
import moment from "moment-timezone";
import {convertHexToRGBA, useMedicalEntitySuffix} from "@lib/hooks";
import {useRequestQueryMutation} from "@lib/axios";
import {useAppSelector} from "@lib/redux/hooks";
import {agendaSelector} from "@features/calendar";
import {useRouter} from "next/router";
import {alpha, Theme} from "@mui/material/styles";

function Event({...props}) {
    const {isBeta, event, view, isMobile, open, setAppointmentData, anchorEl, setAnchorEl, isEventDragging} = props;
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {config: agenda, openViewDrawer} = useAppSelector(agendaSelector);

    const {trigger: triggerAppointmentTooltip} = useRequestQueryMutation("/agenda/appointment/tooltip");

    let timeoutId: any;
    const appointment = event.event._def.extendedProps;
    const appointmentUuid = event.event._def.publicId;

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            setAppointmentData(null);
            const query = `?mode=tooltip&appointment=${appointmentUuid}&start_date=${moment(appointment.time).format("DD-MM-YYYY")}&end_date=${moment(appointment.time).format("DD-MM-YYYY")}&format=week`
            triggerAppointmentTooltip({
                method: "GET",
                url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${router.locale}${query}`
            }, {
                onSuccess: (result) => {
                    const appointmentData = (result?.data as HttpResponse)?.data as AppointmentModel[];
                    if (appointmentData.length > 0) {
                        setAnchorEl(event.target as any);
                        setAppointmentData(appointmentData[0]);
                    }
                }
            })
        }, 1000);
    }

    const handlePopoverClose = () => {
        setAnchorEl(null);
        clearTimeout(timeoutId);
    }

    useEffect(() => {
        if (anchorEl !== null && openViewDrawer) {
            handlePopoverClose()
        }
    }, [anchorEl]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <EventStyled
                sx={{
                    ...((isBeta && !appointment?.payed) && {backgroundColor: (theme: Theme) => alpha(theme.palette.expire.main, 0.2)}),
                    ...(appointment.motif.length > 0 && {background: (theme: Theme) => `linear-gradient(90deg, ${isBeta && !appointment?.payed ? alpha(theme.palette.expire.main, 0.2) : 'rgba(255,0,0,0)'} 95%, ${appointment.motif.map((motif: ConsultationReasonModel) => `${convertHexToRGBA(motif.color, 0.8)} 5%`).join(",")})`}),
                    "&:before": {
                        background: event.borderColor
                    }
                }}
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                {...((!isMobile && !isEventDragging) && {onMouseEnter: handlePopoverOpen})}
                {...((!isMobile && !isEventDragging) && {onMouseLeave: handlePopoverClose})}
                className="fc-event-main-box">
                {appointment.new && <Box className="badge"/>}
                <Typography
                    variant="body2"
                    {...((appointment.status.key === "WAITING_ROOM" &&
                            appointment.hasErrors.length === 0) &&
                        {className: "ic-waiting"})}
                    component={"span"}
                    color="text.primary">
                    {appointment?.status.icon}
                    {appointment.hasErrors.length > 0 && <DangerIcon className={"ic-danger"}/>}
                </Typography>

                <Typography
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
                    color="primary"
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
            </EventStyled>
        </>
    )
}

export default Event;

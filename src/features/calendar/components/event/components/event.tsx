import {Avatar, Box, Chip, Popover, Typography} from "@mui/material";
import React from "react";
import DangerIcon from "@themes/overrides/icons/dangerIcon";
import {AppointmentPopoverCard} from "@features/card";
import EventStyled from './overrides/eventStyled';
import Icon from "@themes/urlIcon";
import moment from "moment-timezone";
import {convertHexToRGBA, useMedicalEntitySuffix} from "@lib/hooks";
import {useRequestMutation} from "@lib/axios";
import {useAppSelector} from "@lib/redux/hooks";
import {agendaSelector} from "@features/calendar";
import {useRouter} from "next/router";

function Event({...props}) {
    const {event, view, t, isMobile} = props;
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {config: agenda} = useAppSelector(agendaSelector);

    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const [appointmentData, setAppointmentData] = React.useState<AppointmentModel | null>(null);

    const open = Boolean(anchorEl);
    let timeoutId: any;
    const appointment = event.event._def.extendedProps;
    const appointmentUuid = event.event._def.publicId;
    const {trigger: triggerAppointmentTooltip} = useRequestMutation(null, "/agenda/appointment/tooltip");

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            setAnchorEl(event.target as any);
            const query = `?mode=tooltip&appointment=${appointmentUuid}&start_date=${moment(appointment.time).format("DD-MM-YYYY")}&end_date=${moment(appointment.time).format("DD-MM-YYYY")}&format=week`
            triggerAppointmentTooltip({
                method: "GET",
                url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${router.locale}${query}`
            }).then((result) => {
                const appointmentData = (result?.data as HttpResponse)?.data as AppointmentModel[];
                if (appointmentData.length > 0) {
                    setAppointmentData(appointmentData[0]);
                }
            })
        }, 1000);
    }

    const handlePopoverClose = () => {
        setAnchorEl(null);
        clearTimeout(timeoutId);
    }

    const isHorizontal = () => {
        if (view === "timeGridDay")
            return 'left';
        else if (moment(appointment.time).weekday() > 4)
            return -305;
        else return 'right';
    }

    return (
        <>
            <EventStyled
                sx={{
                    ...(appointment.motif.length > 0 && {background: `linear-gradient(90deg, rgba(255,0,0,0) 95%, ${appointment.motif.map((motif: ConsultationReasonModel) => `${convertHexToRGBA(motif.color, 0.8)} 5%`).join(",")})`}),
                    "&:before": {
                        background: event.borderColor,
                    },
                }}
                onClick={(event) => {
                    handlePopoverClose();
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
                        ...((appointment.isOnline || appointment.motif.length > 0) && {width: "96%"}),
                        ...((appointment.hasErrors.length > 0 && (appointment.isOnline || appointment.motif.length > 0)) && {width: "94%"})
                    }
                }} color="primary" noWrap>
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
                    horizontal: isHorizontal()
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus>
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
                        data={appointmentData}/>
                </>
            </Popover>
        </>
    )
}

export default Event;

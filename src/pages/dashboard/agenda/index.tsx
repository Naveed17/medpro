import {GetStaticProps} from "next";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {MutableRefObject, ReactElement, useCallback, useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import {
    Alert,
    Box,
    Button,
    Container,
    Drawer, Fab,
    LinearProgress,
    Theme,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import {configSelector, DashLayout} from "@features/base";
import {SubHeader} from "@features/subHeader";
import {CalendarToolbar} from "@features/toolbar";
import {DesktopContainer} from "@themes/desktopConainter";
import {MobileContainer} from "@themes/mobileContainer";
import dynamic from "next/dynamic";
import {useSession} from "next-auth/react";
import {LoadingScreen} from "@features/loadingScreen";
import {useRequestMutation} from "@app/axios";
import {useSnackbar} from 'notistack';
import {Session} from "next-auth";
import moment from "moment-timezone";
import FullCalendar, {DateSelectArg, DatesSetArg, EventChangeArg, EventDef} from "@fullcalendar/react";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {
    agendaSelector,
    AppointmentStatus,
    DayOfWeek,
    openDrawer,
    setSelectedEvent,
    setStepperIndex
} from "@features/calendar";
import {
    appointmentSelector,
    EventType,
    Instruction,
    Patient, resetSubmitAppointment,
    setAppointmentDate,
    setAppointmentRecurringDates,
    TimeSchedule
} from "@features/tabPanel";
import {TriggerWithoutValidation} from "@app/swr/swrProvider";
import {AppointmentDetail, Dialog, dialogMoveSelector, PatientDetail, setMoveDateTime} from "@features/dialog";
import {AppointmentListMobile, setTimer, timerSelector} from "@features/card";
import {FilterButton} from "@features/buttons";
import {ActionBarState, AgendaFilter, leftActionBarSelector, resetFilterPatient} from "@features/leftActionBar";
import {AnimatePresence, motion} from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import Icon from "@themes/urlIcon";
import {LoadingButton} from "@mui/lab";
import {CustomStepper} from "@features/customStepper";
import IconUrl from "@themes/urlIcon";

const Calendar = dynamic(() => import('@features/calendar/components/calendar'), {
    ssr: false
});

const EventStepper = [
    {
        title: "steppers.tabs.tab-1",
        children: EventType,
        disabled: false
    }, {
        title: "steppers.tabs.tab-2",
        children: TimeSchedule,
        disabled: true
    }, {
        title: "steppers.tabs.tab-3",
        children: Patient,
        disabled: true
    }, {
        title: "steppers.tabs.tab-4",
        children: Instruction,
        disabled: true
    }
];

function Agenda() {
    const {data: session, status} = useSession();
    const router = useRouter();
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const {enqueueSnackbar} = useSnackbar();

    const {t, ready} = useTranslation(['agenda', 'common']);

    const {direction} = useAppSelector(configSelector);
    const {query: filter} = useAppSelector(leftActionBarSelector);
    const {submitted} = useAppSelector(appointmentSelector);
    const {
        openViewDrawer,
        openAddDrawer, openPatientDrawer, currentDate, view
    } = useAppSelector(agendaSelector);
    const {
        date: moveDialogDate,
        time: moveDialogTime,
        selected: moveDateChanged,
        action: moveDialogAction
    } = useAppSelector(dialogMoveSelector);
    const {isActive} = useAppSelector(timerSelector);
    const {config: agenda} = useAppSelector(agendaSelector);

    const [
        timeRange,
        setTimeRange
    ] = useState({start: "", end: ""});

    const [loading, setLoading] = useState<boolean>(status === 'loading');
    const [moveDialogInfo, setMoveDialogInfo] = useState<boolean>(false);
    const [cancelDialog, setCancelDialog] = useState<boolean>(false);
    const [actionDialog, setActionDialog] = useState("cancel");
    const [moveDialog, setMoveDialog] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [localFilter, setLocalFilter] = useState("");

    const [date, setDate] = useState(currentDate.date);
    const [event, setEvent] = useState<EventDef>();
    const [calendarEl, setCalendarEl] = useState<FullCalendar | null>(null);
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

    let events: MutableRefObject<EventModal[]> = useRef([]);
    let sortedData: MutableRefObject<GroupEventsModel[]> = useRef([]);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;


    const openingHours = agenda?.locations[0].openingHours[0].openingHours;

    const {
        data: httpAppointmentResponse,
        trigger
    } = useRequestMutation(null, "/agenda/appointment", {revalidate: true, populateCache: false});

    const {
        trigger: updateAppointmentTrigger
    } = useRequestMutation(null, "/agenda/update/appointment",
        TriggerWithoutValidation);

    const {
        trigger: updateStatusTrigger
    } = useRequestMutation(null, "/agenda/update/appointment/status",
        TriggerWithoutValidation);

    const getAppointmentBugs = useCallback((date: Date) => {
        const hasDayWorkHours: any = Object.entries(openingHours).find((openingHours: any) =>
            DayOfWeek(openingHours[0], 0) === moment(date).isoWeekday());
        if (hasDayWorkHours) {
            let hasError: boolean[] = [];
            hasDayWorkHours[1].map((time: { end_time: string, start_time: string }) => {
                    hasError.push(!moment(date).isBetween(
                        moment(`${moment(date).format("DD-MM-YYYY")} ${time.start_time}`, "DD-MM-YYYY HH:mm"),
                        moment(`${moment(date).format("DD-MM-YYYY")} ${time.end_time}`, "DD-MM-YYYY HH:mm"), "minutes", '[)'));
                }
            );
            return hasError.every(error => error);
        }
        return true;
    }, [openingHours]);

    const getAppointments = useCallback((query: string, view = "timeGridWeek") => {
        setLoading(true);
        trigger({
            method: "GET",
            url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agenda?.uuid}/appointments/${router.locale}?${query}`,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            }
        }, TriggerWithoutValidation).then((result) => {
            const eventCond = (result?.data as HttpResponse)?.data;
            const appointments = (eventCond?.hasOwnProperty('list') ? eventCond.list : eventCond) as AppointmentModel[];
            const eventsUpdated: EventModal[] = [];
            appointments?.map((appointment) => {
                const hasErrors = [
                    ...(getAppointmentBugs(moment(appointment.dayDate + ' ' + appointment.startTime, "DD-MM-YYYY HH:mm").toDate()) ? ["event.hors-opening-hours"] : []),
                    ...(appointment.PatientHasAgendaAppointment ? ["event.patient-multi-event-day"] : [])]
                eventsUpdated.push({
                    start: moment(appointment.dayDate + ' ' + appointment.startTime, "DD-MM-YYYY HH:mm").toDate(),
                    time: moment(appointment.dayDate + ' ' + appointment.startTime, "DD-MM-YYYY HH:mm").toDate(),
                    end: moment(appointment.dayDate + ' ' + appointment.startTime, "DD-MM-YYYY HH:mm").add(appointment.duration, "minutes").toDate(),
                    title: appointment.patient.lastName + ' ' + appointment.patient.firstName,
                    allDay: false,
                    borderColor: appointment.type?.color,
                    patient: appointment.patient,
                    overlapEvent: appointment.overlapEvent ? appointment.overlapEvent : false,
                    motif: appointment.consultationReason,
                    instruction: appointment.instruction !== null ? appointment.instruction : "",
                    id: appointment.uuid,
                    hasErrors,
                    dur: appointment.duration,
                    type: appointment.type,
                    meeting: false,
                    new: moment(appointment.createdAt, "DD-MM-YYYY HH:mm").add(1, "hours").isBetween(moment().subtract(30, "minutes"), moment(), "minutes", '[]'),
                    addRoom: true,
                    status: AppointmentStatus[appointment.status]
                });
            });
            events.current = eventsUpdated;
            // this gives an object with dates as keys
            const groups: any = eventsUpdated.reduce(
                (groups: any, data: any) => {
                    const date = moment(data.time, "ddd MMM DD YYYY HH:mm:ss")
                        .format('DD-MM-YYYY');
                    if (!groups[date]) {
                        groups[date] = [];
                    }
                    groups[date].push(data);
                    return groups;
                }, {});

            // Edit: to add it in the array format instead
            const groupArrays = Object.keys(groups).map((date) => {
                return {
                    date,
                    events: groups[date]
                };
            });

            if (isMobile || view === "listWeek") {
                // sort grouped data
                sortedData.current = groupArrays.slice()
                    .sort((a, b) =>
                        new Date(a.date).getTime() - new Date(b.date).getTime());
            }

            setLoading(false);
        });
    }, [agenda?.uuid, getAppointmentBugs, isMobile, medical_entity.uuid, router.locale, session?.accessToken, trigger]);

    const prepareSearchKeys = (filter: ActionBarState | undefined) => {
        let query = "";
        if (filter) {
            Object.entries(filter).map((param, index) => {
                if (param[0] === "patient" && param[1]) {
                    Object.entries(param[1]).map(deepParam => {
                        if (deepParam[1]) {
                            query += `&${deepParam[0]}=${deepParam[1]}`;
                        }
                    })
                }
                if (param[0] === "type" && param[1]) {
                    query += `&${param[0]}=${param[1]}`;
                }
            });
        }
        return query;
    }

    useEffect(() => {
        if (filter?.type && timeRange.start !== "" || filter?.patient) {
            const query = prepareSearchKeys(filter as any);
            setLocalFilter(query);
            const queryPath = `${view === 'listWeek' ? 'format=list&page=1&limit=50' :
                `start_date=${timeRange.start}&end_date=${timeRange.end}&format=week`}${query}`;
            getAppointments(queryPath, view);
        } else if (localFilter) {
            const queryPath = `${view === 'listWeek' ? 'format=list&page=1&limit=50' :
                `start_date=${timeRange.start}&end_date=${timeRange.end}&format=week`}`
            getAppointments(queryPath, view);
        }
    }, [filter, getAppointments, timeRange]) // eslint-disable-line react-hooks/exhaustive-deps


    const handleOnRangeChange = (event: DatesSetArg) => {
        dispatch(resetFilterPatient());
        const startStr = moment(event.startStr).format('DD-MM-YYYY');
        const endStr = moment(event.endStr).format('DD-MM-YYYY');
        setTimeRange({start: startStr, end: endStr});
        if (prepareSearchKeys(filter as any).length === 0 && localFilter.length === 0) {
            getAppointments(`start_date=${startStr}&end_date=${endStr}&format=week`);
        }
    }

    const handleOnToday = (event: React.MouseEventHandler) => {
        const calendarApi = (calendarEl as FullCalendar).getApi();
        calendarApi.today();
    }

    const onLoadCalendar = (event: FullCalendar) => {
        setCalendarEl(event);
    }

    const onViewChange = (view: string) => {
        console.log("onViewChange", filter);
        const query = prepareSearchKeys(filter as any);
        if (view === 'listWeek' && filter?.patient === undefined) {
            getAppointments(`format=list&page=1&limit=50${query}`, view);
        }
    }

    const onSelectEvent = (event: EventDef) => {
        setEvent(event);
        dispatch(setSelectedEvent(event));
        dispatch(openDrawer({type: "view", open: true}));
    }

    const onEventChange = (info: EventChangeArg) => {
        const startDate = moment(info.event._instance?.range.start);
        const endDate = moment(info.event._instance?.range.end);
        const duration = endDate.diff(startDate, "minutes");
        const oldStartDate = moment(info.oldEvent._instance?.range.start);
        const oldEndDate = moment(info.oldEvent._instance?.range.end);
        const oldDuration = oldEndDate.diff(oldStartDate, "minutes");
        const defEvent = {
            ...info.event._def,
            extendedProps: {
                newDate: startDate,
                oldDate: oldStartDate,
                duration,
                oldDuration,
                onDurationChanged: oldDuration !== duration
            }
        };
        setEvent(defEvent);
        setMoveDialog(true);
    }

    const onMenuActions = (action: string, event: EventDef) => {
        switch (action) {
            case "onCancel":
                setEvent(event);
                setActionDialog('cancel');
                setCancelDialog(true);
                break;
            case "onConsultationDetail":
                if (!isActive) {
                    const slugConsultation = `/dashboard/consultation/${event?.publicId ? event?.publicId : (event as any)?.id}`;
                    router.push(slugConsultation, slugConsultation, {locale: router.locale}).then(() => {
                        dispatch(setTimer({isActive: true, isPaused: false, event}));
                        updateAppointmentStatus(event?.publicId ? event?.publicId : (event as any)?.id, "4", {
                            start_date: moment().format("DD-MM-YYYY"),
                            start_time: moment().format("HH:mm")
                        });
                    });
                } else {
                    setError(true);
                }
                break;
            case "onConsultationView":
                const slugConsultation = `/dashboard/consultation/${event?.publicId ? event?.publicId : (event as any)?.id}`;
                router.push(slugConsultation, slugConsultation, {locale: router.locale});
                break;
            case "onPatientDetail":
                setEvent(event);
                dispatch(openDrawer({type: "patient", open: true}));
                break;
            case "onWaitingRoom":
                setEvent(event);
                onOpenWaitingRoom(event);
                break;
            case "onLeaveWaitingRoom":
                setEvent(event);
                updateAppointmentStatus(event?.publicId ? event?.publicId :
                    (event as any)?.id, "6").then(() => {
                    refreshData();
                    enqueueSnackbar(t(`alert.leave-waiting-room`), {variant: "success"});
                });
                break;
            case "onPatientNoShow":
                setEvent(event);
                onPatientNoShow(event);
                break;
            case "onMove":
                dispatch(setSelectedEvent(event));
                setEvent(event);
                dispatch(setMoveDateTime({
                    date: new Date(event?.extendedProps.time),
                    time: moment(new Date(event?.extendedProps.time)).format("HH:mm"),
                    action: "move",
                    selected: false
                }));
                setMoveDialogInfo(true);
                break;
            case "onReschedule":
                dispatch(setSelectedEvent(event));
                setEvent(event);
                dispatch(setMoveDateTime({
                    date: new Date(event?.extendedProps.time),
                    time: moment(new Date(event?.extendedProps.time)).format("HH:mm"),
                    action: "reschedule",
                    selected: false
                }));
                setMoveDialogInfo(true);
                break;
        }
    }

    const onOpenWaitingRoom = (event: EventDef) => {
        updateAppointmentStatus(
            event?.publicId ? event?.publicId : (event as any)?.id, "3").then(
            () => {
                refreshData();
                enqueueSnackbar(t(`alert.on-waiting-room`), {variant: "success"});
            });
    }

    const onPatientNoShow = (event: EventDef) => {
        updateAppointmentStatus(
            event?.publicId ? event?.publicId : (event as any)?.id, "10").then(
            () => {
                refreshData();
                enqueueSnackbar(t(`alert.patient-no-show`), {variant: "success"});
                dispatch(openDrawer({type: "view", open: false}));
            });
    }

    const onConsultationDetail = (event: EventDef) => {
        if (!isActive) {
            const slugConsultation = `/dashboard/consultation/${event?.publicId ? event?.publicId : (event as any)?.id}`;
            router.push(slugConsultation, slugConsultation, {locale: router.locale}).then(() => {
                dispatch(openDrawer({type: "view", open: false}));
                dispatch(setTimer({isActive: true, isPaused: false, event}));
            })
        } else {
            dispatch(openDrawer({type: "view", open: false}));
            setError(true);
            setInterval(() => {
                setError(false);
            }, 8000);
        }
    }

    const onUpdateDefEvent = () => {
        const timeSplit = moveDialogTime.split(':');
        const date = moment(moveDialogDate?.setHours(parseInt(timeSplit[0]), parseInt(timeSplit[1])));
        const defEvent = {
            ...event,
            extendedProps: {
                newDate: date,
                from: 'modal',
                duration: event?.extendedProps.dur,
                onDurationChanged: false,
                oldDate: moment(event?.extendedProps.time)
            }
        } as EventDef;
        setEvent(defEvent);
        return defEvent;
    }

    const onRescheduleAppointment = () => {
        handleRescheduleAppointment(onUpdateDefEvent() as EventDef)
    }

    const onMoveAppointment = () => {
        onUpdateDefEvent();
        setMoveDialogInfo(false);
        setMoveDialog(true);
    }

    const handleMoveAppointment = (event: EventDef) => {
        setLoading(true);
        const form = new FormData();
        form.append('start_date', event.extendedProps.newDate.format("DD-MM-YYYY"));
        form.append('start_time',
            event.extendedProps.newDate.clone().subtract(event.extendedProps.from ? 0 : 1, 'hours').format("HH:mm"));
        const eventId = event.publicId ? event.publicId : (event as any).id;
        form.append('duration', event.extendedProps.duration);
        updateAppointmentTrigger({
            method: "PUT",
            url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agenda?.uuid}/appointments/${eventId}/change-date/${router.locale}`,
            data: form,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            }
        }, TriggerWithoutValidation).then((result) => {
            if ((result?.data as HttpResponse).status === "success") {
                enqueueSnackbar(t(`dialogs.move-dialog.${!event.extendedProps.onDurationChanged ?
                    "alert-msg" : "alert-msg-duration"}`), {variant: "success"});
            }
            refreshData();
            setMoveDialog(false);
        });
    }

    const handleRescheduleAppointment = (event: EventDef) => {
        setLoading(true);
        const form = new FormData();
        form.append('start_date', event.extendedProps.newDate.format("DD-MM-YYYY"));
        form.append('start_time',
            event.extendedProps.newDate.clone().subtract(event.extendedProps.from ? 0 : 1, 'hours').format("HH:mm"));
        const eventId = event.publicId ? event.publicId : (event as any).id;
        updateAppointmentTrigger({
            method: "POST",
            url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agenda?.uuid}/appointments/${eventId}/clone/${router.locale}`,
            data: form,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            }
        }, TriggerWithoutValidation).then((result) => {
            if ((result?.data as HttpResponse).status === "success") {
                enqueueSnackbar(t(`dialogs.reschedule-dialog.alert-msg`), {variant: "success"});
            }
            refreshData();
            setMoveDialogInfo(false);
        });
    }

    const updateAppointmentStatus = (appointmentUUid: string, status: string, params?: any) => {
        const form = new FormData();
        form.append('status', status);
        if (params) {
            Object.entries(params).map((param: any, index) => {
                form.append(param[0], param[1]);
            });
        }
        return updateStatusTrigger({
            method: "PATCH",
            url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agenda?.uuid}/appointments/${appointmentUUid}/status/${router.locale}`,
            data: form,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        });
    }

    const handleActionDialog = (appointmentUUid: string) => {
        switch (actionDialog) {
            case "cancel":
                cancelAppointment(appointmentUUid);
                break;
            case "delete":
                deleteAppointment(appointmentUUid);
                break;
        }

    }

    const deleteAppointment = (appointmentUUid: string) => {
        setLoading(true);
        updateAppointmentStatus(appointmentUUid, "9").then(() => {
            dispatch(openDrawer({type: "view", open: false}));
            setCancelDialog(false);
            setLoading(false);
            refreshData();
            enqueueSnackbar(t(`alert.delete-appointment`), {variant: "success"});
        });
    }

    const cancelAppointment = (appointmentUUid: string) => {
        setLoading(true);
        updateAppointmentStatus(appointmentUUid, "6").then(() => {
            const eventUpdated: any = {
                ...event, extendedProps:
                    {...event?.extendedProps, status: {key: "CANCELED", value: "Annulé"}}
            };
            dispatch(setSelectedEvent(eventUpdated));
            setCancelDialog(false);
            setLoading(false);
            refreshData();
            enqueueSnackbar(t(`alert.cancel-appointment`), {variant: "success"});
        });
    }

    const onSelectDate = (eventArg: DateSelectArg) => {
        dispatch(setAppointmentDate(eventArg.start));
        dispatch(setAppointmentRecurringDates([{
            id: `${moment(eventArg.start).format("DD-MM-YYYY")}--${moment(eventArg.start).format("HH:mm")}`,
            time: moment(eventArg.start).format("HH:mm"),
            date: moment(moment(eventArg.start)).format("DD-MM-YYYY"),
            status: "success"
        }]));
        dispatch(openDrawer({type: "add", open: true}));
    }

    const handleStepperChange = (index: number) => {
        dispatch(setStepperIndex(index));
    }

    const handleStepperActions = (action: string, event: EventDef) => {
        switch (action) {
            case "onDetailPatient":
                setEvent(event);
                dispatch(openDrawer({type: "patient", open: true}));
                break;
            case "onWaitingRoom":
                onOpenWaitingRoom(event);
                dispatch(openDrawer({type: "add", open: false}));
                break;
        }
    }

    const submitStepper = (index: number) => {
        if (EventStepper.length !== index) {
            EventStepper[index].disabled = false;
        } else {
            EventStepper.map((stepper, index) => stepper.disabled = true);
            refreshData();
        }
    }

    const cleanDrawData = () => {
        dispatch(openDrawer({type: "patient", open: false}));
        if (!openViewDrawer) {
            setTimeout(() => {
                setEvent(undefined);
            }, 300);
        }
    }

    const refreshData = () => {
        if (view === 'listWeek') {
            getAppointments(`format=list&page=1&limit=50`, view);
        } else {
            getAppointments(`start_date=${timeRange.start}&end_date=${timeRange.end}&format=week`);
        }
    }

    if (!ready) return (<LoadingScreen/>);

    return (
        <>
            <SubHeader
                {...{
                    sx: {
                        "& .MuiToolbar-root": {
                            "display": "block"
                        }
                    }
                }}>
                <CalendarToolbar onToday={handleOnToday} date={date}/>
                {error &&
                    <AnimatePresence exitBeforeEnter>
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{ease: "easeIn", duration: 1}}
                        >
                            <Alert sx={{marginBottom: 2}}
                                   severity="error">{t("in-consultation-error")}</Alert>
                        </motion.div>
                    </AnimatePresence>}
            </SubHeader>
            <Box>
                <LinearProgress sx={{
                    visibility: !httpAppointmentResponse || loading ? "visible" : "hidden"
                }} color="warning"/>
                <DesktopContainer>
                    <>
                        {agenda &&
                            <AnimatePresence exitBeforeEnter>
                                <motion.div
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    transition={{ease: "easeIn", duration: .5}}
                                >
                                    <Calendar
                                        {...{
                                            events: events.current,
                                            agenda,
                                            spinner: loading,
                                            t,
                                            sortedData: sortedData.current
                                        }}
                                        OnInit={onLoadCalendar}
                                        OnWaitingRoom={(event: EventDef) => onMenuActions('onWaitingRoom', event)}
                                        OnLeaveWaitingRoom={(event: EventDef) => onMenuActions('onLeaveWaitingRoom', event)}
                                        OnSelectEvent={onSelectEvent}
                                        OnEventChange={onEventChange}
                                        OnMenuActions={onMenuActions}
                                        OnSelectDate={onSelectDate}
                                        OnViewChange={onViewChange}
                                        OnRangeChange={handleOnRangeChange}/>
{/*                                    <Fab sx={{position: "sticky", bottom: "1rem", right: "1rem", zIndex: 98}}
                                         size="small"
                                         aria-label={"info"} color={"primary"}>
                                        <IconUrl color={"white"} path={"ic-plusinfo-quetsion"}/>
                                    </Fab>*/}
                                </motion.div>
                            </AnimatePresence>
                        }
                    </>
                </DesktopContainer>
                <MobileContainer>
                    {sortedData.current?.map((row, index) => (
                        <Container key={index}>
                            <Typography variant={"body1"}
                                        color="text.primary"
                                        pb={1} pt={2}
                                        sx={{textTransform: "capitalize", fontSize: '1rem'}}>
                                {moment(row.date, "DD-MM-YYYY").isSame(moment(new Date(), "DD-MM-YYYY")) ? (
                                    "Today"
                                ) : moment(row.date, "DD-MM-YYYY").isSame(moment(new Date(), "DD-MM-YYYY").add(1, 'days')) ? (
                                    "Tomorrow"
                                ) : (
                                    <>
                                        {moment(row.date, "DD-MM-YYYY").format("MMMM")}{" "}
                                        {moment(row.date, "DD-MM-YYYY").format("DD")}
                                    </>
                                )}
                            </Typography>

                            {row.events.map((event) => (
                                <AppointmentListMobile
                                    OnMenuActions={onMenuActions}
                                    OnSelectEvent={onSelectEvent}
                                    key={event.id}
                                    event={event}/>

                            ))}
                        </Container>
                    ))}

                    <FilterButton>
                        <AgendaFilter/>
                    </FilterButton>
                </MobileContainer>

                <Drawer
                    anchor={"right"}
                    open={openViewDrawer}
                    dir={direction}
                    onClose={() => {
                        dispatch(openDrawer({type: "view", open: false}));
                        setTimeout(() => {
                            setEvent(undefined);
                        }, 300);
                    }}
                >
                    {(event && openViewDrawer) &&
                        <AppointmentDetail
                            OnConsultation={onConsultationDetail}
                            OnDataUpdated={() => refreshData()}
                            OnCancelAppointment={() => refreshData()}
                            OnPatientNoShow={onPatientNoShow}
                            OnWaiting={(event: EventDef) => {
                                onOpenWaitingRoom(event);
                                dispatch(openDrawer({type: "view", open: false}));
                            }}
                            OnLeaveWaiting={(event: EventDef) => {
                                onMenuActions('onLeaveWaitingRoom', event);
                                dispatch(openDrawer({type: "view", open: false}));
                            }}
                            OnEditDetail={() => dispatch(openDrawer({type: "patient", open: true}))}
                            SetMoveDialog={() => setMoveDialogInfo(true)}
                            SetCancelDialog={() => {
                                setActionDialog('cancel');
                                setCancelDialog(true)
                            }}
                            SetDeleteDialog={() => {
                                setActionDialog('delete');
                                setCancelDialog(true);
                            }}
                            OnMoveAppointment={onMoveAppointment}
                            translate={t}
                        />}
                </Drawer>

                <Drawer
                    anchor={"right"}
                    open={openAddDrawer}
                    dir={direction}
                    onClose={() => {
                        dispatch(setStepperIndex(0));
                        if (submitted) {
                            dispatch(resetSubmitAppointment());
                        }
                        EventStepper[0].disabled = false;
                        dispatch(openDrawer({type: "add", open: false}));
                        setTimeout(() => {
                            setEvent(undefined);
                        }, 300);
                    }}
                >
                    <Box height={"100%"}>
                        <CustomStepper
                            OnTabsChange={handleStepperChange}
                            OnSubmitStepper={submitStepper}
                            stepperData={EventStepper}
                            OnCustomAction={handleStepperActions}
                            scroll
                            t={t}
                            minWidth={726}
                        />
                    </Box>
                </Drawer>

                <Drawer
                    anchor={"right"}
                    open={openPatientDrawer}
                    dir={direction}
                    onClose={cleanDrawData}
                >
                    <Box height={"100%"}>
                        {(event && openPatientDrawer) &&
                            <PatientDetail
                                onCloseDialog={cleanDrawData}
                                onChangeStepper={(index: number) => console.log("onChangeStepper", index)}
                                onAddAppointment={() => console.log("onAddAppointment")}
                                onConsultation={() => onMenuActions('onConsultationDetail', event)}
                                patientId={event?.extendedProps.patient.uuid}/>}
                    </Box>
                </Drawer>

                <Dialog
                    color={theme.palette.warning.main}
                    contrastText={theme.palette.warning.contrastText}
                    dialogClose={() => setMoveDialog(false)}
                    dir={direction}
                    action={() => {
                        return (
                            <Box sx={{minHeight: 150}}>
                                <Typography sx={{textAlign: "center"}}
                                            variant="subtitle1">{t(`dialogs.move-dialog.${!event?.extendedProps.onDurationChanged ? "sub-title" : "sub-title-duration"}`)}</Typography>
                                <Typography sx={{textAlign: "center"}}
                                            margin={2}>
                                    {!event?.extendedProps.onDurationChanged ? <>
                                        {event?.extendedProps.oldDate.clone().subtract(event?.extendedProps.from ? 0 : 1, 'hours').format("DD-MM-YYYY HH:mm")} {" => "}
                                        {event?.extendedProps.newDate.clone().subtract(event?.extendedProps.from ? 0 : 1, 'hours').format("DD-MM-YYYY HH:mm")}
                                    </> : <>
                                        {event?.extendedProps.oldDuration} {t("times.minutes", {ns: "common"})} {" => "}
                                        {event?.extendedProps.duration} {t("times.minutes", {ns: "common"})}
                                    </>
                                    }

                                </Typography>
                                <Typography sx={{textAlign: "center"}}
                                            margin={2}>{t("dialogs.move-dialog.description")}</Typography>
                            </Box>)
                    }}
                    open={moveDialog}
                    title={t(`dialogs.move-dialog.${!event?.extendedProps.onDurationChanged ? "title" : "title-duration"}`)}
                    actionDialog={
                        <>
                            <Button
                                variant="text-primary"
                                onClick={() => setMoveDialog(false)}
                                startIcon={<CloseIcon/>}
                            >
                                {t("dialogs.move-dialog.garde-date")}
                            </Button>
                            <LoadingButton
                                {...{loading}}
                                loadingPosition="start"
                                variant="contained"
                                color={"warning"}
                                onClick={() => handleMoveAppointment(event as EventDef)}
                                startIcon={<Icon path="iconfinder"></Icon>}
                            >
                                {t("dialogs.move-dialog.confirm")}
                            </LoadingButton>
                        </>
                    }
                />

                <Dialog
                    color={theme.palette.error.main}
                    contrastText={theme.palette.error.contrastText}
                    dialogClose={() => setCancelDialog(false)}
                    sx={{
                        direction: direction
                    }}
                    action={() => {
                        return (
                            <Box sx={{minHeight: 150}}>
                                <Typography sx={{textAlign: "center"}}
                                            variant="subtitle1">{t(`dialogs.${actionDialog}-dialog.sub-title`)} </Typography>
                                <Typography sx={{textAlign: "center"}}
                                            margin={2}>{t(`dialogs.${actionDialog}-dialog.description`)}</Typography>
                            </Box>)
                    }}
                    open={cancelDialog}
                    title={t(`dialogs.${actionDialog}-dialog.title`)}
                    actionDialog={
                        <>
                            <Button
                                variant="text-primary"
                                onClick={() => setCancelDialog(false)}
                                startIcon={<CloseIcon/>}
                            >
                                {t(`dialogs.${actionDialog}-dialog.cancel`)}
                            </Button>
                            <LoadingButton
                                {...{loading}}
                                loadingPosition="start"
                                variant="contained"
                                color={"error"}
                                onClick={() => handleActionDialog(event?.publicId ? event?.publicId as string : (event as any)?.id)}
                                startIcon={<Icon height={"18"} width={"18"} color={"white"} path="icdelete"></Icon>}
                            >
                                {t(`dialogs.${actionDialog}-dialog.confirm`)}
                            </LoadingButton>
                        </>
                    }
                />

                <Dialog
                    size={"sm"}
                    sx={{
                        [theme.breakpoints.down('sm')]: {
                            "& .MuiDialogContent-root": {
                                padding: 1
                            }
                        }
                    }}
                    color={theme.palette.primary.main}
                    contrastText={theme.palette.primary.contrastText}
                    dialogClose={() => setMoveDialogInfo(false)}
                    action={"move_appointment"}
                    dir={direction}
                    open={moveDialogInfo}
                    title={t(`dialogs.${moveDialogAction}-dialog.title`)}
                    actionDialog={
                        <>
                            <Button
                                variant="text-primary"
                                onClick={() => setMoveDialogInfo(false)}
                                startIcon={<CloseIcon/>}
                            >
                                {t(`dialogs.${moveDialogAction}-dialog.garde-date`)}
                            </Button>
                            <Button
                                variant="contained"
                                disabled={!moveDateChanged}
                                onClick={moveDialogAction === "move" ? onMoveAppointment : onRescheduleAppointment}
                                color={"primary"}
                                startIcon={<Icon height={"18"} width={"18"} color={"white"} path="iconfinder"></Icon>}
                            >
                                {t(`dialogs.${moveDialogAction}-dialog.confirm`)}
                            </Button>
                        </>
                    }
                />
            </Box>
        </>
    )
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(context.locale as string, ['common', 'menu', 'agenda', 'patient']))
    }
})

export default Agenda

Agenda.auth = true

Agenda.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}

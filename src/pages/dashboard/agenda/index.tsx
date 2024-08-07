import {GetStaticProps} from "next";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {MutableRefObject, ReactElement, useCallback, useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import {
    Alert,
    Backdrop,
    Box,
    Button, Card, Checkbox,
    Container,
    Drawer, FormControlLabel, Grid,
    LinearProgress,
    Paper,
    SpeedDial,
    SpeedDialAction,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
    Zoom
} from "@mui/material";
import {configSelector, DashLayout, dashLayoutSelector} from "@features/base";
import {SubHeader} from "@features/subHeader";
import {CalendarToolbar} from "@features/toolbar";
import {useSession} from "next-auth/react";
import {LoadingScreen} from "@features/loadingScreen";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useSnackbar} from 'notistack';
import {Session} from "next-auth";
import moment, {Moment} from "moment-timezone";

const humanizeDuration = require("humanize-duration");
import FullCalendar from "@fullcalendar/react";
import {DateSelectArg, DatesSetArg, EventChangeArg} from "@fullcalendar/core";
import {EventDef} from "@fullcalendar/core/internal";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {
    agendaSelector,
    Calendar,
    DayOfWeek,
    openDrawer,
    setAbsences,
    setCurrentDate,
    setGroupedByDayAppointments,
    setSelectedEvent,
    setStepperIndex
} from "@features/calendar";
import {
    appointmentSelector,
    EventType,
    Instruction,
    Patient,
    resetAppointment,
    resetSubmitAppointment,
    setAppointmentDate,
    setAppointmentPatient,
    setAppointmentRecurringDates,
    setAppointmentSubmit, setAppointmentType,
    TimeSchedule
} from "@features/tabPanel";
import {AppointmentListMobile, timerSelector} from "@features/card";
import {FilterButton} from "@features/buttons";
import {AgendaFilter, leftActionBarSelector, resetFilter} from "@features/leftActionBar";
import {AnimatePresence, motion} from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import {CustomStepper} from "@features/customStepper";
import {sideBarSelector} from "@features/menu";
import {
    appointmentGroupByDate,
    appointmentPrepareEvent, mergeArrayByKey,
    prepareSearchKeys, useInvalidateQueries,
    useMedicalEntitySuffix,
    useMutateOnGoing
} from "@lib/hooks";
import {
    AppointmentDetail,
    Dialog,
    dialogMoveSelector,
    PatientDetail,
    preConsultationSelector,
    QuickAddAppointment,
    setMoveDateTime
} from "@features/dialog";
import {DateClickArg} from "@fullcalendar/interaction";
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import FastForwardOutlinedIcon from '@mui/icons-material/FastForwardOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import {alpha} from "@mui/material/styles";
import {DefaultCountry, DeleteAppointmentOptionsData, MobileContainer as smallScreen} from "@lib/constants";
import IconUrl from "@themes/urlIcon";
import {MobileContainer} from "@themes/mobileContainer";
import {DrawerBottom} from "@features/drawerBottom";
import {useSendNotification} from "@lib/hooks/rest";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {dehydrate, QueryClient} from "@tanstack/query-core";
import {setDialog} from "@features/topNavBar";
import {AbsenceDrawer, absenceDrawerSelector, resetAbsenceData, setAbsenceData} from "@features/drawer";
import {useLeavePageConfirm} from "@lib/hooks/useLeavePageConfirm";
import LeaveIcon from "@themes/overrides/icons/leaveIcon";
import {setOpenChat} from "@features/chat/actions";
import ChatIcon from "@themes/overrides/icons/chatIcon";

const actions = [
    {icon: <FastForwardOutlinedIcon/>, key: 'add-quick'},
    {icon: <AddOutlinedIcon/>, key: 'add-complete'},
    {icon: <LeaveIcon/>, key: 'add_leave'},
    {icon: <ChatIcon/>, key: 'add_chat'},
];

function Agenda() {
    const {data: session, status} = useSession();
    const router = useRouter();
    const theme = useTheme();
    const [filterBottom, setFilterBottom] = useState<boolean>(false)
    const dispatch = useAppDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const refs = useRef([]);
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {trigger: mutateOnGoing} = useMutateOnGoing();
    const {trigger: invalidateQueries} = useInvalidateQueries();

    const {t, ready, i18n} = useTranslation(['agenda', 'common', 'patient']);
    const {direction} = useAppSelector(configSelector);
    const {query: filter} = useAppSelector(leftActionBarSelector);
    const {
        motif,
        duration,
        patient,
        type,
        submitted,
        recurringDates,
        finalize
    } = useAppSelector(appointmentSelector);
    const {opened: sidebarOpened} = useAppSelector(sideBarSelector);
    const {model} = useAppSelector(preConsultationSelector);
    const {medicalEntityHasUser, appointmentTypes} = useAppSelector(dashLayoutSelector);
    const {
        openViewDrawer, currentStepper,
        selectedEvent, actionSet, openMoveDrawer, openAbsenceDrawer,
        openAddDrawer, openPatientDrawer, currentDate, view
    } = useAppSelector(agendaSelector);
    const {
        date: moveDialogDate,
        time: moveDialogTime,
        selected: moveDateChanged,
        action: moveDialogAction
    } = useAppSelector(dialogMoveSelector);
    const {isActive, event: onGoingEvent} = useAppSelector(timerSelector);
    const {config: agenda, sortedData: groupSortedData} = useAppSelector(agendaSelector);
    const absenceData = useAppSelector(absenceDrawerSelector);

    const [timeRange, setTimeRange] = useState({
        start: moment().startOf('week').format('DD-MM-YYYY'),
        end: moment().endOf('week').format('DD-MM-YYYY')
    });
    const [nextRefCalendar, setNextRefCalendar] = useState(1);
    const [loading, setLoading] = useState<boolean>(status === 'loading');
    const [moveDialogInfo, setMoveDialogInfo] = useState({info: false, dialog: false});
    const [openUploadDialog, setOpenUploadDialog] = useState({dialog: false, loading: false});
    const [documentConfig, setDocumentConfig] = useState({name: "", description: "", type: "analyse", files: []});
    const [loadingRequest, setLoadingRequest] = useState(false);
    const [quickAddAppointment, setQuickAddAppointment] = useState<boolean>(false);
    const [quickAddPatient, setQuickAddPatient] = useState<boolean>(false);
    const [cancelDialog, setCancelDialog] = useState<boolean>(false);
    const [actionDialog, setActionDialog] = useState("cancel");
    const [openPreConsultationDialog, setOpenPreConsultationDialog] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [localFilter, setLocalFilter] = useState("");
    const [query, setQuery] = useState<any>(null);
    const [openPaymentDialog, setOpenPaymentDialog] = useState<boolean>(false);
    const [eventStepper, setEventStepper] = useState([
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
    ]);
    const [event, setEvent] = useState<EventDef | null>();
    const [openFabAdd, setOpenFabAdd] = useState(false);
    const [deleteAppointmentOptions, setDeleteAppointmentOptions] = useState<any[]>(DeleteAppointmentOptionsData);
    const [cancelAppointmentOption, setCancelAppointmentOption] = useState(true);
    const isMobile = useMediaQuery(`(max-width:${smallScreen}px)`);
    const calendarRef = useRef<FullCalendar | null>(null);
    let events: MutableRefObject<EventModal[]> = useRef([]);
    let sortedData: MutableRefObject<GroupEventsModel[]> = useRef([]);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const roles = (session?.data as UserDataResponse).general_information.roles as Array<string>
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const {jti} = session?.user as any;
    const isBeta = localStorage.getItem('newCashbox') ? localStorage.getItem('newCashbox') === '1' : user.medical_entity.hasDemo;
    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };

    const {data: httpAppointmentsResponse} = useRequestQuery(agenda && query ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/agendas/${agenda.uuid}/appointments/${router.locale}`
    } : null, {
        ...ReactQueryNoValidateConfig,
        ...(agenda && query && {variables: {query: `?mode=mini&${query.queryData}`}})
    });

    const {trigger: addAppointmentTrigger} = useRequestQueryMutation("/agenda/appointment/add");
    const {trigger: updateAppointmentTrigger} = useRequestQueryMutation("/agenda/appointment/update/date");
    const {trigger: updateAppointmentStatus} = useRequestQueryMutation("/agenda/appointment/update/status");
    const {trigger: handlePreConsultationData} = useRequestQueryMutation("/agenda/pre-consultation/update");
    const {trigger: triggerUploadDocuments} = useRequestQueryMutation("/agenda/appointment/documents");
    const {trigger: triggerAppointmentDetails} = useRequestQueryMutation("/agenda/appointment/details");
    const {trigger: triggerNotificationPush} = useSendNotification();
    const {trigger: triggerAddAbsence} = useRequestQueryMutation("/agenda/appointment/absence/add");
    const {trigger: triggerDeleteAbsence} = useRequestQueryMutation("/absence/delete");

    const getAppointmentBugs = useCallback((date: Date) => {
        const openingHours = agenda?.openingHours[0] as OpeningHoursModel;
        const hasDayWorkHours: any = Object.entries(openingHours).find((openingHours: any) =>
            DayOfWeek(openingHours[0], 1) === moment(date).isoWeekday());
        if (hasDayWorkHours) {
            const interval = calendarIntervalSlot();
            let hasError: boolean[] = [];
            hasDayWorkHours[1].map(() => {
                    hasError.push(!moment(date).isBetween(
                        moment(`${moment(date).format("DD-MM-YYYY")} ${interval.localMinSlot.toString().padStart(2, "0")}:00`, "DD-MM-YYYY HH:mm"),
                        moment(`${moment(date).format("DD-MM-YYYY")} ${interval.localMaxSlot}:00`, "DD-MM-YYYY HH:mm"), "minutes", '[)'));
                }
            );
            return hasError.every(error => error);
        }
        return true;
    }, [agenda]); // eslint-disable-line react-hooks/exhaustive-deps

    const getAppointments = (query: string, view = "timeGridWeek", filter?: boolean, history?: boolean) => {
        setQuery({queryData: query, view, filter, history});
    }

    const updateCalendarEvents = (result: HttpResponse) => {
        setLoading(true);
        let eventCond;
        let absences: any[] = [];
        if (query?.queryData.includes("format=list")) {
            events.current = [];
            eventCond = result?.data;
        } else {
            eventCond = result?.data?.appointments;
            absences = result?.data?.absence?.map((appointment: any) => ({
                uuid: appointment?.uuid,
                start: moment(appointment.startDate, "DD-MM-YYYY HH:mm").toDate(),
                end: moment(appointment.endDate, "DD-MM-YYYY HH:mm").toDate(),
                overlap: false,
                color: theme.palette.grey['A300'],
                display: 'background'
            }));
        }

        const appointments = (eventCond?.hasOwnProperty('list') ? eventCond.list : eventCond) as AppointmentModel[];
        const eventsUpdated: EventModal[] = [];

        if (!query?.filter || events.current.length === 0) {
            appointments?.forEach((appointment) => {
                const horsWork = getAppointmentBugs(moment(appointment.dayDate + ' ' + appointment.startTime, "DD-MM-YYYY HH:mm").toDate());
                const hasErrors = [
                    ...(horsWork ? ["event.hors-opening-hours"] : []),
                    ...(appointment.PatientHasAgendaAppointment ? ["event.patient-multi-event-day"] : [])]
                eventsUpdated.push(appointmentPrepareEvent(appointment, horsWork, hasErrors));
            });
        } else {
            const filteredEvents = appointments.map(appointment => appointmentPrepareEvent(appointment, false, []));
            const mergedArray = mergeArrayByKey(filteredEvents, events.current, "id");
            eventsUpdated.push(...mergedArray.map(event => ({
                ...event,
                filtered: localFilter.length > 0 && !appointments?.find(appointment => appointment.uuid === event.id)
            })));
        }

        if (!query?.history) {
            events.current = [...eventsUpdated, ...absences];
        } else {
            events.current = [...eventsUpdated, ...events.current];
        }

        // Edit: to add it in the array format instead
        const groupArrays = appointmentGroupByDate(events.current);

        dispatch(setGroupedByDayAppointments(groupArrays));
        dispatch(setAbsences(absences));

        if (isMobile || query?.view === "listWeek") {
            // sort grouped data
            sortedData.current = groupArrays.slice()
                .sort((a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime());
        }
        setLoading(false);
    }

    const calendarIntervalSlot = () => {
        let localMinSlot = 8; //8h
        let localMaxSlot = 20; //20h
        const openingHours = agenda?.openingHours[0] as OpeningHoursModel;
        Object.entries(openingHours).forEach((openingHours: any) => {
            openingHours[1].forEach((openingHour: {
                start_time: string,
                end_time: string
            }) => {
                const min = moment.duration(openingHour?.start_time).asHours();
                const max = moment.duration(openingHour?.end_time).asHours();
                if (min < localMinSlot) {
                    localMinSlot = min;
                }
                if (max > localMaxSlot) {
                    localMaxSlot = max;
                }
            })
        })

        return {
            localMinSlot,
            localMaxSlot
        }
    }

    useEffect(() => {
        //reload resources from cdn servers
        i18n.reloadResources(i18n.resolvedLanguage, ['common', 'menu', 'agenda']);
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (httpAppointmentsResponse) {
            updateCalendarEvents(httpAppointmentsResponse as HttpResponse);
        }
    }, [httpAppointmentsResponse])  // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (openMoveDrawer) {
            setEvent(selectedEvent as EventDef);
            setTimeout(() => setMoveDialogInfo({...moveDialogInfo, info: true}));
        }
    }, [openMoveDrawer])  // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (actionSet && actionSet.action === "onConfirm") {
            onConfirmAppointment(actionSet.event);
        }
    }, [actionSet]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (calendarRef.current && currentDate) {
            const calendarApi = (calendarRef.current as FullCalendar)?.getApi();
            calendarApi && setTimeout(() => {
                calendarApi.updateSize();
            }, 0);
        }
    }, [sidebarOpened]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (filter?.type && timeRange.start !== "" || filter?.patient || filter?.disease || filter?.status || filter?.acts || filter?.reasons || filter?.isOnline) {
            const query = prepareSearchKeys(filter as any);
            setLocalFilter(query);
            const queryPath = `${view === 'listWeek' ? 'format=list&page=1&limit=50' :
                `start_date=${timeRange.start}&end_date=${timeRange.end}&format=week`}${query}`;
            getAppointments(queryPath, view, view !== 'listWeek');
        } else if (localFilter.length > 0) {
            const queryPath = `${view === 'listWeek' ? 'format=list&page=1&limit=50' :
                `start_date=${timeRange.start}&end_date=${timeRange.end}&format=week`}`
            getAppointments(queryPath, view);
        }
    }, [filter, timeRange]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleOnRangeChange = (event: DatesSetArg) => {
        const startStr = moment(event.startStr).format('DD-MM-YYYY');
        const endStr = moment(event.endStr).format('DD-MM-YYYY');
        setTimeRange({start: startStr, end: endStr});
        if (prepareSearchKeys(filter as any).length === 0 && localFilter.length === 0) {
            getAppointments(`start_date=${startStr}&end_date=${endStr}&format=week`);
        }
    }

    const handleOnToday = () => {
        const calendarApi = (calendarRef.current as FullCalendar)?.getApi();
        if (calendarApi) {
            calendarApi.today();
            dispatch(setCurrentDate({date: calendarApi.getDate(), fallback: false}));
        }
    }

    const onViewChange = (view: string) => {
        const query = prepareSearchKeys(filter as any);
        if (view === 'listWeek' && filter?.patient === undefined) {
            dispatch(setCurrentDate({date: moment().toDate(), fallback: false}));
            getAppointments(`format=list&page=1&limit=50${query}`, view);
        }
    }

    const handleRangeSelect = (event: DateSelectArg) => {
        dispatch(setAbsenceData({startDate: event.start, endDate: event.end}));
        dispatch(openDrawer({type: "absence", open: true}));
    }

    const handleAddAbsence = (currentDate?: Date) => {
        setLoadingRequest(true);
        const params = new FormData();
        params.append('title', currentDate ? `Congé le ${moment(currentDate).format("DD/MM/YYYY")}` : absenceData.title);
        params.append('dates', JSON.stringify([{
            "start_date": moment(currentDate ?? absenceData.startDate).format('DD-MM-YYYY'),
            "start_time": moment(currentDate ?? absenceData.startDate).format('HH:mm'),
            "end_date": moment(currentDate ?? absenceData.endDate).format('DD-MM-YYYY'),
            "end_time": (currentDate ? moment(currentDate).endOf("day") : moment(absenceData.endDate)).format('HH:mm'),
        }]));

        triggerAddAbsence({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/absences`,
            data: params
        }, {
            onSuccess: () => {
                if (openAbsenceDrawer) {
                    dispatch(openDrawer({type: "absence", open: false}));
                    dispatch(resetAbsenceData());
                }
                refreshData();
            },
            onSettled: () => setLoadingRequest(false)
        });
    }

    const handleDeleteAbsence = (uuid: string, deleteDayOnly: boolean) => {
        setLoadingRequest(true);
        const form = new FormData();
        deleteDayOnly && form.append("day", moment(currentDate.date).format("DD"));
        triggerDeleteAbsence({
            method: "DELETE",
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/absences/${uuid}`,
            ...(deleteDayOnly && {data: form})
        }, {
            onSuccess: () => refreshData(),
            onSettled: () => setLoadingRequest(false)
        });
    }

    const onSelectEvent = (event: EventDef) => {
        setLoadingRequest(true);
        setTimeout(() => setEvent(event));
        dispatch(setSelectedEvent(event));
        dispatch(openDrawer({type: "view", open: true}));
        const query = `?mode=details&appointment=${event.publicId}&start_date=${moment(event.extendedProps.time).format("DD-MM-YYYY")}&end_date=${moment(event.extendedProps.time).format("DD-MM-YYYY")}&format=week`
        triggerAppointmentDetails({
            method: "GET",
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${router.locale}${query}`
        }, {
            onSuccess: (result) => {
                const appointmentData = (result?.data as HttpResponse)?.data as AppointmentModel[];
                if (appointmentData.length > 0) {
                    const appointment = appointmentData[0];
                    const horsWork = getAppointmentBugs(moment(appointment.dayDate + ' ' + appointment.startTime, "DD-MM-YYYY HH:mm").toDate());
                    const hasErrors = [
                        ...(horsWork ? ["event.hors-opening-hours"] : []),
                        ...(appointment.PatientHasAgendaAppointment ? ["event.patient-multi-event-day"] : [])];
                    setLoadingRequest(false);
                    dispatch(setSelectedEvent({
                        ...event,
                        extendedProps: {...event.extendedProps, ...appointmentPrepareEvent(appointment, horsWork, hasErrors)}
                    }));
                }
            }
        });
    }

    const handleDragEvent = (DateTime: Moment, action: string) => {
        dispatch(setMoveDateTime({
            date: DateTime,
            time: DateTime.format("HH:mm"),
            action: action,
            selected: false
        }));
        setMoveDialogInfo({...moveDialogInfo, dialog: true});
    }

    const onEventChange = (info: EventChangeArg) => {
        const startDate = moment(info.event._instance?.range.start);
        const endDate = info.oldEvent._def.allDay ?
            moment(info.event._instance?.range.start).add(info.event._def.extendedProps.dur, "minutes") : moment(info.event._instance?.range.end);
        const duration = info.oldEvent._def.allDay ? info.oldEvent._def.extendedProps.dur : endDate.diff(startDate, "minutes");
        const oldStartDate = moment(info.oldEvent._instance?.range.start);
        const oldEndDate = moment(info.oldEvent._instance?.range.end);
        const oldDuration = info.oldEvent._def.allDay ? info.oldEvent._def.extendedProps.dur : oldEndDate.diff(oldStartDate, "minutes");
        const onDurationChanged = oldDuration !== duration;
        const defEvent = {
            ...info.event._def,
            extendedProps: {
                newDate: moment.utc(startDate),
                oldDate: moment.utc(oldStartDate),
                allDay: info.oldEvent._def.allDay,
                duration,
                oldDuration,
                onDurationChanged,
                revert: info.revert
            }
        };
        setEvent(defEvent);
        const status = info.oldEvent._def.extendedProps.status.key;
        switch (status) {
            case "ON_GOING":
                info.revert();
                break;
            case "FINISHED":
            case "CANCELED":
                if (moment.utc(info.event?._instance?.range.start).isBefore(moment().utc().set({
                    hour: 0,
                    minute: 0,
                    second: 0
                })) || onDurationChanged) {
                    info.revert();
                } else {
                    handleDragEvent(moment.utc(info.event?._instance?.range.start), "reschedule");
                }
                break;
            default:
                handleDragEvent(defEvent?.extendedProps.newDate, "move");
                break;
        }
    }

    const scrollToView = (ref: HTMLElement, nextIndex: number) => {
        setTimeout(() => {
            if (nextRefCalendar <= sortedData.current.length) {
                (ref as unknown as HTMLElement)?.scrollIntoView({behavior: 'smooth'});
                setNextRefCalendar(nextIndex);
            }
        }, 300);
    }

    const handleClickDatePrev = () => {
        if (view !== 'listWeek') {
            const calendarApi = (calendarRef.current as FullCalendar)?.getApi();
            if (calendarApi) {
                calendarApi.prev();
                dispatch(setCurrentDate({date: calendarApi.getDate(), fallback: false}));
            }
        } else {
            scrollToView(refs.current[0], 1);
            const prevDate = moment(currentDate.date).clone().subtract(1, "days");
            dispatch(setCurrentDate({date: prevDate.toDate(), fallback: false}));
            getAppointments(`format=list&page=1&limit=50&start_date=${prevDate.format("DD-MM-YYYY")}`,
                view, false, true);
        }
    };

    const handleClickDateNext = () => {
        if (view !== 'listWeek') {
            const calendarApi = (calendarRef.current as FullCalendar)?.getApi();
            if (calendarApi) {
                calendarApi.next();
                dispatch(setCurrentDate({date: calendarApi.getDate(), fallback: false}));
            }
        } else {
            const nextDate = moment(currentDate.date).clone().add(1, "days");
            dispatch(setCurrentDate({date: nextDate.toDate(), fallback: false}));
            scrollToView(refs.current[nextRefCalendar], nextRefCalendar + 1);
        }
    }

    const onMenuActions = (action: string, event: EventDef) => {
        switch (action) {
            case "onCancel":
                setEvent(event);
                setTimeout(() => {
                    setActionDialog('cancel');
                    setTimeout(() => setCancelDialog(true));
                });
                break;
            case "onConsultationDetail":
                onConsultationStart(event)
                break;
            case "onPay":
                setEvent(event);
                setOpenPaymentDialog(true);
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
                setLoading(true);
                const form = new FormData();
                form.append("status", "1");
                updateAppointmentStatus({
                    method: "PATCH",
                    data: form,
                    url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${event?.publicId ? event?.publicId : (event as any)?.id}/status/${router.locale}`
                }, {
                    onSuccess: () => {
                        refreshData().then(() => setLoading(false));
                        enqueueSnackbar(t(`alert.leave-waiting-room`), {variant: "success"});
                        // refresh on going api
                        mutateOnGoing();
                    }
                });
                break;
            case "onPatientNoShow":
                setEvent(event);
                onPatientNoShow(event);
                break;
            case "onMove":
                const newDate = moment(event?.extendedProps.time);
                const defEvent = {
                    ...event,
                    extendedProps: {
                        ...event.extendedProps,
                        oldDate: newDate
                    }
                };
                dispatch(setSelectedEvent(defEvent));
                setEvent(defEvent);
                dispatch(setMoveDateTime({
                    date: newDate,
                    time: newDate.format("HH:mm"),
                    action: "move",
                    selected: false
                }));
                setTimeout(() => setMoveDialogInfo({...moveDialogInfo, info: true}));
                break;
            case "onReschedule":
                dispatch(setSelectedEvent(event));
                setEvent(event);
                if (eventStepper.find(stepper => stepper.title === "steppers.tabs.tab-3")) {
                    setTimeout(() => setEventStepper(eventStepper.filter(stepper => stepper.title !== "steppers.tabs.tab-3")));
                }
                dispatch(resetAppointment());
                dispatch(setAppointmentPatient(event.extendedProps.patient as any));
                dispatch(openDrawer({type: "add", open: true}));
                break;
            case "onDelete":
                dispatch(setSelectedEvent(event));
                setEvent(event);
                setTimeout(() => {
                    setActionDialog('delete');
                    setTimeout(() => setCancelDialog(true));
                })
                break;
            case "onConfirmAppointment":
                onConfirmAppointment(event);
                break;
            case "onPreConsultation":
                setEvent(event);
                setTimeout(() => setOpenPreConsultationDialog(true));
                break;
            case "onAddConsultationDocuments":
                setEvent(event);
                setTimeout(() => setOpenUploadDialog({...openUploadDialog, dialog: true}));
                break;
        }
    }

    const onOpenWaitingRoom = (event: EventDef) => {
        setLoading(true);
        const todayEvents = groupSortedData.find(events => events.date === moment().format("DD-MM-YYYY"));
        const filteredEvents = todayEvents?.events.every((event: any) => !["ON_GOING", "WAITING_ROOM"].includes(event.status.key) ||
            (event.status.key === "FINISHED" && event.updatedAt.isBefore(moment(), 'year')));
        const form = new FormData();
        form.append("status", "3");
        form.append("is_first_appointment", filteredEvents?.toString() ?? "false");
        updateAppointmentStatus({
            method: "PATCH",
            data: form,
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${event?.publicId ? event?.publicId : (event as any)?.id}/status/${router.locale}`
        }, {
            onSuccess: () => {
                refreshData().then(() => setLoading(false));
                enqueueSnackbar(t(`alert.on-waiting-room`), {variant: "success"});
                // refresh on going api
                mutateOnGoing();
                // update pending notifications status
                invalidateQueries([`${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/get/pending/${router.locale}`]);
            }
        });
    }

    const onPatientNoShow = (event: EventDef) => {
        const form = new FormData();
        form.append("status", "10");
        updateAppointmentStatus({
            method: "PATCH",
            data: form,
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${event?.publicId ? event?.publicId : (event as any)?.id}/status/${router.locale}`
        }, {
            onSuccess: () => {
                refreshData();
                enqueueSnackbar(t(`alert.patient-no-show`), {variant: "success"});
                dispatch(openDrawer({type: "view", open: false}));
            }
        });
    }

    const onConsultationView = (event: EventDef) => {
        const slugConsultation = `/dashboard/consultation/${event?.publicId ? event?.publicId : (event as any)?.id}`;
        router.push(slugConsultation, slugConsultation, {locale: router.locale}).then(() => {
            dispatch(openDrawer({type: "view", open: false}));
        })
    }

    const onConfirmAppointment = (event: EventDef) => {
        setLoading(true);
        const form = new FormData();
        form.append("status", "1");
        updateAppointmentStatus({
            method: "PATCH",
            data: form,
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${event?.publicId ? event?.publicId : (event as any)?.id}/status/${router.locale}`
        }, {
            onSuccess: () => {
                refreshData();
                enqueueSnackbar(t(`alert.confirm-appointment`), {variant: "success"});
                dispatch(openDrawer({type: "view", open: false}));
                // update pending notifications status
                invalidateQueries([`${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/get/pending/${router.locale}`]);
                setLoading(false);
            }
        });
    }

    const onConsultationStart = (event: EventDef) => {
        dispatch(setSelectedEvent(event));
        if (!isActive) {
            const slugConsultation = `/dashboard/consultation/${event?.publicId ? event?.publicId : (event as any)?.id}`;
            router.push({
                pathname: slugConsultation,
                query: {
                    inProgress: true,
                    agendaUuid: agenda?.uuid
                }
            }, slugConsultation, {locale: router.locale}).then(() => {
                dispatch(openDrawer({type: "view", open: false}));
            })
        } else {
            dispatch(openDrawer({type: "view", open: false}));
            dispatch(setDialog({dialog: "switchConsultationDialog", value: true}));
        }
    }

    const onUpdateDefEvent = () => {
        const timeSplit = moveDialogTime.split(':');
        const date = moveDialogDate?.set({hour: parseInt(timeSplit[0]), minute: parseInt(timeSplit[1])})
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
        setMoveDialogInfo({dialog: true, info: false});
        if (openMoveDrawer) {
            dispatch(openDrawer({type: "move", open: false}));
        }
    }

    const handleMoveAppointment = (event: EventDef) => {
        setLoading(true);
        const form = new FormData();
        form.append('start_date', event.extendedProps.newDate.format("DD-MM-YYYY"));
        form.append('start_time', event.extendedProps.newDate.format("HH:mm"));
        const eventId = event.publicId ? event.publicId : (event as any).id;
        form.append('duration', event.extendedProps.duration);
        updateAppointmentTrigger({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${eventId}/change-date/${router.locale}`,
            data: form
        }, {
            onSuccess: (result) => {
                if ((result?.data as HttpResponse).status === "success") {
                    enqueueSnackbar(t(`dialogs.move-dialog.${!event.extendedProps.onDurationChanged ?
                        "alert-msg" : "alert-msg-duration"}`), {variant: "success"});
                }
                dispatch(openDrawer({type: "view", open: false}));
                refreshData();
                setMoveDialogInfo({...moveDialogInfo, dialog: false});
                // update pending notifications status
                invalidateQueries([`${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/get/pending/${router.locale}`]);
            }
        });
    }

    const handleRescheduleAppointment = (event: EventDef) => {
        setLoading(true);
        const form = new FormData();
        form.append('start_date', event.extendedProps.newDate.format("DD-MM-YYYY"));
        form.append('start_time', event.extendedProps.newDate.format("HH:mm"));
        const eventId = event.publicId ? event.publicId : (event as any).id;
        updateAppointmentTrigger({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${eventId}/clone/${router.locale}`,
            data: form
        }, {
            onSuccess: (result) => {
                if ((result?.data as HttpResponse).status === "success") {
                    enqueueSnackbar(t(`dialogs.reschedule-dialog.alert-msg`), {variant: "success"});
                }
                refreshData();
                setMoveDialogInfo({dialog: false, info: false});
            }
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
        const params = new FormData();
        params.append("type", deleteAppointmentOptions.reduce((options, option) => [...(options ?? []), ...(option.selected ? [option.key] : [])], []).join(","));

        updateAppointmentStatus({
            method: "DELETE",
            data: params,
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${appointmentUUid}/${router.locale}`
        }, {
            onSuccess: () => {
                dispatch(openDrawer({type: "view", open: false}));
                setCancelDialog(false);
                setTimeout(() => setLoading(false));
                refreshData();
                enqueueSnackbar(t(`alert.delete-appointment`), {variant: "success"});
            }
        });
    }

    const cancelAppointment = (appointmentUUid: string) => {
        setLoading(true);
        const form = new FormData();
        form.append("status", "6");
        form.append("send-sms", cancelAppointmentOption.toString());
        updateAppointmentStatus({
            method: "PATCH",
            data: form,
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${appointmentUUid}/status/${router.locale}`
        }, {
            onSuccess: () => {
                const eventUpdated: any = {
                    ...event, extendedProps:
                        {...event?.extendedProps, status: {key: "CANCELED", value: "Annulé"}}
                };
                dispatch(setSelectedEvent(eventUpdated));
                setCancelDialog(false);
                setTimeout(() => setLoading(false));
                setCancelAppointmentOption(true);
                refreshData();
                enqueueSnackbar(t(`alert.cancel-appointment`), {variant: "success"});
            }
        });
    }

    const onSelectDate = (eventArg: DateClickArg) => {
        // dispatch(resetAppointment());
        dispatch(setAppointmentDate(eventArg.date));
        dispatch(setAppointmentRecurringDates([{
            id: `${moment(eventArg.date).format("DD-MM-YYYY")}--${moment(eventArg.date).format("HH:mm")}`,
            time: moment(eventArg.date).format("HH:mm"),
            date: moment(eventArg.date).format("DD-MM-YYYY"),
            status: "success"
        }]));

        if (!eventStepper.find(stepper => stepper.title === "steppers.tabs.tab-3")) {
            setEventStepper(
                [...eventStepper.slice(0, 2),
                    {
                        title: "steppers.tabs.tab-3",
                        children: Patient,
                        disabled: true
                    },
                    ...eventStepper.slice(2)]);
        }
    }

    const handleStepperChange = (index: number) => {
        dispatch(setStepperIndex(index));
    }

    const handleStepperActions = (action: string, event: EventDef) => {
        switch (action) {
            case "onDetailPatient":
                setEvent(event);
                dispatch(openDrawer({type: "patient", open: true}));
                dispatch(openDrawer({type: "add", open: false}));
                break;
            case "onWaitingRoom":
                onOpenWaitingRoom(event);
                dispatch(openDrawer({type: "add", open: false}));
                break;
            case "onConsultationStart":
                onConsultationStart(event);
                dispatch(openDrawer({type: "add", open: false}));
                break;
        }
    }

    const submitStepper = (index: number) => {
        const steps: any = eventStepper.map((stepper) => ({...stepper}));
        if (eventStepper.length !== index) {
            steps[index].disabled = false;
            setEventStepper(steps);
        } else {
            setEventStepper(steps.map((stepper: any) => ({...stepper, disabled: true})));
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

    const submitPreConsultationData = () => {
        setLoadingRequest(true);
        const form = new FormData();
        form.append("modal_uuid", model);
        form.append("modal_data", localStorage.getItem(`Modeldata${event?.publicId}`) as string);
        handlePreConsultationData({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${event?.publicId}/data/${router.locale}`,
            data: form
        }, {
            onSuccess: () => {
                setLoadingRequest(false);
                localStorage.removeItem(`Modeldata${event?.publicId}`);
                setTimeout(() => setOpenPreConsultationDialog(false));
                medicalEntityHasUser && invalidateQueries([`${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/agendas/${agenda?.uuid}/appointments/${event?.publicId}/consultation-sheet/${router.locale}`]);
            }
        });
    }

    const refreshData = () => {
        return invalidateQueries([`${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${router.locale}`]);
    }

    const handleAddAppointment = (action: string) => {
        dispatch(resetAppointment());
        switch (action) {
            case "add-complete":
                if (!eventStepper.find(stepper => stepper.title === "steppers.tabs.tab-3")) {
                    setEventStepper(
                        [...eventStepper.slice(0, 2),
                            {
                                title: "steppers.tabs.tab-3",
                                children: Patient,
                                disabled: true
                            },
                            ...eventStepper.slice(2)]);
                }
                dispatch(openDrawer({type: "add", open: true}));
                break;
            case "add-quick":
                appointmentTypes && dispatch(setAppointmentType(appointmentTypes[0]?.uuid));
                setQuickAddAppointment(true);
                break;
        }
    }

    const handleUploadDocuments = () => {
        setOpenUploadDialog({...openUploadDialog, loading: true});
        const params = new FormData();
        documentConfig.files.map((file: any) => {
            params.append(`files[${file.type}][]`, file.file, file.name);
        });
        triggerUploadDocuments({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${event?.publicId}/documents/${router.locale}`,
            data: params
        }, {
            onSuccess: () => {
                medicalEntityHasUser && triggerNotificationPush({
                    action: "push",
                    root: "all",
                    message: " ",
                    content: JSON.stringify({
                        mutate: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${event?.publicId}/documents/${router.locale}`,
                        fcm_session: jti
                    })
                });
            },
            onSettled: () => setOpenUploadDialog({loading: false, dialog: false})
        });
    }

    const handleAddAppointmentRequest = () => {
        setLoading(true);
        const params = new FormData();
        params.append('dates', JSON.stringify(recurringDates.map(recurringDate => ({
            "start_date": recurringDate.date,
            "start_time": recurringDate.time
        }))));
        motif && params.append('consultation_reasons', motif.toString());
        params.append('title', `${patient?.firstName} ${patient?.lastName}`);
        params.append('patient_uuid', patient?.uuid as string);
        params.append('type', type);
        params.append('duration', duration as string);

        addAppointmentTrigger({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${router.locale}`,
            data: params
        }, {
            onSuccess: (value) => {
                refreshData();
                dispatch(setAppointmentSubmit({uuids: value?.data.data}));
                dispatch(setStepperIndex(0));
                setTimeout(() => setQuickAddAppointment(false));
            },
            onSettled: () => setLoading(false)
        });
    }

    const handleOpenFab = () => setOpenFabAdd(true);

    const handleCloseFab = () => setOpenFabAdd(false);

    const handleActionFab = (action: any) => {
        setOpenFabAdd(false);
        switch (action.key) {
            case "add_leave":
                dispatch(openDrawer({type: "absence", open: true}));
                break;
            case "add_chat":
                dispatch(setOpenChat(true))
                break;
            case "add-quick":
                handleAddAppointment("add-quick");
                break;
            case "add-complete":
                handleAddAppointment("add-complete");
                break;
        }
    }

    useLeavePageConfirm(() => {
        dispatch(resetFilter());
    });

    if (!ready) return (<LoadingScreen button text={"loading"}/>);

    return (
        <>
            <SubHeader
                sx={{
                    "& .MuiToolbar-root": {
                        display: "block"
                    }
                }}>
                <CalendarToolbar
                    {...{t, timeRange}}
                    OnToday={handleOnToday}
                    OnSelectEvent={onSelectEvent}
                    OnMoveEvent={(event: EventDef) => onMenuActions("onMove", event)}
                    OnConfirmEvent={(event: EventDef) => onConfirmAppointment(event)}
                    OnWaitingRoom={(event: EventDef) => onMenuActions('onWaitingRoom', event)}
                    OnClickDateNext={handleClickDateNext}
                    OnTableEvent={handleClickDateNext}
                    OnClickDatePrev={handleClickDatePrev}
                    OnAddAppointment={handleAddAppointment}/>
                {error &&
                    <AnimatePresence>
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{ease: "easeIn", duration: 1}}>
                            <Alert variant="filled"
                                   onClick={() => {
                                       const slugConsultation = `/dashboard/consultation/${onGoingEvent?.publicId ? onGoingEvent?.publicId : (onGoingEvent as any)?.id}`;
                                       if (router.asPath !== slugConsultation) {
                                           router.replace(slugConsultation, slugConsultation, {locale: router.locale});
                                       }
                                   }}
                                   onClose={(event) => {
                                       event.stopPropagation();
                                       setError(false);
                                   }}
                                   sx={{marginBottom: 2, border: "none", cursor: "pointer"}}
                                   severity="error">{t("in-consultation-error")}</Alert>
                        </motion.div>
                    </AnimatePresence>}
            </SubHeader>
            <Box sx={{background: "white"}}>
                <Backdrop sx={{zIndex: 100, backgroundColor: alpha(theme.palette.common.white, 0.9)}}
                          open={openFabAdd}/>
                <LinearProgress sx={{
                    visibility: !httpAppointmentsResponse || loading ? "visible" : "hidden"
                }} color="warning"/>

                {agenda &&
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{ease: "easeIn", duration: .5}}>
                        <Calendar
                            {...{
                                isBeta,
                                events: events.current,
                                doctor_country,
                                agenda,
                                calendarRef,
                                roles,
                                refs,
                                spinner: loading,
                                t,
                                sortedData: sortedData.current,
                                mutate: refreshData
                            }}
                            OnAddAppointment={handleAddAppointment}
                            OnSelectEvent={onSelectEvent}
                            OnEventChange={onEventChange}
                            OnRangeDateSelect={handleRangeSelect}
                            OnAddAbsence={handleAddAbsence}
                            OnDeleteAbsence={handleDeleteAbsence}
                            OnMenuActions={onMenuActions}
                            OnSelectDate={onSelectDate}
                            OnViewChange={onViewChange}
                            OnRangeChange={handleOnRangeChange}/>
                        {isMobile &&
                            <Zoom
                                in={!loading}
                                timeout={transitionDuration}
                                style={{
                                    transitionDelay: `${!loading ? transitionDuration.exit : 0}ms`,
                                }}
                                unmountOnExit>
                                <SpeedDial
                                    ariaLabel="SpeedDial tooltip Add"
                                    sx={{
                                        position: 'fixed',
                                        bottom: 50,
                                        right: 16
                                    }}
                                    icon={<SpeedDialIcon/>}
                                    onClose={handleCloseFab}
                                    onOpen={handleOpenFab}
                                    open={openFabAdd}>
                                    {actions.map((action) => (
                                        <SpeedDialAction
                                            key={action.key}
                                            icon={action.icon}
                                            tooltipTitle={t(`${action.key}`)}
                                            tooltipOpen
                                            onClick={() => handleActionFab(action)}
                                        />
                                    ))}
                                </SpeedDial>
                            </Zoom>}
                    </motion.div>
                }

                {(isMobile && view === "listWeek") && <>
                    {sortedData.current?.map((row, index) => (
                        <Container key={index} sx={{background: theme.palette.background.default, minHeight: "100vh"}}>
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
                            <Stack spacing={1}>
                                {row.events.map((event, idx) => (
                                    <AppointmentListMobile
                                        {...{roles, event}}
                                        key={event.id}
                                        index={idx}
                                        OnMenuActions={onMenuActions}
                                        OnSelectEvent={onSelectEvent}/>
                                ))}
                            </Stack>
                        </Container>
                    ))}
                    <FilterButton>
                        <AgendaFilter/>
                    </FilterButton>
                </>}

                <Drawer
                    anchor={"right"}
                    open={openViewDrawer && !openPatientDrawer}
                    dir={direction}
                    onClose={() => {
                        dispatch(openDrawer({type: "view", open: false}));
                        setTimeout(() => {
                            setEvent(undefined);
                        }, 300);
                    }}
                    PaperProps={{
                        sx: {
                            minWidth: "35vw",
                            maxWidth: "30rem",
                        }
                    }}>
                    {((event || selectedEvent) && openViewDrawer) &&
                        <AppointmentDetail
                            {...{isBeta}}
                            OnConsultation={onConsultationStart}
                            OnConfirmAppointment={onConfirmAppointment}
                            OnUploadDocuments={(event: EventDef) => onMenuActions('onAddConsultationDocuments', event)}
                            OnConsultationView={onConsultationView}
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
                            OnEditDetail={(event: EventDef) => {
                                setEvent(event);
                                dispatch(openDrawer({type: "view", open: false}));
                                dispatch(openDrawer({type: "patient", open: true}));
                            }}
                            SetMoveDialog={() => setMoveDialogInfo({...moveDialogInfo, info: true})}
                            SetCancelDialog={() => {
                                setActionDialog('cancel');
                                setTimeout(() => setCancelDialog(true));
                            }}
                            SetDeleteDialog={() => {
                                setActionDialog('delete');
                                setTimeout(() => setCancelDialog(true));
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
                        dispatch(openDrawer({type: "add", open: false}));
                        dispatch(setStepperIndex(0));
                        if (submitted) {
                            dispatch(resetSubmitAppointment());
                        }

                        eventStepper[0].disabled = false;

                        setTimeout(() => {
                            setEvent(undefined);
                        }, 300);
                    }}>
                    <Box height={"100%"}>
                        <CustomStepper
                            currentIndex={currentStepper}
                            OnTabsChange={handleStepperChange}
                            OnSubmitStepper={submitStepper}
                            stepperData={eventStepper}
                            OnCustomAction={handleStepperActions}
                            scroll
                            t={t}
                            minWidth={726}
                        />
                    </Box>
                </Drawer>

                <Drawer
                    anchor={"right"}
                    PaperProps={{
                        sx: {
                            width: {xs: "100%", md: 726},
                        }
                    }}
                    open={openPatientDrawer}
                    dir={direction}
                    onClose={cleanDrawData}>
                    <Box height={"100%"}>
                        {(event && openPatientDrawer) &&
                            <PatientDetail
                                mutateAgenda={() => refreshData()}
                                onCloseDialog={cleanDrawData}
                                onChangeStepper={(index: number) => console.log("onChangeStepper", index)}
                                onAddAppointment={() => console.log("onAddAppointment")}
                                onConsultation={() => onMenuActions('onConsultationView', event)}
                                onConsultationStart={(eventData: any) => {
                                    onMenuActions('onConsultationDetail', eventData);
                                    dispatch(openDrawer({type: "patient", open: false}));
                                }}
                                patientId={event?.extendedProps.patient.uuid}/>}
                    </Box>
                </Drawer>

                <Drawer
                    anchor={"right"}
                    open={openAbsenceDrawer}
                    dir={direction}
                    onClose={() => {
                        dispatch(openDrawer({type: "absence", open: false}));
                        dispatch(resetAbsenceData());
                    }}>
                    <AbsenceDrawer main={true} {...{t}} />
                    <Paper
                        sx={{
                            display: "inline-block",
                            borderRadius: 0,
                            borderWidth: 0,
                            textAlign: "right",
                            p: "1rem"
                        }}
                        className="action">
                        <Button
                            sx={{
                                mr: 1
                            }}
                            variant="text-primary"
                            onClick={() => {
                                dispatch(openDrawer({type: "absence", open: false}));
                                dispatch(resetAbsenceData());
                            }}>
                            {t(`steppers.back`)}
                        </Button>
                        <LoadingButton
                            loading={loadingRequest}
                            onClick={() => handleAddAbsence()}
                            disabled={absenceData.title.length === 0 || absenceData.hasError}
                            variant="contained"
                            color={"primary"}>
                            {t(`dialogs.quick_add_appointment-dialog.confirm`)}
                        </LoadingButton>
                    </Paper>
                </Drawer>

                <Drawer
                    anchor={"right"}
                    sx={{
                        width: 300
                    }}
                    open={quickAddAppointment}
                    dir={direction}
                    onClose={() => {
                        setQuickAddAppointment(false);
                        setQuickAddPatient(false);
                    }}>
                    <QuickAddAppointment
                        {...{t}}
                        handleClose={() => setQuickAddAppointment(false)}
                        handleAddPatient={(action: boolean) => setQuickAddPatient(action)}/>
                    <Paper
                        sx={{
                            display: quickAddPatient ? "none" : "inline-block",
                            borderRadius: 0,
                            borderWidth: 0,
                            textAlign: "right",
                            p: "1rem"
                        }}
                        className="action">
                        {finalize ?
                            <>
                                <Button
                                    sx={{
                                        mr: 1
                                    }}
                                    variant="text-primary"
                                    onClick={() => setQuickAddAppointment(false)}
                                    startIcon={<CloseIcon/>}>
                                    {t(`dialogs.quick_add_appointment-dialog.cancel`)}
                                </Button>
                                <LoadingButton
                                    {...{loading}}
                                    variant="contained"
                                    color={"primary"}
                                    onClick={event => {
                                        event.stopPropagation();
                                        handleAddAppointmentRequest();
                                    }}
                                    disabled={recurringDates.length === 0 || type === "" || !patient}>
                                    {t(`dialogs.quick_add_appointment-dialog.confirm`)}
                                </LoadingButton>
                            </> : <Stack pt={2} px={2} mx={-2} direction='row' justifyContent='space-between'
                                         alignItems='center' borderTop={1} borderColor='divider'>
                                <Button
                                    onClick={() => setQuickAddAppointment(false)}
                                    variant="text-black">
                                    {t("steppers.final-step.btn-close")}
                                </Button>
                                <Stack direction='row' alignItems='center' spacing={2}>
                                    <LoadingButton
                                        {...{loading}}
                                        variant="google"
                                        sx={{bgcolor: theme.palette.grey[50]}}
                                    >
                                        {t("steppers.final-step.btn-another-rdv-schedule")}
                                    </LoadingButton>
                                    <LoadingButton
                                        onClick={() => setQuickAddAppointment(false)}
                                        {...{loading}}
                                        variant="contained"

                                    >
                                        {t("steppers.final-step.btn-complete")}
                                    </LoadingButton>
                                </Stack>
                            </Stack>
                        }
                    </Paper>
                </Drawer>

                <Dialog
                    color={moveDialogAction === "move" ? theme.palette.warning.main : theme.palette.primary.main}
                    contrastText={moveDialogAction === "move" ? theme.palette.warning.contrastText : theme.palette.primary.contrastText}
                    dialogClose={() => {
                        event?.extendedProps.revert && event?.extendedProps.revert();
                        setMoveDialogInfo({...moveDialogInfo, dialog: false});
                    }}
                    dir={direction}
                    action={() => (
                        <Box sx={{minHeight: 150}}>
                            <Typography sx={{textAlign: "center"}}
                                        variant="subtitle1">{t(`dialogs.${moveDialogAction}-dialog.${!event?.extendedProps.onDurationChanged ? "sub-title" : "sub-title-duration"}`)}</Typography>
                            <Typography sx={{textAlign: "center"}}
                                        margin={2}>
                                {!event?.extendedProps.onDurationChanged ? <>
                                    {event?.extendedProps.oldDate.format(`DD-MM-YYYY ${event?.extendedProps.allDay ? '' : 'HH:mm'}`)} {" => "}
                                    {event?.extendedProps.newDate?.format("DD-MM-YYYY")} {moveDialogTime}
                                </> : <>
                                    {humanizeDuration(event?.extendedProps.oldDuration * 60000)} {" => "}
                                    {humanizeDuration(event?.extendedProps.duration * 60000)}
                                </>
                                }
                            </Typography>
                            <Typography sx={{textAlign: "center"}}
                                        margin={2}>{t(`dialogs.${moveDialogAction}-dialog.description`)}</Typography>
                        </Box>)}
                    open={moveDialogInfo.dialog}
                    title={t(`dialogs.${moveDialogAction}-dialog.${!event?.extendedProps.onDurationChanged ? "title" : "title-duration"}`)}
                    actionDialog={
                        <>
                            <Button
                                variant="text-primary"
                                onClick={() => {
                                    event?.extendedProps.revert && event?.extendedProps.revert();
                                    setMoveDialogInfo({...moveDialogInfo, dialog: false})
                                }}
                                startIcon={<CloseIcon/>}>
                                {t(`dialogs.${moveDialogAction}-dialog.garde-date`)}
                            </Button>
                            <LoadingButton
                                {...{loading}}
                                loadingPosition="start"
                                variant="contained"
                                color={moveDialogAction === "move" ? "warning" : "primary"}
                                onClick={() => moveDialogAction === "move" ? handleMoveAppointment(event as EventDef) :
                                    handleRescheduleAppointment(event as EventDef)}
                                startIcon={<IconUrl path="iconfinder"></IconUrl>}>
                                {t(`dialogs.${moveDialogAction}-dialog.confirm`)}
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

                                {actionDialog === "delete" ? <Grid container spacing={1}>
                                        {deleteAppointmentOptions.filter(option => !(event?.extendedProps?.status?.key !== "FINISHED" && option.key === "delete-transaction")).map((option: any, index: number) =>
                                            <Grid key={option.key} item
                                                  md={12 / deleteAppointmentOptions.filter(option => !(event?.extendedProps?.status?.key !== "FINISHED" && option.key === "delete-transaction")).length}
                                                  xs={12}>
                                                <Card
                                                    sx={{
                                                        padding: 1,
                                                        ml: 2,
                                                        borderRadius: 1.4,
                                                        "& .MuiTypography-root": {
                                                            fontSize: 14, fontWeight: "bold"
                                                        },
                                                        "& .MuiFormControlLabel-root": {
                                                            ml: 1,
                                                            width: "100%"
                                                        }
                                                    }}>
                                                    <FormControlLabel
                                                        label={t(`dialogs.delete-dialog.${option.key}`)}
                                                        checked={option.selected}
                                                        control={
                                                            <Checkbox
                                                                onChange={(event) => {
                                                                    setDeleteAppointmentOptions([
                                                                        ...deleteAppointmentOptions.slice(0, index),
                                                                        {
                                                                            ...deleteAppointmentOptions[index],
                                                                            selected: event.target.checked
                                                                        },
                                                                        ...deleteAppointmentOptions.slice(index + 1)
                                                                    ])
                                                                }}
                                                            />
                                                        }
                                                    />
                                                </Card>
                                            </Grid>)}
                                    </Grid> :
                                    <Grid item md={4} xs={12}>
                                        <Card
                                            sx={{
                                                padding: 1,
                                                ml: 2,
                                                borderRadius: 1.4,
                                                "& .MuiTypography-root": {
                                                    fontSize: 14,
                                                    fontWeight: "bold"
                                                },
                                                "& .MuiFormControlLabel-root": {
                                                    ml: 1,
                                                    width: "100%"
                                                }
                                            }}>
                                            <FormControlLabel
                                                label={t(`dialogs.cancel-dialog.notice`)}
                                                checked={cancelAppointmentOption}
                                                control={
                                                    <Checkbox
                                                        onChange={(event) => {
                                                            setCancelAppointmentOption(event.target.checked)
                                                        }}
                                                    />
                                                }
                                            />
                                        </Card>
                                    </Grid>}
                            </Box>)
                    }}
                    open={cancelDialog}
                    title={t(`dialogs.${actionDialog}-dialog.title`)}
                    actionDialog={
                        <Stack direction="row" alignItems="center" justifyContent={"space-between"} width={"100%"}>
                            <Button
                                variant="text-black"
                                onClick={() => setCancelDialog(false)}>
                                {t(`dialogs.${actionDialog}-dialog.cancel`)}
                            </Button>
                            <LoadingButton
                                {...{loading}}
                                loadingPosition="start"
                                variant="contained"
                                disabled={deleteAppointmentOptions.filter(option => option.selected).length === 0}
                                color={"error"}
                                onClick={() => handleActionDialog(event?.publicId ? event?.publicId as string : (event as any)?.id)}
                                startIcon={<IconUrl height={actionDialog === "cancel" ? "16" : "18"}
                                                    width={actionDialog === "cancel" ? "16" : "18"}
                                                    color={"white"}
                                                    path={actionDialog === "cancel" ? "close" : "ic-trash"}></IconUrl>}>
                                {t(`dialogs.${actionDialog}-dialog.confirm`)}
                            </LoadingButton>
                        </Stack>
                    }
                />

                <Dialog
                    action={"pre_consultation_data"}
                    {...{
                        direction,
                        sx: {
                            minHeight: 380
                        }
                    }}
                    open={openPreConsultationDialog}
                    data={{
                        patient: event?.extendedProps.patient,
                        uuid: event?.publicId
                    }}
                    size={"md"}
                    title={t("pre_consultation_dialog_title", {ns: "common"})}
                    {...(!loading && {dialogClose: () => setOpenPreConsultationDialog(false)})}
                    actionDialog={
                        <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"}>
                            <Button
                                variant={"text-black"}
                                onClick={() => setOpenPreConsultationDialog(false)}
                                startIcon={<CloseIcon/>}>
                                {t("cancel", {ns: "common"})}
                            </Button>
                            <LoadingButton
                                loading={loadingRequest}
                                loadingPosition="start"
                                variant="contained"
                                onClick={() => submitPreConsultationData()}
                                startIcon={<IconUrl path="iconfinder_save"/>}>
                                {t("save", {ns: "common"})}
                            </LoadingButton>
                        </Stack>
                    }
                />

                <Dialog
                    {...{direction}}
                    action={"add_a_document"}
                    open={openUploadDialog.dialog}
                    data={{
                        t,
                        state: documentConfig,
                        setState: setDocumentConfig
                    }}
                    size={"md"}
                    sx={{minHeight: 400}}
                    title={t("config.doc_detail_title", {ns: "patient"})}
                    {...(!openUploadDialog.loading && {
                        dialogClose: () => setOpenUploadDialog({
                            ...openUploadDialog,
                            dialog: false
                        })
                    })}
                    actionDialog={
                        <Stack direction={"row"} justifyContent={"space-between"} width={"100%"}>
                            <Button
                                variant={"text-black"}
                                onClick={() => {
                                    setOpenUploadDialog({...openUploadDialog, dialog: false});
                                }}
                                startIcon={<CloseIcon/>}>
                                {t("config.add-patient.cancel", {ns: "patient"})}
                            </Button>
                            <LoadingButton
                                loading={openUploadDialog.loading}
                                loadingPosition={"start"}
                                variant="contained"
                                onClick={event => {
                                    event.stopPropagation();
                                    handleUploadDocuments();
                                }}
                                startIcon={<IconUrl path="iconfinder_save"/>}>
                                {t("config.add-patient.register", {ns: "patient"})}
                            </LoadingButton>
                        </Stack>
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
                    dialogClose={() => {
                        setMoveDialogInfo({...moveDialogInfo, info: false});
                        if (openMoveDrawer) {
                            dispatch(openDrawer({type: "move", open: false}));
                        }
                    }}
                    action={"move_appointment"}
                    dir={direction}
                    open={moveDialogInfo.info}
                    title={t(`dialogs.${moveDialogAction}-dialog.title`)}
                    actionDialog={
                        <>
                            <Button
                                variant="text-primary"
                                onClick={() => {
                                    setMoveDialogInfo({...moveDialogInfo, info: false});
                                    if (openMoveDrawer) {
                                        dispatch(openDrawer({type: "move", open: false}));
                                    }
                                }}
                                startIcon={<CloseIcon/>}>
                                {t(`dialogs.${moveDialogAction}-dialog.garde-date`)}
                            </Button>
                            <LoadingButton
                                {...{loading}}
                                loadingPosition={"start"}
                                variant="contained"
                                disabled={!moveDateChanged}
                                onClick={moveDialogAction === "move" ? onMoveAppointment : onRescheduleAppointment}
                                color={"primary"}
                                startIcon={<IconUrl height={"18"} width={"18"} color={"white"}
                                                    path="iconfinder"></IconUrl>}>
                                {t(`dialogs.${moveDialogAction}-dialog.confirm`)}
                            </LoadingButton>
                        </>
                    }
                />

                <Dialog
                    action={"payment_dialog"}
                    {...{
                        direction,
                        sx: {
                            minHeight: 380
                        }
                    }}
                    open={openPaymentDialog}
                    data={{
                        patient: event?.extendedProps.patient,
                        setOpenPaymentDialog
                    }}
                    size={"lg"}
                    fullWidth
                    title={t("payment_dialog_title", {ns: "common"})}
                    dialogClose={() => {
                        setOpenPaymentDialog(false);
                        dispatch(openDrawer({type: "pay", open: false}));
                    }}
                />

                <MobileContainer>
                    <Button
                        startIcon={<IconUrl path="ic-filter"/>}
                        variant="filter"
                        onClick={() => setFilterBottom(true)}
                        sx={{
                            position: "fixed",
                            bottom: 50,
                            transform: "translateX(-50%)",
                            left: "50%",
                            zIndex: 999,

                        }}>
                        {t("filter.title")} (0)
                    </Button>
                </MobileContainer>
                <DrawerBottom
                    handleClose={() => setFilterBottom(false)}
                    open={filterBottom}
                    title={t("filter.title")}>
                    <AgendaFilter/>
                </DrawerBottom>
            </Box>
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({locale}) => {
    const queryClient = new QueryClient();
    const baseURL: string = process.env.NEXT_PUBLIC_API_URL || "";

    const countries = `api/public/places/countries/${locale}?nationality=true`;

    await queryClient.prefetchQuery({
        queryKey: [`/${countries}`],
        queryFn: () => fetch(`${baseURL}${countries}`, {method: "GET"}).then(response => response.json())
    });

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
            fallback: false,
            ...(await serverSideTranslations(locale as string, ['common', 'menu', 'agenda']))
        }
    }
}

export default Agenda

Agenda.auth = true

Agenda.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
}

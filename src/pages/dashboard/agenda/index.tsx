import {GetStaticProps} from "next";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {MutableRefObject, ReactElement, useCallback, useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import {
    Alert, Backdrop,
    Box,
    Button,
    Container, DialogActions,
    Drawer,
    LinearProgress, Paper, SpeedDial, SpeedDialAction,
    Theme,
    Typography,
    useMediaQuery,
    useTheme, Zoom
} from "@mui/material";
import {configSelector, DashLayout, dashLayoutSelector, setOngoing} from "@features/base";
import {SubHeader} from "@features/subHeader";
import {CalendarToolbar} from "@features/toolbar";
import {useSession} from "next-auth/react";
import dynamic from "next/dynamic";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

import {instanceAxios, useRequestMutation} from "@lib/axios";
import {useSnackbar} from 'notistack';
import {Session} from "next-auth";
import moment, {Moment} from "moment-timezone";

const humanizeDuration = require("humanize-duration");
import FullCalendar from "@fullcalendar/react";
import {DatesSetArg, EventChangeArg} from "@fullcalendar/core";
import {EventDef} from "@fullcalendar/core/internal";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {
    agendaSelector,
    DayOfWeek,
    openDrawer, setCurrentDate, setGroupedByDayAppointments,
    setSelectedEvent,
    setStepperIndex
} from "@features/calendar";
import {
    appointmentSelector,
    EventType,
    Instruction,
    Patient, resetAppointment, resetSubmitAppointment,
    setAppointmentDate, setAppointmentPatient,
    setAppointmentRecurringDates, setAppointmentSubmit,
    TimeSchedule
} from "@features/tabPanel";
import {TriggerWithoutValidation} from "@lib/swr/swrProvider";
import {
    AppointmentDetail, QuickAddAppointment,
    Dialog, dialogMoveSelector, PatientDetail, setMoveDateTime, preConsultationSelector
} from "@features/dialog";
import {AppointmentListMobile, setTimer, timerSelector} from "@features/card";
import {FilterButton} from "@features/buttons";
import {AgendaFilter, leftActionBarSelector} from "@features/leftActionBar";
import {AnimatePresence, motion} from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import {CustomStepper} from "@features/customStepper";
import {sideBarSelector} from "@features/menu";
import {appointmentGroupByDate, appointmentPrepareEvent, prepareSearchKeys, useMedicalEntitySuffix} from "@lib/hooks";
import {DateClickArg} from "@fullcalendar/interaction";
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import FastForwardOutlinedIcon from '@mui/icons-material/FastForwardOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import {alpha} from "@mui/material/styles";
import {DefaultCountry} from "@lib/constants";
import useSWRMutation from "swr/mutation";
import {sendRequest} from "@lib/hooks/rest";
import IconUrl from "@themes/urlIcon";
import {useSWRConfig} from "swr";
import {MobileContainer} from "@themes/mobileContainer";
import {DrawerBottom} from "@features/drawerBottom";

const actions = [
    {icon: <FastForwardOutlinedIcon/>, name: 'Ajout rapide', key: 'add-quick'},
    {icon: <AddOutlinedIcon/>, name: 'Ajout complet', key: 'add-complete'}
];

const Calendar = dynamic(() => import('@features/calendar/components/calendar'), {
    ssr: false
});

function Agenda() {
    const {data: session, status} = useSession();
    const router = useRouter();
    const theme = useTheme();
    const [filterBottom, setFilterBottom] = useState<boolean>(false)
    const dispatch = useAppDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const refs = useRef([]);
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {mutate} = useSWRConfig();

    const {t, ready} = useTranslation(['agenda', 'common']);
    const {direction} = useAppSelector(configSelector);
    const {query: filter} = useAppSelector(leftActionBarSelector);
    const {
        motif,
        duration,
        patient,
        type,
        submitted,
        recurringDates
    } = useAppSelector(appointmentSelector);
    const {opened: sidebarOpened} = useAppSelector(sideBarSelector);
    const {model} = useAppSelector(preConsultationSelector);
    const {waiting_room, mutate: mutateOnGoing, medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const {
        openViewDrawer, currentStepper, config,
        selectedEvent, actionSet, openMoveDrawer,
        openAddDrawer, openPatientDrawer, currentDate, view
    } = useAppSelector(agendaSelector);
    const {
        date: moveDialogDate,
        time: moveDialogTime,
        selected: moveDateChanged,
        action: moveDialogAction
    } = useAppSelector(dialogMoveSelector);
    const {isActive, event: onGoingEvent} = useAppSelector(timerSelector);
    const {config: agenda, lastUpdateNotification, sortedData: groupSortedData} = useAppSelector(agendaSelector);

    const [timeRange, setTimeRange] = useState({
        start: moment().startOf('week').format('DD-MM-YYYY'),
        end: moment().endOf('week').format('DD-MM-YYYY')
    });
    const [nextRefCalendar, setNextRefCalendar] = useState(1);
    const [loading, setLoading] = useState<boolean>(status === 'loading');
    const [moveDialogInfo, setMoveDialogInfo] = useState<boolean>(false);
    const [quickAddAppointment, setQuickAddAppointment] = useState<boolean>(false);
    const [quickAddPatient, setQuickAddPatient] = useState<boolean>(false);
    const [cancelDialog, setCancelDialog] = useState<boolean>(false);
    const [actionDialog, setActionDialog] = useState("cancel");
    const [moveDialog, setMoveDialog] = useState<boolean>(false);
    const [openPreConsultationDialog, setOpenPreConsultationDialog] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [localFilter, setLocalFilter] = useState("");
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
    const [calendarEl, setCalendarEl] = useState<FullCalendar | null>(null);
    const [openFabAdd, setOpenFabAdd] = useState(false);

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

    let events: MutableRefObject<EventModal[]> = useRef([]);
    let sortedData: MutableRefObject<GroupEventsModel[]> = useRef([]);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const roles = (session?.data as UserDataResponse).general_information.roles as Array<string>
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };

    const {data: httpAppointmentResponse, trigger} = useRequestMutation(null, "/agenda/appointment");
    const {trigger: addAppointmentTrigger} = useRequestMutation(null, "/agenda/addPatient");
    const {trigger: updateAppointmentTrigger} = useRequestMutation(null, "/agenda/update/appointment");
    const {trigger: updateAppointmentStatus} = useSWRMutation(["/agenda/update/appointment/status", {Authorization: `Bearer ${session?.accessToken}`}], sendRequest as any);
    const {trigger: handlePreConsultationData} = useSWRMutation(["/pre-consultation/update"], sendRequest as any);

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
        setLoading(true);
        if (query.includes("format=list")) {
            dispatch(setCurrentDate({date: moment().toDate(), fallback: false}));
            events.current = [];
        }
        trigger({
            method: "GET",
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${router.locale}?${query}`
        }).then((result) => {
            const eventCond = (result?.data as HttpResponse)?.data;
            const appointments = (eventCond?.hasOwnProperty('list') ? eventCond.list : eventCond) as AppointmentModel[];
            const eventsUpdated: EventModal[] = [];
            if (!filter || events.current.length === 0) {
                appointments?.forEach((appointment) => {
                    const horsWork = getAppointmentBugs(moment(appointment.dayDate + ' ' + appointment.startTime, "DD-MM-YYYY HH:mm").toDate());
                    const hasErrors = [
                        ...(horsWork ? ["event.hors-opening-hours"] : []),
                        ...(appointment.PatientHasAgendaAppointment ? ["event.patient-multi-event-day"] : [])]
                    eventsUpdated.push(appointmentPrepareEvent(appointment, horsWork, hasErrors));
                });
            } else {
                events.current.forEach(event => {
                    eventsUpdated.push({
                        ...event,
                        filtered: !appointments?.find(appointment => appointment.uuid === event.id)
                    })
                })
            }
            if (!history) {
                events.current = eventsUpdated;
            } else {
                events.current = [...eventsUpdated, ...events.current];
            }

            // Edit: to add it in the array format instead
            const groupArrays = appointmentGroupByDate(events.current);

            dispatch(setGroupedByDayAppointments(groupArrays));

            if (isMobile || view === "listWeek") {
                // sort grouped data
                sortedData.current = groupArrays.slice()
                    .sort((a, b) =>
                        new Date(a.date).getTime() - new Date(b.date).getTime());
            }
            setLoading(false);
        });
    }

    const calendarIntervalSlot = () => {
        let localMinSlot = 8; //8h
        let localMaxSlot = 20; //20h
        const openingHours = agenda?.openingHours[0] as OpeningHoursModel;
        Object.entries(openingHours).forEach((openingHours: any) => {
            openingHours[1].forEach((openingHour: { start_time: string, end_time: string }) => {
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
        if (lastUpdateNotification) {
            refreshData();
        }
    }, [lastUpdateNotification])  // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (openMoveDrawer) {
            setEvent(selectedEvent as EventDef);
            setMoveDialogInfo(true);
        }
    }, [openMoveDrawer])  // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (actionSet && actionSet.action === "onConfirm") {
            onConfirmAppointment(actionSet.event);
        }
    }, [actionSet]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (calendarEl && currentDate) {
            const calendarApi = (calendarEl as FullCalendar)?.getApi();
            calendarApi && calendarApi.gotoDate(currentDate.date);
        }
    }, [sidebarOpened]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (filter?.type && timeRange.start !== "" || filter?.patient || filter?.status || filter?.isOnline) {
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
        // dispatch(resetFilterPatient());
        const startStr = moment(event.startStr).format('DD-MM-YYYY');
        const endStr = moment(event.endStr).format('DD-MM-YYYY');
        setTimeRange({start: startStr, end: endStr});
        if (prepareSearchKeys(filter as any).length === 0 && localFilter.length === 0) {
            getAppointments(`start_date=${startStr}&end_date=${endStr}&format=week`);
        }
    }

    const handleOnToday = () => {
        const calendarApi = (calendarEl as FullCalendar)?.getApi();
        if (calendarApi) {
            calendarApi.today();
            dispatch(setCurrentDate({date: calendarApi.getDate(), fallback: false}));
        }
    }

    const onLoadCalendar = (event: FullCalendar) => {
        setCalendarEl(event);
    }

    const onViewChange = (view: string) => {
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

    const handleDragEvent = (DateTime: Moment, action: string) => {
        dispatch(setMoveDateTime({
            date: DateTime,
            time: DateTime.format("HH:mm"),
            action: action,
            selected: false
        }));
        setMoveDialog(true);
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
            const calendarApi = (calendarEl as FullCalendar)?.getApi();
            if (calendarApi) {
                calendarApi.prev();
                dispatch(setCurrentDate({date: calendarApi.getDate(), fallback: false}));
            }
        } else {
            scrollToView(refs.current[0], 1);
            const prevDate = moment(currentDate.date).clone().subtract(1, "days");
            getAppointments(`format=list&page=1&limit=50&start_date=${prevDate.format("DD-MM-YYYY")}`,
                view, false, true);
            dispatch(setCurrentDate({date: prevDate.toDate(), fallback: false}));
        }
    };

    const handleClickDateNext = () => {
        if (view !== 'listWeek') {
            const calendarApi = (calendarEl as FullCalendar)?.getApi();
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
        console.log("onMenuActions", action, event);
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
                        updateAppointmentStatus({
                            method: "PATCH",
                            data: {
                                status: "4",
                                start_date: moment().format("DD-MM-YYYY"),
                                start_time: moment().format("HH:mm")
                            },
                            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${event?.publicId ? event?.publicId : (event as any)?.id}/status/${router.locale}`
                        } as any).then(() => {
                            dispatch(setTimer({
                                    isActive: true,
                                    isPaused: false,
                                    event,
                                    startTime: moment().utc().format("HH:mm")
                                }
                            ));
                            // refresh on going api
                            mutateOnGoing && mutateOnGoing();
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
                updateAppointmentStatus({
                    method: "PATCH",
                    data: {
                        status: "1"
                    },
                    url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${event?.publicId ? event?.publicId : (event as any)?.id}/status/${router.locale}`
                } as any).then(() => {
                    refreshData();
                    enqueueSnackbar(t(`alert.leave-waiting-room`), {variant: "success"});
                    // refresh on going api
                    mutateOnGoing && mutateOnGoing();
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
                setMoveDialogInfo(true);
                break;
            case "onReschedule":
                dispatch(setSelectedEvent(event));
                setEvent(event);
                if (eventStepper.find(stepper => stepper.title === "steppers.tabs.tab-3")) {
                    setEventStepper(eventStepper.filter(stepper => stepper.title !== "steppers.tabs.tab-3"));
                }
                dispatch(resetAppointment());
                dispatch(setAppointmentPatient(event.extendedProps.patient as any));
                dispatch(openDrawer({type: "add", open: true}));
                break;
            case "onDelete":
                dispatch(setSelectedEvent(event));
                setEvent(event);
                setActionDialog('delete');
                setCancelDialog(true);
                break;
            case "onConfirmAppointment":
                onConfirmAppointment(event);
                break;
            case "onPreConsultation":
                setEvent(event);
                setOpenPreConsultationDialog(true);
                break;
        }
    }

    const onOpenWaitingRoom = (event: EventDef) => {
        const todayEvents = groupSortedData.find(events => events.date === moment().format("DD-MM-YYYY"));
        const filteredEvents = todayEvents?.events.every((event: any) => !["ON_GOING", "WAITING_ROOM"].includes(event.status.key) ||
            (event.status.key === "FINISHED" && event.updatedAt.isBefore(moment(), 'year')));
        updateAppointmentStatus({
            method: "PATCH",
            data: {
                status: "3",
                is_first_appointment: filteredEvents
            },
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${event?.publicId ? event?.publicId : (event as any)?.id}/status/${router.locale}`
        } as any).then(
            () => {
                refreshData();
                enqueueSnackbar(t(`alert.on-waiting-room`), {variant: "success"});
                dispatch(setOngoing({waiting_room: (waiting_room ? waiting_room : 0) + 1}));
                // update pending notifications status
                config?.mutate[1]();
            });
    }

    const onPatientNoShow = (event: EventDef) => {
        updateAppointmentStatus({
            method: "PATCH",
            data: {
                status: "10"
            },
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${event?.publicId ? event?.publicId : (event as any)?.id}/status/${router.locale}`
        } as any).then(() => {
            refreshData();
            enqueueSnackbar(t(`alert.patient-no-show`), {variant: "success"});
            dispatch(openDrawer({type: "view", open: false}));
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
        updateAppointmentStatus({
            method: "PATCH",
            data: {
                status: "1"
            },
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${event?.publicId ? event?.publicId : (event as any)?.id}/status/${router.locale}`
        } as any).then(() => {
            setLoading(false);
            refreshData();
            enqueueSnackbar(t(`alert.confirm-appointment`), {variant: "success"});
            dispatch(openDrawer({type: "view", open: false}));
            // update pending notifications status
            config?.mutate[1]();
        });
    }

    const onConsultationDetail = (event: EventDef) => {
        if (!isActive) {
            const slugConsultation = `/dashboard/consultation/${event?.publicId ? event?.publicId : (event as any)?.id}`;
            router.push(slugConsultation, slugConsultation, {locale: router.locale}).then(() => {
                updateAppointmentStatus({
                    method: "PATCH",
                    data: {
                        status: "4",
                        start_date: moment().format("DD-MM-YYYY"),
                        start_time: moment().format("HH:mm")
                    },
                    url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${event?.publicId ? event?.publicId : (event as any)?.id}/status/${router.locale}`
                } as any).then(() => {
                    dispatch(openDrawer({type: "view", open: false}));
                    dispatch(setTimer({
                            isActive: true,
                            isPaused: false,
                            event,
                            startTime: moment().utc().format("HH:mm")
                        }
                    ));
                    // refresh on going api
                    mutateOnGoing && mutateOnGoing();
                });
            })
        } else {
            dispatch(openDrawer({type: "view", open: false}));
            setError(true);
            // hide notification after 8000ms
            setInterval(() => {
                setError(false);
            }, 8000);
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
        setMoveDialogInfo(false);
        if (openMoveDrawer) {
            dispatch(openDrawer({type: "move", open: false}));
        }
        setMoveDialog(true);
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
        }, TriggerWithoutValidation).then((result) => {
            if ((result?.data as HttpResponse).status === "success") {
                enqueueSnackbar(t(`dialogs.move-dialog.${!event.extendedProps.onDurationChanged ?
                    "alert-msg" : "alert-msg-duration"}`), {variant: "success"});
            }
            dispatch(openDrawer({type: "view", open: false}));
            refreshData();
            setMoveDialog(false);
            // update pending notifications status
            config?.mutate[1]();
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
        }, TriggerWithoutValidation).then((result) => {
            if ((result?.data as HttpResponse).status === "success") {
                enqueueSnackbar(t(`dialogs.reschedule-dialog.alert-msg`), {variant: "success"});
            }
            refreshData();
            setMoveDialogInfo(false);
            setMoveDialog(false);
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
        updateAppointmentStatus({
            method: "PATCH",
            data: {status: "9"},
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${appointmentUUid}/status/${router.locale}`
        } as any).then(() => {
            dispatch(openDrawer({type: "view", open: false}));
            setCancelDialog(false);
            setLoading(false);
            refreshData();
            enqueueSnackbar(t(`alert.delete-appointment`), {variant: "success"});
        });
    }

    const cancelAppointment = (appointmentUUid: string) => {
        setLoading(true);
        updateAppointmentStatus({
            method: "PATCH",
            data: {status: "6"},
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${appointmentUUid}/status/${router.locale}`
        } as any).then(() => {
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
        // dispatch(openDrawer({type: "add", open: true}));
    }

    const handleStepperChange = (index: number) => {
        dispatch(setStepperIndex(index));
    }

    const handleStepperActions = (action: string, event: EventDef) => {
        console.log("handleStepperActions", action, event);
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
                onConsultationDetail(event);
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
        handlePreConsultationData({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${event?.publicId}/data/${router.locale}`,
            data: {
                "modal_uuid": model,
                "modal_data": localStorage.getItem(`Modeldata${event?.publicId}`) as string
            }
        } as any).then(() => {
            localStorage.removeItem(`Modeldata${event?.publicId}`);
            setOpenPreConsultationDialog(false);
            medicalEntityHasUser && mutate(`${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/agendas/${agenda?.uuid}/appointments/${event?.publicId}/consultation-sheet/${router.locale}`)
        });
    }

    const refreshData = () => {
        if (view === 'listWeek') {
            getAppointments(`format=list&page=1&limit=50`, view);
        } else {
            getAppointments(`start_date=${timeRange.start}&end_date=${timeRange.end}&format=week`);
        }
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
                setQuickAddAppointment(true);
                break;
        }
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
        }).then((value: any) => {
            setLoading(false);
            if (value?.data.status === 'success') {
                refreshData();
                dispatch(setAppointmentSubmit({uuids: value?.data.data}));
                dispatch(setStepperIndex(0));
                setQuickAddAppointment(false);
            }
        });
    }

    const handleOpenFab = () => setOpenFabAdd(true);

    const handleCloseFab = () => setOpenFabAdd(false);

    const handleActionFab = (action: any) => {
        setOpenFabAdd(false);
        switch (action.key) {
            case "add-quick" :
                handleAddAppointment("add-quick");
                break;
            case "add-complete" :
                handleAddAppointment("add-complete");
                break;
        }
    }

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <div>
            <SubHeader
                sx={{
                    "& .MuiToolbar-root": {
                        display: "block"
                    }
                }}>
                <CalendarToolbar
                    {...{t}}
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
                    <AnimatePresence mode='wait'>
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{ease: "easeIn", duration: 1}}
                        >
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
            <Box>
                <Backdrop sx={{zIndex: 100, backgroundColor: alpha(theme.palette.common.white, 0.9)}}
                          open={openFabAdd}/>
                <LinearProgress sx={{
                    visibility: !httpAppointmentResponse || loading ? "visible" : "hidden"
                }} color="warning"/>
                <>
                    {agenda &&
                        <AnimatePresence mode='wait'>
                            <motion.div
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{ease: "easeIn", duration: .5}}
                            >
                                <Calendar
                                    {...{
                                        events: events.current,
                                        doctor_country,
                                        agenda,
                                        roles,
                                        refs,
                                        spinner: loading,
                                        t,
                                        sortedData: sortedData.current,
                                        mutate: refreshData
                                    }}
                                    OnInit={onLoadCalendar}
                                    OnAddAppointment={handleAddAppointment}
                                    OnMoveEvent={(event: EventDef) => onMenuActions("onMove", event)}
                                    OnWaitingRoom={(event: EventDef) => onMenuActions('onWaitingRoom', event)}
                                    OnLeaveWaitingRoom={(event: EventDef) => onMenuActions('onLeaveWaitingRoom', event)}
                                    OnSelectEvent={onSelectEvent}
                                    OnConfirmEvent={(event: EventDef) => onConfirmAppointment(event)}
                                    OnEventChange={onEventChange}
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
                                        unmountOnExit
                                    >
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
                                            open={openFabAdd}
                                        >
                                            {actions.map((action) => (
                                                <SpeedDialAction
                                                    key={action.name}
                                                    icon={action.icon}
                                                    tooltipTitle={t(`${action.key}`)}
                                                    tooltipOpen
                                                    onClick={() => handleActionFab(action)}
                                                />
                                            ))}
                                        </SpeedDial>
                                    </Zoom>}
                            </motion.div>
                        </AnimatePresence>
                    }
                </>

                {(isMobile && view === "listWeek") && <>
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
                </>}

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
                    PaperProps={{
                        sx: {
                            minWidth: "29vw",
                            maxWidth: "30rem",
                        }
                    }}
                >
                    {((event || selectedEvent) && openViewDrawer) &&
                        <AppointmentDetail
                            OnConsultation={onConsultationDetail}
                            OnConfirmAppointment={onConfirmAppointment}
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
                        eventStepper[0].disabled = false;
                        dispatch(openDrawer({type: "add", open: false}));
                        setTimeout(() => {
                            setEvent(undefined);
                        }, 300);
                    }}
                >
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
                    open={openPatientDrawer}
                    dir={direction}
                    onClose={cleanDrawData}
                >
                    <Box height={"100%"}>
                        {(event && openPatientDrawer) &&
                            <PatientDetail
                                mutateAgenda={() => refreshData()}
                                onCloseDialog={cleanDrawData}
                                onChangeStepper={(index: number) => console.log("onChangeStepper", index)}
                                onAddAppointment={() => console.log("onAddAppointment")}
                                onConsultation={() => onMenuActions('onConsultationView', event)}
                                onConsultationStart={(eventData: any) => onMenuActions('onConsultationDetail', eventData)}
                                patientId={event?.extendedProps.patient.uuid}/>}
                    </Box>
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
                    }}
                >
                    <QuickAddAppointment
                        {...{t}}
                        handleAddPatient={(action: boolean) => setQuickAddPatient(action)}/>
                    <Paper
                        sx={{
                            display: quickAddPatient ? "none" : "inline-block",
                            borderRadius: 0,
                            borderWidth: 0,
                            textAlign: "right",
                            p: "1rem"
                        }}
                        className="action"
                    >
                        <Button
                            sx={{
                                mr: 1
                            }}
                            variant="text-primary"
                            onClick={() => setQuickAddAppointment(false)}
                            startIcon={<CloseIcon/>}
                        >
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
                    </Paper>
                </Drawer>

                <Dialog
                    color={moveDialogAction === "move" ? theme.palette.warning.main : theme.palette.primary.main}
                    contrastText={moveDialogAction === "move" ? theme.palette.warning.contrastText : theme.palette.primary.contrastText}
                    dialogClose={() => {
                        event?.extendedProps.revert && event?.extendedProps.revert();
                        setMoveDialog(false);
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
                    open={moveDialog}
                    title={t(`dialogs.${moveDialogAction}-dialog.${!event?.extendedProps.onDurationChanged ? "title" : "title-duration"}`)}
                    actionDialog={
                        <>
                            <Button
                                variant="text-primary"
                                onClick={() => {
                                    event?.extendedProps.revert && event?.extendedProps.revert();
                                    setMoveDialog(false)
                                }}
                                startIcon={<CloseIcon/>}
                            >
                                {t(`dialogs.${moveDialogAction}-dialog.garde-date`)}
                            </Button>
                            <LoadingButton
                                {...{loading}}
                                loadingPosition="start"
                                variant="contained"
                                color={moveDialogAction === "move" ? "warning" : "primary"}
                                onClick={() => moveDialogAction === "move" ? handleMoveAppointment(event as EventDef) :
                                    handleRescheduleAppointment(event as EventDef)}
                                startIcon={<IconUrl path="iconfinder"></IconUrl>}
                            >
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
                                startIcon={<IconUrl height={"18"} width={"18"} color={"white"}
                                                    path="icdelete"></IconUrl>}
                            >
                                {t(`dialogs.${actionDialog}-dialog.confirm`)}
                            </LoadingButton>
                        </>
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
                        <DialogActions>
                            <Button onClick={() => setOpenPreConsultationDialog(false)} startIcon={<CloseIcon/>}>
                                {t("cancel", {ns: "common"})}
                            </Button>
                            <LoadingButton
                                {...{loading}}
                                loadingPosition="start"
                                variant="contained"
                                onClick={() => submitPreConsultationData()}
                                startIcon={<IconUrl path="ic-dowlaodfile"/>}>
                                {t("save", {ns: "common"})}
                            </LoadingButton>
                        </DialogActions>
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
                        setMoveDialogInfo(false);
                        if (openMoveDrawer) {
                            dispatch(openDrawer({type: "move", open: false}));
                        }
                    }}
                    action={"move_appointment"}
                    dir={direction}
                    open={moveDialogInfo}
                    title={t(`dialogs.${moveDialogAction}-dialog.title`)}
                    actionDialog={
                        <>
                            <Button
                                variant="text-primary"
                                onClick={() => {
                                    setMoveDialogInfo(false);
                                    if (openMoveDrawer) {
                                        dispatch(openDrawer({type: "move", open: false}));
                                    }
                                }}
                                startIcon={<CloseIcon/>}
                            >
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
                                                    path="iconfinder"></IconUrl>}
                            >
                                {t(`dialogs.${moveDialogAction}-dialog.confirm`)}
                            </LoadingButton>
                        </>
                    }
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
        </div>
    )
}

export const getStaticProps: GetStaticProps = async ({locale}) => {
    // `getStaticProps` is executed on the server side.
    const {data: countries} = await instanceAxios({
        url: `/api/public/places/countries/${locale}?nationality=true`,
        method: "GET"
    });

    return {
        props: {
            fallback: {
                [`/api/public/places/countries/${locale}?nationality=true`]: countries
            },
            ...(await serverSideTranslations(locale as string, ['common', 'menu', 'agenda', 'patient', 'consultation', 'payment']))
        }
    }
}

export default Agenda

Agenda.auth = true

Agenda.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}

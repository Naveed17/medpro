import {GetStaticProps} from "next";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useCallback, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Box, Button, Container, Drawer, IconButton, LinearProgress, Typography, useTheme} from "@mui/material";
import {configSelector, DashLayout} from "@features/base";
import {SubHeader} from "@features/subHeader";
import {CalendarToolbar} from "@features/toolbar";
import {DesktopContainer} from "@themes/desktopConainter";
import {MobileContainer} from "@themes/mobileContainer";
import dynamic from "next/dynamic";
import {useSession} from "next-auth/react";
import {LoadingScreen} from "@features/loadingScreen";
import {useRequest, useRequestMutation} from "@app/axios";
import {Session} from "next-auth";
import moment from "moment-timezone";
import FullCalendar, {DateSelectArg, DatesSetArg, EventChangeArg, EventDef} from "@fullcalendar/react";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {
    agendaSelector,
    CalendarContextMenu,
    openDrawer,
    setConfig,
    setSelectedEvent,
    setStepperIndex
} from "@features/calendar";
import {EventType, TimeSchedule, Patient, Instruction, setAppointmentDate} from "@features/tabPanel";
import {CustomStepper} from "@features/customStepper";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import {
    AppointmentDetail,
    Dialog,
    dialogMoveSelector,
    PatientDetail,
    setMoveDateTime
} from "@features/dialog";
import {AppointmentListMobile} from "@features/card";
import {FilterButton} from "@features/buttons";
import {AgendaFilter} from "@features/leftActionBar";
import {AnimatePresence, motion} from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import Icon from "@themes/urlIcon";
import {LoadingButton} from "@mui/lab";
import {AppointmentTypes} from "@features/calendar";
import {Popover} from "@features/popover";

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
    const {t, ready} = useTranslation(['agenda', 'common']);

    const {direction} = useAppSelector(configSelector);
    const {
        openViewDrawer,
        selectedEvent,
        openAddDrawer, openPatientDrawer,
        currentStepper, currentDate, view
    } = useAppSelector(agendaSelector);
    const {
        date: moveDialogDate,
        time: moveDialogTime,
        selected: moveDateChanged
    } = useAppSelector(dialogMoveSelector);

    const [
        timeRange,
        setTimeRange
    ] = useState({start: "", end: ""})
    const [disabledSlots, setDisabledSlots] = useState([{
        start: moment("27-07-2022 13:00", "DD-MM-YYYY HH:mm").toDate(),
        end: moment("27-07-2022 13:30", "DD-MM-YYYY HH:mm").toDate()
    }]);

    const [loading, setLoading] = useState<boolean>(status === 'loading');
    const [moveAlert, setMoveAlert] = useState<boolean>(false);
    const [alertCancel, setAlertCancel] = useState<boolean>(false);
    const [alert, setAlert] = useState<boolean>(false);

    const [date, setDate] = useState(currentDate);
    const [event, setEvent] = useState<EventDef>();
    const [calendarEl, setCalendarEl] = useState<FullCalendar | null>(null);

    let appointments: AppointmentModel[] = [];
    let events: EventModal[] = [];

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpAgendasResponse, error: errorHttpAgendas} = useRequest({
        method: "GET",
        url: `/api/medical-entity/${medical_entity.uuid}/agendas/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        }
    }, SWRNoValidateConfig);

    const agenda = (httpAgendasResponse as HttpResponse)?.data
        .find((item: AgendaConfigurationModel) =>
            item.isDefault) as AgendaConfigurationModel;

    useEffect(() => {
        if (agenda) {
            dispatch(setConfig(agenda));
        }
    }, [agenda, dispatch])

    const {
        data: httpAppointmentResponse,
        trigger
    } = useRequestMutation(null, "/agenda/appointment", {revalidate: true, populateCache: false});

    const {
        trigger: updateAppointmentTrigger
    } = useRequestMutation(null, "/agenda/update/appointment", {revalidate: false, populateCache: false});

    const {
        trigger: updateStatusTrigger
    } = useRequestMutation(null, "/agenda/update/appointment/status",
        {revalidate: false, populateCache: false});

    const getAppointments = useCallback((query: string) => {
        setLoading(true);
        trigger({
            method: "GET",
            url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agenda.uuid}/appointments/${router.locale}?${query}`,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            }
        }, {revalidate: true, populateCache: true}).then(() => setLoading(false));
    }, [agenda?.uuid, medical_entity.uuid, router.locale, session?.accessToken, trigger]);

    if (errorHttpAgendas) return <div>failed to load</div>
    if (!ready) return (<LoadingScreen/>);

    const handleOnRangeChange = (event: DatesSetArg) => {
        const startStr = moment(event.startStr).format('DD-MM-YYYY');
        const endStr = moment(event.endStr).format('DD-MM-YYYY');
        setTimeRange({start: startStr, end: endStr});
        getAppointments(`start_date=${startStr}&end_date=${endStr}&format=week`);
    }

    const handleOnToday = (event: React.MouseEventHandler) => {
        const calendarApi = (calendarEl as FullCalendar).getApi();
        calendarApi.today();
    }

    const onLoadCalendar = (event: FullCalendar) => {
        setCalendarEl(event);
    }

    const onViewChange = (view: string) => {
        if (view === 'listWeek') {
            getAppointments(`format=list&page=1&limit=50`);
        }
    }

    const onSelectEvent = (event: EventDef) => {
        setEvent(event);
        dispatch(setSelectedEvent(event));
        dispatch(openDrawer({type: "view", open: true}));
    }

    const onEventChange = (info: EventChangeArg) => {
        const startDate = moment(info.event._instance?.range.start);
        const oldStartDate = moment(info.oldEvent._instance?.range.start);
        const defEvent = {
            ...info.event._def,
            extendedProps: {newDate: startDate, oldDate: oldStartDate}
        };
        setEvent(defEvent);
        setAlert(true);
    }

    const onMenuActions = (action: string, event: EventDef) => {
        switch (action) {
            case "onCancel":
                setAlertCancel(true);
                break;
            case "onConsultationDetail":
                const slugConsultation = `/dashboard/consultation/${event?.publicId ? event?.publicId : (event as any )?.id}`;
                router.push(slugConsultation, slugConsultation, {locale: router.locale});
                break;
            case "onPatientDetail":
                setEvent(event);
                dispatch(openDrawer({type: "patient", open: true}));
                break;
            case "onMove":
                setEvent(event);
                dispatch(setMoveDateTime({
                    date: event?.extendedProps.time,
                    time: moment(event?.extendedProps.time).format("HH:mm"),
                    selected: false
                }));
                setMoveAlert(true);
                break;
        }
    }

    const onConsultationDetail = (event: EventDef) => {
        const slugConsultation = `/dashboard/consultation/${(event as any)?.id}`;
        router.push(slugConsultation, slugConsultation, {locale: router.locale});
    }

    const onMoveAppointment = () => {
        const timeSplit = moveDialogTime.split(':');
        const date = moment(moveDialogDate?.setHours(parseInt(timeSplit[0]), parseInt(timeSplit[1])));
        const defEvent = {
            ...event,
            extendedProps: {
                ...event?.extendedProps,
                newDate: date,
                from: 'modal',
                oldDate: moment(event?.extendedProps.time)
            }
        } as EventDef;
        setEvent(defEvent);
        setMoveAlert(false);
        setAlert(true);
    }

    const handleMoveAppointment = (event: EventDef) => {
        setLoading(true);
        const form = new FormData();
        form.append('start_date', event.extendedProps.newDate.format("DD-MM-YYYY"));
        form.append('start_time',
            event.extendedProps.newDate.clone().subtract(event.extendedProps.from ? 0 : 1, 'hours').format("HH:mm"));
        const eventId = event.publicId ? event.publicId : (event as any).id;

        updateAppointmentTrigger({
            method: "PUT",
            url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agenda.uuid}/appointments/${eventId}/change-date/${router.locale}`,
            data: form,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            }
        }, {revalidate: false, populateCache: false}).then(() => {
            refreshData();
            setAlert(false);
        });
    }

    const cancelAppointment = (appointmentUUid: string) => {
        setLoading(true);
        const form = new FormData();
        form.append('status', '6');
        updateStatusTrigger({
            method: "PATCH",
            url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agenda?.uuid}
            /appointments/${appointmentUUid}/status/${router.locale}`,
            data: form,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        }).then(() => {
            const eventUpdated: any = {
                ...event, extendedProps:
                    {...event?.extendedProps, status: {key: "CANCELED", value: "Annulé"}}
            };
            dispatch(setSelectedEvent(eventUpdated));
            setLoading(false);
            setAlertCancel(false);
            refreshData();
        })
    }

    const onSelectDate = (eventArg: DateSelectArg) => {
        dispatch(setAppointmentDate(eventArg.start));
        dispatch(openDrawer({type: "add", open: true}));
    }

    const handleStepperChange = (index: number) => {
        dispatch(setStepperIndex(index));
    }

    const submitStepper = (index: number) => {
        if (EventStepper.length !== index) {
            EventStepper[index].disabled = false;
        } else {
            refreshData();
            dispatch(setStepperIndex(0));
            EventStepper.map((stepper, index) => {
                if (index > 0) {
                    stepper.disabled = true;
                }
            })
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
            getAppointments(`format=list&page=1&limit=50`);
        } else {
            getAppointments(`start_date=${timeRange.start}&end_date=${timeRange.end}&format=week`);
        }
    }

    const eventCond = (httpAppointmentResponse as HttpResponse)?.data;
    appointments = (eventCond?.hasOwnProperty('list') ? eventCond.list : eventCond) as AppointmentModel[];
    appointments?.map((appointment) => {
        events.push({
            start: moment(appointment.dayDate + ' ' + appointment.startTime, "DD-MM-YYYY HH:mm").toDate(),
            time: moment(appointment.dayDate + ' ' + appointment.startTime, "DD-MM-YYYY HH:mm").toDate(),
            end: moment(appointment.dayDate + ' ' + appointment.startTime, "DD-MM-YYYY HH:mm").add(appointment.consultationReason.duration, "minutes").toDate(),
            title: appointment.patient.lastName + ' ' + appointment.patient.firstName,
            allDay: false,
            borderColor: appointment.consultationReason.color,
            patient: appointment.patient,
            motif: appointment.consultationReason,
            description: "",
            id: appointment.uuid,
            meeting: false,
            new: appointment.createdAt.split(" ")[0] === moment().format("DD-MM-YYYY"),
            addRoom: true,
            status: AppointmentTypes[appointment.status]
        });
    });

    // this gives an object with dates as keys
    const groups: any = events.reduce(
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

    const sortedData: GroupEventsModel[] = groupArrays
        .slice()
        .sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <>
            <SubHeader>
                <CalendarToolbar onToday={handleOnToday} date={date}/>
            </SubHeader>
            <Box>
                {(!httpAgendasResponse || !httpAppointmentResponse || loading) &&
                    <LinearProgress color="warning"/>}
                <DesktopContainer>
                    <>
                        {httpAgendasResponse &&
                            <AnimatePresence exitBeforeEnter>
                                <motion.div
                                    initial={{opacity: 0, y: -100}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{ease: "easeIn", duration: 1}}
                                >
                                    <Calendar {...{events, agenda, disabledSlots, t, sortedData}}
                                              OnInit={onLoadCalendar}
                                              OnSelectEvent={onSelectEvent}
                                              OnEventChange={onEventChange}
                                              OnMenuActions={onMenuActions}
                                              OnSelectDate={onSelectDate}
                                              OnViewChange={onViewChange}
                                              OnRangeChange={handleOnRangeChange}/>
                                </motion.div>
                            </AnimatePresence>
                        }
                    </>
                </DesktopContainer>
                <MobileContainer>
                    {sortedData?.map((row, index) => (
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
                            OnCancelAppointment={() => refreshData()}
                            OnEditDetail={() => dispatch(openDrawer({type: "patient", open: true}))}
                            SetMoveDialog={() => setMoveAlert(true)}
                            SetCancelDialog={() => setAlertCancel(true)}
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
                            stepperData={EventStepper}
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
                                ConsultationId={event?.publicId}
                                patientId={event?.extendedProps.patient.uuid}/>}
                    </Box>
                </Drawer>

                <Dialog
                    color={theme.palette.warning.main}
                    contrastText={theme.palette.warning.contrastText}
                    dialogClose={() => setAlert(false)}
                    action={() => {
                        return (
                            <Box sx={{minHeight: 150}}>
                                <Typography sx={{textAlign: "center"}}
                                            variant="subtitle1">{t("dialogs.move-dialog.sub-title")}</Typography>
                                <Typography sx={{textAlign: "center"}}
                                            margin={2}>
                                    {event?.extendedProps.modal}
                                    {event?.extendedProps.oldDate.clone().subtract(event?.extendedProps.from ? 0 : 1, 'hours').format("DD-MM-YYYY HH:mm")} {" => "}
                                    {event?.extendedProps.newDate.clone().subtract(event?.extendedProps.from ? 0 : 1, 'hours').format("DD-MM-YYYY HH:mm")}
                                </Typography><Typography sx={{textAlign: "center"}}
                                                         margin={2}>{t("dialogs.move-dialog.description")}</Typography>
                            </Box>)
                    }}
                    open={alert}
                    title={t("dialogs.move-dialog.title")}
                    actionDialog={
                        <>
                            <Button
                                variant="text-primary"
                                onClick={() => setAlert(false)}
                                startIcon={<CloseIcon/>}
                            >
                                {t("dialogs.move-dialog.garde-date")}
                            </Button>
                            <LoadingButton
                                {...(loading && {loading})}
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
                    dialogClose={() => setAlertCancel(false)}
                    action={() => {
                        return (
                            <Box sx={{minHeight: 150}}>
                                <Typography sx={{textAlign: "center"}}
                                            variant="subtitle1">{t("dialogs.cancel-dialog.sub-title")}</Typography>
                                <Typography sx={{textAlign: "center"}}
                                            margin={2}>{t("dialogs.cancel-dialog.description")}</Typography>
                            </Box>)
                    }}
                    open={alertCancel}
                    title={t("dialogs.cancel-dialog.title")}
                    actionDialog={
                        <>
                            <Button
                                variant="text-primary"
                                onClick={() => setAlertCancel(false)}
                                startIcon={<CloseIcon/>}
                            >
                                {t("dialogs.cancel-dialog.cancel")}
                            </Button>
                            <LoadingButton
                                {...(loading && loading)}
                                variant="contained"
                                color={"error"}
                                onClick={() => cancelAppointment(selectedEvent?.publicId ? selectedEvent?.publicId as string : (selectedEvent as any)?.id)}
                                startIcon={<Icon height={"18"} width={"18"} color={"white"} path="icdelete"></Icon>}
                            >
                                {t("dialogs.cancel-dialog.confirm")}
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
                    dialogClose={() => setMoveAlert(false)}
                    action={"move_appointment"}
                    open={moveAlert}
                    title={t("dialogs.move-dialog.title")}
                    actionDialog={
                        <>
                            <Button
                                variant="text-primary"
                                onClick={() => setMoveAlert(false)}
                                startIcon={<CloseIcon/>}
                            >
                                {t("dialogs.move-dialog.garde-date")}
                            </Button>
                            <Button
                                variant="contained"
                                disabled={!moveDateChanged}
                                onClick={onMoveAppointment}
                                color={"primary"}
                                startIcon={<Icon height={"18"} width={"18"} color={"white"} path="iconfinder"></Icon>}
                            >
                                {t("dialogs.move-dialog.confirm")}
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

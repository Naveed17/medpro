import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Button, Container, Drawer, LinearProgress, Typography, useTheme } from "@mui/material";
import { configSelector, DashLayout } from "@features/base";
import { SubHeader } from "@features/subHeader";
import { CalendarToolbar } from "@features/toolbar";
import { DesktopContainer } from "@themes/desktopConainter";
import { MobileContainer } from "@themes/mobileContainer";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { LoadingScreen } from "@features/loadingScreen";
import { useRequest, useRequestMutation } from "@app/axios";
import { Session } from "next-auth";
import moment from "moment-timezone";
import FullCalendar, { DateSelectArg, DatesSetArg, EventChangeArg, EventDef } from "@fullcalendar/react";
import { useAppDispatch, useAppSelector } from "@app/redux/hooks";
import { agendaSelector, openDrawer, setConfig, setSelectedEvent, setStepperIndex } from "@features/calendar";
import { EventType, TimeSchedule, Patient, Instruction, setAppointmentDate } from "@features/tabPanel";
import { CustomStepper } from "@features/customStepper";
import { SWRNoValidateConfig } from "@app/swr/swrProvider";
import { AppointmentDetail, Dialog } from "@features/dialog";
import { AppointmentListMobile } from "@features/card";
import { FilterButton } from "@features/buttons";
import { AgendaFilter } from "@features/leftActionBar";
import { AnimatePresence, motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import Icon from "@themes/urlIcon";
import { LoadingButton } from "@mui/lab";

const Calendar = dynamic(() => import('@features/calendar/components/calendar'), {
    ssr: false
});

const AppointmentTypes: { [key: string]: AppointmentTypeModel } = {
    0: { key: "PENDING", value: "En attende" },
    1: { key: "CONFIRMED", value: "Confirmé" },
    2: { key: "REFUSED", value: "Effectué" },
    3: { key: "WAITING_ROOM", value: "Salle d'attende" },
    4: { key: "ON_GOING", value: "en attende" },
    5: { key: "FINISHED", value: "en attende" },
    6: { key: "CANCELED", value: "Annulé" },
    7: { key: "EXPIRED", value: "Expiré" },
}
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
    const { data: session, status } = useSession();
    const router = useRouter();
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const { direction } = useAppSelector(configSelector);
    const { openViewDrawer, openAddDrawer, currentStepper, currentDate, view } = useAppSelector(agendaSelector);
    const { t, ready } = useTranslation('agenda');
    const [
        timeRange,
        setTimeRange
    ] = useState({ start: "", end: "" })
    const [disabledSlots, setDisabledSlots] = useState([{
        start: moment("27-07-2022 13:00", "DD-MM-YYYY hh:mm").toDate(),
        end: moment("27-07-2022 13:30", "DD-MM-YYYY hh:mm").toDate()
    }]);

    const [loading, setLoading] = useState<boolean>(status === 'loading');
    const [date, setDate] = useState(currentDate);
    const [event, setEvent] = useState<EventDef>();
    const [alert, setAlert] = useState<boolean>(false);
    const [calendarEl, setCalendarEl] = useState<FullCalendar | null>(null);

    let appointments: AppointmentModel[] = [];
    let events: EventModal[] = [];

    const { data: user } = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const { data: httpAgendasResponse, error: errorHttpAgendas } = useRequest({
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
    } = useRequestMutation(null, "/agenda/appointment", { revalidate: true, populateCache: false });

    const {
        trigger: updateAppointmentTrigger
    } = useRequestMutation(null, "/agenda/update/appointment", { revalidate: false, populateCache: false });

    const getAppointments = useCallback((query: string) => {
        setLoading(true);
        trigger({
            method: "GET",
            url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agenda.uuid}/appointments/${router.locale}?${query}`,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            }
        }, { revalidate: true, populateCache: true }).then(() => setLoading(false));
    }, [agenda?.uuid, medical_entity.uuid, router.locale, session?.accessToken, trigger]);

    if (errorHttpAgendas) return <div>failed to load</div>
    if (!ready) return (<LoadingScreen />);

    const handleOnRangeChange = (event: DatesSetArg) => {
        const startStr = moment(event.startStr).format('DD-MM-YYYY');
        const endStr = moment(event.endStr).format('DD-MM-YYYY');
        setTimeRange({ start: startStr, end: endStr });
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
        console.log(view)
        if (view === 'listWeek') {
            getAppointments(`format=list&page=1&limit=50`);
        }
    }

    const onSelectEvent = (event: EventDef) => {
        setEvent(event);
        dispatch(setSelectedEvent(event));
        dispatch(openDrawer({ type: "view", open: true }));
    }

    const OnEventChange = (info: EventChangeArg) => {
        const startDate = moment(info.event._instance?.range.start);
        const defEvent = { ...info.event._def, extendedProps: { newDate: startDate } };
        setEvent(defEvent);
        setAlert(true);
    }

    const handleMoveAppointment = (event: EventDef) => {
        setLoading(true);
        const form = new FormData();
        form.append('start_date', event.extendedProps.newDate.format("DD-MM-YYYY"));
        form.append('start_time', event.extendedProps.newDate.subtract(1, 'hours').format("hh:mm"));
        updateAppointmentTrigger({
            method: "PUT",
            url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agenda.uuid}/appointments/${event.publicId}/change-date/${router.locale}`,
            data: form,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            }
        }, { revalidate: false, populateCache: false }).then(() => {
            refreshData();
            setAlert(false);
        });
    }

    const onSelectDate = (eventArg: DateSelectArg) => {
        dispatch(setAppointmentDate(eventArg.start));
        dispatch(openDrawer({ type: "add", open: true }));
    }

    const handleStepperChange = (index: number) => {
        dispatch(setStepperIndex(index));
    }

    const submitStepper = (index: number) => {
        if (EventStepper.length !== index) {
            EventStepper[index].disabled = false;
        } else {
            refreshData();
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
            start: moment(appointment.dayDate + ' ' + appointment.startTime, "DD-MM-YYYY hh:mm").toDate(),
            time: moment(appointment.dayDate + ' ' + appointment.startTime, "DD-MM-YYYY hh:mm").toDate(),
            end: moment(appointment.dayDate + ' ' + appointment.startTime, "DD-MM-YYYY hh:mm").add(appointment.consultationReason.duration, "minutes").toDate(),
            title: appointment.patient.lastName + ' ' + appointment.patient.firstName,
            allDay: false,
            borderColor: appointment.consultationReason.color,
            patient: appointment.patient,
            motif: appointment.consultationReason,
            description: "",
            id: appointment.uuid,
            meeting: false,
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
                <CalendarToolbar onToday={handleOnToday} date={date} />
            </SubHeader>
            <Box>
                {(!httpAgendasResponse || !httpAppointmentResponse || loading) &&
                    <LinearProgress color="warning" />}
                <DesktopContainer>
                    <>
                        {httpAgendasResponse &&
                            <AnimatePresence exitBeforeEnter>
                                <motion.div
                                    initial={{ opacity: 0, y: -100 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ ease: "easeIn", duration: 1 }}
                                >
                                    <Calendar {...{ events, agenda, disabledSlots, t, sortedData }}
                                        OnInit={onLoadCalendar}
                                        OnSelectEvent={onSelectEvent}
                                        OnEventChange={OnEventChange}
                                        OnSelectDate={onSelectDate}
                                        OnViewChange={onViewChange}
                                        OnRangeChange={handleOnRangeChange} />
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
                                sx={{ textTransform: "capitalize", fontSize: '1rem' }}>
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
                                    OnSelectEvent={onSelectEvent}
                                    key={event.id}
                                    event={event} />
                            ))}
                        </Container>
                    ))}

                    <FilterButton>
                        <AgendaFilter />
                    </FilterButton>
                </MobileContainer>

                <Drawer
                    anchor={"right"}
                    open={openViewDrawer}
                    dir={direction}
                    onClose={() => {
                        dispatch(openDrawer({ type: "view", open: false }));
                        setTimeout(() => {
                            setEvent(undefined);
                        }, 300);
                    }}
                >
                    {event &&
                        <AppointmentDetail
                            onCancelAppointment={() => refreshData()}
                            translate={t}
                        />}
                </Drawer>
                <Drawer
                    anchor={"right"}
                    open={openAddDrawer}
                    dir={direction}
                    onClose={() => {
                        dispatch(openDrawer({ type: "add", open: false }));
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

                <Dialog
                    color={theme.palette.warning.main}
                    contrastText={theme.palette.warning.contrastText}
                    dialogClose={() => setAlert(false)}
                    action={() => {
                        return (
                            <Box sx={{ minHeight: 150 }}>
                                <Typography sx={{ textAlign: "center" }}
                                    variant="subtitle1">{t("dialogs.move-dialog.sub-title")}</Typography>
                                <Typography sx={{ textAlign: "center" }}
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
                                startIcon={<CloseIcon />}
                            >
                                {t("dialogs.move-dialog.garde-date")}
                            </Button>
                            <LoadingButton
                                {...(loading && { loading })}
                                variant="contained"
                                color={"warning"}
                                onClick={() => handleMoveAppointment(event as EventDef)}
                                startIcon={<Icon path="iconfinder"></Icon>}
                            >
                                {t("dialogs.move-dialog.confirm")}
                            </LoadingButton>
                        </>
                    }
                ></Dialog>
            </Box>
        </>
    )
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(context.locale as string, ['common', 'menu', 'agenda']))
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
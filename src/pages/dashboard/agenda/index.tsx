import {GetStaticProps} from "next";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Box, Container, Drawer, LinearProgress, Typography} from "@mui/material";
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
import FullCalendar, {DateSelectArg, DatesSetArg, EventDef} from "@fullcalendar/react";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {agendaSelector, openDrawer, setConfig, setStepperIndex} from "@features/calendar";
import {EventType, TimeSchedule, Patient, Instruction, setAppointmentDate} from "@features/tabPanel";
import {CustomStepper} from "@features/customStepper";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import {AppointmentDetail} from "@features/dialog";
import {AppointmentListMobile} from "@features/card";
import {FilterButton} from "@features/buttons";
import {AgendaFilter} from "@features/leftActionBar";

const Calendar = dynamic(() => import('@features/calendar/components/Calendar'), {
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
    const dispatch = useAppDispatch();
    const {direction} = useAppSelector(configSelector);
    const {openViewDrawer, openAddDrawer, currentStepper, currentDate, view} = useAppSelector(agendaSelector);
    const {t, ready} = useTranslation('agenda');
    const [
        timeRange,
        setTimeRange
    ] = useState({start: "", end: ""})
    const [disabledSlots, setDisabledSlots] = useState([{
        start: moment("27-07-2022 13:00", "DD-MM-YYYY hh:mm").toDate(),
        end: moment("27-07-2022 13:30", "DD-MM-YYYY hh:mm").toDate()
    }]);

    const [loading, setLoading] = useState<boolean>(status === 'loading');
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
        error: errorHttpAppointment,
        trigger
    } = useRequestMutation(null, "/agenda/appointment", {revalidate: true, populateCache: false});

    if (errorHttpAgendas) return <div>failed to load</div>
    if (!ready) return (<LoadingScreen/>);

    const getAppointments = (query: string) => {
        setLoading(true);
        trigger({
            method: "GET",
            url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agenda.uuid}/appointments/${router.locale}?${query}`,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            }
        }, {revalidate: true, populateCache: true}).then(r => setLoading(false));
    }

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
        dispatch(openDrawer({type: "view", open: true}));
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
            if (view === 'listWeek') {
                getAppointments(`format=list&page=1&limit=50`);
            } else {
                getAppointments(`start_date=${timeRange.start}&end_date=${timeRange.end}&format=week`);
            }
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
            status: "Confirmed"
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
            new Date(a.date).getTime() - new Date(b.date).getTime())
        .reverse();

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
                            <Calendar {...{events, agenda, disabledSlots, t, sortedData}}
                                      OnInit={onLoadCalendar}
                                      OnSelectEvent={onSelectEvent}
                                      OnSelectDate={onSelectDate}
                                      OnViewChange={onViewChange}
                                      OnRangeChange={handleOnRangeChange}/>}
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
                    {event && <AppointmentDetail
                        translate={t}
                        data={event}
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

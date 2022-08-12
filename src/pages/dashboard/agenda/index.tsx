import {GetStaticProps} from "next";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Box, Drawer, LinearProgress} from "@mui/material";
import {configSelector, DashLayout} from "@features/base";
import {SubHeader} from "@features/subHeader";
import {CalendarToolbar} from "@features/toolbar";
import {DesktopContainer} from "@themes/desktopConainter";
import {MobileContainer} from "@themes/mobileContainer";
import dynamic from "next/dynamic";
import {useSession} from "next-auth/react";
import {LoadingScreen} from "@features/loadingScreen";
import {useRequest} from "@app/axios";
import {Session} from "next-auth";
import moment from "moment-timezone";
import {useAppointment} from "@app/hooks/rest";
import FullCalendar, {DatesSetArg} from "@fullcalendar/react";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {agendaSelector, openDrawer, setConfig, setStepperIndex} from "@features/calendar";
import {EventType, TimeSchedule, Patient} from "@features/tabPanel";
import {CustomStepper} from "@features/customStepper";

const Calendar = dynamic(() => import('@features/calendar/components/Calendar'), {
    ssr: false
});

const EventStepper = [
    {
        title: "steppers.tabs.tab-1",
        children: EventType
    }, {
        title: "steppers.tabs.tab-2",
        children: TimeSchedule
    }, {
        title: "steppers.tabs.tab-3",
        children: Patient
    }
];

function Agenda() {
    const {data: session, status} = useSession();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {direction} = useAppSelector(configSelector);
    const {drawer, currentStepper} = useAppSelector(agendaSelector);
    const {t, ready} = useTranslation('agenda');
    const [
        timeRange,
        setTimeRange
    ] = useState({
        start: moment().startOf('week').subtract(1, "days").format('DD-MM-YYYY'),
        end: moment().endOf('week').subtract(1, "days").format('DD-MM-YYYY')
    })
    const [disabledSlots, setDisabledSlots] = useState([{
        start: moment("27-07-2022 13:00", "DD-MM-YYYY hh:mm").toDate(),
        end: moment("27-07-2022 13:30", "DD-MM-YYYY hh:mm").toDate()
    }]);
    const [loading, setLoading] = useState<boolean>(status === 'loading');
    const [date, setDate] = useState(new Date());

    const [calendarEl, setCalendarEl] = useState<FullCalendar | null>(null);
    let appointments: AppointmentModel[] = [];

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpAgendasResponse, error: errorHttpAgendas} = useRequest({
        method: "GET",
        url: `/api/medical-entity/${medical_entity.uuid}/agendas/${router.locale}`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        }
    });

    const agenda = (httpAgendasResponse as HttpResponse)?.data
        .find((item: AgendaConfigurationModel) =>
            item.isDefault) as AgendaConfigurationModel;

    useEffect(() => {
        if (agenda) {
            dispatch(setConfig(agenda));
        }
    }, [agenda, dispatch])

    const {
        httpAppointmentResponse,
        errorHttpAppointment,
        trigger
    } = useAppointment(agenda,
        medical_entity.uuid,
        session?.accessToken as string,
        router.locale as string,
        timeRange.start,
        timeRange.end
    );

    if (errorHttpAgendas) return <div>failed to load</div>
    if (!ready) return (<LoadingScreen/>);

    const eventCond = (httpAppointmentResponse as HttpResponse)?.data;


    const handleOnRangeChange = (event: DatesSetArg) => {
        const startStr = moment(event.startStr).format('DD-MM-YYYY');
        const endStr = moment(event.endStr).format('DD-MM-YYYY');
        setLoading(true);
        trigger({
            method: "GET",
            url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agenda.uuid}/appointments/${router.locale}?start_date=${startStr}&end_date=${endStr}&format=week`,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            }
        }, {revalidate: true, populateCache: true}).then(r => setLoading(false));
    }

    const handleOnToday = (event: React.MouseEventHandler) => {
        const calendarApi = (calendarEl as FullCalendar).getApi();
        calendarApi.today();
    }

    const onLoadCalendar = (event: FullCalendar) => {
        setCalendarEl(event);
    }

    appointments = (eventCond?.hasOwnProperty('list') ? eventCond.list : eventCond) as AppointmentModel[];
    const events: EventModal[] = [];
    appointments?.map((appointment) => {
        events.push({
            start: moment(appointment.dayDate + ' ' + appointment.startTime, "DD-MM-YYYY hh:mm").toDate(),
            time: moment(appointment.dayDate + ' ' + appointment.startTime, "DD-MM-YYYY hh:mm").toDate(),
            end: moment(appointment.dayDate + ' ' + appointment.startTime, "DD-MM-YYYY hh:mm").add(appointment.consultationReason.duration, "minutes").toDate(),
            title: appointment.patient.lastName + ' ' + appointment.patient.firstName,
            addRoom: false,
            agenda: false,
            allDay: false,
            borderColor: "#E83B68",
            customRender: true,
            motif: appointment.consultationReason.name,
            description: "Unde a inventore et. Sed esse ut. Atque ducimus quibusdam fuga quas id qui fuga.",
            id: appointment.uuid,
            inProgress: false,
            meeting: false,
            status: false
        });
    });

    const onViewChange = (view: string) => {
        setLoading(true);
        if (view === 'listWeek') {
            trigger({
                method: "GET",
                url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agenda.uuid}/appointments/${router.locale}?format=list&page=1&limit=50`,
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`
                }
            }, {revalidate: true, populateCache: true}).then(r => setLoading(false));
        }
    }

    return (
        <>
            <SubHeader>
                <CalendarToolbar onToday={handleOnToday} date={date}/>
            </SubHeader>
            <Box>
                <DesktopContainer>
                    <>
                        {(!httpAgendasResponse || !httpAppointmentResponse || loading) &&
                            <LinearProgress color="warning"/>}
                        {httpAgendasResponse &&
                            <Calendar {...{events, agenda, disabledSlots, t, trigger}}
                                      OnInit={onLoadCalendar}
                                      OnViewChange={onViewChange}
                                      OnRangeChange={handleOnRangeChange}/>}
                    </>
                </DesktopContainer>
                <MobileContainer>
                    <div>mobile</div>
                </MobileContainer>
                <Drawer
                    anchor={"right"}
                    open={drawer}
                    dir={direction}
                    onClose={() => dispatch(openDrawer(false))}
                >
                    <Box height={"100%"}>
                        <CustomStepper
                            currentIndex={currentStepper}
                            OnStepperChange={(index: number) => dispatch(setStepperIndex(index))}
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

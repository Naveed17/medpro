import FullCalendar from "@fullcalendar/react"; // => request placed at the top
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import {
    Box,
    useMediaQuery,
    IconButton,
    useTheme,
} from "@mui/material";

import RootStyled from './overrides/rootStyled';
import CalendarStyled from './overrides/calendarStyled';

import React, {useEffect, useRef, useState} from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import moment from "moment";
import {FormatterInput} from "@fullcalendar/common";
import {useAppSelector} from "@app/redux/hooks";
import {agendaSelector, Event, Header} from "@features/calendar";
import {Otable} from "@features/table";
import {useIsMountedRef} from "@app/hooks";
import {NoDataCard} from "@features/card";

const tableHead = [
    {
        id: "heure",
        label: "header.heure",
        align: "left",
        sortable: true
    },
    {
        id: "motif",
        label: "header.motif",
        align: "left",
        sortable: true
    },
    {
        id: "durée",
        label: "header.duree",
        align: "left",
        sortable: true
    },
    {
        id: "status",
        label: "header.status",
        align: "center",
        sortable: true
    },
    {
        id: "patient",
        label: "header.patient",
        align: "center",
        sortable: true
    },
    {
        id: "agenda",
        label: "header.agenda",
        align: "center",
        sortable: true
    },
    {
        id: "action",
        label: "header.action",
        align: "right",
        sortable: false
    },
];

const AddAppointmentCardData = {
    mainIcon: "ic-agenda-+",
    title: "table.no-data.event.title",
    description: "table.no-data.event.description",
    buttonText: "table.no-data.event.button-text",
    buttonIcon: "ic-agenda-+",
    buttonVariant: "warning"
};

function Calendar({...props}) {
    const {events: appointments, OnRangeChange, disabledSlots, t: translation, OnInit, OnViewChange, OnSelectEvent} = props;
    const theme = useTheme();
    const {view, currentDate} = useAppSelector(agendaSelector);
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const calendarRef = useRef(null);
    const [events, setEvents] = useState<ConsultationReasonTypeModel[]>(appointments);
    const [eventGroupByDay, setEventGroupByDay] = useState<GroupEventsModel[]>([]);
    const [date, setDate] = useState(moment().toDate());
    const isMounted = useIsMountedRef();

    useEffect(() => {
        const calendarEl = calendarRef.current;
        if (isMounted.current && calendarEl) {
            OnInit(calendarEl)
        }
    }, [OnInit, isMounted]);

    useEffect(() => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = (calendarEl as FullCalendar).getApi();
            calendarApi.gotoDate(currentDate);
        }
    }, [currentDate]);

    useEffect(() => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = (calendarEl as FullCalendar).getApi();
            calendarApi.changeView(view as string);
        } else {
            console.log(view)
            OnViewChange(view as string);
        }
    }, [view]);


    useEffect(() => {
        setEvents(appointments);
        // this gives an object with dates as keys
        const groups = appointments.reduce(
            (groups: { [key: string]: Array<EventCalendarModel> },
             data: EventCalendarModel) => {
                const date = moment(data.time, "ddd MMM DD YYYY HH:mm:ss").format('DD-MM-YYYY');
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
        const sortedData = groupArrays
            .slice()
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .reverse();

        setEventGroupByDay(sortedData);

        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = (calendarEl as FullCalendar).getApi();
            calendarApi.refetchEvents();
        }
    }, [appointments]);

    const handleClickDatePrev = () => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = (calendarEl as FullCalendar).getApi();
            calendarApi.prev();
            setDate(calendarApi.getDate());
        }
    };

    const handleClickDateNext = () => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = (calendarEl as FullCalendar).getApi();
            calendarApi.next();
            setDate(calendarApi.getDate());
        }
    };

    const isGridWeek = Boolean(view === "timeGridWeek");
    const isRTL = theme.direction === "rtl";
    const slotFormat = {hour: 'numeric', minute: '2-digit', omitZeroMinute: false, hour12: false} as FormatterInput;

    return (
        <Box bgcolor="#F0FAFF">
            <RootStyled>
                <CalendarStyled>
                    {view === "listWeek" ? (
                        <Box className="container">
                            <Otable
                                headers={tableHead}
                                rows={eventGroupByDay}
                                from={"calendar"}
                                t={translation}
                            />
                            {eventGroupByDay.length === 0 &&
                                <NoDataCard t={translation} data={AddAppointmentCardData}/>}
                        </Box>
                    ) : (
                        <Box position="relative">

                            <Box
                                className="action-header-main"
                                sx={{
                                    svg: {
                                        transform: isRTL ? "rotate(180deg)" : "rotate(0deg)",
                                    },
                                }}
                            >
                                <IconButton
                                    onClick={handleClickDatePrev}
                                    size="small"
                                    aria-label="back"
                                >
                                    <ArrowBackIosNewIcon fontSize="small"/>
                                </IconButton>
                                <IconButton
                                    onClick={handleClickDateNext}
                                    size="small"
                                    aria-label="next"
                                >
                                    <ArrowForwardIosIcon fontSize="small"/>
                                </IconButton>
                            </Box>

                            <FullCalendar
                                weekends
                                editable
                                direction={isRTL ? "rtl" : "ltr"}
                                droppable
                                selectable
                                events={events}
                                ref={calendarRef}
                                allDaySlot={false}
                                datesSet={OnRangeChange}
                                eventContent={(event) => <Event event={event}/>}
                                dayHeaderContent={(event) => Header({
                                    isGridWeek,
                                    view,
                                    event
                                })}
                                slotLabelClassNames={(day) => {
                                    return moment(day.date, "ddd MMM DD YYYY HH:mm:ss").isBetween(disabledSlots[0].start, disabledSlots[0].end) ? 'normal' : 'disabled';
                                }}
                                eventClick={OnSelectEvent}
                                showNonCurrentDates={true}
                                rerenderDelay={10}
                                height={isMobile ? "auto" : 720}
                                initialDate={date}
                                slotMinTime={"08:00:00"}
                                slotMaxTime={"20:20:00"}
                                firstDay={1}
                                initialView={view}
                                dayMaxEventRows={3}
                                eventDisplay="block"
                                headerToolbar={false}
                                allDayMaintainDuration
                                eventResizableFromStart
                                slotDuration="00:30:00"
                                slotLabelFormat={slotFormat}
                                plugins={[
                                    listPlugin,
                                    dayGridPlugin,
                                    timeGridPlugin,
                                    interactionPlugin
                                ]}
                            />
                        </Box>
                    )}
                </CalendarStyled>
            </RootStyled>
        </Box>
    )
}

export default Calendar;

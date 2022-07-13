import FullCalendar from "@fullcalendar/react"; // => request placed at the top
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import {
    Box,
    DialogTitle,
    useMediaQuery,
    IconButton,
    Typography, useTheme,
} from "@mui/material";

import RootStyled from './overrides/rootStyled';
import CalendarStyled from './overrides/calendarStyled';

import {useEffect, useRef, useState} from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import moment from "moment";
import {FormatterInput} from "@fullcalendar/common";
import Event from "./event/components/event";
import {useAppSelector} from "@app/redux/hooks";
import {agendaSelector} from "@features/calendar";

function Calendar() {
    const theme = useTheme();
    const {view} = useAppSelector(agendaSelector);
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const calendarRef = useRef(null);
    const [events, setEvents] = useState([]);
    const [date, setDate] = useState(moment().toDate());

    useEffect(() => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = (calendarEl as FullCalendar).getApi();
            calendarApi.changeView(view as string);
        }
    }, [view]);

    const isGridWeek = Boolean(view === "timeGridWeek");
    const isRTL = theme.direction === "rtl";
    const slotFormat = {hour: 'numeric', minute: '2-digit', omitZeroMinute: false, hour12: false} as FormatterInput;

    return (
        <Box bgcolor="#F0FAFF">
            <RootStyled>
                <CalendarStyled>
                    {view === "listWeek" ? (
                        <></>
                    ) : (
                        <Box position="relative">
                            {(isGridWeek || view === "timeGridDay") && (
                                <Box
                                    className="action-header-main"
                                    sx={{
                                        svg: {
                                            transform: isRTL ? "rotate(180deg)" : "rotate(0deg)",
                                        },
                                    }}
                                >
                                    <IconButton
                                        // onClick={handleClickDatePrev}
                                        size="small"
                                        aria-label="back"
                                    >
                                        <ArrowBackIosNewIcon fontSize="small"/>
                                    </IconButton>
                                    <IconButton
                                        // onClick={handleClickDateNext}
                                        size="small"
                                        aria-label="next"
                                    >
                                        <ArrowForwardIosIcon fontSize="small"/>
                                    </IconButton>
                                </Box>
                            )}
                            <FullCalendar
                                weekends
                                editable
                                direction={isRTL ? "rtl" : "ltr"}
                                droppable
                                selectable
                                events={events}
                                ref={calendarRef}
                                allDaySlot={false}
                                initialEvents={[
                                    {
                                        addRoom: false,
                                        agenda: false,
                                        allDay: false,
                                        borderColor: "#E83B68",
                                        customRender: true,
                                        description: "Unde a inventore et. Sed esse ut. Atque ducimus quibusdam fuga quas id qui fuga.",
                                        end: "2022-07-11T09:40:30.075Z",
                                        id: "299263f6-2964-4f30-8ee1-e71e9c50d9ec",
                                        inProgress: false,
                                        meeting: false,
                                        motif: "Brady",
                                        start: "2022-07-11T09:10:30.075Z",
                                        status: false,
                                        time: "2022-08-11T09:10:30.075Z",
                                        title: "Melanie Noble"
                                    }
                                ]}
                                eventContent={(event) => {
                                    return <Event event={event}/>
                                }}
                                rerenderDelay={10}
                                height={isMobile ? "auto" : 720}
                                initialDate={date}
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

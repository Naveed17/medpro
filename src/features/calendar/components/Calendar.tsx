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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import IconUrl from "@themes/urlIcon";
import moment from "moment";
import {FormatterInput} from "@fullcalendar/common";
import dynamic from "next/dynamic";


function Calendar() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const calendarRef = useRef(null);
    const [view, setView] = useState("timeGridWeek");
    const [events, setEvents] = useState([]);
    const [date, setDate] = useState(moment().toDate());

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
                                    {title: 'nice event', start: new Date(), resourceId: 'a'}
                                ]}
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

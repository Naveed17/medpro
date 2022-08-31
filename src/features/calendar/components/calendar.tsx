import FullCalendar from "@fullcalendar/react"; // => request placed at the top
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import {Box, IconButton, Menu, MenuItem, useTheme} from "@mui/material";

import RootStyled from "./overrides/rootStyled";
import CalendarStyled from "./overrides/calendarStyled";

import React, {useEffect, useRef, useState} from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import moment from "moment-timezone";
import {FormatterInput} from "@fullcalendar/common";
import {useAppSelector} from "@app/redux/hooks";
import {
    AddAppointmentCardData,
    agendaSelector,
    CalendarContextMenu,
    Event,
    Header,
    TableHead
} from "@features/calendar";
import {Otable} from "@features/table";
import {useIsMountedRef} from "@app/hooks";
import {NoDataCard} from "@features/card";
import {uniqueId} from "lodash";
import Typography from "@mui/material/Typography";

function Calendar({...props}) {
    const {
        events: appointments,
        OnRangeChange,
        disabledSlots,
        t: translation,
        sortedData,
        OnInit,
        OnViewChange = null,
        OnSelectEvent,
        OnSelectDate,
        OnEventChange,
    } = props;

    const theme = useTheme();
    const isMounted = useIsMountedRef();
    const calendarRef = useRef(null);

    const {view, currentDate} = useAppSelector(agendaSelector);

    const [events, setEvents] =
        useState<ConsultationReasonTypeModel[]>(appointments);
    const [eventGroupByDay, setEventGroupByDay] =
        useState<GroupEventsModel[]>(sortedData);
    const [date, setDate] = useState(moment().toDate());
    const [contextMenu, setContextMenu] = React.useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);
    const [anchorEl, setAnchorEl] = React.useState<EventTarget | null>(null);


    useEffect(() => {
        const calendarEl = calendarRef.current;
        if (isMounted.current && calendarEl) {
            OnInit(calendarEl);
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
            OnViewChange(view as string);
        }
    }, [view]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        setEvents(appointments);
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = (calendarEl as FullCalendar).getApi();
            calendarApi.refetchEvents();
        }
    }, [appointments]);

    useEffect(() => {
        setEventGroupByDay(sortedData);
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = (calendarEl as FullCalendar).getApi();
            calendarApi.refetchEvents();
        }
    }, [sortedData]);

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

    const handleTableEvent = (action: string, eventData: EventModal) => {
        switch (action) {
            case "showEvent":
                OnSelectEvent(eventData);
                break;
            case "waitingRoom":
                console.log("waitingRoom", eventData.id);
                break;
        }
    };

    const handleContextMenu = (event: MouseEvent) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
        setContextMenu(
            contextMenu === null
                ? {
                    mouseX: event.clientX + 2,
                    mouseY: event.clientY - 6,
                }
                : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
                  // Other native context menus might behave different.
                  // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
                null,
        );
    };

    const handleClose = () => {
        setContextMenu(null);
    };

    const isGridWeek = Boolean(view === "timeGridWeek");
    const isRTL = theme.direction === "rtl";
    const slotFormat = {
        hour: "numeric",
        minute: "2-digit",
        omitZeroMinute: false,
        hour12: false,
    } as FormatterInput;

    return (
        <Box bgcolor="#F0FAFF">
            <RootStyled>
                <CalendarStyled>
                    {view === "listWeek" ? (
                        <Box className="container">
                            <Otable
                                headers={TableHead}
                                rows={eventGroupByDay}
                                handleEvent={(action: string, eventData: EventModal) =>
                                    handleTableEvent(action, eventData)
                                }
                                from={"calendar"}
                                t={translation}
                            />
                            {eventGroupByDay.length === 0 && (
                                <NoDataCard t={translation} data={AddAppointmentCardData}/>
                            )}
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
                                timeZone={'local'}
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
                                eventDidMount={mountArg => mountArg.el.oncontextmenu = handleContextMenu}
                                businessHours={() => [ // specify an array instead
                                    {
                                        daysOfWeek: [1, 2, 3], // Monday, Tuesday, Wednesday
                                        startTime: '08:00', // 8am
                                        endTime: '18:00' // 6pm
                                    },
                                    {
                                        daysOfWeek: [4, 5], // Thursday, Friday
                                        startTime: '10:00', // 10am
                                        endTime: '16:00' // 4pm
                                    }
                                ]}
                                dayHeaderContent={(event) =>
                                    Header({
                                        isGridWeek,
                                        view,
                                        event,
                                    })
                                }
                                slotLabelClassNames={(day) => {
                                    return moment(day.date, "ddd MMM DD YYYY HH:mm:ss").isBetween(
                                        disabledSlots[0].start,
                                        disabledSlots[0].end
                                    )
                                        ? "normal"
                                        : "disabled";
                                }}
                                eventClick={(eventArg) => OnSelectEvent(eventArg.event._def)}
                                eventChange={(info) => OnEventChange(info)}
                                select={OnSelectDate}
                                showNonCurrentDates={true}
                                rerenderDelay={10}
                                height={"100vh"}
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
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            />

                            <Menu
                                open={contextMenu !== null}
                                onClose={handleClose}
                                anchorReference="anchorPosition"
                                PaperProps={{
                                    elevation: 0,
                                    sx: {
                                        backgroundColor: theme.palette.text.primary,
                                        "& .popover-item": {
                                            padding: theme.spacing(2),
                                            display: "flex",
                                            alignItems: "center",
                                            svg: { color: "#fff", marginRight: theme.spacing(1), fontSize: 20 },
                                            cursor: "pointer",
                                        }
                                    },
                                }}
                                anchorPosition={
                                    contextMenu !== null
                                        ? {top: contextMenu.mouseY, left: contextMenu.mouseX}
                                        : undefined
                                }
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                            >
                                {CalendarContextMenu.map(
                                    (v: any) => (
                                        <MenuItem
                                            key={uniqueId()}
                                            onClick={() => {
                                                handleClose();
                                            }}
                                            className="popover-item"
                                        >
                                            {v.icon}
                                            <Typography fontSize={15} sx={{color: "#fff"}}>
                                                {translation(v.title)}
                                            </Typography>
                                        </MenuItem>
                                    )
                                )}
                            </Menu>
                        </Box>
                    )}
                </CalendarStyled>
            </RootStyled>
        </Box>
    );
}

export default Calendar;

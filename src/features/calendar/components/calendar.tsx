import FullCalendar, {EventDef, VUIEvent} from "@fullcalendar/react"; // => request placed at the top

import {Box, IconButton, Menu, Theme, useMediaQuery, useTheme} from "@mui/material";

import RootStyled from "./overrides/rootStyled";
import CalendarStyled from "./overrides/calendarStyled";

import React, {useEffect, useRef, useState} from "react";

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Typography from "@mui/material/Typography";

import moment from "moment-timezone";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {
    AddAppointmentCardData,
    agendaSelector,
    CalendarContextMenu, DayOfWeek,
    Event,
    Header, setCurrentDate, setView, SlotFormat,
    TableHead
} from "@features/calendar";

import dynamic from "next/dynamic";

const Otable = dynamic(() => import('@features/table/components/table'));

import {useIsMountedRef} from "@app/hooks";
import {NoDataCard} from "@features/card";
import {uniqueId} from "lodash";
import {BusinessHoursInput} from "@fullcalendar/common";
import {useSwipeable} from "react-swipeable";

function Calendar({...props}) {
    const {
        events: appointments,
        OnRangeChange,
        spinner,
        roles,
        refs,
        t: translation,
        sortedData,
        OnInit,
        OnLeaveWaitingRoom,
        OnWaitingRoom,
        OnViewChange = null,
        OnSelectEvent,
        OnSelectDate,
        OnEventChange,
        OnMenuActions
    } = props;

    const dispatch = useAppDispatch();
    const theme = useTheme();
    const isMounted = useIsMountedRef();
    const calendarRef = useRef(null);
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

    const {view, currentDate, config: agendaConfig} = useAppSelector(agendaSelector);

    const prevView = useRef(view);

    const [events, setEvents] = useState<ConsultationReasonTypeModel[]>(appointments);
    const [eventGroupByDay, setEventGroupByDay] = useState<GroupEventsModel[]>(sortedData);
    const [eventMenu, setEventMenu] = useState<EventDef>();
    const [date, setDate] = useState(currentDate.date);
    const [calendarHeight, setCalendarHeight] = useState("80vh");
    const [daysOfWeek, setDaysOfWeek] = useState<BusinessHoursInput[]>([]);
    const [contextMenu, setContextMenu] = React.useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);
    const [anchorEl, setAnchorEl] = React.useState<EventTarget | null>(null);
    const [loading, setLoading] = useState(false);

    const isGridWeek = Boolean(view === "timeGridWeek");
    const isRTL = theme.direction === "rtl";
    const isLgScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('xl'));
    const openingHours = agendaConfig?.locations[0].openingHours[0].openingHours;

    useEffect(() => {
        const calendarEl = calendarRef.current;
        if (isMounted.current && calendarEl) {
            OnInit(calendarEl);
            let days: BusinessHoursInput[] = [];
            if (openingHours) {
                Object.entries(openingHours).map((openingHours: any) => {
                    openingHours[1].map((openingHour: { start_time: string, end_time: string }) => {
                        days.push({
                            daysOfWeek: [DayOfWeek(openingHours[0], 0)],
                            startTime: openingHour.start_time,
                            endTime: openingHour.end_time
                        });
                    })
                });
                setDaysOfWeek(days);
            }
        }
    }, [OnInit, isMounted, openingHours]);

    useEffect(() => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = (calendarEl as FullCalendar).getApi();
            if (currentDate.fallback) {
                calendarApi.gotoDate(currentDate.date);
            }
        }
    }, [currentDate]);

    useEffect(() => {
        const calendarEl = calendarRef.current;
        if (calendarEl && prevView.current !== "listWeek") {
            const calendarApi = (calendarEl as FullCalendar).getApi();
            if (calendarApi.view.type !== view) {
                calendarApi.changeView(view as string);
            }
        } else {
            OnViewChange(view as string);
        }
        prevView.current = view;
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
            dispatch(setCurrentDate({date: calendarApi.getDate(), fallback: false}));
        }
    };

    const handleClickDateNext = () => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = (calendarEl as FullCalendar).getApi();
            calendarApi.next();
            dispatch(setCurrentDate({date: calendarApi.getDate(), fallback: false}));
        }
    };

    const handleNavLinkDayClick = (date: Date, jsEvent: VUIEvent) => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = (calendarEl as FullCalendar).getApi();
            calendarApi.gotoDate(date);
            dispatch(setView("timeGridDay"));
            dispatch(setCurrentDate({date, fallback: false}));
        }
    }

    const handleTableEvent = (action: string, eventData: EventModal) => {
        switch (action) {
            case "showEvent":
                OnSelectEvent(eventData);
                break;
            case "waitingRoom":
                OnWaitingRoom(eventData);
                break;
            case "leaveWaitingRoom":
                OnLeaveWaitingRoom(eventData);
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

    const MenuContextlog = (action: string, eventMenu: EventDef) => {
        return (
            action === "onWaitingRoom" &&
            (moment().format("DD-MM-YYYY") !== moment(eventMenu?.extendedProps.time).format("DD-MM-YYYY") ||
                (eventMenu?.extendedProps.status.key === "WAITING_ROOM" || eventMenu?.extendedProps.status.key === "ON_GOING" || eventMenu?.extendedProps.status.key === "FINISHED")) ||
            action === "onConsultationView" && (!["FINISHED", "ON_GOING"].includes(eventMenu?.extendedProps.status.key) || roles.includes('ROLE_SECRETARY')) ||
            action === "onConsultationDetail" && (["FINISHED", "ON_GOING"].includes(eventMenu?.extendedProps.status.key) || roles.includes('ROLE_SECRETARY')) ||
            action === "onLeaveWaitingRoom" && eventMenu?.extendedProps.status.key !== "WAITING_ROOM" ||
            action === "onCancel" &&
            (eventMenu?.extendedProps.status.key === "CANCELED" || eventMenu?.extendedProps.status.key === "FINISHED") ||
            action === "onMove" && moment().isAfter(eventMenu?.extendedProps.time) ||
            action === "onPatientNoShow" && ((moment().isBefore(eventMenu?.extendedProps.time) || eventMenu?.extendedProps.status.key === "ON_GOING") ||
                eventMenu?.extendedProps.status.key === "FINISHED") ||
            action === "onReschedule" && moment().isBefore(eventMenu?.extendedProps.time)
        )
    }

    const handlers = useSwipeable({
        onSwiped: (eventData) => {
            if (eventData.dir === "Left") {
                handleClickDatePrev();
            } else {
                handleClickDateNext();
            }
        }
    });

    return (
        <Box bgcolor="#F0FAFF">
            <RootStyled>
                <CalendarStyled>
                    {(view === "listWeek" && !isMobile) ? (
                        <Box className="container">
                            <Otable
                                {...{spinner, refs}}
                                maxHeight={`calc(100vh - 180px)`}
                                headers={TableHead}
                                rows={eventGroupByDay}
                                handleEvent={(action: string, eventData: EventModal) =>
                                    handleTableEvent(action, eventData)
                                }
                                from={"calendar"}
                                t={translation}
                            />
                            {(!spinner && eventGroupByDay.length === 0) && (
                                <NoDataCard t={translation} data={AddAppointmentCardData}/>
                            )}
                        </Box>
                    ) : (
                        <Box position="relative" {...handlers} style={{touchAction: 'pan-y'}}>
                            <FullCalendar
                                weekends
                                editable
                                direction={isRTL ? "rtl" : "ltr"}
                                droppable
                                navLinks
                                selectable
                                eventDurationEditable
                                slotEventOverlap={true}
                                events={events}
                                ref={calendarRef}
                                datesSet={OnRangeChange}
                                navLinkDayClick={handleNavLinkDayClick}
                                allDayContent={(event) => ""}
                                moreLinkContent={(event) => `${event.shortText} plus`}
                                eventContent={(event) =>
                                    <Event {...{event, openingHours, view, isMobile}} t={translation}/>
                                }
                                eventClassNames={(arg) => {
                                    if (arg.event._def.extendedProps.filtered) {
                                        return ['filtered']
                                    } else {
                                        return ['normal']
                                    }
                                }}
                                eventDidMount={mountArg => {
                                    mountArg.el.addEventListener('contextmenu', (ev) => {
                                        ev.preventDefault();
                                        setEventMenu(mountArg.event._def);
                                        handleContextMenu(ev);
                                    })
                                }}
                                moreLinkClick={(event) => {
                                    const jsEvent = event.jsEvent as any;
                                    if (jsEvent.screenY > window.innerHeight) {
                                        setTimeout(() => {
                                            const popover = document.getElementsByClassName("fc-popover") as HTMLCollectionOf<HTMLElement>;
                                            if (popover) {
                                                popover[0].style.bottom = "0";
                                                popover[0].style.top = "auto";
                                                popover[0].style.transition = "bottom 4s ease 0s";
                                            }
                                        }, 0);
                                    }
                                }}
                                dayHeaderContent={(event) =>
                                    Header({
                                        isGridWeek,
                                        event,
                                        isMobile
                                    })
                                }
                                eventClick={(eventArg) => OnSelectEvent(eventArg.event._def)}
                                eventChange={(info) => OnEventChange(info)}
                                select={OnSelectDate}
                                showNonCurrentDates={true}
                                rerenderDelay={8}
                                height={calendarHeight}
                                initialDate={date}
                                slotMinTime={"08:00:00"}
                                slotMaxTime={"20:00:00"}
                                businessHours={daysOfWeek}
                                firstDay={1}
                                initialView={view}
                                dayMaxEventRows={isLgScreen ? 6 : 3}
                                eventMaxStack={1}
                                eventDisplay="block"
                                headerToolbar={false}
                                allDayMaintainDuration
                                eventResizableFromStart
                                slotLabelInterval={{minutes: 30}}
                                slotDuration="00:15:00"
                                slotLabelFormat={SlotFormat}
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
                                            svg: {color: "#fff", marginRight: theme.spacing(1), fontSize: 20},
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
                                {CalendarContextMenu.filter(data => !MenuContextlog(data.action, eventMenu as EventDef)).map((v: any) => (
                                        <IconButton
                                            key={uniqueId()}
                                            onClick={() => {
                                                OnMenuActions(v.action, eventMenu);
                                                handleClose();
                                            }}
                                            className="popover-item"
                                        >
                                            {v.icon}
                                            <Typography fontSize={15} sx={{color: "#fff"}}>
                                                {translation(`${v.title}`, {ns: 'common'})}
                                            </Typography>
                                        </IconButton>
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

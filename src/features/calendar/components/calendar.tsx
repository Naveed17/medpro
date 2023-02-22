import FullCalendar from "@fullcalendar/react"; // => request placed at the top

import {
    Backdrop,
    Box,
    ClickAwayListener,
    IconButton,
    Menu,
    MenuItem,
    Theme,
    useMediaQuery,
    useTheme
} from "@mui/material";

import RootStyled from "./overrides/rootStyled";
import CalendarStyled from "./overrides/calendarStyled";

import React, {useEffect, useRef, useState} from "react";

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, {DateClickTouchArg} from "@fullcalendar/interaction";
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
import {BusinessHoursInput} from "@fullcalendar/core";
import {useSwipeable} from "react-swipeable";
import FastForwardOutlinedIcon from "@mui/icons-material/FastForwardOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {StyledMenu} from "@features/buttons";
import {alpha} from "@mui/material/styles";

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
        OnConfirmEvent,
        OnMoveEvent,
        OnWaitingRoom,
        OnViewChange = null,
        OnAddAppointment,
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

    const [events, setEvents] = useState<EventModal[]>(appointments);
    const [eventGroupByDay, setEventGroupByDay] = useState<GroupEventsModel[]>(sortedData);
    const [eventMenu, setEventMenu] = useState<string>();
    const [slotMinTime, setSlotMinTime] = useState(8);
    const [slotMaxTime, setSlotMaxTime] = useState(20);
    const [date, setDate] = useState(currentDate.date);
    const [calendarHeight, setCalendarHeight] = useState(!isMobile ? "80vh" : window.innerHeight - (window.innerHeight / (Math.trunc(window.innerHeight / 122))));
    const [daysOfWeek, setDaysOfWeek] = useState<BusinessHoursInput[]>([]);
    const [slotInfo, setSlotInfo] = useState<DateClickTouchArg | null>(null);
    const [slotInfoPopover, setSlotInfoPopover] = useState<boolean | null>(null);
    const [contextMenu, setContextMenu] = React.useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);
    const [anchorEl, setAnchorEl] = React.useState<EventTarget | null>(null);
    const [loading, setLoading] = useState(true);

    const isGridWeek = Boolean(view === "timeGridWeek");
    const isRTL = theme.direction === "rtl";
    const isLgScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('xl'));
    const openingHours = agendaConfig?.locations[0].openingHours[0].openingHours;

    useEffect(() => {
        let days: BusinessHoursInput[] = [];
        if (openingHours) {
            Object.entries(openingHours).map((openingHours: any) => {
                openingHours[1].map((openingHour: { start_time: string, end_time: string }) => {
                    const min = moment.duration(openingHour?.start_time).asHours();
                    const max = moment.duration(openingHour?.end_time).asHours();
                    if (min < slotMinTime) {
                        setSlotMinTime(min);
                    }

                    if (max > slotMaxTime) {
                        setSlotMaxTime(max);
                    }

                    days.push({
                        daysOfWeek: [DayOfWeek(openingHours[0], 0)],
                        startTime: openingHour.start_time,
                        endTime: openingHour.end_time
                    });
                })
            });
            setDaysOfWeek(days);
            setLoading(false);
        }
    }, [openingHours]); // eslint-disable-line react-hooks/exhaustive-deps

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

    const getSlotsFormat = (slot: number) => {
        const duration = moment.duration(slot, "hours") as any;
        return moment.utc(duration._milliseconds).format("HH:mm:ss");
    }

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

    const handleNavLinkDayClick = (date: Date, jsEvent: UIEvent) => {
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
            case "confirmEvent":
                OnConfirmEvent(eventData);
                break;
            case "moveEvent":
                OnMoveEvent(eventData);
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

    const MenuContextlog = (action: string, eventMenu: EventModal) => {
        return eventMenu && (
            action === "onWaitingRoom" &&
            (moment().format("DD-MM-YYYY") !== moment(eventMenu.time).format("DD-MM-YYYY") ||
                ["PENDING", "WAITING_ROOM", "ON_GOING", "FINISHED"].includes(eventMenu.status.key)) ||
            action === "onConsultationView" &&
            (!["FINISHED", "ON_GOING"].includes(eventMenu.status.key) || roles.includes('ROLE_SECRETARY')) ||
            action === "onConsultationDetail" &&
            (["FINISHED", "ON_GOING", "PENDING"].includes(eventMenu.status.key) || roles.includes('ROLE_SECRETARY')) ||
            action === "onLeaveWaitingRoom" &&
            eventMenu.status.key !== "WAITING_ROOM" ||
            action === "onCancel" &&
            (eventMenu.status.key === "CANCELED" || eventMenu.status.key === "FINISHED" || eventMenu.status.key === "ON_GOING") ||
            action === "onDelete" &&
            (eventMenu.status.key === "CANCELED" || eventMenu.status.key === "FINISHED" || eventMenu.status.key === "ON_GOING") ||
            action === "onMove" &&
            (moment().isAfter(eventMenu.time) || eventMenu.status.key === "FINISHED") ||
            action === "onPatientNoShow" &&
            ((moment().isBefore(eventMenu.time) || eventMenu.status.key === "ON_GOING") ||
                eventMenu.status.key === "FINISHED") ||
            action === "onConfirmAppointment" &&
            eventMenu.status.key !== "PENDING" ||
            action === "onReschedule" &&
            (moment().isBefore(eventMenu.time) && eventMenu.status.key !== "FINISHED")
        )
    }

    const handlers = useSwipeable({
        onSwipedLeft: (eventData) => {
            handleClickDateNext();
        },
        onSwipedRight: (eventData) => {
            handleClickDatePrev();
        },
        preventScrollOnSwipe: true
    });

    return (
        <Box bgcolor="#F0FAFF">
            {isMobile && <ClickAwayListener onClickAway={() => {
                if (slotInfoPopover) {
                    setSlotInfoPopover(false);
                }
            }}>
                <Backdrop className={"backdrop-calendar"}
                          sx={{zIndex: 100, backgroundColor: alpha(theme.palette.common.white, 0.9)}}
                          open={!!slotInfoPopover}/>
            </ClickAwayListener>}
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
                    ) : !loading && (
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
                                defaultTimedEventDuration="00:15"
                                allDayMaintainDuration={false}
                                navLinkDayClick={handleNavLinkDayClick}
                                allDayContent={(event) => ""}
                                eventDrop={(eventDrop) => {
                                    if (eventDrop.event._def.allDay) {
                                        eventDrop.revert();
                                    }
                                }}
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
                                        setEventMenu(mountArg.event._def.publicId);
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
                                eventChange={(info) => !info.event._def.allDay && OnEventChange(info)}
                                dateClick={(info) => {
                                    setSlotInfo(info as DateClickTouchArg);
                                    setTimeout(() => {
                                        setSlotInfoPopover(true);
                                    }, isMobile ? 100 : 0);
                                }}
                                showNonCurrentDates={true}
                                rerenderDelay={8}
                                height={calendarHeight}
                                initialDate={date}
                                slotMinTime={getSlotsFormat(slotMinTime)}
                                slotMaxTime={getSlotsFormat(slotMaxTime)}
                                businessHours={daysOfWeek}
                                firstDay={1}
                                initialView={view}
                                dayMaxEventRows={isLgScreen ? 6 : 3}
                                eventMaxStack={1}
                                eventDisplay="block"
                                headerToolbar={false}
                                nowIndicator={true}
                                eventResizableFromStart
                                slotLabelInterval={{minutes: 30}}
                                slotDuration="00:15:00"
                                slotLabelFormat={SlotFormat}
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            />

                            {slotInfo && <StyledMenu
                                open={!!slotInfoPopover}
                                anchorReference="anchorPosition"
                                onClose={() => {
                                    setSlotInfoPopover(false);
                                }}
                                anchorPosition={{
                                    top: ((isMobile && slotInfo?.jsEvent.changedTouches) ? slotInfo?.jsEvent.changedTouches[0]?.pageY : slotInfo?.jsEvent.pageY) as number,
                                    left: ((isMobile && slotInfo?.jsEvent.changedTouches) ? slotInfo?.jsEvent.changedTouches[0].pageX : slotInfo?.jsEvent.pageX) as number
                                }}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                PaperProps={{
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: (theme) => `drop-shadow(${theme.customShadows.popover})`,
                                        mt: 1.5,
                                        '& .MuiAvatar-root': {
                                            width: 32,
                                            height: 32,
                                            ml: -0.5,
                                            mr: 1,
                                        },
                                        ...!isMobile && {
                                            '&:before': {
                                                content: '""',
                                                display: 'block',
                                                position: 'absolute',
                                                top: 0,
                                                left: 14,
                                                width: 10,
                                                height: 10,
                                                bgcolor: 'background.paper',
                                                transform: 'translateY(-50%) rotate(45deg)',
                                                zIndex: 0,
                                            }
                                        },
                                    },
                                }}
                            >
                                <MenuItem onClick={() => {
                                    setSlotInfoPopover(false);
                                    OnAddAppointment("quick-add");
                                    OnSelectDate(slotInfo);
                                }} disableRipple>
                                    <FastForwardOutlinedIcon/>
                                    Ajout rapide
                                </MenuItem>
                                <MenuItem onClick={() => {
                                    setSlotInfoPopover(false);
                                    OnAddAppointment("full-add");
                                    OnSelectDate(slotInfo);
                                }} disableRipple>
                                    <AddOutlinedIcon/>
                                    Ajout complet
                                </MenuItem>
                            </StyledMenu>}

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
                                {CalendarContextMenu.filter(data => !MenuContextlog(data.action, events.find(event => event.id === eventMenu) as EventModal)).map((v: any) => (
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

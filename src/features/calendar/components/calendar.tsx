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
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {
    AddAppointmentCardData,
    agendaSelector,
    CalendarContextMenu,
    DayOfWeek,
    Event,
    Header,
    setCurrentDate,
    setView,
    SlotFormat,
    TableHead
} from "@features/calendar";
import dynamic from "next/dynamic";
import {NoDataCard} from "@features/card";
import {uniqueId} from "lodash";
import {BusinessHoursInput} from "@fullcalendar/core";
import {useSwipeable} from "react-swipeable";
import FastForwardOutlinedIcon from "@mui/icons-material/FastForwardOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {StyledMenu} from "@features/buttons";
import {alpha} from "@mui/material/styles";
import {MobileContainer} from "@lib/constants";

const Otable = dynamic(() => import('@features/table/components/table'));

function Calendar({...props}) {
    const {
        calendarRef,
        events: appointments,
        OnRangeChange,
        spinner,
        roles,
        refs,
        t: translation,
        sortedData,
        doctor_country,
        OnLeaveWaitingRoom,
        OnConfirmEvent,
        OnMoveEvent,
        OnWaitingRoom,
        OnViewChange = null,
        OnAddAppointment,
        OnSelectEvent,
        OnSelectDate,
        OnEventChange,
        OnMenuActions,
        mutate: mutateAgenda
    } = props;

    const dispatch = useAppDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(`(max-width:${MobileContainer}px)`);

    const {view, currentDate, config: agendaConfig} = useAppSelector(agendaSelector);

    const prevView = useRef(view);

    const [events, setEvents] = useState<EventModal[]>(appointments);
    const [eventGroupByDay, setEventGroupByDay] = useState<GroupEventsModel[]>(sortedData);
    const [eventMenu, setEventMenu] = useState<string>();
    const [slotMinTime, setSlotMinTime] = useState(8);
    const [slotMaxTime, setSlotMaxTime] = useState(20);
    const [daysOfWeek, setDaysOfWeek] = useState<BusinessHoursInput[]>([]);
    const [slotInfo, setSlotInfo] = useState<DateClickTouchArg | null>(null);
    const [slotInfoPopover, setSlotInfoPopover] = useState<boolean | null>(null);
    const [contextMenu, setContextMenu] = React.useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);
    const [loading, setLoading] = useState(true);

    const isGridWeek = Boolean(view === "timeGridWeek");
    const isRTL = theme.direction === "rtl";
    const isLgScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('xl'));
    const openingHours = agendaConfig?.openingHours[0];
    const calendarHeight = !isMobile ? "80vh" : window.innerHeight - (window.innerHeight / (Math.trunc(window.innerHeight / 122)));

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

    const handleNavLinkDayClick = (date: Date) => {
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
            action === "onPreConsultation" &&
            ["FINISHED", "ON_GOING", "PENDING"].includes(eventMenu.status.key) ||
            action === "onLeaveWaitingRoom" &&
            eventMenu.status.key !== "WAITING_ROOM" ||
            action === "onCancel" &&
            (eventMenu.status.key === "CANCELED" || eventMenu.status.key === "FINISHED" || eventMenu.status.key === "ON_GOING") ||
            action === "onDelete" &&
            (eventMenu.status.key === "FINISHED" || eventMenu.status.key === "ON_GOING") ||
            action === "onMove" &&
            (moment().isAfter(eventMenu.time) || ["FINISHED", "ON_GOING"].includes(eventMenu.status.key)) ||
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
        onSwipedLeft: () => {
            handleClickDateNext();
        },
        onSwipedRight: () => {
            handleClickDatePrev();
        },
        preventScrollOnSwipe: true
    });

    useEffect(() => {
        let days: BusinessHoursInput[] = [];
        if (openingHours) {
            Object.entries(openingHours).forEach((openingHours: any) => {
                openingHours[1].forEach((openingHour: { start_time: string, end_time: string }) => {
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
        if (calendarEl) {
            const calendarApi = (calendarEl as FullCalendar).getApi();
            if (currentDate.fallback) {
                calendarApi.gotoDate(currentDate.date);
            }
        }
    }, [currentDate]); // eslint-disable-line react-hooks/exhaustive-deps

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
        setTimeout(() => {
            setEvents(appointments);
        })
    }, [appointments]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        setEventGroupByDay(sortedData);
    }, [sortedData]); // eslint-disable-line react-hooks/exhaustive-deps

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
                                {...{spinner, refs, mutateAgenda}}
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
                    ) : (!loading && view !== "listWeek") && (
                        <Box position="relative" {...handlers} style={{touchAction: 'pan-y'}}>
                            <FullCalendar
                                weekends
                                editable
                                direction={isRTL ? "rtl" : "ltr"}
                                droppable
                                timeZone={"local"}
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
                                allDayContent={() => ""}
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
                                            if (popover && popover.length > 0) {
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
                                    OnAddAppointment("add-quick");
                                    OnSelectDate(info);
                                    /*setTimeout(() => {
                                        setSlotInfoPopover(true);
                                    }, isMobile ? 100 : 0);*/
                                }}
                                showNonCurrentDates={true}
                                rerenderDelay={8}
                                height={calendarHeight}
                                initialDate={currentDate.date}
                                slotMinTime={getSlotsFormat(slotMinTime)}
                                slotMaxTime={getSlotsFormat(slotMaxTime)}
                                businessHours={daysOfWeek}
                                firstDay={doctor_country?.code === "dz" ? 0 : 1}
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
                                    OnAddAppointment("add-quick");
                                    OnSelectDate(slotInfo);
                                }} disableRipple>
                                    <FastForwardOutlinedIcon/>
                                    {translation('add-quick')}
                                </MenuItem>
                                <MenuItem onClick={() => {
                                    setSlotInfoPopover(false);
                                    OnAddAppointment("add-complete");
                                    OnSelectDate(slotInfo);
                                }} disableRipple>
                                    <AddOutlinedIcon/>
                                    {translation('add-complete')}
                                </MenuItem>
                            </StyledMenu>}

                            <Menu
                                open={contextMenu !== null}
                                onClose={handleClose}
                                anchorReference="anchorPosition"
                                slotProps={{
                                    paper: {
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
                                        }
                                    }
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
                                }}>
                                {CalendarContextMenu.filter(data => !MenuContextlog(data.action, events.find(event => event.id === eventMenu) as EventModal)).map((v: any) => (
                                        <IconButton
                                            key={uniqueId()}
                                            onClick={() => {
                                                const appointment = events.find(event => event.id === eventMenu) as EventModal;
                                                const event = {
                                                    publicId: appointment.id,
                                                    extendedProps: {
                                                        ...appointment
                                                    }
                                                }
                                                OnMenuActions(v.action, event);
                                                handleClose();
                                            }}
                                            className="popover-item">
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

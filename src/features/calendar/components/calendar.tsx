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
import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, {DateClickTouchArg} from "@fullcalendar/interaction";
import Typography from "@mui/material/Typography";
import moment from "moment-timezone";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {
    AddAppointmentCardData,
    agendaSelector,
    CalendarContextMenu, ContextMenuModel,
    DayOfWeek,
    Event,
    Header,
    setCurrentDate, setView,
    SlotFormat,
    TableHead
} from "@features/calendar";
import dynamic from "next/dynamic";
import {NoDataCard} from "@features/card";
import {uniqueId} from "lodash";
import {BusinessHoursInput, DatesSetArg} from "@fullcalendar/core";
import {useSwipeable} from "react-swipeable";
import FastForwardOutlinedIcon from "@mui/icons-material/FastForwardOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {StyledMenu} from "@features/buttons";
import {alpha} from "@mui/material/styles";
import {MobileContainer} from "@lib/constants";
import {motion} from "framer-motion";
import {useTranslation} from "next-i18next";
import {prepareContextMenu} from "@lib/hooks";
import Can, {AbilityContext} from "@features/casl/can";

const Otable = dynamic(() => import('@features/table/components/table'));

function Calendar({...props}) {
    const {
        isBeta,
        calendarRef,
        events: appointments,
        OnRangeChange,
        spinner,
        roles,
        refs,
        t: translation,
        sortedData,
        doctor_country,
        OnViewChange = null,
        OnAddAppointment,
        OnSelectEvent,
        OnSelectDate,
        OnRangeDateSelect,
        OnAddAbsence,
        OnDeleteAbsence,
        OnEventChange,
        OnMenuActions,
        mutate: mutateAgenda
    } = props;

    const dispatch = useAppDispatch();
    const theme = useTheme();
    const {t} = useTranslation('common');
    const isMobile = useMediaQuery(`(max-width:${MobileContainer}px)`);
    const isLgScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('xl'));
    const ability = useContext(AbilityContext);

    const {
        view,
        currentDate,
        config: agendaConfig,
        sortedData: groupSortedData,
        absences
    } = useAppSelector(agendaSelector);

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
    const [contextMenuHeader, setContextMenuHeader] = React.useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [hiddenDays, setHiddenDays] = useState([]);

    const isGridWeek = Boolean(view === "timeGridWeek");
    const isRTL = theme.direction === "rtl";
    const openingHours = agendaConfig?.openingHours[0];
    const calendarHeight = !isMobile ? (window.innerHeight > 900 ? "88vh" : "84.5vh") : window.innerHeight - (window.innerHeight / (Math.trunc(window.innerHeight / 122)));

    const handleOnSelectEvent = useCallback((value: any) => {
        OnSelectEvent(value);
    }, [OnSelectEvent]);

    const handleAddAbsence = useCallback((currentDate: Date) => {
        OnAddAbsence(currentDate);
    }, [OnAddAbsence]);

    const handleDeleteAbsence = useCallback((currentDate: Date, deleteDay: boolean) => {
        OnDeleteAbsence(currentDate, deleteDay);
    }, [OnDeleteAbsence]);

    const handleRangeChange = useCallback((event: DatesSetArg) => {
        OnRangeChange(event);
    }, [OnRangeChange]);

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
            if (!['path', 'svg'].includes((jsEvent.target as any)?.nodeName)) {
                calendarApi.gotoDate(date);
                dispatch(setView("timeGridDay"));
                dispatch(setCurrentDate({date, fallback: false}));
            } else {
                dispatch(setCurrentDate({date, fallback: false}));
            }
        }
    }

    const handleTableEvent = (action: string, eventData: EventModal, event?: any) => {
        switch (action) {
            case "OPEN-POPOVER":
                setEventMenu(eventData.id);
                handleContextMenu(event);
                break;
            default:
                const eventUpdated = {
                    publicId: eventData.id,
                    extendedProps: {
                        ...eventData
                    }
                }
                OnMenuActions(action, eventUpdated);
                break;
        }
    }

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
                openingHours[1].forEach((openingHour: {
                    start_time: string,
                    end_time: string
                }) => {
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
            setTimeout(() => setLoading(false));
        }
    }, [openingHours]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = (calendarEl as FullCalendar).getApi();
            if (currentDate.fallback) {
                queueMicrotask(() => {
                    calendarApi.gotoDate(currentDate.date);
                });
            }
        }
    }, [currentDate]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const calendarEl = calendarRef.current;
        if (calendarEl && prevView.current !== "listWeek") {
            const calendarApi = (calendarEl as FullCalendar).getApi();
            if (calendarApi.view.type !== view) {
                queueMicrotask(() => {
                    calendarApi.changeView(view as string);
                })
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
        <Box bgcolor="common.white">
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
                                handleEvent={(action: string, eventData: EventModal, event: any) =>
                                    handleTableEvent(action, eventData, event)
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
                                {...{hiddenDays}}
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
                                datesSet={handleRangeChange}
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
                                    <motion.div
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        transition={{ease: "easeOut", duration: .2}}>
                                        <Event
                                            {...{
                                                isBeta,
                                                open,
                                                event,
                                                openingHours,
                                                OnMenuActions,
                                                roles,
                                                view
                                            }}
                                            t={translation}/>
                                    </motion.div>
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
                                dayHeaderContent={(event) => {
                                    const datEvents = groupSortedData.find(events => events.date === moment(event.date).format("DD-MM-YYYY"))?.events?.length ?? 0;
                                    return Header({
                                        t,
                                        isGridWeek,
                                        event,
                                        dispatch,
                                        datEvents,
                                        absences,
                                        isMobile,
                                        currentDate,
                                        contextMenuHeader,
                                        setContextMenuHeader,
                                        hiddenDays,
                                        setHiddenDays,
                                        OnAddAbsence: () => handleAddAbsence(currentDate.date),
                                        OnDeleteAbsence: (duration: any) => {
                                            const day: any = absences.find((absence: any) => moment(currentDate.date).isBetween(moment(absence.start), moment(absence.end), "minutes", '[]'));
                                            const deleteCurrentDayOnly = duration.days > 1 || (duration.days === 1 && duration.hours >= 1);
                                            handleDeleteAbsence(day?.uuid, deleteCurrentDayOnly);
                                        }
                                    })
                                }}
                                eventClick={(eventArg) => (eventArg.event._def.ui.display !== "background" && !eventArg.event._def.extendedProps.patient?.isArchived) && handleOnSelectEvent(eventArg.event._def)}
                                eventChange={(info) => !info.event._def.allDay && OnEventChange(info)}
                                {...(ability.can('manage', 'agenda', 'agenda__appointment__create') && {
                                        dateClick: (info) => {
                                            setSlotInfo(info as DateClickTouchArg);
                                            OnAddAppointment("add-quick");
                                            OnSelectDate(info);
                                        }
                                    }
                                )}
                                select={(eventArg) => OnRangeDateSelect(eventArg)}
                                showNonCurrentDates={true}
                                selectMinDistance={10}
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
                                slotProps={{
                                    paper: {
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
                                    }
                                }}>
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
                        </Box>
                    )}
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
                        {CalendarContextMenu.filter(data =>
                            !prepareContextMenu(data.action,
                                (view === "listWeek" ? eventGroupByDay.reduce((eventsData: EventCalendarModel[], data) =>
                                    [...(eventsData ?? []), ...data?.events], []) : events).find(event =>
                                    event.id === eventMenu) as EventModal)).map((context: ContextMenuModel) => (
                                <Can key={uniqueId()}
                                     I={"manage"}
                                     a={context.feature as any} {...(context.permission !== "*" && {field: context.permission})}>
                                    <IconButton
                                        onClick={() => {
                                            const appointment = events.find(event => event.id === eventMenu) as EventModal;
                                            const event = {
                                                publicId: appointment.id,
                                                extendedProps: {
                                                    ...appointment
                                                }
                                            }
                                            OnMenuActions(context.action, event);
                                            handleClose();
                                        }}
                                        className="popover-item">
                                        {context.icon}
                                        <Typography fontSize={15} sx={{color: "#fff"}}>
                                            {translation(`${context.title}`, {ns: 'common'})}
                                        </Typography>
                                    </IconButton>
                                </Can>
                            )
                        )}
                    </Menu>
                </CalendarStyled>
            </RootStyled>
        </Box>
    );
}

export default Calendar;

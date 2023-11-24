import FullCalendar from "@fullcalendar/react"; // => request placed at the top
import {
    Backdrop,
    Box, Chip,
    ClickAwayListener,
    IconButton,
    Menu,
    MenuItem, Popover,
    Theme,
    useMediaQuery,
    useTheme
} from "@mui/material";
import RootStyled from "./overrides/rootStyled";
import CalendarStyled from "./overrides/calendarStyled";
import React, {useCallback, useEffect, useRef, useState} from "react";
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
import {AppointmentPopoverCard, NoDataCard} from "@features/card";
import {uniqueId} from "lodash";
import {BusinessHoursInput} from "@fullcalendar/core";
import {useSwipeable} from "react-swipeable";
import FastForwardOutlinedIcon from "@mui/icons-material/FastForwardOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {StyledMenu} from "@features/buttons";
import {alpha} from "@mui/material/styles";
import {MobileContainer} from "@lib/constants";
import {motion} from "framer-motion";
import {useTranslation} from "next-i18next";
import {useRequestQueryMutation} from "@lib/axios";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useRouter} from "next/router";

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
        OnLeaveWaitingRoom,
        OnConfirmEvent,
        OnMoveEvent,
        OnWaitingRoom,
        OnViewChange = null,
        OnAddAppointment,
        OnSelectEvent,
        OnSelectDate,
        OnRangeDateSelect,
        OnOpenPatient,
        OnEventChange,
        OnMenuActions,
        mutate: mutateAgenda
    } = props;

    const dispatch = useAppDispatch();
    const theme = useTheme();
    const {t} = useTranslation('common');
    const isMobile = useMediaQuery(`(max-width:${MobileContainer}px)`);
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const router = useRouter();
    const isLgScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('xl'));

    const {config: agenda, openViewDrawer} = useAppSelector(agendaSelector);

    const {view, currentDate, config: agendaConfig, sortedData: groupSortedData} = useAppSelector(agendaSelector);

    const prevView = useRef(view);

    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const [appointmentData, setAppointmentData] = React.useState<AppointmentModel | null>(null);
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
    const [isEventDragging, setIsEventDragging] = useState(false);

    const isGridWeek = Boolean(view === "timeGridWeek");
    const isRTL = theme.direction === "rtl";
    const openingHours = agendaConfig?.openingHours[0];
    const calendarHeight = !isMobile ? "80vh" : window.innerHeight - (window.innerHeight / (Math.trunc(window.innerHeight / 122)));
    const open = Boolean(anchorEl);
    let timeoutId: any

    const {trigger: triggerAppointmentTooltip} = useRequestQueryMutation("/agenda/appointment/tooltip");

    const handleOnSelectEvent = useCallback((value: any) => {
        OnSelectEvent(value);
    }, [OnSelectEvent]);

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
        /*const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = (calendarEl as FullCalendar).getApi();
            calendarApi.gotoDate(date);
            dispatch(setView("timeGridDay"));
            dispatch(setCurrentDate({date, fallback: false}));
        }*/
    }

    const handleNavLinkWeekClick = (date: Date, jsEvent: UIEvent) => {
        console.log("handleNavLinkWeekClick", jsEvent);
    }

    const handleTableEvent = (action: string, eventData: EventModal) => {
        switch (action) {
            case "showEvent":
                handleOnSelectEvent(eventData);
                break;
            case "showPatient":
                OnOpenPatient(eventData);
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
            (moment().format("DD-MM-YYYY") !== moment(eventMenu.time).format("DD-MM-YYYY") || eventMenu.patient?.isArchived ||
                ["PENDING", "WAITING_ROOM", "ON_GOING", "FINISHED"].includes(eventMenu.status.key)) ||
            action === "onConsultationView" &&
            (!["FINISHED", "ON_GOING"].includes(eventMenu.status.key) || roles.includes('ROLE_SECRETARY')) ||
            action === "onConsultationDetail" &&
            (["FINISHED", "ON_GOING", "PENDING"].includes(eventMenu.status.key) || roles.includes('ROLE_SECRETARY') || eventMenu.patient?.isArchived) ||
            action === "onPreConsultation" &&
            (["FINISHED", "ON_GOING", "PENDING"].includes(eventMenu.status.key) || eventMenu.patient?.isArchived) ||
            action === "onLeaveWaitingRoom" &&
            eventMenu.status.key !== "WAITING_ROOM" ||
            action === "onCancel" &&
            (["CANCELED", "PATIENT_CANCELED", "FINISHED", "ON_GOING"].includes(eventMenu.status.key) || eventMenu.patient?.isArchived) ||
            action === "onDelete" &&
            ["FINISHED", "ON_GOING"].includes(eventMenu.status.key) ||
            action === "onMove" &&
            (moment().isAfter(eventMenu.time) || ["FINISHED", "ON_GOING"].includes(eventMenu.status.key) || eventMenu.patient?.isArchived) ||
            action === "onPatientNoShow" &&
            ((moment().isBefore(eventMenu.time) || eventMenu.status.key === "ON_GOING") || eventMenu.status.key === "FINISHED" || eventMenu.patient?.isArchived) ||
            action === "onConfirmAppointment" &&
            eventMenu.status.key !== "PENDING" ||
            action === "onReschedule" &&
            ((moment().isBefore(eventMenu.time) && eventMenu.status.key !== "FINISHED") || eventMenu.patient?.isArchived) ||
            ["onPatientDetail", "onAddConsultationDocuments"].includes(action) &&
            eventMenu.patient?.isArchived
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

    const isHorizontal = () => {
        if (view === "timeGridDay")
            return 'left';
        else if (moment(appointmentData?.dayDate, "DD-MM-YYYY").weekday() > 4)
            return "center";
        else return 'right';
    }

    const handlePopoverClose = () => {
        setAnchorEl(null);
        clearTimeout(timeoutId);
    }

    useEffect(() => {
        if (anchorEl !== null && (openViewDrawer || isEventDragging)) {
            handlePopoverClose()
        }
    }, [anchorEl, isEventDragging]); // eslint-disable-line react-hooks/exhaustive-deps

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
                calendarApi.gotoDate(currentDate.date);
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
                                navLinkWeekClick={handleNavLinkWeekClick}
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
                                                isEventDragging,
                                                setAppointmentData,
                                                event, openingHours,
                                                view, isMobile, anchorEl, setAnchorEl
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
                                eventDragStart={() => setIsEventDragging(true)}
                                eventDragStop={() => setIsEventDragging(false)}
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
                                        isGridWeek,
                                        event,
                                        datEvents,
                                        isMobile,
                                        contextMenuHeader,
                                        setContextMenuHeader,
                                        t
                                    })
                                }}
                                eventClick={(eventArg) => !eventArg.event._def.extendedProps.patient?.isArchived && handleOnSelectEvent(eventArg.event._def)}
                                {...(!isEventDragging && {
                                    eventMouseEnter: (info) => {
                                        if (timeoutId !== undefined) {
                                            clearTimeout(timeoutId);
                                        }

                                        timeoutId = setTimeout(() => {
                                            setAppointmentData(null);
                                            const query = `?mode=tooltip&appointment=${info.event._def.publicId}&start_date=${moment(info.event._def.extendedProps.time).format("DD-MM-YYYY")}&end_date=${moment(info.event._def.extendedProps.time).format("DD-MM-YYYY")}&format=week`
                                            triggerAppointmentTooltip({
                                                method: "GET",
                                                url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${router.locale}${query}`
                                            }, {
                                                onSuccess: (result) => {
                                                    const appointmentData = (result?.data as HttpResponse)?.data as AppointmentModel[];
                                                    if (appointmentData.length > 0) {
                                                        setAnchorEl(info.jsEvent.target as any);
                                                        setAppointmentData(appointmentData[0]);
                                                    }
                                                }
                                            })
                                        }, 1000);

                                    }
                                })}
                                eventMouseLeave={handlePopoverClose}
                                eventChange={(info) => !info.event._def.allDay && OnEventChange(info)}
                                dateClick={(info) => {
                                    setSlotInfo(info as DateClickTouchArg);
                                    OnAddAppointment("add-quick");
                                    OnSelectDate(info);
                                }}
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

                            <Popover
                                id="mouse-over-popover"
                                onMouseLeave={handlePopoverClose}
                                sx={{
                                    pointerEvents: 'none',
                                    zIndex: 900
                                }}
                                open={open}
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: view === "timeGridDay" ? 'bottom' : 'top',
                                    horizontal: isHorizontal()
                                }}
                                onClose={() => setAnchorEl(null)}
                                disableRestoreFocus>
                                <motion.div
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    transition={{ease: "linear", duration: .2}}>
                                    {appointmentData?.new &&
                                        <Chip label={translation("event.new", {ns: 'common'})}
                                              sx={{
                                                  position: "absolute",
                                                  right: 4,
                                                  top: 4,
                                                  fontSize: 10
                                              }}
                                              size="small"
                                              color={"primary"}/>}
                                    <AppointmentPopoverCard
                                        eventO={(event: any) => setAnchorEl(event.target as any)}
                                        {...{isBeta, t: translation}}
                                        style={{width: "300px", border: "none"}}
                                        data={appointmentData}/>
                                </motion.div>
                            </Popover>
                        </Box>
                    )}
                </CalendarStyled>
            </RootStyled>
        </Box>
    );
}

export default Calendar;

import {RootStyled} from "@features/toolbar";
import {
    Badge,
    Box,
    Button,
    Hidden,
    IconButton,
    Stack,
    Tooltip, Typography,
    useTheme
} from "@mui/material";

import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import {useTranslation} from "next-i18next";
import TodayIcon from "@themes/overrides/icons/todayIcon";
import DayIcon from "@themes/overrides/icons/dayIcon";
import WeekIcon from "@themes/overrides/icons/weekIcon";
import GridIcon from "@themes/overrides/icons/gridIcon";
import CalendarIcon from "@themes/overrides/icons/calendarIcon";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {agendaSelector, setView, TableHead} from "@features/calendar";
import Zoom from '@mui/material/Zoom';
import moment from "moment-timezone";
import {CalendarViewButton, CalendarAddButton} from "@features/buttons";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {LoadingScreen} from "@features/loadingScreen";
import PendingTimerIcon from "@themes/overrides/icons/pendingTimerIcon";
import {Dialog} from "@features/dialog";
import {configSelector} from "@features/base";
import {Otable} from "@features/table";
import {appointmentGroupByDate, appointmentPrepareEvent} from "@lib/hooks";
import {DefaultViewMenu} from "@features/menu";

function CalendarToolbar({...props}) {
    const {
        OnToday,
        OnAddAppointment,
        OnClickDatePrev,
        OnClickDateNext,
        OnSelectEvent,
        OnMoveEvent,
        OnWaitingRoom,
        OnConfirmEvent,
        timeRange
    } = props;
    const theme = useTheme();
    const dispatch = useAppDispatch();
    let pendingEvents: MutableRefObject<EventModal[]> = useRef([]);
    const isRTL = theme.direction === "rtl";

    const {t, ready} = useTranslation('agenda');
    const {direction} = useAppSelector(configSelector);
    const {view, currentDate, pendingAppointments} = useAppSelector(agendaSelector);

    const [pendingDialog, setPendingDialog] = useState(false);
    const VIEW_OPTIONS = [
        {value: "timeGridDay", label: "Day", text: "Jour", icon: TodayIcon},
        {value: "timeGridWeek", label: "Weeks", text: "Semaine", icon: WeekIcon},
        {value: "dayGridMonth", label: "Months", text: "Mois", icon: DayIcon},
        {value: "listWeek", label: "Agenda", text: "List", icon: GridIcon}
    ];

    const handleViewChange = (view: string) => {
        dispatch(setView(view));
    }

    const handleTableEvent = (action: string, eventData: any) => {
        const event: any = {
            publicId: eventData.id,
            extendedProps: {
                ...eventData
            }
        }
        setPendingDialog(false);
        switch (action) {
            case "onPatientDetail":
                OnSelectEvent(event);
                break;
            case "waitingRoom":
                OnWaitingRoom(event);
                break;
            case "onConfirmAppointment":
                OnConfirmEvent(event);
                break;
            case "onMove":
                OnMoveEvent(event);
                break;
        }
    }

    useEffect(() => {
        pendingEvents.current = [];
        pendingAppointments?.map(event => pendingEvents.current.push(appointmentPrepareEvent(event, false, [])))
    }, [pendingAppointments]);

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <RootStyled {...props}>
            <Box>
                <Hidden smDown>
                    <Box sx={{
                        display: "flex",
                        alignItems: "center"
                    }}>
                        <Tooltip title={t("today", {ns: "common"})} TransitionComponent={Zoom}>
                            <IconButton
                                onClick={OnToday}
                                aria-label="Calendar"
                                sx={{border: "1px solid", mr: 1, color: "primary.main"}}>
                                <CalendarIcon/>
                            </IconButton>
                        </Tooltip>

                        <Box
                            className="action-header-main"
                            sx={{
                                "& .MuiSvgIcon-root": {
                                    width: 16,
                                    height: 16
                                },
                                svg: {
                                    transform: isRTL ? "rotate(180deg)" : "rotate(0deg)",
                                },
                            }}>
                            <IconButton
                                color={"primary"}
                                onClick={OnClickDatePrev}
                                aria-label="back">
                                <ArrowBackIosNewIcon fontSize="small"/>
                            </IconButton>
                            <IconButton
                                color={"primary"}
                                onClick={OnClickDateNext}
                                aria-label="next">
                                <ArrowForwardIosIcon fontSize="small"/>
                            </IconButton>
                        </Box>

                        <Button className="Current-date" variant="text-transparent">
                            <Typography variant="body2" component={"span"} fontWeight={"bold"}>
                                {view === 'timeGridWeek' ?
                                    `${moment(timeRange.start, "DD/MM/YYYY").format(`DD ${timeRange.start.split('-')[1] !== moment(timeRange.end, "DD/MM/YYYY").subtract(1, "day").format("MM") ? 'MMM' : ''} ${timeRange.start.split('-')[2] !== moment(timeRange.end, "DD/MM/YYYY").subtract(1, "day").format("YYYY") ? 'YYYY' : ''}`)} - ${moment(timeRange.end, "DD/MM/YYYY").subtract(1, "day").format("DD MMM YYYY")}` :
                                    moment(currentDate.date.toLocaleDateString("fr"), "DD/MM/YYYY").format(view === 'dayGridMonth' || view === 'timeGridWeek' ? 'MMMM YYYY' : 'Do MMMM, YYYY')}
                            </Typography>
                        </Button>

                        {pendingAppointments.length > 0 &&
                            <Button sx={{ml: 2, p: "6px 12px"}}
                                    onClick={() => setPendingDialog(true)}
                                    startIcon={<PendingTimerIcon/>}
                                    endIcon={<Badge
                                        sx={{m: 1}}
                                        badgeContent={pendingAppointments.length}
                                        color="warning"
                                    />}
                                    variant={"contained"}>
                                {t("pending")}
                            </Button>}
                    </Box>
                </Hidden>

                <Hidden smUp>
                    <Stack direction={"row"} sx={{
                        position: "absolute",
                        top: "0.6rem",
                        left: "0.5rem"
                    }}>
                        <Box
                            className="action-header-main"
                            sx={{
                                "& .MuiSvgIcon-root": {
                                    width: 16,
                                    height: 16
                                },
                                svg: {
                                    transform: isRTL ? "rotate(180deg)" : "rotate(0deg)",
                                },
                            }}
                        >
                            <IconButton
                                onClick={OnClickDatePrev}
                                aria-label="back"
                            >
                                <ArrowBackIosNewIcon fontSize="small"/>
                            </IconButton>
                            <IconButton
                                onClick={OnClickDateNext}
                                aria-label="next"
                            >
                                <ArrowForwardIosIcon fontSize="small"/>
                            </IconButton>
                        </Box>
                        <Button className="Current-date"
                                variant="text-transparent">
                            <Typography variant="body2" component={"span"}>
                                {moment(currentDate.date).format(view === 'dayGridMonth' || view === 'timeGridWeek' ? 'MMMM' : 'Do MMMM')}
                            </Typography>
                        </Button>
                    </Stack>
                </Hidden>
            </Box>

            <Hidden smUp>
                <Stack direction="row" spacing={1.5} justifyContent={"flex-end"} sx={{margin: "0.5rem 0"}}>
                    <CalendarViewButton
                        {...{view, t}}
                        sx={{
                            "& .MuiButton-startIcon>*:nth-of-type(1)": {
                                fontSize: 20
                            }
                        }}
                        views={VIEW_OPTIONS}
                        onSelect={(viewOption: string) => handleViewChange(viewOption)}
                    />
                </Stack>
            </Hidden>
            <Hidden smDown>
                <Stack direction="row" spacing={1.5}>
                    <CalendarViewButton
                        {...{view, t}}
                        sx={{
                            "& .MuiButton-startIcon>*:nth-of-type(1)": {
                                fontSize: 20
                            }
                        }}
                        views={VIEW_OPTIONS}
                        onSelect={(viewOption: string) => handleViewChange(viewOption)}
                    />

                    <DefaultViewMenu {...{view}} onViewChange={handleViewChange}/>

                    <CalendarAddButton
                        {...{t}}
                        onClickEvent={OnAddAppointment}
                    />
                </Stack>
            </Hidden>

            <Dialog
                size={"lg"}
                sx={{
                    [theme.breakpoints.down('sm')]: {
                        "& .MuiDialogContent-root": {
                            padding: 1
                        }
                    }
                }}
                color={theme.palette.primary.main}
                contrastText={theme.palette.primary.contrastText}
                dialogClose={() => {
                    setPendingDialog(false);
                }}
                action={() => <Otable
                    {...{t, pendingData: true}}
                    maxHeight={`calc(100vh - 180px)`}
                    headers={TableHead.filter((head: any) => head.id !== "motif")}
                    handleEvent={handleTableEvent}
                    rows={appointmentGroupByDate(pendingEvents.current)}
                    from={"calendar"}
                />}
                dir={direction}
                open={pendingDialog}
                title={t(`dialogs.pending-dialog.title`)}
            />
        </RootStyled>
    );
}

export default CalendarToolbar;

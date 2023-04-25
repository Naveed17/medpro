import {RootStyled} from "@features/toolbar";
import {
    Badge,
    Box,
    Button,
    Hidden,
    IconButton,
    Stack,
    SvgIcon,
    Tooltip, Typography,
    useTheme
} from "@mui/material";

import React, {MutableRefObject, useEffect, useRef, useState} from "react";
import {useTranslation} from "next-i18next";
import TodayIcon from "@themes/overrides/icons/todayIcon";
import DayIcon from "@themes/overrides/icons/dayIcon";
import WeekIcon from "@themes/overrides/icons/weekIcon";
import GridIcon from "@themes/overrides/icons/gridIcon";
import ToggleButtonStyled from "./overrides/toggleButtonStyled";
import CalendarIcon from "@themes/overrides/icons/calendarIcon";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
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
import {appointmentGroupByDate, appointmentPrepareEvent} from "@app/hooks";

function CalendarToolbar({...props}) {
    const {
        OnToday,
        OnAddAppointment,
        OnClickDatePrev,
        OnClickDateNext,
        OnSelectEvent,
        OnMoveEvent,
        OnWaitingRoom,
        OnConfirmEvent
    } = props;
    const theme = useTheme();
    const dispatch = useAppDispatch();
    let pendingEvents: MutableRefObject<EventModal[]> = useRef([]);
    const isRTL = theme.direction === "rtl";

    const {t, ready} = useTranslation('agenda');
    const {direction} = useAppSelector(configSelector);
    const {view, currentDate, pendingAppointments} = useAppSelector(agendaSelector);

    const VIEW_OPTIONS = [
        {value: "timeGridDay", label: "Day", text: "Jour", icon: TodayIcon},
        {value: "timeGridWeek", label: "Weeks", text: "Semaine", icon: DayIcon},
        {value: "dayGridMonth", label: "Months", text: "Mois", icon: WeekIcon},
        {value: "listWeek", label: "Agenda", text: "List", icon: GridIcon}
    ];

    const [pendingDialog, setPendingDialog] = useState(false);

    const handleViewChange = (view: string) => {
        dispatch(setView(view));
    }

    const handleTableEvent = (action: string, eventData: EventModal) => {
        setPendingDialog(false);
        switch (action) {
            case "showEvent":
                OnSelectEvent(eventData);
                break;
            case "waitingRoom":
                OnWaitingRoom(eventData);
                break;
            case "confirmEvent":
                OnConfirmEvent(eventData);
                break;
            case "moveEvent":
                OnMoveEvent(eventData);
                break;
        }
    };
    useEffect(() => {
        pendingEvents.current = [];
        pendingAppointments?.map(event => pendingEvents.current.push(appointmentPrepareEvent(event, false, [])))
    }, [pendingAppointments]);

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

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

                        <Button className="Current-date" variant="text-transparent">
                            <Typography variant="body2" component={"span"}>
                                {moment(currentDate.date.toLocaleDateString("fr"), "DD/MM/YYYY").format(view === 'dayGridMonth' || view === 'timeGridWeek' ? 'MMMM, YYYY' : 'Do MMMM, YYYY')}
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
                        {...{view}}
                        sx={{
                            "& .MuiButton-startIcon>*:nth-of-type(1)": {
                                fontSize: 20
                            }
                        }}
                        views={VIEW_OPTIONS}
                        onSelect={(viewOption: string) => viewOption !== "listWeek" && handleViewChange(viewOption)}
                    />

                    {/*<CalendarAddButton
                        sx={{
                            padding: "8px",
                            "& .MuiButton-startIcon": {
                                margin: 0
                            },
                            "& .MuiButton-startIcon>*:nth-of-type(1)": {
                                fontSize: 16
                            }
                        }}
                        onClickEvent={OnAddAppointment}
                    />*/}
                </Stack>
            </Hidden>
            <Hidden smDown>
                <Stack direction="row" spacing={1.5}>
                    {VIEW_OPTIONS.map((viewOption) => (
                        <Tooltip key={viewOption.value}
                                 TransitionComponent={Zoom}
                                 onClick={() => handleViewChange(viewOption.value)}
                                 title={t(`times.${viewOption.label.toLowerCase()}`, {ns: "common"})}>
                            <ToggleButtonStyled
                                value="dayGridMonth"
                                sx={{
                                    width: 37, height: 37, padding: 0, marginTop: '2px!important',
                                    ...(viewOption.value === view && {background: theme.palette.primary.main})
                                }}>
                                <SvgIcon component={viewOption.icon} width={20} height={20}
                                         htmlColor={viewOption.value === view ? theme.palette.background.paper : theme.palette.text.primary}/>
                            </ToggleButtonStyled>
                        </Tooltip>
                    ))}
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
                    {...{t}}
                    maxHeight={`calc(100vh - 180px)`}
                    headers={TableHead}
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

import {RootStyled} from "@features/toolbar";
import {
    Badge,
    Box,
    Button, DialogActions,
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
import {configSelector, dashLayoutSelector} from "@features/base";
import {Otable} from "@features/table";
import {appointmentGroupByDate, appointmentPrepareEvent, useMedicalEntitySuffix} from "@lib/hooks";
import {DefaultViewMenu} from "@features/menu";
import {DuplicateDetected, duplicatedSelector, resetDuplicated, setDuplicated} from "@features/duplicateDetected";
import CloseIcon from "@mui/icons-material/Close";
import IconUrl from "@themes/urlIcon";
import {useRequestMutation} from "@lib/axios";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {LoadingButton} from "@mui/lab";

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
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {data: session} = useSession();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    let pendingEvents: MutableRefObject<EventModal[]> = useRef([]);
    const isRTL = theme.direction === "rtl";

    const {t, ready} = useTranslation('agenda');
    const {direction} = useAppSelector(configSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const {view, currentDate, pendingAppointments} = useAppSelector(agendaSelector);
    const {duplications, duplicationSrc, openDialog: duplicateDetectedDialog} = useAppSelector(duplicatedSelector);

    const [pendingDialog, setPendingDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const VIEW_OPTIONS = [
        {value: "timeGridDay", label: "Day", text: "Jour", icon: TodayIcon},
        {value: "timeGridWeek", label: "Weeks", text: "Semaine", icon: DayIcon},
        {value: "dayGridMonth", label: "Months", text: "Mois", icon: WeekIcon},
        {value: "listWeek", label: "Agenda", text: "List", icon: GridIcon}
    ];

    const {trigger: mergeDuplicationsTrigger} = useRequestMutation(null, "/duplications/merge");

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
    }

    const handleMergeDuplication = () => {
        setLoading(true);
        const params = new FormData();
        duplications && params.append('duplicatedPatients', JSON.stringify(duplications.map(duplication => duplication.uuid).join(",")));
        Object.entries(duplicationSrc as PatientModel).forEach(
            object => params.append(object[0].split(/(?=[A-Z])/).map((key: string) => key.toLowerCase()).join("_"), JSON.stringify(object[1] ?? "")));

        medicalEntityHasUser && mergeDuplicationsTrigger({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${duplicationSrc?.uuid}/merge-duplications/${router.locale}`,
            data: params,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        }).then((data) => {
            setLoading(false);
            console.log("data", data);
            dispatch(setDuplicated({openDialog: false}));
            dispatch(resetDuplicated());
        })
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
                    <DefaultViewMenu/>
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

            <Dialog
                {...{
                    sx: {
                        minHeight: 340,
                    },
                }}
                size={"lg"}
                color={theme.palette.primary.main}
                contrastText={theme.palette.primary.contrastText}
                dialogClose={() => {
                    dispatch(setDuplicated({openDialog: false}));
                }}
                action={() => <DuplicateDetected src={duplicationSrc} data={duplications}/>}
                actionDialog={
                    <DialogActions
                        sx={{
                            justifyContent: "space-between",
                            width: "100%",
                            "& .MuiDialogActions-root": {
                                div: {
                                    width: "100%",
                                },
                            },
                        }}>
                        <Stack
                            direction={"row"}
                            justifyContent={"space-between"}
                            sx={{width: "100%"}}>
                            <Button
                                onClick={() => dispatch(setDuplicated({openDialog: false}))}
                                startIcon={<CloseIcon/>}>
                                {t("dialogs.duplication-dialog.later")}
                            </Button>
                            <Box>
                                <Button
                                    sx={{marginRight: 1}}
                                    color={"inherit"}
                                    startIcon={<CloseIcon/>}>
                                    {t("dialogs.duplication-dialog.no-duplicates")}
                                </Button>
                                <LoadingButton
                                    {...{loading}}
                                    loadingPosition="start"
                                    onClick={handleMergeDuplication}
                                    variant="contained"
                                    startIcon={<IconUrl path="ic-dowlaodfile"></IconUrl>}>
                                    {t("dialogs.duplication-dialog.save")}
                                </LoadingButton>
                            </Box>
                        </Stack>
                    </DialogActions>
                }
                open={duplicateDetectedDialog}
                title={t(`dialogs.duplication-dialog.title`)}
            />
        </RootStyled>
    );
}

export default CalendarToolbar;

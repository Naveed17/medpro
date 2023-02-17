import {NoDataCard} from "@features/card";
import React, {useState} from "react";
import {useTranslation} from "next-i18next";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {Box, Button, Typography, useMediaQuery, useTheme} from "@mui/material";
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import EventIcon from '@mui/icons-material/Event';
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {agendaSelector, AppointmentStatus, openDrawer, setAction, setSelectedEvent} from "@features/calendar";
import {BasicList} from "@features/list";
import {TabPanel} from "@features/tabPanel";
import {EventDef} from "@fullcalendar/react";
import moment from "moment-timezone";
import {useRouter} from "next/router";
import {LoadingScreen} from "@features/loadingScreen";
import {Dialog, dialogMoveSelector, setMoveDateTime} from "@features/dialog";
import {Theme} from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import Icon from "@themes/urlIcon";
import {configSelector} from "@features/base";
import {TriggerWithoutValidation} from "@app/swr/swrProvider";
import {useRequestMutation} from "@app/axios";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {useSnackbar} from "notistack";

const humanizeDuration = require("humanize-duration");

const popoverNotificationData = {
    mainIcon: <NotificationsOffIcon/>,
    title: "notification.empty",
    description: "notification.desc",
    buttonText: "notification.button",
    buttonVariant: "primary"
};

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function NotificationPopover({...props}) {
    const {onClose} = props;
    const {data: session} = useSession();
    const router = useRouter();
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

    const {t, ready} = useTranslation("common");
    const {config, pendingAppointments, selectedEvent} = useAppSelector(agendaSelector);
    const {direction} = useAppSelector(configSelector);
    const {
        date: moveDialogDate,
        time: moveDialogTime,
        selected: moveDateChanged,
        action: moveDialogAction
    } = useAppSelector(dialogMoveSelector);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {trigger: updateAppointmentTrigger} = useRequestMutation(null, "/agenda/update/appointment");
    const {trigger: updateStatusTrigger} = useRequestMutation(null, "/agenda/update/appointment/status");

    const [value, setValue] = React.useState(0);
    const [moveDialog, setMoveDialog] = useState<boolean>(false);
    const [moveDialogInfo, setMoveDialogInfo] = useState<boolean>(false);
    const [event, setEvent] = useState<EventDef | null>();
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const onMoveAppointment = () => {
        setMoveDialogInfo(false);
        const timeSplit = moveDialogTime.split(':');
        const date = moment(moveDialogDate?.setHours(parseInt(timeSplit[0]), parseInt(timeSplit[1])));
        const defEvent = {
            ...selectedEvent,
            extendedProps: {
                newDate: date,
                from: 'modal',
                duration: selectedEvent?.extendedProps.dur,
                onDurationChanged: false,
                oldDate: moment(selectedEvent?.extendedProps.time)
            }
        } as EventDef;

        setEvent(defEvent);
        setMoveDialog(true);
    }

    const handleMoveAppointment = (event: EventDef) => {
        setLoading(true);
        const form = new FormData();
        form.append('start_date', event.extendedProps.newDate.format("DD-MM-YYYY"));
        form.append('start_time',
            event.extendedProps.newDate.clone().subtract(event.extendedProps.from ? 0 : 1, 'hours').format("HH:mm"));
        const eventId = event.publicId ? event.publicId : (event as any).id;
        form.append('duration', event.extendedProps.duration);
        updateAppointmentTrigger({
            method: "PUT",
            url: `/api/medical-entity/${medical_entity.uuid}/agendas/${config?.uuid}/appointments/${eventId}/change-date/${router.locale}`,
            data: form,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            }
        }, TriggerWithoutValidation).then((result) => {
            setLoading(false);
            if ((result?.data as HttpResponse).status === "success") {
                enqueueSnackbar(t(`dialogs.move-dialog.${!event.extendedProps.onDurationChanged ?
                    "alert-msg" : "alert-msg-duration"}`), {variant: "success"});
            }
            dispatch(openDrawer({type: "view", open: false}));
            setMoveDialog(false);
            onClose();
            // update pending notifications status
            config?.mutate[1]();
        });
    }

    const onConfirmAppointment = (event: EventDef) => {
        setLoading(true);
        const appUuid = event?.publicId ? event?.publicId : (event as any)?.id;
        const form = new FormData();
        form.append('status', "1");
        return updateStatusTrigger({
            method: "PATCH",
            url: `/api/medical-entity/${medical_entity.uuid}/agendas/${config?.uuid}/appointments/${appUuid}/status/${router.locale}`,
            data: form,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        }).then(() => {
            setLoading(false);
            enqueueSnackbar(t(`dialogs.alert.confirm-appointment`), {variant: "success"});
            onClose();
            // update pending notifications status
            config?.mutate[1]();
        });
    }

    const getDuration = (date: string) => {
        const duration: any = moment.duration(moment.utc().diff(moment.utc(date, "DD-MM-YYYY HH:mm")));
        return humanizeDuration(duration, {largest: 2, round: true});
    }

    const handleNotificationAction = (action: string, event: any) => {
        const eventUpdated = {
            publicId: event?.uuid,
            title: `${event?.patient?.firstName} ${event?.patient?.lastName}`,
            extendedProps: {
                patient: event?.patient,
                dur: event?.dur,
                type: event?.type,
                status: AppointmentStatus[event?.status],
                time: moment(`${event.dayDate} ${event.startTime}`, "DD-MM-YYYY HH:mm").toDate()
            }
        } as any;
        switch (action) {
            case "onEdit":
                // onClose();
                dispatch(setSelectedEvent(eventUpdated));
                dispatch(setMoveDateTime({
                    date: new Date(eventUpdated?.extendedProps.time),
                    time: moment(new Date(eventUpdated?.extendedProps.time)).format("HH:mm"),
                    action: "move",
                    selected: false
                }));
                setMoveDialogInfo(true);
                break;
            case "onConfirm":
                onConfirmAppointment(eventUpdated);
                break;
        }
    }

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <>
            <Box
                sx={{
                    width: isMobile ? 320 : 400,
                    p: 2,
                    "& .MuiSvgIcon-root": {
                        width: 60,
                        height: 60
                    }
                }}>
                {pendingAppointments.length > 0 ?
                    <>
                        <Typography variant="h6">Notifications</Typography>
                        <Box
                            sx={{
                                width: '100%',
                                "& .container .MuiBox-root": {
                                    padding: "0.2rem"
                                }
                            }}>
                            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                    <Tab label="Tous" {...a11yProps(0)} />
                                    <Tab label="En attende" {...a11yProps(1)} />
                                </Tabs>
                            </Box>
                            <TabPanel value={value} index={0} className={"container"}>
                                <BasicList
                                    handleAction={handleNotificationAction}
                                    sx={{
                                        "& .MuiSvgIcon-root": {
                                            width: 26,
                                            height: 26
                                        },
                                        "& .MuiButtonBase-root": {
                                            margin: "8px 4px"
                                        }
                                    }}
                                    data={[
                                        ...pendingAppointments.map(appointment => ({
                                            ...appointment,
                                            dur: appointment.duration,
                                            duration: appointment.createdAt && getDuration(appointment.createdAt),
                                            title: `${appointment.patient.firstName} ${appointment.patient.lastName} a demandé un nouveau rendez-vous en ligne pour le ${appointment.dayDate} ${appointment.startTime}`,
                                            icon: <EventIcon/>,
                                            buttons: [
                                                {text: "Confirmer", color: "success", action: "onConfirm"},
                                                {text: "Gérer", color: "white", action: "onEdit"},
                                                {
                                                    ...(appointment.patient?.contact.length > 0 && {
                                                        text: `Appeler ${appointment.patient?.contact[0].value}`,
                                                        href: `tel:${appointment.patient?.contact[0]?.code}${appointment.patient?.contact[0].value}`,
                                                        color: "primary",
                                                        action: "onCall"
                                                    })
                                                }
                                            ]
                                        }))
                                    ]}/>
                            </TabPanel>
                            <TabPanel value={value} index={1} className={"container"}>
                                <BasicList
                                    handleAction={(action: string, event: EventDef) => {
                                        console.log(action, event);
                                    }}
                                    sx={{
                                        "& .MuiSvgIcon-root": {
                                            width: 26,
                                            height: 26
                                        }
                                    }}
                                    data={[
                                        ...pendingAppointments.map(appointment => ({
                                            ...appointment,
                                            duration: appointment.createdAt && getDuration(appointment.createdAt),
                                            title: `Une nouvelle demande de rendez-vous en ligne le ${appointment.dayDate}`,
                                            icon: <EventIcon/>,
                                            buttons: [
                                                {text: "Confirmer", color: "success", action: "onConfirm"},
                                                {text: "Gérer", color: "white", action: "onEdit"}
                                            ]
                                        }))
                                    ]}/>
                            </TabPanel>
                        </Box>

                    </>
                    :
                    <NoDataCard
                        {...{t}}
                        ns={"common"}
                        data={popoverNotificationData}/>}
            </Box>

            <Dialog
                size={"sm"}
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
                    setMoveDialogInfo(false);
                    /*                    if (openMoveDrawer) {
                                            dispatch(openDrawer({type: "move", open: false}));
                                        }*/
                }}
                action={"move_appointment"}
                dir={direction}
                open={moveDialogInfo}
                title={t(`dialogs.move-dialog.title`)}
                actionDialog={
                    <>
                        <Button
                            variant="text-primary"
                            onClick={() => {
                                setMoveDialogInfo(false);
                                /*                                if (openMoveDrawer) {
                                                                    dispatch(openDrawer({type: "move", open: false}));
                                                                }*/
                            }}
                            startIcon={<CloseIcon/>}
                        >
                            {t(`dialogs.move-dialog.garde-date`)}
                        </Button>
                        <Button
                            variant="contained"
                            onClick={onMoveAppointment}
                            color={"primary"}
                            startIcon={<Icon height={"18"} width={"18"} color={"white"} path="iconfinder"></Icon>}
                        >
                            {t(`dialogs.move-dialog.confirm`)}
                        </Button>
                    </>
                }
            />

            <Dialog
                color={theme.palette.warning.main}
                contrastText={theme.palette.warning.contrastText}
                dialogClose={() => {
                    event?.extendedProps.revert && event?.extendedProps.revert();
                    setMoveDialog(false);
                }}
                dir={direction}
                action={() => {
                    return (
                        <Box sx={{minHeight: 150}}>
                            <Typography sx={{textAlign: "center"}}
                                        variant="subtitle1">{t(`dialogs.move-dialog.${!event?.extendedProps.onDurationChanged ? "sub-title" : "sub-title-duration"}`)}</Typography>
                            <Typography sx={{textAlign: "center"}}
                                        margin={2}>
                                {!event?.extendedProps.onDurationChanged ? <>
                                    {event?.extendedProps.oldDate.clone().subtract(event?.extendedProps.from ? 0 : 1, 'hours').format(`DD-MM-YYYY ${event?.extendedProps.allDay ? '' : 'HH:mm'}`)} {" => "}
                                    {event?.extendedProps.newDate.clone().subtract(event?.extendedProps.from ? 0 : 1, 'hours').format("DD-MM-YYYY HH:mm")}
                                </> : <>
                                    {humanizeDuration(event?.extendedProps.oldDuration * 60000)} {" => "}
                                    {humanizeDuration(event?.extendedProps.duration * 60000)}
                                </>
                                }

                            </Typography>
                            <Typography sx={{textAlign: "center"}}
                                        margin={2}>{t("dialogs.move-dialog.description")}</Typography>
                        </Box>)
                }}
                open={moveDialog}
                title={t(`dialogs.move-dialog.${!event?.extendedProps.onDurationChanged ? "title" : "title-duration"}`)}
                actionDialog={
                    <>
                        <Button
                            variant="text-primary"
                            onClick={() => {
                                event?.extendedProps.revert && event?.extendedProps.revert();
                                setMoveDialog(false)
                            }}
                            startIcon={<CloseIcon/>}
                        >
                            {t("dialogs.move-dialog.garde-date")}
                        </Button>
                        <LoadingButton
                            {...{loading}}
                            loadingPosition="start"
                            variant="contained"
                            color={"warning"}
                            onClick={() => handleMoveAppointment(event as EventDef)}
                            startIcon={<Icon path="iconfinder"></Icon>}
                        >
                            {t("dialogs.move-dialog.confirm")}
                        </LoadingButton>
                    </>
                }
            />
        </>

    )
}

export default NotificationPopover

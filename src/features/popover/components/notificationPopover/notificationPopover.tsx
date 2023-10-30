import {NoDataCard} from "@features/card";
import React, {useState} from "react";
import {useTranslation} from "next-i18next";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {Box, Button, Typography, useMediaQuery, useTheme} from "@mui/material";
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import EventIcon from '@mui/icons-material/Event';
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {agendaSelector, AppointmentStatus, openDrawer, setSelectedEvent, setStepperIndex} from "@features/calendar";
import {BasicList} from "@features/list";
import {setAppointmentPatient, setAppointmentType, TabPanel} from "@features/tabPanel";
import {EventDef} from "@fullcalendar/core/internal";
import moment from "moment-timezone";
import {useRouter} from "next/router";
import dynamic from "next/dynamic";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

import {Dialog, dialogMoveSelector, setMoveDateTime} from "@features/dialog";
import {Theme} from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import Icon from "@themes/urlIcon";
import {configSelector, dashLayoutSelector, setOngoing} from "@features/base";
import {useSnackbar} from "notistack";
import {getDiffDuration, useInvalidateQueries, useMedicalEntitySuffix} from "@lib/hooks";
import {useSession} from "next-auth/react";
import {useRequestQueryMutation} from "@lib/axios";

const humanizeDuration = require("humanize-duration");

const popoverNotificationData = {
    mainIcon: <NotificationsOffIcon/>,
    title: "notification.empty",
    description: "notification.desc"
};

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function NotificationPopover({...props}) {
    const {onClose} = props;
    const router = useRouter();
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {data: session} = useSession();
    const {trigger: invalidateQueries} = useInvalidateQueries();

    const {t, ready} = useTranslation("common");
    const {config, pendingAppointments: localPendingAppointments, selectedEvent} = useAppSelector(agendaSelector);
    const {direction} = useAppSelector(configSelector);
    const {notifications: localNotifications, appointmentTypes} = useAppSelector(dashLayoutSelector);
    const {
        date: moveDialogDate,
        time: moveDialogTime
    } = useAppSelector(dialogMoveSelector);

    const {trigger: updateAppointmentStatus} = useRequestQueryMutation("/agenda/update/appointment/status");

    const [value, setValue] = React.useState(0);
    const [moveDialog, setMoveDialog] = useState<boolean>(false);
    const [moveDialogInfo, setMoveDialogInfo] = useState<boolean>(false);
    const [event, setEvent] = useState<EventDef | null>();
    const [loading, setLoading] = useState<boolean>(false);
    const [pendingAppointments] = useState<any[]>([...localPendingAppointments.map(appointment => ({
        ...appointment,
        dur: appointment.duration,
        avatar: `${appointment.patient.firstName.charAt(0).toUpperCase()}${appointment.patient.lastName.charAt(0).toUpperCase()}`,
        duration: appointment.createdAt && getDiffDuration(appointment.createdAt),
        title: `${appointment.patient.firstName} ${appointment.patient.lastName} ${t("request-appointment")} ${appointment.dayDate} ${appointment.startTime}`,
        icon: <EventIcon/>,
        buttons: [
            {text: t("dialogs.move-dialog.confirm"), color: "success", action: "onConfirm"},
            {text: t("dialogs.confirm-dialog.edit"), color: "white", action: "onEdit"},
            {
                ...(appointment.patient?.contact.length > 0 && {
                    text: `${t("dialogs.confirm-dialog.call")} ${appointment.patient?.contact[0].value}`,
                    href: `tel:${appointment.patient?.contact[0]?.code}${appointment.patient?.contact[0].value}`,
                    color: "primary",
                    action: "onCall"
                })
            }
        ]
    }))])
    const [notifications] = useState<any[]>([
        ...pendingAppointments
        , ...(localNotifications ? localNotifications.map(data => ({
            ...data,
            avatar: `${data.appointment?.patient.firstName.charAt(0).toUpperCase()}${data.appointment?.patient.lastName.charAt(0).toUpperCase()}`,
            title: `${t("dialogs.alert.consultation-finish")} ${data.appointment?.patient.firstName} ${data.appointment?.patient.lastName}`,
            icon: <EventIcon/>,
            buttons: [
                /*{
                    text: t("dialogs.finish-dialog.pay"),
                    color: "primary",
                    action: "onPay"
                },*/
                {
                    text: t("dialogs.finish-dialog.reschedule"),
                    color: "primary",
                    action: "onReschedule"
                }]
        })) : [])]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const onMoveAppointment = () => {
        setMoveDialogInfo(false);
        const timeSplit = moveDialogTime.split(':');
        const date = moment(moveDialogDate?.clone().toDate().setHours(parseInt(timeSplit[0]), parseInt(timeSplit[1])));
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
        const eventId = event.publicId ? event.publicId : (event as any).id;
        const form = new FormData();
        form.append("duration", event.extendedProps.duration);
        form.append("start_date", event.extendedProps.newDate.format("DD-MM-YYYY"));
        form.append("start_time", event.extendedProps.newDate.clone().subtract(event.extendedProps.from ? 0 : 1, 'hours').format("HH:mm"));
        updateAppointmentStatus({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/agendas/${config?.uuid}/appointments/${eventId}/change-date/${router.locale}`,
            data: form
        }, {
            onSuccess: (result: any) => {
                setLoading(false);
                if ((result?.data as HttpResponse).status === "success") {
                    enqueueSnackbar(t(`dialogs.move-dialog.${!event.extendedProps.onDurationChanged ?
                        "alert-msg" : "alert-msg-duration"}`), {variant: "success"});
                }
                dispatch(openDrawer({type: "view", open: false}));
                setMoveDialog(false);
                onClose();
                // update pending notifications status
                invalidateQueries([`${urlMedicalEntitySuffix}/agendas/${config?.uuid}/appointments/get/pending/${router.locale}`]);
            }
        });
    }

    const onConfirmAppointment = (event: EventDef) => {
        setLoading(true);
        const appUuid = event?.publicId ? event?.publicId : (event as any)?.id;
        const form = new FormData();
        form.append("status", "1");
        updateAppointmentStatus({
            method: "PATCH",
            data: form,
            url: `${urlMedicalEntitySuffix}/agendas/${config?.uuid}/appointments/${appUuid}/status/${router.locale}`,
        }, {
            onSuccess: () => {
                setLoading(false);
                enqueueSnackbar(t(`dialogs.alert.confirm-appointment`), {variant: "success"});
                onClose();
                // update pending notifications status
                invalidateQueries([`${urlMedicalEntitySuffix}/agendas/${config?.uuid}/appointments/get/pending/${router.locale}`]);
            }
        });
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
                const newDate = moment(eventUpdated?.extendedProps.time);
                dispatch(setMoveDateTime({
                    date: newDate,
                    time: newDate.format("HH:mm"),
                    action: "move",
                    selected: false
                }));
                setMoveDialogInfo(true);
                break;
            case "onConfirm":
                onConfirmAppointment(eventUpdated);
                break;
            case "onReschedule":
                const localStorageNotifications = localStorage.getItem("notifications");
                if (localStorageNotifications) {
                    const notifications = JSON.parse(localStorageNotifications).map((notification: any) => {
                        if (notification.appointment.appUuid === event.appointment.appUuid) return {
                            ...notification,
                            appointment: {...notification.appointment, edited: true}
                        }
                        return notification
                    });
                    dispatch(setOngoing({notifications}));
                    localStorage.setItem("notifications", JSON.stringify(notifications));
                }
                onClose();
                router.push("/dashboard/agenda").then(() => {
                    dispatch(setStepperIndex(1));
                    dispatch(setAppointmentPatient(event?.appointment.patient));
                    appointmentTypes && dispatch(setAppointmentType(appointmentTypes[1]?.uuid));
                    dispatch(openDrawer({type: "add", open: true}));
                });
                break;
        }


    }

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <>
            <Box
                sx={{
                    width: isMobile ? 320 : 400,
                    p: 0,
                    "& .MuiSvgIcon-root": {
                        width: 60,
                        height: 60
                    }
                }}>
                {(pendingAppointments.length > 0 || notifications.length > 0) ?
                    <>
                        <Typography variant="h6" sx={{p: "16px 16px 0 16px"}}>Notifications</Typography>
                        <Box
                            sx={{
                                width: '100%',
                                "& .container .MuiBox-root": {
                                    padding: 0
                                },
                                "& .container .MuiButtonBase-root": {
                                    margin: "8px 4px"
                                }
                            }}>
                            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                    <Tab label={t("all")} {...a11yProps(0)} />
                                    {pendingAppointments.length > 0 && <Tab label={t("pending")} {...a11yProps(1)} />}
                                </Tabs>
                            </Box>
                            <TabPanel value={value} index={0} className={"container"}>
                                <BasicList
                                    {...{t}}
                                    handleAction={handleNotificationAction}
                                    sx={{
                                        "& .MuiSvgIcon-root": {
                                            width: 26,
                                            height: 26
                                        }
                                    }}
                                    data={notifications}/>
                            </TabPanel>
                            {pendingAppointments.length > 0 &&
                                <TabPanel value={value} index={1} className={"container"}>
                                    <BasicList
                                        {...{t}}
                                        handleAction={handleNotificationAction}
                                        sx={{
                                            "& .MuiSvgIcon-root": {
                                                width: 26,
                                                height: 26
                                            }
                                        }}
                                        data={pendingAppointments}/>
                                </TabPanel>}
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
                            startIcon={<Icon path="iconfinder"></Icon>}>
                            {t("dialogs.move-dialog.confirm")}
                        </LoadingButton>
                    </>
                }
            />
        </>

    )
}

export default NotificationPopover

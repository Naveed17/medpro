import {NoDataCard} from "@features/card";
import React from "react";
import {useTranslation} from "next-i18next";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {Box, Typography, useMediaQuery} from "@mui/material";
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
import {setMoveDateTime} from "@features/dialog";
import {Theme} from "@mui/material/styles";

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
    const router = useRouter();
    const dispatch = useAppDispatch();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

    const {t, ready} = useTranslation("common");
    const {pendingAppointments} = useAppSelector(agendaSelector);

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

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
                onClose();
                router.push("/dashboard/agenda").then(() => {
                    dispatch(setSelectedEvent(eventUpdated));
                    dispatch(setMoveDateTime({
                        date: new Date(eventUpdated?.extendedProps.time),
                        time: moment(new Date(eventUpdated?.extendedProps.time)).format("HH:mm"),
                        action: "move",
                        selected: false
                    }));
                    dispatch(openDrawer({type: "move", open: true}));
                });
                break;
            case "onConfirm":
                onClose();
                dispatch(setAction({action: "onConfirm", event: eventUpdated}));
                break;
        }
    }

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
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
    )
}

export default NotificationPopover

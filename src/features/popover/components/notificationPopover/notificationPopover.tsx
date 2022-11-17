import {NoDataCard} from "@features/card";
import React from "react";
import {useTranslation} from "next-i18next";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {Box, Typography} from "@mui/material";
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import EventIcon from '@mui/icons-material/Event';
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {agendaSelector, AppointmentStatus, openDrawer, setSelectedEvent} from "@features/calendar";
import {BasicList} from "@features/list";
import {TabPanel} from "@features/tabPanel";
import {EventDef} from "@fullcalendar/react";
import moment from "moment-timezone";
import {useRouter} from "next/router";

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

    const {t, ready} = useTranslation("common");
    const {pendingAppointments} = useAppSelector(agendaSelector);

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const getDuration = (date: string) => {
        const duration: any = moment.duration(moment.utc().diff(moment.utc(date, "DD-MM-YYYY HH:mm")));
        return humanizeDuration(duration, {largest: 2});
    }

    const handleNotificationAction = (action: string, event: any) => {
        console.log(action, event);
        switch (action) {
            case "onEdit":
                onClose();
                const eventUpdated = {
                    publicId: event?.uuid,
                    title: `${event?.patient?.firstName} ${event?.patient?.lastName}`,
                    extendedProps: {
                        patient: event?.patient,
                        type: event?.type,
                        status: AppointmentStatus[event?.status],
                        time: moment(`${event.dayDate} ${event.startTime}`, "DD-MM-YYYY HH:mm").toDate()
                    }
                } as any;
                console.log(eventUpdated);
                router.push("/dashboard/agenda").then(() => {
                    dispatch(setSelectedEvent(eventUpdated));
                    dispatch(openDrawer({type: "view", open: true}));
                });
                break;
        }
    }

    if (!ready) return (<>loading translations...</>);

    return (
        <Box
            sx={{
                width: 400,
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
                                    }
                                }}
                                data={[
                                    ...pendingAppointments.map(appointment => ({
                                        ...appointment,
                                        duration: getDuration("14-11-2022 13:46"),
                                        title: `Une nouvelle demande de rendez-vous en ligne le ${appointment.dayDate}`,
                                        icon: <EventIcon/>,
                                        buttons: [
                                            {text: "Confirmer", color: "success", action: "onConfirm"},
                                            {text: "Gérer", color: "white", action: "onEdit"}
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
                                        duration: getDuration("14-11-2022 13:46"),
                                        title: `Une nouvelle demande de rendez-vous en ligne le ${appointment.dayDate}`,
                                        icon: <EventIcon/>,
                                        action: "onConfirm"
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

import React, {useCallback, useEffect, useState} from "react";
import {firebaseCloudMessaging} from "@app/firebase";
import {getMessaging, onMessage} from "firebase/messaging";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Paper,
    PaperProps, useTheme
} from "@mui/material";
import axios from "axios";
import {useSession} from "next-auth/react";
import {useRequest, useRequestMutation} from "@app/axios";
import {SWRNoValidateConfig, TriggerWithoutValidation} from "@app/swr/swrProvider";
import {useRouter} from "next/router";
import {Session} from "next-auth";
import {
    agendaSelector,
    AppointmentStatus,
    openDrawer,
    setLastUpdate,
    setSelectedEvent,
    setStepperIndex
} from "@features/calendar";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {ConsultationPopupAction, AgendaPopupAction} from "@features/popup";
import {setAppointmentPatient, setAppointmentType} from "@features/tabPanel";
import {useSnackbar} from "notistack";
import moment from "moment-timezone";
import {CircularProgressbarCard, setTimer} from "@features/card";
import {dashLayoutSelector} from "@features/base";
import {tableActionSelector} from "@features/table";

function PaperComponent(props: PaperProps) {
    return (
        <Paper {...props} />
    );
}

function FcmLayout({...props}) {
    const {data: session} = useSession();
    const router = useRouter();
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const {mutate: mutateOnGoing} = useAppSelector(dashLayoutSelector);
    const {config: agendaConfig} = useAppSelector(agendaSelector);
    const {importData} = useAppSelector(tableActionSelector);

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogAction, setDialogAction] = useState("confirm-dialog"); // confirm-dialog | finish-dialog
    const [notificationData, setNotificationData] = useState<any>(null);
    const [fcmToken, setFcmToken] = useState("");
    const [translationCommon] = useState(props._nextI18Next.initialI18nStore.fr.common);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {
        trigger: updateStatusTrigger
    } = useRequestMutation(null, "/agenda/update/appointment/status",
        TriggerWithoutValidation);

    const {data: httpProfessionalsResponse} = useRequest({
        method: "GET",
        url: "/api/medical-entity/" + medical_entity?.uuid + "/professionals/" + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    }, SWRNoValidateConfig);

    const {data: httpAppointmentTypesResponse} = useRequest({
        method: "GET",
        url: "/api/medical-entity/" + medical_entity?.uuid + "/appointments/types/" + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    }, SWRNoValidateConfig);

    const appointmentTypes = (httpAppointmentTypesResponse as HttpResponse)?.data as AppointmentTypeModel[];
    const medical_professional = (httpProfessionalsResponse as HttpResponse)?.data[0]?.medical_professional as MedicalProfessionalModel;
    const general_information = (session?.data as UserDataResponse).general_information;

    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    }

    // Get the push notification message and triggers a toast to display it
    const getFcmMessage = () => {
        const messaging = getMessaging(firebaseCloudMessaging.firebase);
        onMessage(messaging, (message: any) => {
            const data = JSON.parse(message.data.detail);
            if (data.type === "no_action") {
                if (data.mode === "foreground") {
                    enqueueSnackbar(message.notification.body, {variant: "info"});
                } else {
                    if (data.body.hasOwnProperty('progress')) {
                        if (data.body.progress === -1 || data.body.progress === 100) {
                            localStorage.removeItem("import-data");
                            importData.mutate && importData.mutate();
                            closeSnackbar();
                            enqueueSnackbar((data.body.progress === -1 ?
                                    translationCommon.import_data.failed : translationCommon.import_data.end),
                                {variant: data.body.progress === -1 ? "error" : "success"});
                        }
                    }
                }
            } else {
                switch (message.data.root) {
                    case "agenda":
                        dispatch(setLastUpdate(data));
                        if (data.type === "popup") {
                            if (!data.body.appointment) {
                                dispatch(setTimer({isActive: false}));
                            }
                            setDialogAction(data.body.appointment ? "confirm-dialog" : "finish-dialog")
                            setOpenDialog(true);
                            setNotificationData(data.body);
                        } else if (data.body.action === "update") {
                            // update pending notifications status
                            agendaConfig?.mutate[1]();
                        }
                        break;
                    case "waiting-room":
                        // refresh agenda
                        dispatch(setLastUpdate(data));
                        // refresh on going api
                        mutateOnGoing && mutateOnGoing();
                        break;
                    case "consultation":
                        // refresh agenda
                        dispatch(setLastUpdate(data));
                        // refresh on going api
                        mutateOnGoing && mutateOnGoing();
                        const event = {
                            publicId: data.body.appointment?.uuid,
                            title: `${data.body.appointment.patient.firstName} ${data.body.appointment.patient.lastName}`,
                            extendedProps: {
                                patient: data.body.appointment.patient,
                                type: data.body.type,
                                status: AppointmentStatus[data.body.appointment?.status],
                                time: moment(`${data.body.appointment.dayDate} ${data.body.appointment.startTime}`, "DD-MM-YYYY HH:mm").toDate()
                            }
                        } as any;
                        // start consultation timer
                        dispatch(setTimer({
                            isActive: true,
                            isPaused: false,
                            event,
                            startTime: moment(data.body.appointment.dayDate, "DD-MM-YYYY").format("HH:mm")
                        }));
                        break;
                }
            }
        });
    }

    const setToken = async () => {
        try {
            const token = await firebaseCloudMessaging.init();
            if (token) {
                setFcmToken(token as string);
                getFcmMessage();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const setRefreshToken = async (topicName: string, fcm_api_key: string) => {
        localStorage.removeItem("fcm_token");
        const refreshToken = await firebaseCloudMessaging.init();
        if (refreshToken) {
            localStorage.setItem("fcm_token", refreshToken);
            setFcmToken(refreshToken as string);
            const topicURL = `https://iid.googleapis.com/iid/v1/${refreshToken}/rel/topics/${topicName}`;
            return axios({
                url: topicURL,
                method: "POST",
                headers: {
                    Authorization: `key=${fcm_api_key}`
                },
            })
        }
    }

    const subscribeToTopic = useCallback(async (topicName: string) => {
        if (fcmToken) {
            const {data: fcm_api_key} = await axios({
                url: "/api/helper/server_env",
                method: "POST",
                data: {
                    key: "FCM_WEB_API_KEY"
                }
            });
            // Subscribe to the topic
            const topicURL = `https://iid.googleapis.com/iid/v1/${fcmToken}/rel/topics/${topicName}`;
            return axios({
                url: topicURL,
                method: "POST",
                headers: {
                    Authorization: `key=${fcm_api_key}`
                },
            }).catch(() => {
                setRefreshToken(topicName, fcm_api_key);
                console.error(`Can't subscribe to ${topicName} topic`);
            });
        }
    }, [fcmToken]); // eslint-disable-line react-hooks/exhaustive-deps

    const updateAppointmentStatus = (appointmentUUid: string, status: string) => {
        const form = new FormData();
        form.append('status', status);
        return updateStatusTrigger({
            method: "PATCH",
            url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agendaConfig?.uuid}/appointments/${appointmentUUid}/status/${router.locale}`,
            data: form,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        });
    }

    useEffect(() => {
        if (medical_professional) {
            subscribeToTopic(`${general_information.roles[0]}-${general_information.uuid}`);
        }
    }, [medical_professional, subscribeToTopic]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        setToken();

        // Event listener that listens for the push notification event in the background
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.addEventListener("message", (event) => {
                process.env.NODE_ENV === 'development' && console.log("event for the service worker", event);
            });
        }
    });

    return (
        <>
            {props.children}
            <Dialog
                open={openDialog}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        position: "absolute",
                        right: 0,
                        bottom: 0,
                        minWidth: dialogAction !== "confirm-dialog" ? "40vw" : "33vw",
                        "& .MuiPaper-root": {
                            borderRadius: 0,
                            border: 0
                        },
                        "& .MuiDialogContent-root": {
                            padding: 0
                        }
                    }
                }}
                aria-labelledby="draggable-dialog-title"
            >
                {dialogAction !== "confirm-dialog" ? <>
                        <DialogTitle sx={{m: 0, p: 2, backgroundColor: theme.palette.primary.main}}>
                            Fin de consultation
                        </DialogTitle>
                        <DialogContent>
                            <ConsultationPopupAction
                                data={{
                                    id: notificationData?.patient.uuid,
                                    name: `${notificationData?.patient.firstName} ${notificationData?.patient.lastName}`,
                                    phone: `${notificationData?.patient.contact[0]?.code} ${notificationData?.patient.contact[0]?.value}`,
                                    fees: notificationData?.fees,
                                    instruction: notificationData?.instruction,
                                    nextAppointment: notificationData?.nextApp,
                                    control: notificationData?.control
                                }}
                                OnSchedule={() => {
                                    handleClose();
                                    router.push("/dashboard/agenda").then(() => {
                                        dispatch(setStepperIndex(1));
                                        dispatch(setAppointmentPatient(notificationData?.patient));
                                        dispatch(setAppointmentType(appointmentTypes[1]?.uuid));
                                        dispatch(openDrawer({type: "add", open: true}));
                                    });
                                }}/>
                        </DialogContent>
                    </> :
                    <AgendaPopupAction
                        data={{
                            id: notificationData?.appointment.patient.uuid,
                            name: `${notificationData?.appointment.patient.firstName} ${notificationData?.appointment.patient.lastName}`,
                            phone: `${notificationData?.appointment.patient.contact[0]?.code} ${notificationData?.appointment.patient.contact[0]?.value}`,
                            date: notificationData?.appointment.dayDate,
                            time: notificationData?.appointment.startTime
                        }}
                        OnEdit={() => {
                            handleClose();
                            const event = {
                                publicId: notificationData?.appointment?.uuid,
                                title: `${notificationData?.appointment.patient.firstName} ${notificationData?.appointment.patient.lastName}`,
                                extendedProps: {
                                    patient: notificationData?.appointment.patient,
                                    type: notificationData?.type,
                                    status: AppointmentStatus[notificationData?.appointment?.status],
                                    time: moment(`${notificationData?.appointment.dayDate} ${notificationData?.appointment.startTime}`, "DD-MM-YYYY HH:mm").toDate()
                                }
                            } as any;
                            router.push("/dashboard/agenda").then(() => {
                                dispatch(setSelectedEvent(event));
                                dispatch(openDrawer({type: "view", open: true}));
                            });
                        }}
                        OnConfirm={() => {
                            handleClose();
                            updateAppointmentStatus(notificationData?.appointment?.uuid, "1");
                        }}
                    />}
            </Dialog>
        </>
    );
}

export default FcmLayout;

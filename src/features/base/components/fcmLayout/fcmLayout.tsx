import React, {useCallback, useEffect, useState} from "react";
import {firebaseCloudSdk} from "@lib/firebase";
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
import {useRequest} from "@lib/axios";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
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
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {ConsultationPopupAction, AgendaPopupAction} from "@features/popup";
import {setAppointmentPatient, setAppointmentType} from "@features/tabPanel";
import {SnackbarKey, useSnackbar} from "notistack";
import moment from "moment-timezone";
import {resetTimer, setTimer} from "@features/card";
import {dashLayoutSelector, setOngoing} from "@features/base";
import {tableActionSelector} from "@features/table";
import {DefaultCountry, EnvPattern} from "@lib/constants";
import {setMoveDateTime} from "@features/dialog";
import smartlookClient from "smartlook-client";
import {setProgress} from "@features/progressUI";
import {setUserId, setUserProperties} from "@firebase/analytics";
import {useMedicalEntitySuffix} from "@lib/hooks";
import useSWRMutation from "swr/mutation";
import {sendRequest} from "@lib/hooks/rest";

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
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {mutate: mutateOnGoing} = useAppSelector(dashLayoutSelector);
    const {config: agendaConfig} = useAppSelector(agendaSelector);
    const {importData} = useAppSelector(tableActionSelector);

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogAction, setDialogAction] = useState("confirm-dialog"); // confirm-dialog | finish-dialog
    const [notificationData, setNotificationData] = useState<any>(null);
    const [fcmToken, setFcmToken] = useState("");
    const [noConnection, setNoConnection] = useState<SnackbarKey | undefined>(undefined);
    const [translationCommon] = useState(props._nextI18Next.initialI18nStore.fr.common);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const general_information = (user as UserDataResponse).general_information;
    const roles = (user as UserDataResponse)?.general_information.roles;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;

    const {trigger: updateAppointmentStatus} = useSWRMutation(["/agenda/update/appointment/status", {Authorization: `Bearer ${session?.accessToken}`}], sendRequest as any);

    const {data: httpProfessionalsResponse} = useRequest({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/professionals/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    }, SWRNoValidateConfig);

    const {data: httpUserResponse} = useRequest({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/professional/user/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    }, SWRNoValidateConfig);

    const medicalEntityHasUser = (httpUserResponse as HttpResponse)?.data as MedicalEntityHasUsersModel[];

    const {data: httpAppointmentTypesResponse} = useRequest(medicalEntityHasUser && medicalEntityHasUser.length > 0 ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/appointments/types/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null, SWRNoValidateConfig);

    const appointmentTypes = (httpAppointmentTypesResponse as HttpResponse)?.data as AppointmentTypeModel[];
    const medicalProfessionalData = (httpProfessionalsResponse as HttpResponse)?.data as MedicalProfessionalDataModel[];
    const medical_professional = (httpProfessionalsResponse as HttpResponse)?.data[0]?.medical_professional as MedicalProfessionalModel;
    const prodEnv = !EnvPattern.some(element => window.location.hostname.includes(element));

    const handleClose = () => {
        setOpenDialog(false);
    }

    // Get the push notification message and triggers a toast to display it
    const getFcmMessage = () => {
        const messaging = getMessaging(firebaseCloudSdk.firebase);
        onMessage(messaging, (message: any) => {
            const data = JSON.parse(message.data.detail);
            if (data.type === "no_action") {
                if (data.mode === "foreground") {
                    enqueueSnackbar(message.notification.body, {variant: "info"});
                } else if (data.body.hasOwnProperty('progress')) {
                    if (data.body.progress === -1 || data.body.progress === 100) {
                        localStorage.removeItem("import-data");
                        localStorage.removeItem("import-data-progress");
                        importData.mutate && importData.mutate();
                        // refresh on going api
                        mutateOnGoing && mutateOnGoing();
                        closeSnackbar();
                        enqueueSnackbar((data.body.progress === -1 ?
                                translationCommon.import_data.failed : translationCommon.import_data.end),
                            {variant: data.body.progress === -1 ? "error" : "success"});
                    } else {
                        localStorage.setItem("import-data-progress", data.body.progress.toString());
                        dispatch(setProgress(parseFloat(data.body.progress)));
                    }
                }
            } else {
                switch (message.data.root) {
                    case "agenda":
                        dispatch(setLastUpdate(data));
                        if (data.type === "popup") {
                            if (!data.body.appointment) {
                                dispatch(resetTimer());
                            }
                            setDialogAction(data.body.appointment ? "confirm-dialog" : "finish-dialog");
                            setOpenDialog(true);
                            setNotificationData(data.body);
                            const localStorageNotifications = localStorage.getItem("notifications");
                            const notifications = [...(localStorageNotifications ? JSON.parse(localStorageNotifications).filter(
                                (notification: any) => moment().isSameOrBefore(moment(notification.appointment.dayDate, "DD-MM-YYYY"), "day")) : []), {
                                appointment: data.body,
                                action: "end-consultation"
                            }];
                            localStorage.setItem("notifications", JSON.stringify(notifications));
                            // Update notifications popup
                            dispatch(setOngoing({notifications}));
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
                                startTime: moment().utc().format("HH:mm")
                            }
                        ));
                        break;
                }
            }
        });
    }

    const setToken = async () => {
        try {
            const {token, analytics} = await firebaseCloudSdk.init() as any;
            if (token) {
                setFcmToken(token as string);
                getFcmMessage();
            }
            if (analytics) {
                // identify firebase analytics user
                setUserId(analytics, general_information.uuid);
                setUserProperties(analytics, {
                    name: `${general_information.firstName} ${general_information.lastName}`,
                    email: general_information.email,
                    role: roles[0]
                });
            }
        } catch (error) {
            console.log("error: undefined token");
        }
    }

    const setRefreshToken = async (topicName: string, fcm_api_key: string) => {
        localStorage.removeItem("fcm_token");
        const {token: refreshToken} = await firebaseCloudSdk.init() as any;
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

    useEffect(() => {
        if (medical_professional) {
            subscribeToTopic(`${roles[0]}-${general_information.uuid}`);
            dispatch(setOngoing({medicalProfessionalData}));
            if (prodEnv) {
                // identify smartlook user
                smartlookClient.identify(general_information.uuid, {
                    name: `${general_information.firstName} ${general_information.lastName}`,
                    email: general_information.email,
                    role: roles[0]
                });
            }
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

        if (typeof window !== "undefined") {
            window.addEventListener("online", () => {
                // when we're back online
                closeSnackbar(noConnection);
                setNoConnection(undefined);
            });

            window.addEventListener("offline", () => {
                setNoConnection(enqueueSnackbar('Aucune connexion internet!', {
                    key: "offline",
                    variant: 'error',
                    anchorOrigin: {horizontal: "center", vertical: "bottom"},
                    persist: true
                }));
            });
        }
    });

    useEffect(() => {
        if (medicalEntityHasUser) {
            dispatch(setOngoing({medicalEntityHasUser}));
        }
    }, [dispatch, medicalEntityHasUser])

    useEffect(() => {
        if (appointmentTypes) {
            dispatch(setOngoing({appointmentTypes}));
        }
    }, [dispatch, appointmentTypes])

    useEffect(() => {
        // Update notifications popup
        const localStorageNotifications = localStorage.getItem("notifications");
        if (localStorageNotifications) {
            const notifications = JSON.parse(localStorageNotifications).filter(
                (notification: any) => moment().isSameOrBefore(moment(notification.appointment.dayDate, "DD-MM-YYYY"), "day"));
            dispatch(setOngoing({notifications}))
        }
    }, [dispatch])

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
                        minWidth: "40vw",
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
                                    devise,
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
                                    dur: notificationData?.appointment.duration,
                                    type: notificationData?.type,
                                    status: AppointmentStatus[notificationData?.appointment?.status],
                                    time: moment(`${notificationData?.appointment.dayDate} ${notificationData?.appointment.startTime}`, "DD-MM-YYYY HH:mm").toDate()
                                }
                            } as any;
                            router.push("/dashboard/agenda").then(() => {
                                dispatch(setSelectedEvent(event));
                                const newDate = moment(event?.extendedProps.time);
                                dispatch(setMoveDateTime({
                                    date: newDate,
                                    time: newDate.format("HH:mm"),
                                    action: "move",
                                    selected: false
                                }));
                                dispatch(openDrawer({type: "move", open: true}));
                            });
                        }}
                        OnConfirm={() => {
                            handleClose();
                            updateAppointmentStatus({
                                method: "PATCH",
                                data: {
                                    status: "1"
                                },
                                url: `${urlMedicalEntitySuffix}/agendas/${agendaConfig?.uuid}/appointments/${notificationData?.appointment?.uuid}/status/${router.locale}`
                            } as any);
                        }}
                    />}
            </Dialog>
        </>
    );
}

export default FcmLayout;

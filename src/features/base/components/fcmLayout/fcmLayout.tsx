import React, {useEffect, useState} from "react";
import {firebaseCloudSdk} from "@lib/firebase";
import {getMessaging, onMessage} from "firebase/messaging";
import {Dialog, DialogContent, DialogTitle, Drawer, Fab, Paper, PaperProps, useTheme} from "@mui/material";
import axios from "axios";
import {useSession} from "next-auth/react";
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
import {AgendaPopupAction, ConsultationPopupAction} from "@features/popup";
import {setAppointmentPatient, setAppointmentType} from "@features/tabPanel";
import {Dialog as CustomDialog, setMoveDateTime} from "@features/dialog";
import {SnackbarKey, useSnackbar} from "notistack";
import moment from "moment-timezone";
import {resetTimer} from "@features/card";
import {configSelector, dashLayoutSelector, setOngoing} from "@features/base";
import {tableActionSelector} from "@features/table";
import {DefaultCountry, EnvPattern} from "@lib/constants";
import smartlookClient from "smartlook-client";
import {setProgress} from "@features/progressUI";
import {setUserId, setUserProperties} from "@firebase/analytics";
import {useInvalidateQueries, useMedicalEntitySuffix} from "@lib/hooks";
import {fetchAndActivate, getRemoteConfig, getString} from "firebase/remote-config";
import {useRequestQueryMutation} from "@lib/axios";
import useMutateOnGoing from "@lib/hooks/useMutateOnGoing";
import {buildAbilityFor} from "@lib/rbac/casl/ability";
import {AbilityContext} from "@features/casl/can";
import {useChannel, useConnectionStateListener, usePresence} from "ably/react";
import IconUrl from "@themes/urlIcon";
import {Chat} from "@features/chat";

function PaperComponent(props: PaperProps) {
    return (
        <Paper {...props} />
    );
}

function FcmLayout({...props}) {
    const {data: session, update} = useSession();
    const {jti} = session?.user as any;
    const router = useRouter();
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {trigger: mutateOnGoing} = useMutateOnGoing();
    const {trigger: invalidateQueries} = useInvalidateQueries();

    const {appointmentTypes} = useAppSelector(dashLayoutSelector);
    const {config: agendaConfig} = useAppSelector(agendaSelector);
    const {importData} = useAppSelector(tableActionSelector);
    const {direction} = useAppSelector(configSelector);

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogAction, setDialogAction] = useState("confirm-dialog"); // confirm-dialog | finish-dialog
    const [notificationData, setNotificationData] = useState<any>(null);
    const [noConnection, setNoConnection] = useState<SnackbarKey | undefined>(undefined);
    const [translationCommon] = useState(props._nextI18Next.initialI18nStore.fr.common);
    const [openPaymentDialog, setOpenPaymentDialog] = useState<boolean>(false);

    const [open, setOpen] = React.useState(false);
    const [messages, updateMessages] = useState<any[]>([]);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const general_information = (user as UserDataResponse).general_information;
    const roles = (user as UserDataResponse)?.general_information.roles;
    const default_medical_entity = (user as UserDataResponse)?.medical_entities?.find((entity: MedicalEntityDefault) => entity.is_default);
    const features = default_medical_entity?.features;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;
    const prodEnv = !EnvPattern.some(element => window.location.hostname.includes(element));
    const ability = buildAbilityFor(features ?? []);
    const medicalEntityHasUser = (user as UserDataResponse)?.medical_entities?.find((entity: MedicalEntityDefault) => entity.is_default)?.user;

    const {trigger: updateAppointmentStatus} = useRequestQueryMutation("/agenda/appointment/update/status");

    const handleClose = () => {
        setOpenDialog(false);
    }
    // Get the push notification message and triggers a toast to display it
    const getFcmMessage = () => {
        const messaging = getMessaging(firebaseCloudSdk.firebase);
        onMessage(messaging, (message: any) => {
            const data = JSON.parse(message.data.detail);
            const fcmSession = data.body?.fcm_session ?? "";
            if (fcmSession !== jti) {
                if (data.type === "no_action") {
                    if (data.mode === "foreground") {
                        enqueueSnackbar(message.notification.body, {variant: "info"});
                    } else if (data.body.hasOwnProperty('progress')) {
                        if (data.body.progress === -1 || data.body.progress === 100) {
                            localStorage.removeItem("import-data");
                            localStorage.removeItem("import-data-progress");
                            importData.mutate && importData.mutate();
                            // refresh on going api
                            mutateOnGoing();
                            closeSnackbar();
                            enqueueSnackbar((data.body.progress === -1 ?
                                    translationCommon.import_data.failed : translationCommon.import_data.end),
                                {variant: data.body.progress === -1 ? "error" : "success"});
                        } else {
                            localStorage.setItem("import-data-progress", data.body.progress.toString());
                            dispatch(setProgress(parseFloat(data.body.progress)));
                        }
                    }
                } else if (data.type === "session") {
                    update({[message.data.root]: data.body});
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
                                invalidateQueries([`${urlMedicalEntitySuffix}/agendas/${agendaConfig?.uuid}/appointments/get/pending/${router.locale}`]);
                                // refresh on going api
                                mutateOnGoing();
                            }
                            break;
                        case "waiting-room":
                            // refresh agenda
                            dispatch(setLastUpdate(data));
                            // refresh on going api
                            mutateOnGoing();
                            break;
                        case "consultation":
                            // refresh agenda
                            dispatch(setLastUpdate(data));
                            // refresh on going api
                            mutateOnGoing();
                            break;
                        case "documents":
                            enqueueSnackbar(translationCommon.alerts["speech-text"].title, {variant: "success"});
                            invalidateQueries([`${urlMedicalEntitySuffix}/agendas/${agendaConfig?.uuid}/appointments/${data.body.appointment}/documents/${router.locale}`]);
                            break;
                        default:
                            data.body.mutate && invalidateQueries([data.body.mutate]);
                            break;
                    }
                }
            }
        });
    }

    const setToken = async () => {
        try {
            const {token, analytics} = await firebaseCloudSdk.init() as any;
            if (token) {
                getFcmMessage();
                subscribeToTopic(token, `${roles[0]}-${general_information.uuid}`);
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

    const subscribeToTopic = async (fcmToken: string, topicName: string) => {
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
                console.log(`Can't subscribe to ${topicName} topic`);
            });
        }
    };

    const saveInbox = (msgs: any[], userUuid: string) => {
        updateMessages(msgs)
        let _local = localStorage.getItem("chat") && JSON.parse(localStorage.getItem("chat") as string)
        if (_local) {
            if (_local[userUuid]) _local[userUuid] = msgs
            else _local = {..._local, [userUuid]: msgs}
        } else _local = {[userUuid]: msgs};
        localStorage.setItem("chat", JSON.stringify(_local))
    }

    useEffect(() => {
        if (general_information) {
            const remoteConfig = getRemoteConfig(firebaseCloudSdk.firebase);
            if (prodEnv && remoteConfig) {
                fetchAndActivate(remoteConfig).then(() => {
                    const config = JSON.parse(getString(remoteConfig, 'medlink_remote_config'));
                    if (config.smartlook && config.countries?.includes(process.env.NEXT_PUBLIC_COUNTRY?.toLowerCase())) {
                        // identify smartlook user
                        smartlookClient.identify(general_information.uuid, {
                            name: `${general_information.firstName} ${general_information.lastName}`,
                            email: general_information.email,
                            role: roles[0]
                        });
                    }
                });

            }
        }
    }, [general_information]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const remoteConfig = getRemoteConfig(firebaseCloudSdk.firebase);
        if (typeof window !== "undefined" && window?.usetifulInit && general_information && process.env.NODE_ENV !== 'development') {
            fetchAndActivate(remoteConfig).then(() => {
                const config = JSON.parse(getString(remoteConfig, 'medlink_remote_config'));
                if (config.usetiful) {
                    window.usetifulTags = {
                        userId: general_information.uuid,
                        role: roles[0],
                        name: `${general_information.firstName} ${general_information.lastName}`
                    };
                    window.usetifulInit(window, document, "/static/files/usetiful.js", process.env.NEXT_PUBLIC_USETIFUL_TOKEN ?? "");
                }
            });
        }
    }, [window?.usetifulInit, general_information]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        // Update notifications popup
        const localStorageNotifications = localStorage.getItem("notifications");
        if (localStorageNotifications) {
            const notifications = JSON.parse(localStorageNotifications).filter(
                (notification: any) => moment().isSameOrBefore(moment(notification.appointment.dayDate, "DD-MM-YYYY"), "day"));
            dispatch(setOngoing({notifications}))
        }
    }, [dispatch]);

    useEffect(() => {
        if (agendaConfig) {
            setToken();
            // Event listener that listens for the push notification event in the background
            if ("serviceWorker" in navigator && process.env.NODE_ENV === "development") {
                navigator.serviceWorker.addEventListener("message", (event) => {
                    console.log("event for the service worker", JSON.parse(event.data.data.detail));
                });
            }
        }
    }, [agendaConfig]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
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
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useConnectionStateListener((stateChange) => {
        console.log("current", stateChange.current);  // the new connection state
    });

    const {channel} = useChannel(medical_entity?.uuid, (message) => {
        if (message.name === medicalEntityHasUser) {
            saveInbox([...messages, {
                from: message.clientId,
                to: medicalEntityHasUser,
                data: message.data
            }], message.clientId)
            // @ts-ignore
            enqueueSnackbar(message.data, {variant: "info", iconVariant: {info: '💬 '}});
        }
    });
    const {presenceData} = usePresence(medical_entity?.uuid, 'actif');

    return (
        <>
            <AbilityContext.Provider value={ability}>
                {props.children}
            </AbilityContext.Provider>
            <CustomDialog
                action={"payment_dialog"}
                {...{
                    direction,
                    sx: {
                        minHeight: 460
                    }
                }}
                open={openPaymentDialog}
                data={{
                    patient: notificationData?.patient,
                    setOpenPaymentDialog,
                    mutatePatient: () => mutateOnGoing()
                }}
                size={"lg"}
                fullWidth
                title={translationCommon.payment_dialog_title}
                dialogClose={() => setOpenPaymentDialog(false)}
            />
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
                aria-labelledby="draggable-dialog-title">
                {dialogAction !== "confirm-dialog" ? <>
                        <DialogTitle sx={{m: 0, p: 2, backgroundColor: theme.palette.primary.main}}>
                            Fin de consultation
                        </DialogTitle>
                        <DialogContent>
                            <ConsultationPopupAction
                                data={{
                                    id: notificationData?.patient.uuid,
                                    appUuid: notificationData?.appUuid,
                                    name: `${notificationData?.patient.firstName} ${notificationData?.patient.lastName}`,
                                    fees: notificationData?.fees,
                                    instruction: notificationData?.instruction,
                                    devise,
                                    nextAppointment: notificationData?.nextApp,
                                    control: notificationData?.control,
                                    restAmount: notificationData?.patient.restAmount,
                                    payed: notificationData?.patient.restAmount === 0
                                }}
                                OnPay={() => {
                                    handleClose();
                                    setOpenPaymentDialog(true);
                                }}
                                OnSchedule={() => {
                                    handleClose();
                                    router.push("/dashboard/agenda").then(() => {
                                        dispatch(setStepperIndex(1));
                                        dispatch(setAppointmentPatient(notificationData?.patient));
                                        (appointmentTypes && appointmentTypes.length > 1) && dispatch(setAppointmentType(appointmentTypes[1]?.uuid));
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
                            const form = new FormData();
                            form.append('status', "1");
                            updateAppointmentStatus({
                                method: "PATCH",
                                data: form,
                                url: `${urlMedicalEntitySuffix}/agendas/${agendaConfig?.uuid}/appointments/${notificationData?.appointment?.uuid}/status/${router.locale}`
                            });
                        }}
                    />}
            </Dialog>


            <Fab color="primary"
                 style={{position: "fixed", bottom: 50, right: 40, zIndex: 99}}
                 onClick={() => {
                     setOpen(true)
                 }}>
                <IconUrl path={"ic-chat"} width={30} height={30}/>
            </Fab>

            <Drawer
                anchor={"right"}
                open={open}
                sx={{
                    "& .MuiPaper-root": {
                        width: {xs: "100%", sm: "40%"}
                    }
                }} onClose={() => setOpen(false)}>
                <Chat {...{
                    channel,
                    messages,
                    updateMessages,
                    medicalEntityHasUser,
                    saveInbox,
                    medical_entity,
                    presenceData
                }}/>
            </Drawer>

        </>
    );
}

export default FcmLayout;

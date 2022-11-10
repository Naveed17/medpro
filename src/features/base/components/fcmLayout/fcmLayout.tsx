import {useCallback, useEffect, useState} from "react";
import {firebaseCloudMessaging} from "@app/firebase";
import {getMessaging, onMessage} from "firebase/messaging";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper,
    PaperProps, useTheme
} from "@mui/material";
import axios from "axios";
import {useSession} from "next-auth/react";
import {useRequest} from "@app/axios";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import {useRouter} from "next/router";
import {Session} from "next-auth";
import {agendaSelector, openDrawer, setLastUpdate, setStepperIndex} from "@features/calendar";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {AgendaPopupAction, ConsultationPopupAction} from "@features/popup";
import {setAppointmentPatient, setAppointmentType} from "@features/tabPanel";
import {useSnackbar} from "notistack";

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
    const [open, setOpen] = useState(false);
    const [notificationData, setNotificationData] = useState<any>(null);
    const [fcmToken, setFcmToken] = useState("");

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpProfessionalsResponse} = useRequest({
        method: "GET",
        url: "/api/medical-entity/" + medical_entity.uuid + "/professionals/" + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    }, SWRNoValidateConfig);

    const {data: httpAppointmentTypesResponse} = useRequest({
        method: "GET",
        url: "/api/medical-entity/" + medical_entity.uuid + "/appointments/types/" + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    }, SWRNoValidateConfig);

    const appointmentTypes = (httpAppointmentTypesResponse as HttpResponse)?.data as AppointmentTypeModel[];
    const medical_professional = (httpProfessionalsResponse as HttpResponse)?.data[0]?.medical_professional as MedicalProfessionalModel;
    const general_information = (session?.data as UserDataResponse).general_information;

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // Get the push notification message and triggers a toast to display it
    const getFcmMessage = () => {
        const messaging = getMessaging(firebaseCloudMessaging.firebase);
        onMessage(messaging, (message: any) => {
            const data = JSON.parse(message.data.detail);
            if (data.type === "no_action" && data.mode === "foreground") {
                enqueueSnackbar(message.notification.body, {variant: "info"});
            } else {
                switch (message.data.root) {
                    case "agenda":
                        dispatch(setLastUpdate(data));
                        if (data.type === "popup") {
                            setOpen(true);
                            setNotificationData(data.body);
                        }
                        break;
                }
            }
        });
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
                console.error(`Can't subscribe to ${topicName} topic`);
            });
        }
    }, [fcmToken]);

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
                console.log("event for the service worker", event);
            });
        }

        // Calls the getMessage() function if the token is there
        async function setToken() {
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
    });

    return (
        <>
            {props.children}
            <Dialog
                open={open}
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
                            control: notificationData?.nextApp
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
            </Dialog>
        </>
    );
}

export default FcmLayout;

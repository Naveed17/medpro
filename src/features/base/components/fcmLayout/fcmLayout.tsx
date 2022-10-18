import {useCallback, useEffect, useState} from "react";
import "firebase/messaging";
import {firebaseCloudMessaging} from "@app/firebase";
import firebase from 'firebase/compat/app';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper,
    PaperProps
} from "@mui/material";
import axios from "axios";
import {useSession} from "next-auth/react";
import {useRequest} from "@app/axios";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import {useRouter} from "next/router";
import {Session} from "next-auth";
import {agendaSelector, setLastUpdate} from "@features/calendar";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";

function PaperComponent(props: PaperProps) {
    return (
        <Paper {...props} />
    );
}

function FcmLayout({children}: LayoutProps) {
    const {data: session} = useSession();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const [open, setOpen] = useState(false);
    const [fcmToken, setFcmToken] = useState("");

    const {lastUpdateNotification} = useAppSelector(agendaSelector);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpProfessionalsResponse} = useRequest({
        method: "GET",
        url: "/api/medical-entity/" + medical_entity.uuid + "/professionals/" + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    }, SWRNoValidateConfig);

    const medical_professional = (httpProfessionalsResponse as HttpResponse)?.data[0]?.medical_professional as MedicalProfessionalModel;
    const general_information = (session?.data as UserDataResponse).general_information;

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    // Get the push notification message and triggers a toast to display it
    const getMessage = () => {
        const messaging = firebase.messaging();
        messaging.onMessage((message) => {
            switch (message.data.root) {
                case "agenda":
                    const data = JSON.parse(message.data.detail);
                    dispatch(setLastUpdate(data));
                    if (data.type === "popup") {
                        setOpen(true);
                    }
                    break;
            }
        });
    }

    const subscribeToTopic = useCallback((topicName: string) => {
        if (fcmToken) {
            const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FCM_WEB_API_KEY;
            // Subscribe to the topic
            const topicURL = `https://iid.googleapis.com/iid/v1/${fcmToken}/rel/topics/${topicName}`;
            return axios({
                url: topicURL,
                method: "POST",
                headers: {
                    Authorization: `key=${FIREBASE_API_KEY}`
                },
            }).catch(() => {
                console.error(`Can't subscribe to ${topicName} topic`);
            });
        }
    }, [fcmToken]);

    useEffect(() => {
        if (medical_professional) {
            console.log(`${general_information.roles[0]}-${medical_professional.uuid}`);
            subscribeToTopic(`${general_information.roles[0]}-${medical_professional.uuid}`);
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
                    getMessage();
                }
            } catch (error) {
                console.log(error);
            }
        }
    });

    return (
        <>
            {children}
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
                        minWidth: "40vw"
                    }
                }}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                    {lastUpdateNotification?.title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {lastUpdateNotification?.body}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Annuler
                    </Button>
                    <Button onClick={handleClose}>Valider</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default FcmLayout;

import {useEffect} from "react";
import "firebase/messaging";
import {firebaseCloudMessaging} from "@app/firebase";
import firebase from 'firebase/compat/app';

function FcmLayout({children}: LayoutProps) {

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
                    console.log("token", token);
                    getMessage();
                }
            } catch (error) {
                console.log(error);
            }
        }
    });

    // Get the push notification message and triggers a toast to display it
    function getMessage() {
        const messaging = firebase.messaging();
        messaging.onMessage((message) => {
            console.log(message);
        });
    }

    return (
        <>
            {children}
        </>
    );
}

export default FcmLayout;

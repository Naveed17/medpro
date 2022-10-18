import {initializeApp} from "firebase/app";
import {getMessaging, getToken} from "firebase/messaging";
import axios from "axios";

const firebaseCloudMessaging = {
    firebase: initializeApp({
        apiKey: process.env.NEXT_PUBLIC_FCM_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FCM_AUTH_DOMAIN,
        databaseURL: process.env.NEXT_PUBLIC_FCM_DATABASE_URL,
        projectId: process.env.NEXT_PUBLIC_FCM_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FCM_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FCM_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FCM_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FCM_MEASUREMENT_ID
    }),
    init: async () => {
        try {
            const messaging = getMessaging(firebaseCloudMessaging.firebase);
            const tokenInLocalForage = await localStorage.getItem("fcm_token");

            // Return the token if it is already in our local storage
            if (tokenInLocalForage !== null) {
                return tokenInLocalForage;
            }

            // Request the push notification permission from browser
            const status = await Notification.requestPermission();
            if (status && status === "granted") {
                const {data: pair_key} = await axios({
                    url: "/api/helper/server_env",
                    method: "POST",
                    data: {
                        key: "FCM_KEY_PAIR"
                    }
                });
                // Get new token from Firebase
                const fcm_token = await getToken(messaging, {
                    vapidKey: pair_key
                });

                // Set token in our local storage
                if (fcm_token) {
                    localStorage.setItem("fcm_token", fcm_token);
                    return fcm_token;
                }
            }
        } catch (error) {
            console.error("firebaseCloudMessaging", error);
            return null;
        }
    },
};
export {firebaseCloudMessaging};

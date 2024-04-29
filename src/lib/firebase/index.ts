import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {getMessaging, getToken} from "firebase/messaging";
import axios from "axios";
import {getFirestore} from "@firebase/firestore";
import {isAppleDevise, isSupported} from "@lib/hooks";

const firebaseCloudSdk = {
    firebase: initializeApp({
        apiKey: process.env.NEXT_PUBLIC_FCM_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FCM_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FCM_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FCM_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FCM_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FCM_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FCM_MEASUREMENT_ID
    }),
    init: async () => {
        try {
            //init firebase analytics
            const analytics = process.env.NODE_ENV !== 'development' && getAnalytics(firebaseCloudSdk.firebase);
            //init firebase messaging
            const messaging = (!isAppleDevise() && isSupported()) && getMessaging(firebaseCloudSdk.firebase);
            const firestore = getFirestore(firebaseCloudSdk.firebase);
            const tokenInLocalForage = localStorage.getItem("fcm_token");

            // Return the token if it is already in our local storage
            if (tokenInLocalForage !== null) {
                return {token: tokenInLocalForage, analytics, firestore};
            }

            // Request the push notification permission from browser
            if (messaging) {
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
                        return {token: fcm_token, analytics, firestore};
                    }
                } else {
                    console.log("requestPermission", status);
                    return {token: null, analytics: null, firestore: null};
                }
            } else {
                return {token: null, analytics, firestore};
            }
        } catch (error) {
            console.log("firebaseCloudMessaging", error);
            return {token: null, analytics: null, firestore: null};
        }
    },
};
export {firebaseCloudSdk};

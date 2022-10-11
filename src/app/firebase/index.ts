import firebase from 'firebase/compat/app';
import "firebase/compat/messaging";

const firebaseCloudMessaging = {
    init: async () => {
        if (!firebase?.apps?.length) {
            // Initialize the Firebase app with the credentials
            firebase?.initializeApp({
                apiKey: process.env.NEXT_PUBLIC_FCM_API_KEY,
                authDomain: process.env.NEXT_PUBLIC_FCM_AUTH_DOMAIN,
                databaseURL: process.env.NEXT_PUBLIC_FCM_DATABASE_URL,
                projectId: process.env.NEXT_PUBLIC_FCM_PROJECT_ID,
                storageBucket: process.env.NEXT_PUBLIC_FCM_STORAGE_BUCKET,
                messagingSenderId: process.env.NEXT_PUBLIC_FCM_MESSAGING_SENDER_ID,
                appId: process.env.NEXT_PUBLIC_FCM_APP_ID,
                measurementId: process.env.NEXT_PUBLIC_FCM_MEASUREMENT_ID
            });

            try {
                const messaging = firebase.messaging();
                const tokenInLocalForage = await localStorage.getItem("fcm_token");

                // Return the token if it is alredy in our local storage
                if (tokenInLocalForage !== null) {
                    return tokenInLocalForage;
                }

                // Request the push notification permission from browser
                const status = await Notification.requestPermission();
                if (status && status === "granted") {
                    // Get new token from Firebase
                    const fcm_token = await messaging.getToken({
                        vapidKey: process.env.NEXT_PUBLIC_FCM_KEY_PAIR
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
        }
    },
};
export { firebaseCloudMessaging };

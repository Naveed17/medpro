import "firebase/messaging";
import firebase from "firebase/compat";

const firebaseCloudMessaging = {
    init: async () => {
        if (!firebase?.apps?.length) {

            // Initialize the Firebase app with the credentials
            firebase?.initializeApp({
                apiKey: "AIzaSyCvTRLwdDiRw9yqErIQH66PxSd1rpEjfT0",
                authDomain: "android-app-291211.firebaseapp.com",
                databaseURL: "https://android-app-291211.firebaseio.com",
                projectId: "android-app-291211",
                storageBucket: "android-app-291211.appspot.com",
                messagingSenderId: "945400370872",
                appId: "1:945400370872:web:6023eb6b9235c48eac064d",
                measurementId: "G-PMY89G91XT"
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
                        vapidKey: "your_web_push_certificate_key_pair",
                    });

                    // Set token in our local storage
                    if (fcm_token) {
                        localStorage.setItem("fcm_token", fcm_token);
                        return fcm_token;
                    }
                }
            } catch (error) {
                console.error(error);
                return null;
            }
        }
    },
};
export { firebaseCloudMessaging };

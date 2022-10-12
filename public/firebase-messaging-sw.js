importScripts("https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FCM_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FCM_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FCM_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FCM_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FCM_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FCM_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FCM_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FCM_MEASUREMENT_ID
});

const messaging = firebase.messaging();

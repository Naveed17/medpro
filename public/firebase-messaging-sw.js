importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyCvG726dE6kIYfGaqc90pEfirK5lSdLUpM",
    authDomain: "medlink-3ce56.firebaseapp.com",
    projectId: "medlink-3ce56",
    storageBucket: "medlink-3ce56.appspot.com",
    messagingSenderId: "1098306173863",
    appId: "1:1098306173863:web:812fdf8cef13c4e8999482",
    measurementId: "G-H1ZS7R6SQJ"
});

const messaging = firebase.messaging();

// [START messaging_on_background_message]
messaging.onBackgroundMessage((payload) => {
    console.log(
        '[firebase-messaging-sw.js] Received background message ',
        payload
    );
});
// [END messaging_on_background_message]

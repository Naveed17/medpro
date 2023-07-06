importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyCvTRLwdDiRw9yqErIQH66PxSd1rpEjfT0",
    authDomain: "android-app-291211.firebaseapp.com",
    databaseURL: "https://android-app-291211.firebaseio.com",
    projectId: "android-app-291211",
    storageBucket: "android-app-291211.appspot.com",
    messagingSenderId: "945400370872",
    appId: "1:945400370872:web:6023eb6b9235c48eac064d",
    measurementId: "G-PMY89G91XT"
});

const messaging = firebase.messaging();

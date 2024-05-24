// next-i18next.config.js
const firestoreBackend = require("./i18next-firestore-backend.cjs");
const firebase = require("firebase/compat/app").default;
const {collection, getDocs, where, query} = require("firebase/firestore");
require("firebase/compat/firestore");

const ChainedBackend = require('i18next-chained-backend').default
const LocalStorageBackend = require('i18next-localstorage-backend').default

const isBrowser = typeof window !== 'undefined'
const isDev = process.env.NODE_ENV === 'development'

firebase.initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FCM_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FCM_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FCM_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FCM_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FCM_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FCM_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FCM_MEASUREMENT_ID,
});
const firestore = firebase.firestore();

module.exports = {
    i18n: {
        locales: ["fr", "en", "ar"], defaultLocale: "fr"
    },
    backend: {
        backendOptions: [{
            expirationTime: 60 * 60 * 1000, // 1 hour
        },
            ...(!isDev ? [{
                firestore,
                collectionName: "i18next",
                languageFieldName: "locales",
                namespaceFieldName: "ns",
                dataFieldName: "data",
                firestoreModule: {
                    isModular: true,
                    functions: {
                        collection,
                        query,
                        where,
                        getDocs
                    },
                }
            }] : [])],
        backends: isBrowser ? [LocalStorageBackend, ...(!isDev ? [firestoreBackend] : [])] : [],
    },
    serializeConfig: false,
    partialBundledLanguages: isBrowser && true,
    /*    react: { // used only for the lazy reload
            //bindI18n: 'languageChanged loaded',
            useSuspense: false
        },*/
    use: isBrowser ? [ChainedBackend] : [],
    /** To avoid issues when deploying to some paas (vercel...) */
    localePath: typeof window === 'undefined' ? require('path').resolve('./public/locales') : '/locales',
    reloadOnPrerender: isDev
};

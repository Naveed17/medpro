// next-i18next.config.js
const Backend = require("./i18next-firestore-backend.cjs");
const firebase = require("firebase/compat/app").default;
const {collection, getDocs, where, query} = require("firebase/firestore");
require("firebase/compat/firestore");

const ChainedBackend = require('i18next-chained-backend').default
const LocalStorageBackend = require('i18next-localstorage-backend').default

const isBrowser = typeof window !== 'undefined'
const isDev = process.env.NODE_ENV === 'development'

firebase.initializeApp({
    apiKey: "AIzaSyCvG726dE6kIYfGaqc90pEfirK5lSdLUpM",
    authDomain: "medlink-3ce56.firebaseapp.com",
    projectId: "medlink-3ce56",
    storageBucket: "medlink-3ce56.appspot.com",
    messagingSenderId: "1098306173863",
    appId: "1:1098306173863:web:812fdf8cef13c4e8999482",
    measurementId: "G-H1ZS7R6SQJ"
});
const firestore = firebase.firestore();

module.exports = {
    i18n: {
        locales: ["fr", "en", "ar"], defaultLocale: "fr"
    },
    backend: {
        backendOptions: [{
            expirationTime: 60 * 60 * 1000, // 1 hour
        }, ...(!isDev ? [{
            loadPath: `${process.env.NEXT_PUBLIC_CDN_API}/{{lng}}/{{ns}}.json`,
        }] : [])],
        firestore: firestore,
        collectionName: "locales",
        languageFieldName: "fr",
        namespaceFieldName: "common",
        dataFieldName: "data",
        debug: true,
        firestoreModule: {
            isModular: true,
            functions: {
                collection,
                query,
                where,
                getDocs
            },
        },
        backends: isBrowser ? [Backend] : [],
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

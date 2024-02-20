// next-i18next.config.js
const LocizeBackend = require('i18next-locize-backend/cjs')
const ChainedBackend = require('i18next-chained-backend').default
const LocalStorageBackend = require('i18next-localstorage-backend').default

const isBrowser = typeof window !== 'undefined'

const isDev = process.env.NODE_ENV === 'development'

module.exports = {
    i18n: {
        locales: ["fr", "en", "ar"], defaultLocale: "fr"
    },
    backend: {
        backendOptions: [{
            expirationTime: 60 * 60 * 1000 // 1 hour
        }, {
            projectId: '5f545f61-16a5-4006-80cd-c072b823269c', version: 'latest'
        }], backends: isBrowser ? [LocalStorageBackend, LocizeBackend] : [],
    },
    serializeConfig: false,
    partialBundledLanguages: isBrowser && true,
    use: isBrowser ? [ChainedBackend] : [],
    /** To avoid issues when deploying to some paas (vercel...) */
    localePath: typeof window === 'undefined' ? require('path').resolve('./public/locales') : '/locales',
    reloadOnPrerender: isDev,
    react: {useSuspense: false}
};

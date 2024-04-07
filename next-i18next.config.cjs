// next-i18next.config.js
const HttpBackend = require('i18next-http-backend').default
const ChainedBackend = require('i18next-chained-backend').default
const LocalStorageBackend = require('i18next-localstorage-backend').default

process.env.I18NEXT_DEFAULT_CONFIG_PATH = './next-i18next.config.cjs'

const isBrowser = typeof window !== 'undefined'

const isDev = process.env.NODE_ENV === 'development'

module.exports = {
    i18n: {
        locales: ["fr", "en", "ar"], defaultLocale: "fr"
    },
    backend: {
        backendOptions: [{
            expirationTime: 60 * 60 * 1000, // 1 hour
        }, ...(!isDev ? [{
            loadPath: `${process.env.NEXT_PUBLIC_CDN_API}/{{lng}}/{{ns}}.json`
        }] : [])], backends: isBrowser ? [LocalStorageBackend, HttpBackend] : [],
    },
    serializeConfig: false,
    partialBundledLanguages: isBrowser && true,
   /* react: { // used only for the lazy reload
        bindI18n: 'languageChanged loaded', useSuspense: false
    },*/
    use: isBrowser ? [ChainedBackend] : [],
    /** To avoid issues when deploying to some paas (vercel...) */
    localePath: typeof window === 'undefined' ? require('path').resolve('./public/locales') : '/locales',
    reloadOnPrerender: isDev
};
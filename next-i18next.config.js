module.exports = {
    i18n: {
        locales: ["fr", "en", "ar"],
        defaultLocale: "fr"
    },
    /** To avoid issues when deploying to some paas (vercel...) */
    localePath:
        typeof window === 'undefined'
            ? require('path').resolve('./public/locales')
            : '/locales',

    reloadOnPrerender: process.env.NODE_ENV === 'development',
    react: {useSuspense: false}
};

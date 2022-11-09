const {i18n} = require("./next-i18next.config");
const {withTM} = require("./next-fullcalendar.config");
const withPWA = require("next-pwa")({
    dest: "public",
    register: true,
    skipWaiting: true
});

const plugins = []

plugins.push(withPWA)

/**
 * @type {{}}
 */
const nextConfig = withTM({
    output: 'standalone',
    i18n,
    images: {
        domains: ["flagcdn.com", process.env.S3_URL || '']
    },
    webpack: (config, {nextRuntime}) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack", "url-loader"]
        });
        return config;
    }
});

module.exports = () => plugins.reduce((acc, next) => next(acc), nextConfig)


const {i18n} = require("./next-i18next.config");
const {withTM} = require("./next-fullcalendar.config");

/** @type {{}} */
const nextConfig = withTM({
    output: 'standalone',
    reactStrictMode: false,
    i18n,
    images: {
        domains: ["flagcdn.com", process.env.S3_MED_CORE]
    },
    webpack: (config, {nextRuntime}) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack", "url-loader"]
        });
        return config;
    }
});

module.exports = nextConfig;

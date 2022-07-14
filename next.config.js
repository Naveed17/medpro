const {i18n} = require("./next-i18next.config");
const {withTM} = require("./next-fullcalendar.config");
const path = require("path");

/** @type {{}} */
const nextConfig = withTM({
    i18n,
    webpack: (config,  { nextRuntime }) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack', 'url-loader']
        })
        // Undocumented property of next 12.
        if (nextRuntime !== "nodejs") return config;
        return {
            ...config,
            entry() {
                return config.entry().then((entry) => ({
                    ...entry,
                    cli: path.resolve(process.cwd(), "lib/cli.ts"),
                }));
            },
        };
    }
})

module.exports = nextConfig

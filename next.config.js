const {i18n} = require("./next-i18next.config");
const {withTM} = require("./next-fullcalendar.config");
const {withSentryConfig} = require('@sentry/nextjs');
const plugins = [];

const withPWA = require("next-pwa")({
    dest: "public",
    register: true,
    disable: process.env.NODE_ENV === 'development',
    skipWaiting: true
});
plugins.push(withPWA);

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

plugins.push(withBundleAnalyzer);
/**
 * @type {{}}
 */
const nextConfig = withTM({
    output: 'standalone',
    i18n,
    images: {
        dangerouslyAllowSVG: true,
        domains: ["flagcdn.com", process.env.S3_URL || '']
    },
    sentry: {
        hideSourceMaps: process.env.NODE_ENV !== 'development'
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack", "url-loader"]
        });
        return config;
    }
});

moduleExports = () => plugins.reduce((acc, next) => next(acc), nextConfig)

const sentryWebpackPluginOptions = {
    // Additional config options for the Sentry Webpack plugin. Keep in mind that
    // the following options are set automatically, and overriding them is not
    // recommended:
    //   release, url, org, project, authToken, configFile, stripPrefix,
    //   urlPrefix, include, ignore
    dryRun: process.env.VERCEL_ENV !== "production",
    silent: true // Suppresses all logs
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options.
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);

import {withSentryConfig} from "@sentry/nextjs";
import withSerwistInit from "@serwist/next";
import NextBundleAnalyzer from "@next/bundle-analyzer";

const plugins = [];

const withPWA = withSerwistInit({
    // Note: This is only an example. If you use Pages Router,
    // use something else that works, such as "service-worker/index.ts".
    cacheOnNavigation: true,
    swSrc: "service-worker/index.ts",
    swDest: "public/sw.js",
    maximumFileSizeToCacheInBytes: 10000000,
    reloadOnOnline: true,
    disable: process.env.NODE_ENV === "development", // to disable pwa in development
});
plugins.push(withPWA);

const withBundleAnalyzer = NextBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
    openAnalyzer: false
});

plugins.push(withBundleAnalyzer);
/**
 * @type {{}}
 */
const nextConfig = {
    output: 'standalone',
    i18n: {
        locales: ["fr", "en", "ar"], defaultLocale: "fr"
    },
    experimental: {
        nextScriptWorkers: false
    },
    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'flagcdn.com',
                port: '',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: process.env.S3_PUBLIC_API || '',
                port: '',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: process.env.S3_URL || '',
                port: '',
                pathname: '**',
            }]
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
}

const moduleExports = async () => plugins.reduce((acc, next) => next(acc), nextConfig)

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
export default withSentryConfig(moduleExports, sentryWebpackPluginOptions);

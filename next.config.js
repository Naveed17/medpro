const { i18n } = require("./next-i18next.config");
const { withTM } = require("./next-fullcalendar.config");

/** @type {{}} */
const nextConfig = withTM({
  output: 'standalone',
  reactStrictMode: false,
  i18n,
  images: {
    domains: ["flagcdn.com","s3-med-core-develop.med.ovh"]
  },
  webpack: (config, { nextRuntime }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack", "url-loader"]
    });
    return config;
  }
});

module.exports = nextConfig;

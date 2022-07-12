const { i18n } = require("./next-i18next.config");
const {withTM} = require("./next-fullcalendar.config");

/** @type {{}} */
const nextConfig = withTM({
  i18n,
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack', 'url-loader']
    })
    return config
  }
})

module.exports = nextConfig

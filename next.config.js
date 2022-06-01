const { i18n } = require("./next-i18next.config");

/** @type {{reactStrictMode: boolean, i18n: {defaultLocale: string, locales: string[], localeDetection: boolean}}} */
const nextConfig = {
  reactStrictMode: false,
  i18n,
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack', 'url-loader']
    })
    return config
  }
}

module.exports = nextConfig

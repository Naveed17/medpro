const { i18n } = require("./next-i18next.config");

/** @type {{reactStrictMode: boolean, i18n: {defaultLocale: string, locales: string[], localeDetection: boolean}}} */
const nextConfig = {
  reactStrictMode: true,
  i18n
}

module.exports = nextConfig

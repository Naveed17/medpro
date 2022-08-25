const path = require("path");

module.exports = {
  i18n: {
    locales: ["fr", "ar", "en"],
    defaultLocale: "fr",
    localeDetection: true
  },
  localePath: path.resolve('./public/locales'),
  react: { useSuspense: false }
};

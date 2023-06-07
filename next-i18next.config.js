const path = require("path");
// , "ar", "en"
module.exports = {
  i18n: {
    locales: ["fr","en"],
    defaultLocale: "fr",
    localeDetection: true
  },
  localePath: path.resolve('./public/locales'),
  react: { useSuspense: false }
};

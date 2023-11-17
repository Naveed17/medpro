const path = require("path");
// , "ar", "en"
module.exports = {
  i18n: {
    locales: ["fr","en"],
    defaultLocale: "fr"
  },
  localePath: path.resolve('./public/locales'),
  react: { useSuspense: false }
};

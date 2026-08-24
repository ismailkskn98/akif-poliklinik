const i18next = require("i18next");
const middleware = require("i18next-http-middleware");

const supportedLanguages = ["tr", "en", "de", "he", "fr", "ar", "it", "es", "zh"];
const resources = Object.fromEntries(
  supportedLanguages.map((language) => [
    language,
    {
      translation: require(`../akifClinic/v1/locales/${language}.json`),
    },
  ]),
);

i18next.use(middleware.LanguageDetector).init({
  fallbackLng: "tr",
  supportedLngs: supportedLanguages,
  load: "languageOnly",
  resources,
  detection: {
    order: ["header"],
    lookupHeader: "accept-language",
    caches: false,
  },
});

module.exports = { i18next, i18nMiddleware: middleware.handle(i18next) };

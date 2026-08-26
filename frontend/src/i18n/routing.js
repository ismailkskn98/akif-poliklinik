import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["tr", "en", "de", "he", "fr", "ar", "it", "es", "zh"],
  defaultLocale: "tr",
  localePrefix: "as-needed",
  localeDetection: false,
  pathnames: {
    "/": "/",
    "/privacy-notice": {
      tr: "/kvkk-aydinlatma-metni",
    },
    "/authorization-document": {
      tr: "/yetki-belgesi",
    },
    "/doctors": {
      tr: "/doktorlar",
      en: "/doctors",
      de: "/aerzte",
      he: "/doctors",
      fr: "/medecins",
      ar: "/doctors",
      it: "/medici",
      es: "/doctores",
      zh: "/doctors",
    },
  },
});

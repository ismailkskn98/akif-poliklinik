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
    "/treatments": {
      tr: "/tedaviler",
      en: "/treatments",
      de: "/behandlungen",
      he: "/treatments",
      fr: "/traitements",
      ar: "/treatments",
      it: "/trattamenti",
      es: "/tratamientos",
      zh: "/treatments",
    },
    "/treatments/[slug]": {
      tr: "/tedaviler/[slug]",
      en: "/treatments/[slug]",
      de: "/behandlungen/[slug]",
      he: "/treatments/[slug]",
      fr: "/traitements/[slug]",
      ar: "/treatments/[slug]",
      it: "/trattamenti/[slug]",
      es: "/tratamientos/[slug]",
      zh: "/treatments/[slug]",
    },
  },
});

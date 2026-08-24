import { siteConfig } from "@/config/site";
import { getTreatmentHref, treatments } from "@/content/treatments";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const routes = [
  { href: "/", changeFrequency: "weekly", priority: 1 },
  { href: "/treatments", changeFrequency: "monthly", priority: 0.9 },
  { href: "/authorization-document", changeFrequency: "yearly", priority: 0.5 },
  { href: "/privacy-notice", changeFrequency: "yearly", priority: 0.4 },
];

function getUrl(locale, href) {
  return new URL(getPathname({ locale, href }), siteConfig.siteUrl).toString();
}

export default function sitemap() {
  const staticEntries = routes.flatMap((route) => {
    const languages = Object.fromEntries(
      routing.locales.map((locale) => [locale, getUrl(locale, route.href)]),
    );

    return routing.locales.map((locale) => ({
      url: getUrl(locale, route.href),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: { languages },
    }));
  });

  const treatmentEntries = treatments.flatMap((treatment) => {
    const languages = Object.fromEntries(
      routing.locales.map((locale) => [
        locale,
        getUrl(locale, getTreatmentHref(treatment, locale)),
      ]),
    );

    return routing.locales.map((locale) => ({
      url: getUrl(locale, getTreatmentHref(treatment, locale)),
      changeFrequency: "monthly",
      priority: 0.75,
      alternates: { languages },
    }));
  });

  return [...staticEntries, ...treatmentEntries];
}

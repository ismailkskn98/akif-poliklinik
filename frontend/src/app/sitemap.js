import { siteConfig } from "@/config/site";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getPublicSiteSettings } from "@/lib/siteSettings";

const routes = [
  { href: "/", changeFrequency: "weekly", priority: 1 },
  { href: "/doctors", changeFrequency: "monthly", priority: 0.8 },
  { href: "/authorization-document", changeFrequency: "yearly", priority: 0.5 },
  { href: "/privacy-notice", changeFrequency: "yearly", priority: 0.4 },
];

function getUrl(locale, href) {
  return new URL(getPathname({ locale, href }), siteConfig.siteUrl).toString();
}

export default async function sitemap() {
  const settings = await getPublicSiteSettings();
  const visibleRoutes = settings.authorizationDocumentUrl
    ? routes
    : routes.filter(({ href }) => href !== "/authorization-document");
  const staticEntries = visibleRoutes.flatMap((route) => {
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

  return staticEntries;
}

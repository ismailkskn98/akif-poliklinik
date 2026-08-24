import { getTranslations } from "next-intl/server";

import { siteConfig } from "@/config/site";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function getAbsoluteUrl(locale, pathname) {
  const localizedPathname = getPathname({ locale, href: pathname });
  return new URL(localizedPathname, siteConfig.siteUrl).toString();
}

export async function createPageMetadata({
  locale,
  pathname,
  titleKey,
  descriptionKey,
  title,
  description,
}) {
  const translations = title && description
    ? null
    : await getTranslations({ locale, namespace: "Pages" });
  const languages = Object.fromEntries(
    routing.locales.map((language) => [
      language,
      getAbsoluteUrl(language, pathname),
    ]),
  );

  return {
    title: title || translations(titleKey),
    description: description || translations(descriptionKey),
    alternates: {
      canonical: getAbsoluteUrl(locale, pathname),
      languages: {
        ...languages,
        "x-default": getAbsoluteUrl(routing.defaultLocale, pathname),
      },
    },
  };
}

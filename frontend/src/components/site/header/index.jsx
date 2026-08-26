import { getTranslations } from "next-intl/server";

import { getPublicSiteSettings } from "@/lib/siteSettings";

import NavigationShell from "./navigationShell";

export default async function Header({ locale }) {
  const translations = await getTranslations({ locale, namespace: "Navigation" });
  const settings = await getPublicSiteSettings();
  const labels = {
    ariaLabel: translations("ariaLabel"),
    authorization: translations("authorization"),
    call: translations("call"),
    close: translations("close"),
    doctors: translations("doctors"),
    home: translations("home"),
    languages: translations("languages"),
    menu: translations("menu"),
    privacy: translations("privacy"),
  };

  return (
    <NavigationShell
      currentLocale={locale}
      labels={labels}
      settings={settings}
    />
  );
}

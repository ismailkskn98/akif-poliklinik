import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import localFont from "next/font/local";
import { notFound } from "next/navigation";

import Footer from "@/components/site/footer";
import Header from "@/components/site/header";
import CookieConsent from "@/components/site/cookieConsent";
import SiteMotion from "@/components/site/siteMotion";
import { siteConfig } from "@/config/site";
import { siteTheme } from "@/config/theme";
import { routing } from "@/i18n/routing";

import "../../globals.css";

const rtlLocales = new Set(["ar", "he"]);
const openGraphLocales = {
  tr: "tr_TR",
  en: "en_US",
  de: "de_DE",
  he: "he_IL",
  fr: "fr_FR",
  ar: "ar_SA",
  it: "it_IT",
  es: "es_ES",
  zh: "zh_CN",
};
const siteMotionBootScript = `document.documentElement.dataset.motion = "enabled";`;
const geistSans = localFont({
  src: "../../../../node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  style: "normal",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport = {
  colorScheme: "light",
  themeColor: siteTheme.colors.primary,
};

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const translations = await getTranslations({ locale, namespace: "Metadata" });
  const siteUrl = siteConfig.siteUrl.replace(/\/$/, "");
  const canonical = locale === routing.defaultLocale ? siteUrl : `${siteUrl}/${locale}`;
  const socialImageUrl = new URL("/images/social/akif-poliklinik-og-v2.png", siteUrl).toString();
  const languages = Object.fromEntries(routing.locales.map((language) => [language, language === routing.defaultLocale ? siteUrl : `${siteUrl}/${language}`]));
  const title = translations("title");
  const description = translations("description");

  return {
    metadataBase: new URL(siteUrl),
    applicationName: translations("brand"),
    title: {
      default: title,
      template: `%s | ${translations("brand")}`,
    },
    description,
    manifest: "/manifest.webmanifest",
    alternates: {
      canonical,
      languages: {
        ...languages,
        "x-default": siteUrl,
      },
    },
    openGraph: {
      type: "website",
      siteName: translations("brand"),
      title,
      description,
      url: canonical,
      locale: openGraphLocales[locale],
      alternateLocale: routing.locales.filter((language) => language !== locale).map((language) => openGraphLocales[language]),
      images: [
        {
          url: socialImageUrl,
          width: 1200,
          height: 630,
          alt: translations("brand"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: socialImageUrl,
          alt: translations("brand"),
        },
      ],
    },
    category: "health",
  };
}

export default async function SiteLayout({ children, params }) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const consentTranslations = await getTranslations({
    locale,
    namespace: "CookieConsent",
  });
  const consentLabels = {
    acceptAll: consentTranslations("acceptAll"),
    active: consentTranslations("active"),
    alwaysActive: consentTranslations("alwaysActive"),
    close: consentTranslations("close"),
    consentCookieDescription: consentTranslations("consentCookieDescription"),
    description: consentTranslations("description"),
    detailsTitle: consentTranslations("detailsTitle"),
    externalMediaDescription: consentTranslations("externalMediaDescription"),
    externalMediaTitle: consentTranslations("externalMediaTitle"),
    firstParty: consentTranslations("firstParty"),
    inactive: consentTranslations("inactive"),
    mapsCookieDescription: consentTranslations("mapsCookieDescription"),
    necessaryDescription: consentTranslations("necessaryDescription"),
    necessaryTitle: consentTranslations("necessaryTitle"),
    preferences: consentTranslations("preferences"),
    providerDuration: consentTranslations("providerDuration"),
    rejectOptional: consentTranslations("rejectOptional"),
    savePreferences: consentTranslations("savePreferences"),
    settingsDescription: consentTranslations("settingsDescription"),
    settingsEyebrow: consentTranslations("settingsEyebrow"),
    settingsTitle: consentTranslations("settingsTitle"),
    sixMonths: consentTranslations("sixMonths"),
    thirdParty: consentTranslations("thirdParty"),
    title: consentTranslations("title"),
  };

  return (
    <html
      lang={locale}
      dir={rtlLocales.has(locale) ? "rtl" : "ltr"}
      className={geistSans.variable}
      data-scroll-behavior="smooth"
      data-site-theme={siteTheme.name}
      style={siteTheme.style}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: siteMotionBootScript }} />
      </head>
      <body
        className="
    relative
    min-h-dvh
    bg-background
    before:content-['']
    before:absolute
    before:inset-0
    before:bg-[url('/images/footer-bg-pattern.png')]
    before:bg-center
    before:bg-repeat
    before:opacity-[0.02]
    before:pointer-events-none
    before:select-none
  "
      >
        <div className="relative z-10">
          <NextIntlClientProvider locale={locale} messages={null}>
            <SiteMotion>
              <Header locale={locale} />
              <main>{children}</main>
              <Footer locale={locale} />
            </SiteMotion>
            <CookieConsent labels={consentLabels} />
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}

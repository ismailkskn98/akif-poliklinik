import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import localFont from "next/font/local";
import { notFound } from "next/navigation";

import Footer from "@/components/site/footer";
import Header from "@/components/site/header";
import SiteMotion from "@/components/site/siteMotion";
import { routing } from "@/i18n/routing";

import "../../globals.css";

const rtlLocales = new Set(["ar", "he"]);
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

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const translations = await getTranslations({ locale, namespace: "Metadata" });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const canonical = locale === routing.defaultLocale ? siteUrl : `${siteUrl}/${locale}`;
  const languages = Object.fromEntries(
    routing.locales.map((language) => [
      language,
      language === routing.defaultLocale ? siteUrl : `${siteUrl}/${language}`,
    ]),
  );

  return {
    title: {
      default: translations("title"),
      template: `%s | ${translations("brand")}`,
    },
    description: translations("description"),
    alternates: {
      canonical,
      languages: {
        ...languages,
        "x-default": siteUrl,
      },
    },
  };
}

export default async function SiteLayout({ children, params }) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      dir={rtlLocales.has(locale) ? "rtl" : "ltr"}
      className={geistSans.variable}
    >
      <body>
        <NextIntlClientProvider locale={locale} messages={null}>
          <SiteMotion />
          <Header locale={locale} />
          <main>{children}</main>
          <Footer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

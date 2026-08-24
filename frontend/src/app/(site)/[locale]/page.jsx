import { getTranslations, setRequestLocale } from "next-intl/server";

import Contact from "@/components/site/contact";
import JsonLd from "@/components/site/jsonLd";
import LocationMap from "@/components/site/locationMap";
import { siteConfig } from "@/config/site";
import { getPrivacyNotice, privacyNoticeVersion } from "@/content/privacyNotice";
import { getPublicSiteSettings } from "@/lib/siteSettings";

export default async function HomePage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const translations = await getTranslations({ locale, namespace: "Home" });
  const privacyTranslations = await getTranslations({ locale, namespace: "Pages.privacy" });
  const consentTranslations = await getTranslations({ locale, namespace: "CookieConsent" });
  const settings = await getPublicSiteSettings();
  const privacyNotice = getPrivacyNotice(locale);
  const logoUrl = new URL("/images/logo/main-logo.png", siteConfig.siteUrl).toString();

  const contact = {
    callTitle: translations("contact.callTitle"),
    addressTitle: translations("contact.addressTitle"),
    writeTitle: translations("contact.writeTitle"),
    form: {
      fullName: translations("contact.form.fullName"),
      phone: translations("contact.form.phone"),
      email: translations("contact.form.email"),
      message: translations("contact.form.message"),
      submit: translations("contact.form.submit"),
      sending: translations("contact.form.sending"),
      success: translations("contact.form.success"),
      error: translations("contact.form.error"),
      privacyLink: translations("contact.form.privacyLink"),
      privacyAcknowledgement: translations("contact.form.privacyAcknowledgement"),
      validation: {
        required: translations("contact.form.validation.required"),
        invalidEmail: translations("contact.form.validation.invalidEmail"),
        privacyRequired: translations("contact.form.validation.privacyRequired"),
      },
    },
  };

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "MedicalClinic",
          "@id": `${siteConfig.siteUrl}/#clinic`,
          name: siteConfig.name,
          url: siteConfig.siteUrl,
          logo: logoUrl,
          image: logoUrl,
          telephone: settings.phones.map((phone) => phone.label),
          address: settings.address,
          sameAs: [settings.instagramUrl],
        }}
      />

      <Contact
        translations={contact}
        locale={locale}
        privacyNotice={{
          address: settings.address,
          labels: {
            close: privacyTranslations("close"),
            eyebrow: privacyTranslations("eyebrow"),
            title: privacyTranslations("title"),
          },
          notice: privacyNotice,
          version: privacyNoticeVersion,
        }}
        settings={settings}
      />
      <LocationMap
        consentLabels={{
          enableMap: consentTranslations("enableMap"),
          mapDescription: consentTranslations("mapDescription"),
          mapTitle: consentTranslations("mapTitle"),
        }}
        title={translations("mapTitle")}
        settings={settings}
      />
    </>
  );
}

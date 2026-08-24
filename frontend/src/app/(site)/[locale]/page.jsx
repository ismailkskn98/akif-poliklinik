import { getTranslations, setRequestLocale } from "next-intl/server";

import Contact from "@/components/site/contact";
import JsonLd from "@/components/site/jsonLd";
import LocationMap from "@/components/site/locationMap";
import { siteConfig } from "@/config/site";

export default async function HomePage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const translations = await getTranslations({ locale, namespace: "Home" });

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
      validation: {
        required: translations("contact.form.validation.required"),
        invalidEmail: translations("contact.form.validation.invalidEmail"),
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
          telephone: siteConfig.phones.map((phone) => phone.label),
          address: siteConfig.address,
          sameAs: [siteConfig.instagramUrl],
        }}
      />

      <Contact translations={contact} locale={locale} />
      <LocationMap title={translations("mapTitle")} />
    </>
  );
}

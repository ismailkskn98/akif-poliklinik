export function createPhoneHref(phoneNumber) {
  const digits = phoneNumber.replace(/\D/g, "");
  const internationalNumber = digits.startsWith("0")
    ? `90${digits.slice(1)}`
    : digits;

  return `tel:+${internationalNumber}`;
}

const address =
  "(Lotus Walk Nişantaşı) Halaskargazi Cd. No:38/66 Kat:6 Daire:109, 34371 Şişli/İstanbul";
const mapShareUrl = "https://maps.app.goo.gl/1GC2b1vs46bE8nZz9";
const mapEmbedUrl =
  "https://maps.google.com/maps?q=41.0516039%2C28.987723&t=m&z=17&output=embed&iwloc=near";
const phoneNumbers = [
  "0532 446 90 39",
  "0533 152 38 93",
  "0532 352 43 88",
  "0533 151 32 89",
];

export const siteConfig = {
  name: "Akif Poliklinik",
  primaryColor: "#516FC9",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  address,
  mapShareUrl,
  phones: phoneNumbers.map((phoneNumber) => ({
    label: phoneNumber,
    href: createPhoneHref(phoneNumber),
  })),
  instagramUrl: "https://www.instagram.com/akif_poliklinik/",
  authorizationDocumentPath:
    "/documents/international-health-tourism-authorization.jpg",
  mapEmbedUrl,
};

export const localeLabels = {
  tr: "Türkçe",
  en: "English",
  de: "Deutsch",
  he: "עברית",
  fr: "Français",
  ar: "العربية",
  it: "Italiano",
  es: "Español",
  zh: "中文",
};

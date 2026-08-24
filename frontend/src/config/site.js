export const siteConfig = {
  name: "Akif Poliklinik",
  primaryColor: "#435EB7",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  address:
    "Lotus Walk Nişantaşı, Halaskargazi Cd. No:38/66 Kat:6 Daire:109, 34371 Şişli/İstanbul",
  phones: [
    { label: "0532 446 90 39", href: "tel:+905324469039" },
    { label: "0533 152 38 93", href: "tel:+905331523893" },
    { label: "0532 352 43 88", href: "tel:+905323524388" },
    { label: "0533 151 32 89", href: "tel:+905331513289" },
  ],
  instagramUrl: "https://www.instagram.com/akif_poliklinik/",
  authorizationDocumentPath:
    "/documents/international-health-tourism-authorization.jpg",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Lotus%20Walk%20Ni%C5%9Fanta%C5%9F%C4%B1%20Halaskargazi%20Cd.%20No%3A38%2F66&t=m&z=14&output=embed&iwloc=near",
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

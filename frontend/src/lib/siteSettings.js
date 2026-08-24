import { cache } from "react";

import {
  createMapEmbedUrl,
  createPhoneHref,
  siteConfig,
} from "@/config/site";

const fallbackSettings = {
  instagramUrl: siteConfig.instagramUrl,
  phones: siteConfig.phones,
  address: siteConfig.address,
  authorizationDocumentUrl: siteConfig.authorizationDocumentPath,
  mapEmbedUrl: siteConfig.mapEmbedUrl,
  updatedAt: null,
};

function normalizeSettings(settings) {
  const phoneNumbers = Array.isArray(settings.phoneNumbers)
    ? settings.phoneNumbers.filter(
        (phoneNumber) => typeof phoneNumber === "string" && phoneNumber.trim(),
      )
    : [];
  const address =
    typeof settings.address === "string" && settings.address.trim()
      ? settings.address.trim()
      : fallbackSettings.address;

  return {
    instagramUrl:
      typeof settings.instagramUrl === "string" && settings.instagramUrl.trim()
        ? settings.instagramUrl.trim()
        : fallbackSettings.instagramUrl,
    phones: phoneNumbers.length
      ? phoneNumbers.map((phoneNumber) => ({
          label: phoneNumber,
          href: createPhoneHref(phoneNumber),
        }))
      : fallbackSettings.phones,
    address,
    authorizationDocumentUrl:
      typeof settings.authorizationDocumentUrl === "string" &&
      settings.authorizationDocumentUrl.trim()
        ? settings.authorizationDocumentUrl.trim()
        : fallbackSettings.authorizationDocumentUrl,
    mapEmbedUrl: createMapEmbedUrl(address),
    updatedAt: settings.updatedAt || null,
  };
}

export const getPublicSiteSettings = cache(async () => {
  const apiBaseUrl =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:4000/api/akifclinic/v1";

  try {
    const response = await fetch(`${apiBaseUrl}/public/site-settings`, {
      cache: "no-store",
      headers: { "Accept-Language": "tr" },
      signal: AbortSignal.timeout(2500),
    });

    if (!response.ok) {
      return fallbackSettings;
    }

    const payload = await response.json();
    return normalizeSettings(payload.data || {});
  } catch {
    return fallbackSettings;
  }
});

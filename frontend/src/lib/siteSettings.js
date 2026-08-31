import { cache } from "react";

import {
  createPhoneHref,
  siteConfig,
} from "@/config/site";
import { resolveBackendAssetUrl } from "@/lib/imageSource";

const fallbackSettings = {
  instagramUrl: siteConfig.instagramUrl,
  phones: siteConfig.phones,
  address: siteConfig.address,
  mapShareUrl: siteConfig.mapShareUrl,
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
  const mapShareUrl =
    typeof settings.mapShareUrl === "string" && settings.mapShareUrl.trim()
      ? settings.mapShareUrl.trim()
      : fallbackSettings.mapShareUrl;
  const mapEmbedUrl =
    typeof settings.mapEmbedUrl === "string" &&
    settings.mapEmbedUrl.startsWith("https://maps.google.com/maps?")
      ? settings.mapEmbedUrl
      : fallbackSettings.mapEmbedUrl;

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
    mapShareUrl,
    authorizationDocumentUrl:
      typeof settings.authorizationDocumentUrl === "string"
        ? resolveBackendAssetUrl(settings.authorizationDocumentUrl.trim())
        : fallbackSettings.authorizationDocumentUrl,
    mapEmbedUrl,
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

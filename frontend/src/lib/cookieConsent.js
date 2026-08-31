export const COOKIE_CONSENT_NAME = "akif_cookie_consent";
export const COOKIE_CONSENT_VERSION = "2026-08-24";
export const COOKIE_CONSENT_CHANGED_EVENT = "akif:cookie-consent-changed";
export const OPEN_COOKIE_SETTINGS_EVENT = "akif:open-cookie-settings";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 180;

export const cookieConsentBootScript = `
(function () {
  try {
    var cookiePrefix = ${JSON.stringify(`${COOKIE_CONSENT_NAME}=`)};
    var rawValue = document.cookie
      .split(";")
      .map(function (cookie) { return cookie.trim(); })
      .find(function (cookie) { return cookie.indexOf(cookiePrefix) === 0; });

    if (!rawValue) return;

    var consent = JSON.parse(decodeURIComponent(rawValue.slice(cookiePrefix.length)));

    if (
      consent.version === ${JSON.stringify(COOKIE_CONSENT_VERSION)} &&
      typeof consent.externalMedia === "boolean"
    ) {
      document.documentElement.dataset.cookieConsent = "stored";
    }
  } catch {}
})();`;

export function getCookieConsentSnapshot() {
  if (typeof document === "undefined") {
    return "";
  }

  const cookiePrefix = `${COOKIE_CONSENT_NAME}=`;
  const rawValue = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(cookiePrefix))
    ?.slice(cookiePrefix.length);

  return rawValue || "";
}

export function getServerCookieConsentSnapshot() {
  return "";
}

export function parseCookieConsent(rawValue) {
  if (!rawValue) {
    return null;
  }

  try {
    const consent = JSON.parse(decodeURIComponent(rawValue));

    if (
      consent.version !== COOKIE_CONSENT_VERSION ||
      typeof consent.externalMedia !== "boolean"
    ) {
      return null;
    }

    return consent;
  } catch {
    return null;
  }
}

export function readCookieConsent() {
  return parseCookieConsent(getCookieConsentSnapshot());
}

export function subscribeToCookieConsent(listener) {
  window.addEventListener(COOKIE_CONSENT_CHANGED_EVENT, listener);
  return () => window.removeEventListener(COOKIE_CONSENT_CHANGED_EVENT, listener);
}

export function saveCookieConsent({ externalMedia }) {
  const consent = {
    version: COOKIE_CONSENT_VERSION,
    necessary: true,
    externalMedia: Boolean(externalMedia),
    updatedAt: new Date().toISOString(),
  };
  const secureAttribute = window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie = `${COOKIE_CONSENT_NAME}=${encodeURIComponent(JSON.stringify(consent))}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax${secureAttribute}`;
  document.documentElement.dataset.cookieConsent = "stored";
  window.dispatchEvent(
    new CustomEvent(COOKIE_CONSENT_CHANGED_EVENT, { detail: consent }),
  );

  return consent;
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));
}

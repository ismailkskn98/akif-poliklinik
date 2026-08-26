const supportedLocales = new Set(["tr", "en", "de", "he", "fr", "ar", "it", "es", "zh"]);
const privacyNoticeVersion = "2026-08-24";

function normalizeOptionalText(value) {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();
  return normalizedValue || null;
}

function validateContactRequest(body, requestLocale) {
  const fullName = normalizeOptionalText(body.fullName);
  const phone = normalizeOptionalText(body.phone);
  const email = normalizeOptionalText(body.email);
  const message = normalizeOptionalText(body.message);
  const website = normalizeOptionalText(body.website);
  const acknowledgedPrivacyNotice = body.privacyNoticeAcknowledged === true;
  const submittedPrivacyNoticeVersion = normalizeOptionalText(body.privacyNoticeVersion);

  if (
    !fullName ||
    fullName.length < 2 ||
    fullName.length > 150 ||
    (message && message.length > 2000) ||
    !phone
  ) {
    return { isValid: false, messageKey: "contact.invalidFields" };
  }

  if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
    return { isValid: false, messageKey: "contact.invalidPhone" };
  }

  if (email && (email.length > 190 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    return { isValid: false, messageKey: "contact.invalidEmail" };
  }

  if (
    !acknowledgedPrivacyNotice ||
    submittedPrivacyNoticeVersion !== privacyNoticeVersion
  ) {
    return { isValid: false, messageKey: "contact.privacyNoticeRequired" };
  }

  return {
    isValid: true,
    isSpam: Boolean(website),
    values: {
      fullName,
      phone,
      email,
      message,
      locale: supportedLocales.has(requestLocale) ? requestLocale : "tr",
      privacyNoticeVersion,
    },
  };
}

module.exports = validateContactRequest;

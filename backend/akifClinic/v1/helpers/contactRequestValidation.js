const supportedLocales = new Set(["tr", "en", "de", "he", "fr", "ar", "it", "es", "zh"]);
const privacyNoticeVersion = "2026-08-24";

function normalizeOptionalText(value, maximumLength) {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();
  return normalizedValue ? normalizedValue.slice(0, maximumLength) : null;
}

function validateContactRequest(body, requestLocale) {
  const fullName = normalizeOptionalText(body.fullName, 150);
  const phone = normalizeOptionalText(body.phone, 50);
  const email = normalizeOptionalText(body.email, 190);
  const message = normalizeOptionalText(body.message, 2000);
  const website = normalizeOptionalText(body.website, 200);
  const acknowledgedPrivacyNotice = body.privacyNoticeAcknowledged === true;
  const submittedPrivacyNoticeVersion = normalizeOptionalText(
    body.privacyNoticeVersion,
    40,
  );

  if (!fullName || fullName.length < 2 || !phone || phone.length < 7) {
    return { isValid: false, messageKey: "contact.invalidFields" };
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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

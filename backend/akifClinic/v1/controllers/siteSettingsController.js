const path = require("node:path");
const { URL } = require("node:url");

const { sendError, sendSuccess } = require("../../../general_helpers/response");
const siteSettingsService = require("../services/siteSettingsService");

function isValidUrl(value, { allowRelative = false } = {}) {
  if (allowRelative && value.startsWith("/")) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validateSettings(body) {
  const instagramUrl = typeof body.instagramUrl === "string" ? body.instagramUrl.trim() : "";
  const address = typeof body.address === "string" ? body.address.trim() : "";
  const authorizationDocumentUrl =
    typeof body.authorizationDocumentUrl === "string"
      ? body.authorizationDocumentUrl.trim()
      : "";
  const phoneNumbers = Array.isArray(body.phoneNumbers)
    ? body.phoneNumbers.map((phoneNumber) => String(phoneNumber).trim()).filter(Boolean)
    : [];
  const publicApiOrigin = new URL(
    process.env.PUBLIC_API_URL || "http://localhost:4000",
  ).origin;
  let isValidDocumentUrl = authorizationDocumentUrl.startsWith("/");

  if (!isValidDocumentUrl) {
    try {
      isValidDocumentUrl = new URL(authorizationDocumentUrl).origin === publicApiOrigin;
    } catch {
      isValidDocumentUrl = false;
    }
  }

  const isValid =
    isValidUrl(instagramUrl) &&
    instagramUrl.length <= 500 &&
    address.length >= 10 &&
    address.length <= 1000 &&
    phoneNumbers.length >= 1 &&
    phoneNumbers.length <= 6 &&
    phoneNumbers.every(
      (phoneNumber) => phoneNumber.length >= 7 && phoneNumber.length <= 40,
    ) &&
    authorizationDocumentUrl.length <= 500 &&
    isValidUrl(authorizationDocumentUrl, { allowRelative: true }) &&
    isValidDocumentUrl;

  return {
    isValid,
    values: {
      instagramUrl,
      phoneNumbers,
      address,
      authorizationDocumentUrl,
    },
  };
}

async function get(_request, response) {
  const settings = await siteSettingsService.getSiteSettings();

  return sendSuccess(response, {
    message: _request.t("settings.retrieved"),
    data: settings,
  });
}

async function update(request, response) {
  const validation = validateSettings(request.body || {});

  if (!validation.isValid) {
    return sendError(response, {
      statusCode: 422,
      message: request.t("settings.invalidFields"),
    });
  }

  const settings = await siteSettingsService.updateSiteSettings(
    validation.values,
    request.user.id,
  );

  return sendSuccess(response, {
    message: request.t("settings.updated"),
    data: settings,
  });
}

async function uploadAuthorizationDocument(request, response) {
  if (!request.file) {
    return sendError(response, {
      statusCode: 422,
      message: request.t("settings.invalidDocument"),
    });
  }

  const publicApiUrl = process.env.PUBLIC_API_URL || "http://localhost:4000";
  const relativePath = path.posix.join(
    "/uploads/authorization",
    request.file.filename,
  );
  const authorizationDocumentUrl = new URL(relativePath, publicApiUrl).toString();
  const settings = await siteSettingsService.updateSiteSettings(
    { authorizationDocumentUrl },
    request.user.id,
  );

  return sendSuccess(response, {
    statusCode: 201,
    message: request.t("settings.documentUploaded"),
    data: settings,
  });
}

module.exports = { get, update, uploadAuthorizationDocument };

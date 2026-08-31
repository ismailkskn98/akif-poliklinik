const fs = require("node:fs/promises");
const { Buffer } = require("node:buffer");
const path = require("node:path");
const { URL } = require("node:url");

const { sendError, sendSuccess } = require("../../../general_helpers/response");
const {
  isAllowedGoogleMapsUrl,
  resolveGoogleMapsShareUrl,
} = require("../helpers/googleMaps");
const siteSettingsService = require("../services/siteSettingsService");

const MAX_PHONE_NUMBERS = 8;

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

function isValidInstagramUrl(value) {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();

    return (
      url.protocol === "https:" &&
      (hostname === "instagram.com" || hostname.endsWith(".instagram.com"))
    );
  } catch {
    return false;
  }
}

function normalizeAuthorizationDocumentUrl(value) {
  if (!value) {
    return "";
  }

  try {
    const parsedUrl = new URL(
      value,
      process.env.PUBLIC_API_URL || "http://localhost:4000",
    );

    return parsedUrl.pathname.startsWith("/uploads/authorization/")
      ? parsedUrl.pathname
      : value;
  } catch {
    return value;
  }
}

function isValidPhoneNumber(value) {
  const digitCount = value.replace(/\D/g, "").length;

  return (
    value.length <= 40 &&
    digitCount >= 7 &&
    digitCount <= 15 &&
    /^[+\d().\s-]+$/.test(value)
  );
}

async function removeManagedAuthorizationDocument(documentUrl) {
  if (typeof documentUrl !== "string" || !documentUrl) {
    return;
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(
      documentUrl,
      process.env.PUBLIC_API_URL || "http://localhost:4000",
    );
  } catch {
    return;
  }

  if (!parsedUrl.pathname.startsWith("/uploads/authorization/")) {
    return;
  }

  const uploadDirectory = path.resolve(
    process.cwd(),
    process.env.UPLOAD_DIR || "uploads",
    "authorization",
  );
  const filePath = path.resolve(uploadDirectory, path.basename(parsedUrl.pathname));

  if (path.dirname(filePath) !== uploadDirectory) {
    return;
  }

  await fs.unlink(filePath).catch(() => {});
}

async function hasValidImageSignature(file) {
  const content = await fs.readFile(file.path);

  if (file.mimetype === "image/jpeg") {
    return content.length >= 3 && content[0] === 0xff && content[1] === 0xd8 && content[2] === 0xff;
  }

  if (file.mimetype === "image/png") {
    return (
      content.length >= 8 &&
      content.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    );
  }

  return (
    file.mimetype === "image/webp" &&
    content.length >= 12 &&
    content.subarray(0, 4).toString("ascii") === "RIFF" &&
    content.subarray(8, 12).toString("ascii") === "WEBP"
  );
}

function validateSettings(body) {
  const instagramUrl = typeof body.instagramUrl === "string" ? body.instagramUrl.trim() : "";
  const address = typeof body.address === "string" ? body.address.trim() : "";
  const mapShareUrl =
    typeof body.mapShareUrl === "string" ? body.mapShareUrl.trim() : "";
  const authorizationDocumentUrl = normalizeAuthorizationDocumentUrl(
    typeof body.authorizationDocumentUrl === "string"
      ? body.authorizationDocumentUrl.trim()
      : "",
  );
  const phoneNumbers = Array.isArray(body.phoneNumbers)
    ? body.phoneNumbers.map((phoneNumber) => String(phoneNumber).trim()).filter(Boolean)
    : [];
  const publicApiOrigin = new URL(
    process.env.PUBLIC_API_URL || "http://localhost:4000",
  ).origin;
  const hasTooManyPhoneNumbers = phoneNumbers.length > MAX_PHONE_NUMBERS;
  const hasValidMapShareUrl =
    mapShareUrl.length <= 1000 && isAllowedGoogleMapsUrl(mapShareUrl);
  let isValidDocumentUrl = authorizationDocumentUrl === "";

  if (authorizationDocumentUrl && !isValidDocumentUrl) {
    isValidDocumentUrl = authorizationDocumentUrl.startsWith("/");
  }

  if (authorizationDocumentUrl && !isValidDocumentUrl) {
    try {
      isValidDocumentUrl = new URL(authorizationDocumentUrl).origin === publicApiOrigin;
    } catch {
      isValidDocumentUrl = false;
    }
  }

  const isValid =
    isValidInstagramUrl(instagramUrl) &&
    instagramUrl.length <= 500 &&
    address.length >= 10 &&
    address.length <= 1000 &&
    hasValidMapShareUrl &&
    phoneNumbers.length >= 1 &&
    phoneNumbers.length <= MAX_PHONE_NUMBERS &&
    phoneNumbers.every(isValidPhoneNumber) &&
    authorizationDocumentUrl.length <= 500 &&
    (authorizationDocumentUrl === "" ||
      isValidUrl(authorizationDocumentUrl, { allowRelative: true })) &&
    isValidDocumentUrl;

  return {
    isValid,
    errorKey: hasTooManyPhoneNumbers
      ? "settings.tooManyPhoneNumbers"
      : !hasValidMapShareUrl
        ? "settings.invalidMapUrl"
        : "settings.invalidFields",
    values: {
      instagramUrl,
      phoneNumbers,
      address,
      mapShareUrl,
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
      message: request.t(validation.errorKey),
    });
  }

  let resolvedMapLocation;

  try {
    resolvedMapLocation = await resolveGoogleMapsShareUrl(
      validation.values.mapShareUrl,
    );
  } catch {
    return sendError(response, {
      statusCode: 422,
      message: request.t("settings.invalidMapUrl"),
    });
  }

  const settings = await siteSettingsService.updateSiteSettings(
    {
      ...validation.values,
      mapShareUrl: resolvedMapLocation.mapShareUrl,
      mapEmbedUrl: resolvedMapLocation.mapEmbedUrl,
    },
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

  if (!(await hasValidImageSignature(request.file))) {
    await fs.unlink(request.file.path).catch(() => {});

    return sendError(response, {
      statusCode: 422,
      message: request.t("settings.invalidDocument"),
    });
  }

  const relativePath = path.posix.join(
    "/uploads/authorization",
    request.file.filename,
  );
  const previousSettings = await siteSettingsService.getSiteSettings();
  const settings = await siteSettingsService.updateSiteSettings(
    { authorizationDocumentUrl: relativePath },
    request.user.id,
  );

  await removeManagedAuthorizationDocument(
    previousSettings.authorizationDocumentUrl,
  );

  return sendSuccess(response, {
    statusCode: 201,
    message: request.t("settings.documentUploaded"),
    data: settings,
  });
}

async function removeAuthorizationDocument(request, response) {
  const previousSettings = await siteSettingsService.getSiteSettings();
  const settings = await siteSettingsService.updateSiteSettings(
    { authorizationDocumentUrl: "" },
    request.user.id,
  );

  await removeManagedAuthorizationDocument(
    previousSettings.authorizationDocumentUrl,
  );

  return sendSuccess(response, {
    message: request.t("settings.documentRemoved"),
    data: settings,
  });
}

module.exports = {
  get,
  removeAuthorizationDocument,
  update,
  uploadAuthorizationDocument,
};

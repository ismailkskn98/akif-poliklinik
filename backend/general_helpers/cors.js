const { URL } = require("node:url");

const CORS_ORIGIN_DENIED_CODE = "CORS_ORIGIN_DENIED";

function normalizeOrigin(origin, settingName = "CORS origin") {
  const trimmedOrigin = typeof origin === "string" ? origin.trim() : "";

  if (!trimmedOrigin || trimmedOrigin === "*") {
    throw new Error(`${settingName} geçerli bir HTTP(S) origin değeri olmalıdır.`);
  }

  let parsedOrigin;

  try {
    parsedOrigin = new URL(trimmedOrigin);
  } catch {
    throw new Error(`${settingName} geçerli bir URL olmalıdır: ${trimmedOrigin}`);
  }

  const hasUnsupportedProtocol = !["http:", "https:"].includes(
    parsedOrigin.protocol,
  );
  const hasUnexpectedParts =
    parsedOrigin.username ||
    parsedOrigin.password ||
    parsedOrigin.pathname !== "/" ||
    parsedOrigin.search ||
    parsedOrigin.hash;

  if (hasUnsupportedProtocol || hasUnexpectedParts) {
    throw new Error(
      `${settingName} yalnızca protokol, alan adı ve port içermelidir: ${trimmedOrigin}`,
    );
  }

  return parsedOrigin.origin;
}

function parseAllowedOrigins(value) {
  const origins = String(value || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (origins.length === 0) {
    throw new Error("CORS_ORIGINS en az bir origin içermelidir.");
  }

  return [
    ...new Set(
      origins.map((origin) => normalizeOrigin(origin, "CORS_ORIGINS")),
    ),
  ];
}

function createCorsOriginError(origin) {
  const error = new Error("Origin is not allowed by CORS.");
  error.code = CORS_ORIGIN_DENIED_CODE;
  error.statusCode = 403;
  error.messageKey = "errors.corsOriginDenied";
  error.origin = String(origin || "").slice(0, 256);
  return error;
}

function createCorsOptions(allowedOrigins) {
  const allowedOriginSet = new Set(allowedOrigins);

  return {
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      let normalizedOrigin;

      try {
        normalizedOrigin = normalizeOrigin(origin, "İstek origin değeri");
      } catch {
        callback(createCorsOriginError(origin));
        return;
      }

      if (allowedOriginSet.has(normalizedOrigin)) {
        callback(null, true);
        return;
      }

      callback(createCorsOriginError(origin));
    },
  };
}

module.exports = {
  CORS_ORIGIN_DENIED_CODE,
  createCorsOptions,
  normalizeOrigin,
  parseAllowedOrigins,
};

const { sendError } = require("../../../general_helpers/response");
const {
  CORS_ORIGIN_DENIED_CODE,
} = require("../../../general_helpers/cors");

function errorHandler(error, request, response, next) {
  if (response.headersSent) {
    next(error);
    return;
  }

  const isCorsOriginDenied = error.code === CORS_ORIGIN_DENIED_CODE;

  if (isCorsOriginDenied) {
    const origin = JSON.stringify(String(error.origin || "").slice(0, 256));
    const method = String(request.method || "").slice(0, 16);
    const requestPath = JSON.stringify(
      String(request.originalUrl || "").slice(0, 512),
    );

    console.warn(
      `[CORS] İstek reddedildi: origin=${origin} method=${method} path=${requestPath}`,
    );
  } else {
    console.error(error);
  }

  const isUploadLimitError = ["LIMIT_FILE_SIZE", "LIMIT_FILE_COUNT"].includes(
    error.code,
  );
  const messageKey = error.messageKey
    ? error.messageKey
    : isUploadLimitError
      ? "settings.invalidDocument"
      : "errors.serverError";

  sendError(response, {
    statusCode: error.statusCode || (isUploadLimitError ? 422 : 500),
    message: request.t
      ? request.t(messageKey)
      : "Beklenmeyen bir sunucu hatası oluştu.",
  });
}

module.exports = errorHandler;

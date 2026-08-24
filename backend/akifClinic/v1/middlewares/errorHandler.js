const { sendError } = require("../../../general_helpers/response");

function errorHandler(error, request, response, next) {
  if (response.headersSent) {
    next(error);
    return;
  }

  console.error(error);
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

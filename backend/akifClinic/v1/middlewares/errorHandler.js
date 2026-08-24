const { sendError } = require("../../../general_helpers/response");

function errorHandler(error, request, response, next) {
  if (response.headersSent) {
    next(error);
    return;
  }

  console.error(error);
  sendError(response, {
    statusCode: 500,
    message: request.t
      ? request.t("errors.serverError")
      : "Beklenmeyen bir sunucu hatası oluştu.",
  });
}

module.exports = errorHandler;

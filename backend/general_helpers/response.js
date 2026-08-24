function sendSuccess(response, { message, data = null, statusCode = 200 }) {
  return response.status(statusCode).json({
    status: true,
    message,
    data,
  });
}

function sendError(response, { message, data = null, statusCode = 400 }) {
  return response.status(statusCode).json({
    status: false,
    message,
    data,
  });
}

module.exports = { sendSuccess, sendError };

const { rateLimit } = require("express-rate-limit");

const { sendError } = require("../../../general_helpers/response");

function createRateLimiter({ windowMs, limit, messageKey }) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler(request, response) {
      sendError(response, {
        statusCode: 429,
        message: request.t(messageKey),
      });
    },
  });
}

const contactRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  messageKey: "contact.rateLimited",
});

const loginRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  messageKey: "auth.rateLimited",
});

const forgotPasswordRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  messageKey: "auth.resetRateLimited",
});

const resetPasswordRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  messageKey: "auth.resetRateLimited",
});

module.exports = {
  contactRateLimiter,
  forgotPasswordRateLimiter,
  loginRateLimiter,
  resetPasswordRateLimiter,
};

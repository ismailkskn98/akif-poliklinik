const jwt = require("jsonwebtoken");

const { sendError } = require("../../../general_helpers/response");
const { createSessionVersion } = require("../helpers/authValidation");
const authService = require("../services/authService");

async function verifyToken(request, response, next) {
  const authorizationHeader = request.headers.authorization || "";
  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    sendError(response, {
      statusCode: 401,
      message: request.t("auth.unauthorized"),
    });
    return;
  }

  let tokenPayload;

  try {
    tokenPayload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    sendError(response, {
      statusCode: 401,
      message: request.t("auth.invalidToken"),
    });
    return;
  }

  const admin = await authService.findActiveAdminById(tokenPayload.id);
  const sessionIsCurrent =
    admin &&
    tokenPayload.sessionVersion === createSessionVersion(admin.password_hash);

  if (!sessionIsCurrent) {
    sendError(response, {
      statusCode: 401,
      message: request.t("auth.invalidToken"),
    });
    return;
  }

  request.user = {
    id: admin.id,
    email: admin.email,
    role: admin.role,
  };
  next();
}

module.exports = verifyToken;

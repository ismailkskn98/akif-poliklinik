const jwt = require("jsonwebtoken");

const { sendError } = require("../../../general_helpers/response");

function verifyToken(request, response, next) {
  const authorizationHeader = request.headers.authorization || "";
  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    sendError(response, {
      statusCode: 401,
      message: request.t("auth.unauthorized"),
    });
    return;
  }

  try {
    request.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    sendError(response, {
      statusCode: 401,
      message: request.t("auth.invalidToken"),
    });
  }
}

module.exports = verifyToken;

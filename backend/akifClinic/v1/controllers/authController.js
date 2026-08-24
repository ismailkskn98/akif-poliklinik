const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { sendError, sendSuccess } = require("../../../general_helpers/response");
const authService = require("../services/authService");

async function login(request, response) {
  const email = typeof request.body?.email === "string" ? request.body.email.trim().toLowerCase() : "";
  const password = typeof request.body?.password === "string" ? request.body.password : "";

  if (!email || !password) {
    return sendError(response, {
      statusCode: 422,
      message: request.t("auth.missingCredentials"),
    });
  }

  const admin = await authService.findAdminByEmail(email);
  const passwordMatches = admin
    ? await bcrypt.compare(password, admin.password_hash)
    : false;

  if (!admin || !admin.is_active || !passwordMatches) {
    return sendError(response, {
      statusCode: 401,
      message: request.t("auth.invalidCredentials"),
    });
  }

  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "8h" },
  );

  await authService.updateLastLogin(admin.id);

  return sendSuccess(response, {
    message: request.t("auth.loggedIn"),
    data: {
      token,
      user: {
        id: admin.id,
        fullName: admin.full_name,
        email: admin.email,
        role: admin.role,
      },
    },
  });
}

module.exports = { login };

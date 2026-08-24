const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { sendError, sendSuccess } = require("../../../general_helpers/response");
const mailService = require("../../../general_services/mail");
const {
  createSessionVersion,
  isValidEmail,
  isValidPassword,
  normalizeEmail,
} = require("../helpers/authValidation");
const authService = require("../services/authService");

async function login(request, response) {
  const email = normalizeEmail(request.body?.email);
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
    {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      sessionVersion: createSessionVersion(admin.password_hash),
    },
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

async function forgotPassword(request, response) {
  const email = normalizeEmail(request.body?.email);

  if (!isValidEmail(email)) {
    return sendError(response, {
      statusCode: 422,
      message: request.t("auth.invalidEmail"),
    });
  }

  const admin = await authService.findAdminByEmail(email);

  if (admin?.is_active) {
    const reset = await authService.createPasswordResetToken(
      admin.id,
      request.ip?.slice(0, 45) || null,
    );

    try {
      await mailService.sendPasswordResetNotification({
        email: admin.email,
        fullName: admin.full_name,
        ...reset,
      });
    } catch (error) {
      console.error("Parola sıfırlama e-postası gönderilemedi:", error.message);
    }
  }

  return sendSuccess(response, {
    message: request.t("auth.resetRequested"),
  });
}

async function resetPassword(request, response) {
  const token = typeof request.body?.token === "string" ? request.body.token.trim() : "";
  const password = request.body?.password;

  if (!/^[a-f0-9]{64}$/i.test(token) || !isValidPassword(password)) {
    return sendError(response, {
      statusCode: 422,
      message: request.t("auth.invalidResetFields"),
    });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const passwordWasReset = await authService.resetPassword(token, passwordHash);

  if (!passwordWasReset) {
    return sendError(response, {
      statusCode: 400,
      message: request.t("auth.invalidResetToken"),
    });
  }

  return sendSuccess(response, {
    message: request.t("auth.passwordReset"),
  });
}

module.exports = { forgotPassword, login, resetPassword };

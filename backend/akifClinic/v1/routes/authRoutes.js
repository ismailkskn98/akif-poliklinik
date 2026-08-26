const express = require("express");

const authController = require("../controllers/authController");
const {
  changePasswordRateLimiter,
  forgotPasswordRateLimiter,
  loginRateLimiter,
  resetPasswordRateLimiter,
} = require("../middlewares/rateLimiters");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/login", loginRateLimiter, authController.login);
router.post(
  "/forgot-password",
  forgotPasswordRateLimiter,
  authController.forgotPassword,
);
router.post(
  "/reset-password",
  resetPasswordRateLimiter,
  authController.resetPassword,
);
router.put(
  "/change-password",
  verifyToken,
  changePasswordRateLimiter,
  authController.changePassword,
);

module.exports = router;

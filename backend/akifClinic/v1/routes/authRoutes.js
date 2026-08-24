const express = require("express");

const authController = require("../controllers/authController");
const {
  forgotPasswordRateLimiter,
  loginRateLimiter,
  resetPasswordRateLimiter,
} = require("../middlewares/rateLimiters");

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

module.exports = router;

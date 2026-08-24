const express = require("express");

const authController = require("../controllers/authController");
const { loginRateLimiter } = require("../middlewares/rateLimiters");

const router = express.Router();

router.post("/login", loginRateLimiter, authController.login);

module.exports = router;

const express = require("express");

const contactRequestController = require("../controllers/contactRequestController");
const publicController = require("../controllers/publicController");
const { contactRateLimiter } = require("../middlewares/rateLimiters");

const router = express.Router();

router.get("/health", publicController.getHealth);
router.get("/site-settings", publicController.getSiteSettings);
router.post("/contact-requests/create", contactRateLimiter, contactRequestController.create);

module.exports = router;

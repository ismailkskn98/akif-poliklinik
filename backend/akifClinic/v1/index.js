const express = require("express");

const authRoutes = require("./routes/authRoutes");
const contactRequestRoutes = require("./routes/contactRequestRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const publicRoutes = require("./routes/publicRoutes");
const siteSettingsRoutes = require("./routes/siteSettingsRoutes");
const verifyToken = require("./middlewares/verifyToken");

const router = express.Router();

router.use("/public", publicRoutes);
router.use("/auth", authRoutes);
router.use(verifyToken);
router.use("/contact-requests", contactRequestRoutes);
router.use("/doctors", doctorRoutes);
router.use("/site-settings", siteSettingsRoutes);

module.exports = router;

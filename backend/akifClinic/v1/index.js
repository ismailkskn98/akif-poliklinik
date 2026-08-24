const express = require("express");

const authRoutes = require("./routes/authRoutes");
const contactRequestRoutes = require("./routes/contactRequestRoutes");
const publicRoutes = require("./routes/publicRoutes");
const verifyToken = require("./middlewares/verifyToken");

const router = express.Router();

router.use("/public", publicRoutes);
router.use("/auth", authRoutes);
router.use(verifyToken);
router.use("/contact-requests", contactRequestRoutes);

module.exports = router;

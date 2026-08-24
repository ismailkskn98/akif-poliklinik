const express = require("express");

const contactRequestController = require("../controllers/contactRequestController");

const router = express.Router();

router.get("/", contactRequestController.list);
router.patch("/:id", contactRequestController.update);

module.exports = router;

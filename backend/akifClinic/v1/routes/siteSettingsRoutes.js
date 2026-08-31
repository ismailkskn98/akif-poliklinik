const express = require("express");

const siteSettingsController = require("../controllers/siteSettingsController");
const uploadAuthorizationDocument = require("../middlewares/uploadAuthorizationDocument");

const router = express.Router();

router.get("/", siteSettingsController.get);
router.put("/update", siteSettingsController.update);
router.post(
  "/authorization-document",
  uploadAuthorizationDocument,
  siteSettingsController.uploadAuthorizationDocument,
);
router.delete(
  "/authorization-document",
  siteSettingsController.removeAuthorizationDocument,
);

module.exports = router;

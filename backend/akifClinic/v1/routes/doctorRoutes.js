const express = require("express");

const doctorController = require("../controllers/doctorController");
const uploadDoctorImage = require("../middlewares/uploadDoctorImage");

const router = express.Router();

router.get("/", doctorController.list);
router.post("/", uploadDoctorImage, doctorController.create);
router.patch("/:id", uploadDoctorImage, doctorController.update);
router.delete("/:id", doctorController.remove);

module.exports = router;

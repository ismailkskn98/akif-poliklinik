const fs = require("node:fs");
const path = require("node:path");
const multer = require("multer");

const uploadDirectory = path.resolve(
  process.cwd(),
  process.env.UPLOAD_DIR || "uploads",
  "doctors",
);

fs.mkdirSync(uploadDirectory, { recursive: true });

const extensionByMimeType = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename(_request, file, callback) {
    const extension = extensionByMimeType[file.mimetype];
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    callback(null, `doctor-${uniqueSuffix}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
  fileFilter(_request, file, callback) {
    if (!extensionByMimeType[file.mimetype]) {
      const error = new Error("Unsupported doctor image type.");
      error.statusCode = 422;
      error.messageKey = "doctors.invalidImage";
      callback(error);
      return;
    }

    callback(null, true);
  },
}).single("image");

function uploadDoctorImage(request, response, next) {
  upload(request, response, (error) => {
    if (error) {
      error.statusCode = 422;
      error.messageKey = "doctors.invalidImage";
    }

    next(error);
  });
}

module.exports = uploadDoctorImage;

const fs = require("node:fs/promises");
const { Buffer } = require("node:buffer");
const path = require("node:path");
const { URL } = require("node:url");

const { sendError, sendSuccess } = require("../../../general_helpers/response");
const doctorService = require("../services/doctorService");

function normalizeBoolean(value) {
  if (value === true || value === "true" || value === "1" || value === 1) {
    return true;
  }

  if (value === false || value === "false" || value === "0" || value === 0) {
    return false;
  }

  return null;
}

function validateDoctorInput(body) {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
  const sortOrder = Number(body.sortOrder);
  const isPublished = normalizeBoolean(body.isPublished);
  const isValid =
    title.length >= 2 &&
    title.length <= 80 &&
    fullName.length >= 2 &&
    fullName.length <= 150 &&
    Number.isInteger(sortOrder) &&
    sortOrder >= 0 &&
    sortOrder <= 999 &&
    isPublished !== null;

  return {
    isValid,
    values: { title, fullName, sortOrder, isPublished },
  };
}

async function hasValidImageSignature(file) {
  const content = await fs.readFile(file.path);

  if (file.mimetype === "image/jpeg") {
    return content.length >= 3 && content[0] === 0xff && content[1] === 0xd8 && content[2] === 0xff;
  }

  if (file.mimetype === "image/png") {
    return (
      content.length >= 8 &&
      content.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    );
  }

  return (
    file.mimetype === "image/webp" &&
    content.length >= 12 &&
    content.subarray(0, 4).toString("ascii") === "RIFF" &&
    content.subarray(8, 12).toString("ascii") === "WEBP"
  );
}

function createImageUrl(file) {
  const publicApiUrl = process.env.PUBLIC_API_URL || "http://localhost:4000";
  const relativePath = path.posix.join("/uploads/doctors", file.filename);

  return new URL(relativePath, publicApiUrl).toString();
}

async function removeUploadedFile(file) {
  if (file?.path) {
    await fs.unlink(file.path).catch(() => {});
  }
}

async function removeManagedDoctorImage(imageUrl) {
  if (typeof imageUrl !== "string" || !imageUrl) {
    return;
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(imageUrl, process.env.PUBLIC_API_URL || "http://localhost:4000");
  } catch {
    return;
  }

  if (!parsedUrl.pathname.startsWith("/uploads/doctors/")) {
    return;
  }

  const uploadDirectory = path.resolve(
    process.cwd(),
    process.env.UPLOAD_DIR || "uploads",
    "doctors",
  );
  const filePath = path.resolve(uploadDirectory, path.basename(parsedUrl.pathname));

  if (path.dirname(filePath) !== uploadDirectory) {
    return;
  }

  await fs.unlink(filePath).catch(() => {});
}

function parseId(value) {
  const id = Number.parseInt(value, 10);
  return Number.isInteger(id) && id > 0 ? id : null;
}

async function list(request, response) {
  const doctors = await doctorService.listDoctors();

  return sendSuccess(response, {
    message: request.t("doctors.listed"),
    data: { doctors },
  });
}

async function create(request, response) {
  const validation = validateDoctorInput(request.body || {});

  if (!validation.isValid) {
    await removeUploadedFile(request.file);
    return sendError(response, {
      statusCode: 422,
      message: request.t("doctors.invalidFields"),
    });
  }

  if (!request.file) {
    return sendError(response, {
      statusCode: 422,
      message: request.t("doctors.imageRequired"),
    });
  }

  if (!(await hasValidImageSignature(request.file))) {
    await removeUploadedFile(request.file);
    return sendError(response, {
      statusCode: 422,
      message: request.t("doctors.invalidImage"),
    });
  }

  let doctor;

  try {
    doctor = await doctorService.createDoctor({
      ...validation.values,
      imageUrl: createImageUrl(request.file),
    });
  } catch (error) {
    await removeUploadedFile(request.file);
    throw error;
  }

  return sendSuccess(response, {
    statusCode: 201,
    message: request.t("doctors.created"),
    data: { doctor },
  });
}

async function update(request, response) {
  const id = parseId(request.params.id);
  const validation = validateDoctorInput(request.body || {});

  if (!id || !validation.isValid) {
    await removeUploadedFile(request.file);
    return sendError(response, {
      statusCode: 422,
      message: request.t("doctors.invalidFields"),
    });
  }

  const existingDoctor = await doctorService.findDoctorById(id);

  if (!existingDoctor) {
    await removeUploadedFile(request.file);
    return sendError(response, {
      statusCode: 404,
      message: request.t("doctors.notFound"),
    });
  }

  if (request.file && !(await hasValidImageSignature(request.file))) {
    await removeUploadedFile(request.file);
    return sendError(response, {
      statusCode: 422,
      message: request.t("doctors.invalidImage"),
    });
  }

  const imageUrl = request.file
    ? createImageUrl(request.file)
    : existingDoctor.imageUrl;
  let doctor;

  try {
    doctor = await doctorService.updateDoctor(id, {
      ...validation.values,
      imageUrl,
    });
  } catch (error) {
    await removeUploadedFile(request.file);
    throw error;
  }

  if (request.file) {
    await removeManagedDoctorImage(existingDoctor.imageUrl);
  }

  return sendSuccess(response, {
    message: request.t("doctors.updated"),
    data: { doctor },
  });
}

async function remove(request, response) {
  const id = parseId(request.params.id);

  if (!id) {
    return sendError(response, {
      statusCode: 422,
      message: request.t("doctors.invalidFields"),
    });
  }

  const doctor = await doctorService.findDoctorById(id);

  if (!doctor) {
    return sendError(response, {
      statusCode: 404,
      message: request.t("doctors.notFound"),
    });
  }

  await doctorService.deleteDoctor(id);
  await removeManagedDoctorImage(doctor.imageUrl);

  return sendSuccess(response, {
    message: request.t("doctors.deleted"),
    data: { id },
  });
}

module.exports = {
  create,
  hasValidImageSignature,
  list,
  remove,
  update,
  validateDoctorInput,
};

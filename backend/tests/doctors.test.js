const assert = require("node:assert/strict");
const { Buffer } = require("node:buffer");
const { once } = require("node:events");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "doctor-test-secret";

const app = require("../app");
const {
  hasValidImageSignature,
  validateDoctorInput,
} = require("../akifClinic/v1/controllers/doctorController");

test("doktor alanlarını normalize eder ve sınırları doğrular", () => {
  assert.deepEqual(validateDoctorInput({
    title: " Dr. ",
    fullName: " Yusuf Çınar ",
    sortOrder: "2",
    isPublished: "true",
  }), {
    isValid: true,
    values: {
      title: "Dr.",
      fullName: "Yusuf Çınar",
      sortOrder: 2,
      isPublished: true,
    },
  });

  assert.equal(validateDoctorInput({
    title: "D",
    fullName: "Yusuf Çınar",
    sortOrder: -1,
    isPublished: "yes",
  }).isValid, false);
});

test("doktor görselinin gerçek dosya imzasını kontrol eder", async (context) => {
  const temporaryDirectory = await fs.mkdtemp(path.join(os.tmpdir(), "akif-doctor-"));
  context.after(() => fs.rm(temporaryDirectory, { recursive: true, force: true }));

  const validJpegPath = path.join(temporaryDirectory, "valid.jpg");
  const invalidJpegPath = path.join(temporaryDirectory, "invalid.jpg");
  await fs.writeFile(validJpegPath, Buffer.from([0xff, 0xd8, 0xff, 0x00]));
  await fs.writeFile(invalidJpegPath, Buffer.from("not-an-image"));

  assert.equal(await hasValidImageSignature({
    mimetype: "image/jpeg",
    path: validJpegPath,
  }), true);
  assert.equal(await hasValidImageSignature({
    mimetype: "image/jpeg",
    path: invalidJpegPath,
  }), false);
});

test("doktor yönetim uçları kimlik doğrulaması olmadan kullanılamaz", async (context) => {
  const server = app.listen(0);
  await once(server, "listening");

  context.after(
    () =>
      new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      }),
  );

  const response = await globalThis.fetch(
    `http://127.0.0.1:${server.address().port}/api/akifclinic/v1/doctors`,
  );

  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), {
    status: false,
    message: "Bu işlem için giriş yapmalısınız.",
    data: null,
  });
});

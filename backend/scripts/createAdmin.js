const bcrypt = require("bcryptjs");

const loadEnvironment = require("../general_helpers/loadEnvironment");

loadEnvironment();

const { getPool } = require("../akifClinic/v1/models/db");

async function createAdmin() {
  const fullName = process.env.ADMIN_FULL_NAME?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!fullName || !email || !password || password.startsWith("replace-with")) {
    throw new Error(
      "ADMIN_FULL_NAME, ADMIN_EMAIL ve güçlü bir ADMIN_PASSWORD tanımlanmalıdır.",
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await getPool().execute(
    `INSERT INTO admin_users
      (full_name, email, password_hash, role, is_active)
     VALUES (?, ?, ?, 'super_admin', 1)
     ON DUPLICATE KEY UPDATE
      full_name = VALUES(full_name),
      password_hash = VALUES(password_hash),
      role = 'super_admin',
      is_active = 1,
      updated_at = CURRENT_TIMESTAMP`,
    [fullName, email, passwordHash],
  );

  console.log(`${email} admin hesabı oluşturuldu veya güncellendi.`);
}

createAdmin()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await getPool().end();
  });

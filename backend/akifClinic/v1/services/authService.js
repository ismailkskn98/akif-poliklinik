const { getPool } = require("../models/db");

async function findAdminByEmail(email) {
  const [rows] = await getPool().execute(
    `SELECT id, full_name, email, password_hash, role, is_active
       FROM admin_users
      WHERE email = ?
      LIMIT 1`,
    [email],
  );

  return rows[0] || null;
}

async function updateLastLogin(adminId) {
  await getPool().execute(
    "UPDATE admin_users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?",
    [adminId],
  );
}

module.exports = { findAdminByEmail, updateLastLogin };

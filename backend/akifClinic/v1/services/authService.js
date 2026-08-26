const crypto = require("node:crypto");

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

async function findActiveAdminById(adminId) {
  const [rows] = await getPool().execute(
    `SELECT id, full_name, email, password_hash, role, is_active
       FROM admin_users
      WHERE id = ? AND is_active = 1
      LIMIT 1`,
    [adminId],
  );

  return rows[0] || null;
}

async function updateLastLogin(adminId) {
  await getPool().execute(
    "UPDATE admin_users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?",
    [adminId],
  );
}

async function updateAdminPassword(adminId, passwordHash) {
  const connection = await getPool().getConnection();

  try {
    await connection.beginTransaction();
    await connection.execute(
      `UPDATE admin_users
          SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND is_active = 1`,
      [passwordHash, adminId],
    );
    await connection.execute(
      `UPDATE password_reset_tokens
          SET used_at = CURRENT_TIMESTAMP
        WHERE admin_user_id = ? AND used_at IS NULL`,
      [adminId],
    );
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function createPasswordResetToken(adminId, requestedIp) {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(
    Date.now() + Number(process.env.PASSWORD_RESET_EXPIRES_MINUTES || 30) * 60_000,
  );
  const connection = await getPool().getConnection();

  try {
    await connection.beginTransaction();
    await connection.execute(
      `UPDATE password_reset_tokens
          SET used_at = CURRENT_TIMESTAMP
        WHERE admin_user_id = ? AND used_at IS NULL`,
      [adminId],
    );
    await connection.execute(
      `INSERT INTO password_reset_tokens
        (admin_user_id, token_hash, expires_at, requested_ip)
       VALUES (?, ?, ?, ?)`,
      [adminId, tokenHash, expiresAt, requestedIp],
    );
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  return { token, expiresAt };
}

async function resetPassword(token, passwordHash) {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const connection = await getPool().getConnection();

  try {
    await connection.beginTransaction();
    const [rows] = await connection.execute(
      `SELECT password_reset_tokens.id, password_reset_tokens.admin_user_id
         FROM password_reset_tokens
         INNER JOIN admin_users
           ON admin_users.id = password_reset_tokens.admin_user_id
          AND admin_users.is_active = 1
        WHERE password_reset_tokens.token_hash = ?
          AND password_reset_tokens.used_at IS NULL
          AND password_reset_tokens.expires_at > CURRENT_TIMESTAMP
        LIMIT 1
        FOR UPDATE`,
      [tokenHash],
    );
    const resetToken = rows[0];

    if (!resetToken) {
      await connection.rollback();
      return false;
    }

    await connection.execute(
      `UPDATE admin_users
          SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
      [passwordHash, resetToken.admin_user_id],
    );
    await connection.execute(
      `UPDATE password_reset_tokens
          SET used_at = CURRENT_TIMESTAMP
        WHERE admin_user_id = ? AND used_at IS NULL`,
      [resetToken.admin_user_id],
    );
    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  createPasswordResetToken,
  findActiveAdminById,
  findAdminByEmail,
  resetPassword,
  updateAdminPassword,
  updateLastLogin,
};

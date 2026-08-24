const { getPool } = require("../models/db");

async function createContactRequest(contactRequest) {
  const [result] = await getPool().execute(
    `INSERT INTO contact_requests
      (full_name, phone, email, message, locale, source, ip_address, user_agent)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      contactRequest.fullName,
      contactRequest.phone,
      contactRequest.email,
      contactRequest.message,
      contactRequest.locale,
      contactRequest.source,
      contactRequest.ipAddress,
      contactRequest.userAgent,
    ],
  );

  return result.insertId;
}

async function listContactRequests({ page, limit, status }) {
  const offset = (page - 1) * limit;
  const conditions = [];
  const parameters = [];

  if (status) {
    conditions.push("status = ?");
    parameters.push(status);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const [rows] = await getPool().execute(
    `SELECT id, full_name, phone, email, message, locale, source, status,
            admin_note, created_at, updated_at
       FROM contact_requests
       ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?`,
    [...parameters, limit, offset],
  );
  const [countRows] = await getPool().execute(
    `SELECT COUNT(*) AS total FROM contact_requests ${whereClause}`,
    parameters,
  );

  return { rows, total: Number(countRows[0].total) };
}

async function updateContactRequest(id, { status, adminNote }) {
  const [result] = await getPool().execute(
    `UPDATE contact_requests
        SET status = ?, admin_note = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
    [status, adminNote, id],
  );

  return result.affectedRows;
}

module.exports = {
  createContactRequest,
  listContactRequests,
  updateContactRequest,
};

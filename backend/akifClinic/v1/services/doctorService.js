const { getPool } = require("../models/db");

function mapDoctor(row) {
  return {
    id: Number(row.id),
    title: row.title,
    fullName: row.full_name,
    imageUrl: row.image_url,
    sortOrder: Number(row.sort_order),
    isPublished: Boolean(row.is_published),
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

async function listPublicDoctors() {
  const [rows] = await getPool().execute(
    `SELECT id, title, full_name, image_url, sort_order, is_published
       FROM doctors
      WHERE is_published = 1
      ORDER BY sort_order ASC, id ASC`,
  );

  return rows.map(mapDoctor);
}

async function listDoctors() {
  const [rows] = await getPool().execute(
    `SELECT id, title, full_name, image_url, sort_order, is_published,
            created_at, updated_at
       FROM doctors
      ORDER BY sort_order ASC, id ASC`,
  );

  return rows.map(mapDoctor);
}

async function findDoctorById(id) {
  const [rows] = await getPool().execute(
    `SELECT id, title, full_name, image_url, sort_order, is_published,
            created_at, updated_at
       FROM doctors
      WHERE id = ?
      LIMIT 1`,
    [id],
  );

  return rows[0] ? mapDoctor(rows[0]) : null;
}

async function createDoctor({ title, fullName, imageUrl, sortOrder, isPublished }) {
  const [result] = await getPool().execute(
    `INSERT INTO doctors (title, full_name, image_url, sort_order, is_published)
     VALUES (?, ?, ?, ?, ?)`,
    [title, fullName, imageUrl, sortOrder, isPublished ? 1 : 0],
  );

  return findDoctorById(result.insertId);
}

async function updateDoctor(
  id,
  { title, fullName, imageUrl, sortOrder, isPublished },
) {
  const [result] = await getPool().execute(
    `UPDATE doctors
        SET title = ?, full_name = ?, image_url = ?, sort_order = ?,
            is_published = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
    [title, fullName, imageUrl, sortOrder, isPublished ? 1 : 0, id],
  );

  return result.affectedRows ? findDoctorById(id) : null;
}

async function deleteDoctor(id) {
  const [result] = await getPool().execute(
    "DELETE FROM doctors WHERE id = ?",
    [id],
  );

  return result.affectedRows;
}

module.exports = {
  createDoctor,
  deleteDoctor,
  findDoctorById,
  listDoctors,
  listPublicDoctors,
  updateDoctor,
};

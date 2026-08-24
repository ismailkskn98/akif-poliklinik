const fs = require("node:fs");
const path = require("node:path");
const mysql = require("mysql2/promise");

const loadEnvironment = require("../general_helpers/loadEnvironment");

loadEnvironment();

async function migrate() {
  const databaseName = process.env.DB_NAME || "akif_poliklinik";

  if (!/^[A-Za-z0-9_]+$/.test(databaseName)) {
    throw new Error("DB_NAME yalnızca harf, rakam ve alt çizgi içerebilir.");
  }

  const sqlDirectory = path.resolve(
    process.cwd(),
    "akifClinic",
    "v1",
    "sql",
  );
  const migrationFiles = fs
    .readdirSync(sqlDirectory)
    .filter((fileName) => fileName.endsWith(".sql"))
    .sort();
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    charset: "utf8mb4",
    multipleStatements: true,
  });

  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${databaseName}\`
        CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
    await connection.query(`USE \`${databaseName}\``);
    await connection.query(
      `CREATE TABLE IF NOT EXISTS schema_migrations (
        migration_name VARCHAR(255) NOT NULL,
        applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (migration_name)
      ) ENGINE=InnoDB`,
    );

    const [appliedRows] = await connection.query(
      "SELECT migration_name FROM schema_migrations",
    );
    const appliedMigrations = new Set(
      appliedRows.map(({ migration_name: migrationName }) => migrationName),
    );

    for (const migrationFile of migrationFiles) {
      if (appliedMigrations.has(migrationFile)) {
        console.log(`${migrationFile} daha önce uygulanmış.`);
        continue;
      }

      if (
        migrationFile === "2026-08-24_site_settings_seed.sql" &&
        (await tableHasRows(connection, "site_settings"))
      ) {
        await recordMigration(connection, migrationFile);
        console.log(`${migrationFile} mevcut veriler korunarak kaydedildi.`);
        continue;
      }

      const sql = fs.readFileSync(path.join(sqlDirectory, migrationFile), "utf8");
      await connection.query(sql);
      await recordMigration(connection, migrationFile);
      console.log(`${migrationFile} uygulandı.`);
    }
  } finally {
    await connection.end();
  }
}

async function tableExists(connection, databaseName, tableName) {
  const [rows] = await connection.execute(
    `SELECT COUNT(*) AS total
       FROM information_schema.tables
      WHERE table_schema = ? AND table_name = ?`,
    [databaseName, tableName],
  );

  return Number(rows[0].total) > 0;
}

async function tableHasRows(connection, tableName) {
  if (!(await tableExists(connection, process.env.DB_NAME || "akif_poliklinik", tableName))) {
    return false;
  }

  const [rows] = await connection.query(
    `SELECT EXISTS(SELECT 1 FROM \`${tableName}\` LIMIT 1) AS has_rows`,
  );

  return Boolean(rows[0].has_rows);
}

async function recordMigration(connection, migrationFile) {
  await connection.execute(
    "INSERT INTO schema_migrations (migration_name) VALUES (?)",
    [migrationFile],
  );
}

migrate().catch((error) => {
  console.error("Veritabanı kurulumu tamamlanamadı:", error.message);
  process.exitCode = 1;
});

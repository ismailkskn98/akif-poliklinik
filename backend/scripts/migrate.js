const fs = require("node:fs");
const path = require("node:path");
const mysql = require("mysql2/promise");

const loadEnvironment = require("../general_helpers/loadEnvironment");

loadEnvironment();

async function migrate() {
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
    for (const migrationFile of migrationFiles) {
      const sql = fs.readFileSync(path.join(sqlDirectory, migrationFile), "utf8");
      await connection.query(sql);
      console.log(`${migrationFile} uygulandı.`);
    }
  } finally {
    await connection.end();
  }
}

migrate().catch((error) => {
  console.error("Veritabanı kurulumu tamamlanamadı:", error.message);
  process.exitCode = 1;
});

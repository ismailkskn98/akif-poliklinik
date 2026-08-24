const crypto = require("node:crypto");

function normalizeEmail(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function isValidEmail(value) {
  return (
    value.length <= 190 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  );
}

function isValidPassword(value) {
  return typeof value === "string" && value.length >= 12 && value.length <= 128;
}

function createSessionVersion(passwordHash) {
  return crypto.createHash("sha256").update(passwordHash).digest("hex").slice(0, 24);
}

module.exports = {
  createSessionVersion,
  isValidEmail,
  isValidPassword,
  normalizeEmail,
};

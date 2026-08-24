const path = require("node:path");
const dotenv = require("dotenv");

function isPlaceholderValue(value) {
  return (
    !value ||
    value.startsWith("replace-with") ||
    value.includes("example.com")
  );
}

function loadEnvironment() {
  const environment = process.env.NODE_ENV || "development";
  const environmentFile = path.resolve(process.cwd(), `.env.${environment}`);
  const defaultFile = path.resolve(process.cwd(), ".env");

  dotenv.config({ path: environmentFile, quiet: true });
  dotenv.config({ path: defaultFile, quiet: true, override: false });

  if (process.env.NODE_ENV === "production") {
    const requiredValues = [
      "DB_HOST",
      "DB_USER",
      "DB_PASSWORD",
      "DB_NAME",
      "JWT_SECRET",
      "PUBLIC_API_URL",
      "CORS_ORIGINS",
    ];
    const invalidValue = requiredValues.find((key) =>
      isPlaceholderValue(process.env[key]),
    );

    if (invalidValue) {
      throw new Error(
        `${invalidValue} production ortamı için güvenli biçimde tanımlanmalıdır.`,
      );
    }

    if (process.env.MAIL_ENABLED === "true") {
      const requiredMailValues = [
        "SMTP_HOST",
        "SMTP_FROM_ADDRESS",
        "CONTACT_NOTIFICATION_TO",
        "PASSWORD_RESET_TO",
        "FRONTEND_URL",
      ];
      const invalidMailValue = requiredMailValues.find((key) =>
        isPlaceholderValue(process.env[key]),
      );

      if (invalidMailValue) {
        throw new Error(
          `${invalidMailValue} e-posta gönderimi için tanımlanmalıdır.`,
        );
      }

      if (process.env.SMTP_USER && !process.env.SMTP_PASSWORD) {
        throw new Error("SMTP_USER kullanıldığında SMTP_PASSWORD zorunludur.");
      }
    }
  }
}

module.exports = loadEnvironment;

const { getPool } = require("../models/db");

const settingDefinitions = {
  instagramUrl: { key: "instagram_url", type: "text" },
  phoneNumbers: { key: "phone_numbers", type: "json" },
  address: { key: "address", type: "text" },
  authorizationDocumentUrl: {
    key: "authorization_document_url",
    type: "text",
  },
};

const defaultSettings = {
  instagramUrl: "https://www.instagram.com/akif_poliklinik/",
  phoneNumbers: [
    "0532 446 90 39",
    "0533 152 38 93",
    "0532 352 43 88",
    "0533 151 32 89",
  ],
  address:
    "Lotus Walk Nişantaşı, Halaskargazi Cd. No:38/66 Kat:6 Daire:109, 34371 Şişli/İstanbul",
  authorizationDocumentUrl:
    "/documents/international-health-tourism-authorization.jpg",
};

function parseSettingValue(value, type) {
  if (type !== "json") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

async function getSiteSettings() {
  const settingKeys = Object.values(settingDefinitions).map(({ key }) => key);
  const placeholders = settingKeys.map(() => "?").join(", ");
  const [rows] = await getPool().execute(
    `SELECT setting_key, setting_value, value_type, updated_at
       FROM site_settings
      WHERE is_public = 1 AND setting_key IN (${placeholders})`,
    settingKeys,
  );
  const settings = { ...defaultSettings };
  let updatedAt = null;

  Object.entries(settingDefinitions).forEach(([propertyName, definition]) => {
    const row = rows.find(({ setting_key: settingKey }) => settingKey === definition.key);

    if (!row) {
      return;
    }

    const parsedValue = parseSettingValue(row.setting_value, row.value_type);

    if (parsedValue !== null && parsedValue !== "") {
      settings[propertyName] = parsedValue;
    }

    if (!updatedAt || row.updated_at > updatedAt) {
      updatedAt = row.updated_at;
    }
  });

  return { ...settings, updatedAt };
}

async function updateSiteSettings(settings, adminId) {
  const connection = await getPool().getConnection();

  try {
    await connection.beginTransaction();

    for (const [propertyName, value] of Object.entries(settings)) {
      const definition = settingDefinitions[propertyName];

      if (!definition) {
        continue;
      }

      const storedValue = definition.type === "json" ? JSON.stringify(value) : value;

      await connection.execute(
        `INSERT INTO site_settings
          (setting_key, setting_value, value_type, is_public, updated_by)
         VALUES (?, ?, ?, 1, ?)
         ON DUPLICATE KEY UPDATE
          setting_value = VALUES(setting_value),
          value_type = VALUES(value_type),
          is_public = 1,
          updated_by = VALUES(updated_by),
          updated_at = CURRENT_TIMESTAMP`,
        [definition.key, storedValue, definition.type, adminId],
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  return getSiteSettings();
}

module.exports = {
  defaultSettings,
  getSiteSettings,
  updateSiteSettings,
};

INSERT INTO site_settings
  (setting_key, setting_value, value_type, is_public)
VALUES
  ('instagram_url', 'https://www.instagram.com/akif_poliklinik/', 'text', 1),
  ('phone_numbers', '["0532 446 90 39","0533 152 38 93","0532 352 43 88","0533 151 32 89"]', 'json', 1),
  ('address', 'Lotus Walk Nişantaşı, Halaskargazi Cd. No:38/66 Kat:6 Daire:109, 34371 Şişli/İstanbul', 'text', 1),
  ('authorization_document_url', '/documents/international-health-tourism-authorization.jpg', 'text', 1)
ON DUPLICATE KEY UPDATE
  setting_value = VALUES(setting_value),
  value_type = VALUES(value_type),
  is_public = VALUES(is_public),
  updated_at = CURRENT_TIMESTAMP;

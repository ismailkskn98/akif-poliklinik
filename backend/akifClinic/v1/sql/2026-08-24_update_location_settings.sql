INSERT INTO site_settings
  (setting_key, setting_value, value_type, is_public)
VALUES
  ('address', '(Lotus Walk Nişantaşı) Halaskargazi Cd. No:38/66 Kat:6 Daire:109, 34371 Şişli/İstanbul', 'text', 1),
  ('map_query', 'British Estetik Nişantaşı', 'text', 1)
ON DUPLICATE KEY UPDATE
  setting_value = VALUES(setting_value),
  value_type = VALUES(value_type),
  is_public = VALUES(is_public),
  updated_at = CURRENT_TIMESTAMP;

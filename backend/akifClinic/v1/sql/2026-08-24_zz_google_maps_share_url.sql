INSERT INTO site_settings
  (setting_key, setting_value, value_type, is_public)
VALUES
  ('map_share_url', 'https://maps.app.goo.gl/1GC2b1vs46bE8nZz9', 'text', 1),
  ('map_embed_url', 'https://maps.google.com/maps?q=British+Esthetic&ll=41.0516039%2C28.987723&t=m&z=17&output=embed&iwloc=A', 'text', 1)
ON DUPLICATE KEY UPDATE
  setting_value = VALUES(setting_value),
  value_type = VALUES(value_type),
  is_public = VALUES(is_public),
  updated_at = CURRENT_TIMESTAMP;

DELETE FROM site_settings WHERE setting_key = 'map_query';

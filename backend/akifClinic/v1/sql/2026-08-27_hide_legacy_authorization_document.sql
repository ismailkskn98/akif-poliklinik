INSERT INTO site_settings (
  setting_key,
  setting_value,
  value_type,
  is_public
)
VALUES (
  'authorization_document_url',
  '',
  'text',
  1
)
ON DUPLICATE KEY UPDATE
  setting_value = VALUES(setting_value),
  value_type = VALUES(value_type),
  is_public = VALUES(is_public),
  updated_at = CURRENT_TIMESTAMP;

ALTER TABLE contact_requests
  ADD COLUMN privacy_notice_version VARCHAR(40) NULL AFTER user_agent,
  ADD COLUMN privacy_notice_acknowledged_at DATETIME NULL AFTER privacy_notice_version;

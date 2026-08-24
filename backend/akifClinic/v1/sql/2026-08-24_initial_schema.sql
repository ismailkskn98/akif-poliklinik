CREATE DATABASE IF NOT EXISTS akif_poliklinik
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE akif_poliklinik;

CREATE TABLE admin_users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('super_admin', 'editor', 'viewer') NOT NULL DEFAULT 'editor',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  last_login_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admin_users_email (email)
) ENGINE=InnoDB;

CREATE TABLE contact_requests (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(190) NULL,
  message TEXT NULL,
  locale VARCHAR(5) NOT NULL DEFAULT 'tr',
  source VARCHAR(50) NOT NULL DEFAULT 'website',
  status ENUM('new', 'contacted', 'qualified', 'closed', 'spam') NOT NULL DEFAULT 'new',
  admin_note TEXT NULL,
  ip_address VARCHAR(45) NULL,
  user_agent VARCHAR(500) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_contact_requests_status_created (status, created_at),
  KEY idx_contact_requests_phone (phone)
) ENGINE=InnoDB;

CREATE TABLE site_settings (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  setting_key VARCHAR(120) NOT NULL,
  setting_value TEXT NULL,
  value_type ENUM('text', 'number', 'boolean', 'json') NOT NULL DEFAULT 'text',
  is_public TINYINT(1) NOT NULL DEFAULT 0,
  updated_by BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_site_settings_key (setting_key),
  CONSTRAINT fk_site_settings_updated_by
    FOREIGN KEY (updated_by) REFERENCES admin_users (id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE pages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  page_key VARCHAR(120) NOT NULL,
  content_source ENUM('database', 'static') NOT NULL DEFAULT 'database',
  is_published TINYINT(1) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_pages_key (page_key)
) ENGINE=InnoDB;

CREATE TABLE page_translations (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  page_id BIGINT UNSIGNED NOT NULL,
  locale VARCHAR(5) NOT NULL,
  slug VARCHAR(190) NOT NULL,
  title VARCHAR(255) NOT NULL,
  meta_title VARCHAR(255) NULL,
  meta_description VARCHAR(320) NULL,
  summary TEXT NULL,
  body LONGTEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_page_translations_page_locale (page_id, locale),
  UNIQUE KEY uq_page_translations_locale_slug (locale, slug),
  CONSTRAINT fk_page_translations_page
    FOREIGN KEY (page_id) REFERENCES pages (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE legal_documents (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  document_key VARCHAR(120) NOT NULL,
  document_type ENUM('privacy', 'cookie', 'terms', 'authorization', 'other') NOT NULL,
  version VARCHAR(40) NOT NULL,
  effective_date DATE NULL,
  file_path VARCHAR(500) NULL,
  is_published TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_legal_documents_key_version (document_key, version)
) ENGINE=InnoDB;

CREATE TABLE legal_document_translations (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  legal_document_id BIGINT UNSIGNED NOT NULL,
  locale VARCHAR(5) NOT NULL,
  title VARCHAR(255) NOT NULL,
  body LONGTEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_legal_translations_document_locale (legal_document_id, locale),
  CONSTRAINT fk_legal_translations_document
    FOREIGN KEY (legal_document_id) REFERENCES legal_documents (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE redirects (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  source_path VARCHAR(500) NOT NULL,
  destination_path VARCHAR(500) NOT NULL,
  status_code SMALLINT UNSIGNED NOT NULL DEFAULT 301,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_redirects_source (source_path)
) ENGINE=InnoDB;

CREATE TABLE audit_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  admin_user_id BIGINT UNSIGNED NULL,
  action VARCHAR(120) NOT NULL,
  entity_type VARCHAR(120) NOT NULL,
  entity_id BIGINT UNSIGNED NULL,
  changes_json JSON NULL,
  ip_address VARCHAR(45) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_audit_logs_entity (entity_type, entity_id),
  KEY idx_audit_logs_created (created_at),
  CONSTRAINT fk_audit_logs_admin
    FOREIGN KEY (admin_user_id) REFERENCES admin_users (id) ON DELETE SET NULL
) ENGINE=InnoDB;

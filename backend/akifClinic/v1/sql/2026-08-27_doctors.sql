CREATE TABLE IF NOT EXISTS doctors (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(80) NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_doctors_public_order (is_published, sort_order, id)
) ENGINE=InnoDB;

INSERT INTO doctors (title, full_name, image_url, sort_order, is_published)
SELECT 'Dr.', 'Yusuf Çınar', '/images/doctors/dr-yusuf-cinar.jpg', 1, 1
WHERE NOT EXISTS (SELECT 1 FROM doctors WHERE full_name = 'Yusuf Çınar');

INSERT INTO doctors (title, full_name, image_url, sort_order, is_published)
SELECT 'Dr.', 'Mustafa Kantar', '/images/doctors/dr-mustafa-kantar.jpg', 2, 1
WHERE NOT EXISTS (SELECT 1 FROM doctors WHERE full_name = 'Mustafa Kantar');

INSERT INTO doctors (title, full_name, image_url, sort_order, is_published)
SELECT 'Dr.', 'Uğur Özlü', '/images/doctors/dr-ugur-ozlu.jpg', 3, 1
WHERE NOT EXISTS (SELECT 1 FROM doctors WHERE full_name = 'Uğur Özlü');

INSERT INTO doctors (title, full_name, image_url, sort_order, is_published)
SELECT 'Dr.', 'Dağıstan Altuğ', '/images/doctors/dr-dagistan-altug.jpg', 4, 1
WHERE NOT EXISTS (SELECT 1 FROM doctors WHERE full_name = 'Dağıstan Altuğ');

INSERT INTO doctors (title, full_name, image_url, sort_order, is_published)
SELECT 'Uzman Dr.', 'Satı Zeynep Tekin', '/images/doctors/uzman-dr-sati-zeynep-tekin.jpg', 5, 1
WHERE NOT EXISTS (SELECT 1 FROM doctors WHERE full_name = 'Satı Zeynep Tekin');

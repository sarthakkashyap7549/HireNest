CREATE DATABASE IF NOT EXISTS defaultdb
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE defaultdb;  

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL,
  phone CHAR(10) NOT NULL,
  role VARCHAR(80) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  location VARCHAR(120) NOT NULL DEFAULT '',
  headline VARCHAR(80) NOT NULL DEFAULT '',
  skills JSON NOT NULL DEFAULT (JSON_ARRAY()),
  about VARCHAR(400) NOT NULL DEFAULT '',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_role (role)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS jobs (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(160) NOT NULL,
  company VARCHAR(160) NOT NULL,
  location VARCHAR(120) NOT NULL,
  type ENUM('Full-time', 'Part-time', 'Internship', 'Contract') NOT NULL,
  mode ENUM('On-site', 'Hybrid', 'Remote') NOT NULL,
  experience ENUM('Fresher', '1-3 years', '3+ years') NOT NULL,
  salary DECIMAL(6,2) NOT NULL,
  skills JSON NOT NULL,
  posted_days_ago SMALLINT UNSIGNED NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_jobs_location (location),
  KEY idx_jobs_type (type),
  KEY idx_jobs_mode (mode),
  KEY idx_jobs_experience (experience),
  KEY idx_jobs_salary (salary)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS applications (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  job_id INT UNSIGNED NOT NULL,
  status ENUM('Applied', 'Under review', 'Interview', 'Rejected') NOT NULL DEFAULT 'Applied',
  applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_applications_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_applications_job FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE RESTRICT,
  CONSTRAINT uq_applications_user_job UNIQUE (user_id, job_id),
  KEY idx_applications_user_applied (user_id, applied_at),
  KEY idx_applications_job (job_id)
) ENGINE=InnoDB;

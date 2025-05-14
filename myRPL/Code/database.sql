-- Buat database
CREATE DATABASE IF NOT EXISTS literasi_db;

-- Gunakan database
USE literasi_db;

-- Buat tabel literasi_data
CREATE TABLE IF NOT EXISTS literasi_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    jawaban TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

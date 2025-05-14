-- Buat database
CREATE DATABASE IF NOT EXISTS emotion_tracker;

-- Gunakan database
USE emotion_tracker;

-- Buat tabel emotions
CREATE TABLE IF NOT EXISTS emotions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    emotion_type ENUM('senang', 'cemas', 'marah', 'sedih') NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Buat tabel recommendations
CREATE TABLE IF NOT EXISTS recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    emotion_type ENUM('senang', 'cemas', 'marah', 'sedih') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    tips TEXT,
    quote TEXT,
    icon VARCHAR(50),
    color VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert data rekomendasi default
INSERT INTO recommendations (emotion_type, title, description, tips, quote, icon, color) VALUES
('senang', 'Anda tampak dalam suasana hati yang baik!', 'Terus lakukan hal yang membuat Anda bahagia. Berikut kutipan untuk Anda:', NULL, '"Hidup adalah apa yang terjadi ketika kamu sedang sibuk membuat rencana." — John Lennon', 'laugh-beam', 'var(--happy-color)'),
('cemas', 'Kecemasan bisa diatasi!', 'Coba teknik relaksasi sederhana untuk menenangkan pikiran:', '["Ambil napas dalam 4 hitungan, tahan 4 hitungan, buang napas 6 hitungan","Lakukan peregangan ringan selama 5 menit","Tuliskan apa yang mengganggu pikiran Anda"]', NULL, 'flushed', 'var(--anxious-color)'),
('marah', 'Rasakan kemarahan sebagai energi positif', 'Cara sehat untuk menyalurkan energi emosional:', '["Lakukan aktivitas fisik seperti berjalan cepat atau lompat-lompat","Tepuk bantal atau berteriak di tempat yang sepi","Ekspresikan perasaan Anda melalui tulisan atau gambar"]', NULL, 'angry', 'var(--angry-color)'),
('sedih', 'Perasaan sedih adalah hal yang wajar', 'Beberapa hal yang mungkin bisa membantu:', '["Dengarkan lagu yang mengangkat semangat","Hubungi teman atau keluarga untuk mengobrol","Luangkan waktu untuk melakukan hobi yang disukai"]', NULL, 'sad-tear', 'var(--sad-color)');

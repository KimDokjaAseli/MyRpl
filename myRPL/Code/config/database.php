<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "emotion_tracker";

// Buat koneksi
$conn = new mysqli($servername, $username, $password, $dbname);

// Periksa koneksi
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set charset ke utf8mb4 untuk mendukung emoji dan karakter khusus
$conn->set_charset("utf8mb4");
?>

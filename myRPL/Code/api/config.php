<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$host = "localhost";
$db_name = "emotion_tracker";
$username = "root";
$password = "";

// Buat koneksi
$conn = new mysqli($host, $username, $password, $db_name);

// Periksa koneksi
if ($conn->connect_error) {
    die("Koneksi database gagal: " . $conn->connect_error);
}

// Set charset ke utf8mb4 untuk mendukung emoji dan karakter khusus
$conn->set_charset("utf8mb4");
?>

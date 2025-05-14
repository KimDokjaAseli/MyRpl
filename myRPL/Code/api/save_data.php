<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

// Tangkap data yang dikirim dari JavaScript
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validasi data
if (!isset($data['emotion_type'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Data emosi tidak lengkap']);
    exit;
}

try {
    // Siapkan pernyataan SQL untuk menyimpan emosi
    $stmt = $conn->prepare("INSERT INTO emotions (emotion_type, description) VALUES (?, ?)");
    
    // Ambil deskripsi atau gunakan string kosong jika tidak ada
    $description = $data['description'] ?? '';
    
    // Bind parameter
    $stmt->bind_param('ss', $data['emotion_type'], $description);
    
    // Eksekusi query
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true, 
            'message' => 'Emosi berhasil dicatat',
            'id' => $stmt->insert_id
        ]);
    } else {
        throw new Exception('Gagal menyimpan data emosi');
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Terjadi kesalahan: ' . $e->getMessage()
    ]);
}

// Tutup koneksi
$stmt->close();
$conn->close();
?>

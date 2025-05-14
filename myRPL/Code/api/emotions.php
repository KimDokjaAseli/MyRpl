<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Ambil semua catatan emosi
        $query = "SELECT * FROM emotions ORDER BY created_at DESC";
        $result = $conn->query($query);
        
        $emotions = [];
        while ($row = $result->fetch_assoc()) {
            $emotions[] = $row;
        }
        
        echo json_encode(['status' => 'success', 'data' => $emotions]);
        break;
        
    case 'POST':
        // Tambah catatan emosi baru
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception('Invalid JSON data');
            }
            
            $emotion_type = $data['emotion_type'] ?? '';
            $description = $data['description'] ?? 'Tidak ada deskripsi';
            
            if (empty($emotion_type)) {
                throw new Exception('Jenis emosi tidak boleh kosong');
            }
            
            // Validasi tipe emosi yang diizinkan
            $allowed_emotions = ['senang', 'sedih', 'marah', 'cemas'];
            if (!in_array($emotion_type, $allowed_emotions)) {
                throw new Exception('Jenis emosi tidak valid');
            }
            
            $stmt = $conn->prepare("INSERT INTO emotions (emotion_type, description) VALUES (?, ?)");
            if (!$stmt) {
                throw new Exception('Database error: ' . $conn->error);
            }
            
            $stmt->bind_param('ss', $emotion_type, $description);
            
            if ($stmt->execute()) {
                $emotion_id = $conn->insert_id;
                echo json_encode([
                    'status' => 'success', 
                    'message' => 'Emosi berhasil dicatat',
                    'data' => [
                        'id' => $emotion_id,
                        'emotion_type' => $emotion_type,
                        'description' => $description,
                        'created_at' => date('Y-m-d H:i:s')
                    ]
                ]);
            } else {
                throw new Exception('Gagal menyimpan emosi: ' . $stmt->error);
            }
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error', 
                'message' => $e->getMessage()
            ]);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
        break;
}

$conn->close();
?>

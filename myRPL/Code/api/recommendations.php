<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $emotion_type = $_GET['emotion'] ?? '';
    
    if (empty($emotion_type)) {
        // Jika tidak ada parameter emotion, ambil rekomendasi berdasarkan emosi terakhir
        $query = "SELECT * FROM emotions ORDER BY created_at DESC LIMIT 1";
        $result = $conn->query($query);
        
        if ($result->num_rows > 0) {
            $last_emotion = $result->fetch_assoc();
            $emotion_type = $last_emotion['emotion_type'];
        } else {
            // Jika tidak ada data emosi, berikan rekomendasi default
            $emotion_type = 'senang';
        }
    }
    
    $stmt = $conn->prepare("SELECT * FROM recommendations WHERE emotion_type = ?");
    $stmt->bind_param('s', $emotion_type);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $recommendation = $result->fetch_assoc();
        
        // Parse tips jika ada
        if (!empty($recommendation['tips'])) {
            $recommendation['tips'] = json_decode($recommendation['tips'], true);
        }
        
        echo json_encode(['status' => 'success', 'data' => $recommendation]);
    } else {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'No recommendations found']);
    }
} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
}

$conn->close();
?>

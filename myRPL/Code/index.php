<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pemantauan Emosi Harian</title>
  <?php
  // Mulai session
  session_start();
  
  // Inisialisasi pesan notifikasi
  $notification = [
    'type' => '',
    'message' => ''
  ];
  
  // Proses form kuesioner jika dikirim
  if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['submit_questionnaire'])) {
    // Validasi input
    if (isset($_POST['q1']) && isset($_POST['q2'])) {
      // Simpan jawaban ke session
      $_SESSION['questionnaire'] = [
        'q1' => intval($_POST['q1']),
        'q2' => intval($_POST['q2']),
        'submitted_at' => date('Y-m-d H:i:s')
      ];
      
      // Set notifikasi sukses
      $notification['type'] = 'success';
      $notification['message'] = 'Terima kasih telah mengisi kuesioner!';
    } else {
      // Set notifikasi error
      $notification['type'] = 'error';
      $notification['message'] = 'Mohon lengkapi semua pertanyaan';
    }
  }
  
  // Cek apakah pengguna sudah login atau memiliki session
  $isLoggedIn = isset($_SESSION['user_id']);
  ?>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <link rel="stylesheet" href="styles.css" />
  <style>
    /* Style untuk notifikasi */
    .notification {
      padding: 12px 20px;
      margin: 10px 0;
      border-radius: 4px;
      color: white;
      font-weight: 500;
      animation: slideDown 0.3s ease-out;
    }
    
    .notification.success {
      background-color: #4CAF50;
    }
    
    .notification.error {
      background-color: #f44336;
    }
    
    @keyframes slideDown {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  </style>
  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <header>
    <div class="container">
      <h1><i class="fas fa-brain" style="margin-right: 10px;"></i> Aplikasi Pemantauan Emosi Harian</h1>
      <p class="tagline">Lacak dan kelola perasaan Anda dengan lebih baik</p>
      <?php if ($notification['type'] && $notification['message']): ?>
        <div class="notification <?php echo $notification['type']; ?>">
          <?php echo htmlspecialchars($notification['message']); ?>
        </div>
      <?php endif; ?>
      <nav>
        <button data-page="record" class="active"><i class="fas fa-pen-fancy"></i> Catat Emosi</button>
        <button data-page="dashboard"><i class="fas fa-chart-line"></i> Dashboard</button>
        <button data-page="recommendation"><i class="fas fa-lightbulb"></i> Rekomendasi</button>
      </nav>
    </div>
  </header>

  <main class="container">
    <section id="record" class="page active">
      <div class="card">
        <h2><i class="fas fa-feather-alt"></i> Catat Emosi Anda Hari Ini</h2>
        <form id="emotionForm">
          <div class="form-group">
            <label for="emotion">Pilih Emosi Anda:</label>
            <div class="emotion-selector">
              <div class="emotion-option">
                <input type="radio" id="senang" name="emotion" value="senang" required>
                <label for="senang" class="emotion-btn happy">
                  <i class="far fa-laugh"></i>
                  <span>Senang</span>
                </label>
              </div>
              <div class="emotion-option">
                <input type="radio" id="sedih" name="emotion" value="sedih">
                <label for="sedih" class="emotion-btn sad">
                  <i class="far fa-sad-tear"></i>
                  <span>Sedih</span>
                </label>
              </div>
              <div class="emotion-option">
                <input type="radio" id="marah" name="emotion" value="marah">
                <label for="marah" class="emotion-btn angry">
                  <i class="far fa-angry"></i>
                  <span>Marah</span>
                </label>
              </div>
              <div class="emotion-option">
                <input type="radio" id="cemas" name="emotion" value="cemas">
                <label for="cemas" class="emotion-btn anxious">
                  <i class="far fa-flushed"></i>
                  <span>Cemas</span>
                </label>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="description">Deskripsi Perasaan Anda:</label>
            <textarea id="description" name="description" placeholder="Ceritakan lebih detail perasaan Anda hari ini..."></textarea>
          </div>

          <div class="form-group">
            <button type="submit" class="btn-primary">
              <i class="fas fa-save"></i> Simpan Emosi
            </button>
          </div>
        </form>
      </div>

      <div class="card mt-4">
        <h3><i class="fas fa-clipboard-list"></i> Kuesioner Kesehatan Mental</h3>
        <p class="mb-4">Bantu kami memahami perasaan Anda lebih dalam dengan mengisi kuesioner singkat ini.</p>
        
        <form id="questionnaireForm" method="POST" action="">
          <input type="hidden" name="submit_questionnaire" value="1">
          <div class="form-group">
            <p class="question">1. Seberapa sering Anda merasa cemas dalam 1 minggu terakhir?</p>
            <div class="radio-group">
              <label class="radio-option">
                <input type="radio" name="q1" value="0" required>
                <span>Tidak pernah</span>
              </label>
              <label class="radio-option">
                <input type="radio" name="q1" value="1">
                <span>Kadang-kadang</span>
              </label>
              <label class="radio-option">
                <input type="radio" name="q1" value="2">
                <span>Sering</span>
              </label>
              <label class="radio-option">
                <input type="radio" name="q1" value="3">
                <span>Selalu</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <p class="question">2. Seberapa sering Anda merasa marah atau frustrasi?</p>
            <div class="radio-group">
              <label class="radio-option">
                <input type="radio" name="q2" value="0" required>
                <span>Tidak pernah</span>
              </label>
              <label class="radio-option">
                <input type="radio" name="q2" value="1">
                <span>Kadang-kadang</span>
              </label>
              <label class="radio-option">
                <input type="radio" name="q2" value="2">
                <span>Sering</span>
              </label>
              <label class="radio-option">
                <input type="radio" name="q2" value="3">
                <span>Selalu</span>
              </label>
            </div>
          </div>

          <div class="form-group text-right">
            <button type="submit" class="btn-primary">
              <i class="fas fa-paper-plane"></i> Kirim Kuesioner
            </button>
          </div>
        </form>
      </div>
    </section>

    <section id="dashboard" class="page">
      <div class="card">
        <h2><i class="fas fa-chart-line"></i> Grafik Tren Emosi</h2>
        <div class="chart-container">
          <canvas id="emotionChart" aria-label="Grafik tren emosi" role="img"></canvas>
        </div>
      </div>
    </section>

    <section id="recommendation" class="page">
      <div class="card">
        <h2><i class="fas fa-lightbulb"></i> Rekomendasi Aktivitas</h2>
        <div id="recommendations" class="recommendation-container">
          <div class="empty-state">
            <i class="fas fa-comment-alt-smile"></i>
            <h3>Belum ada data</h3>
            <p>Rekomendasi akan muncul di sini setelah Anda mencatat emosi atau mengisi kuesioner.</p>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer>
    <div class="container">
      <p>&copy; 2024 Aplikasi Pemantauan Emosi Harian. Dibuat dengan <i class="fas fa-heart" style="color: #f5365c;"></i> untuk kesehatan mental yang lebih baik.</p>
    </div>
  </footer>

  <!-- Tambahkan script JavaScript -->
  <script>
    // Inisialisasi variabel global
    const isLoggedIn = <?php echo $isLoggedIn ? 'true' : 'false'; ?>;
    document.addEventListener('DOMContentLoaded', function() {
      // Tampilkan notifikasi dari PHP jika ada
      <?php if ($notification['type'] && $notification['message']): ?>
      showNotification('<?php echo $notification['type']; ?>', '<?php echo addslashes($notification['message']); ?>');
      <?php endif; ?>
      // Inisialisasi tooltip
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
      });

      // Inisialisasi popover
      const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
      popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
      });
    });
  </script>
  
  <!-- Script utama aplikasi -->
  <script>
    // Fungsi untuk menampilkan notifikasi
    function showNotification(type, message) {
      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      notification.textContent = message;
      
      // Tambahkan notifikasi ke header
      const header = document.querySelector('header .container');
      header.insertBefore(notification, header.querySelector('nav'));
      
      // Hapus notifikasi setelah 5 detik
      setTimeout(() => {
        notification.remove();
      }, 5000);
    }
    
    // Redirect ke halaman login jika belum login
    if (!isLoggedIn && !window.location.href.includes('login.php')) {
      // window.location.href = 'login.php';
      // Sementara di-comment untuk pengembangan
    }
  </script>
  <script src="script.js"></script>
</body>
</html>

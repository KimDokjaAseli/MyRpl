// Inisialisasi variabel global
const pages = document.querySelectorAll('.page');
const navButtons = document.querySelectorAll('nav button');
const form = document.getElementById('emotionForm');
const emotionRadios = document.querySelectorAll('input[name="emotion"]');
const descriptionInput = document.getElementById('description');
const questionnaireForm = document.getElementById('questionnaireForm');
const recommendationsDiv = document.getElementById('recommendations');

// Inisialisasi emosi dari localStorage atau array kosong
let emotionData = [];

// Fungsi untuk memuat data emosi dari API
async function loadEmotionData() {
  try {
    const response = await fetch('api/emotions.php');
    const result = await response.json();
    
    if (result.status === 'success') {
      emotionData = result.data;
      return true;
    } else {
      console.error('Error loading emotion data:', result.message);
      return false;
    }
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

// Deklarasi variabel global untuk chart
let emotionChart;

// Fungsi untuk menginisialisasi chart
function initChart() {
  const ctx = document.getElementById('emotionChart');
  if (!ctx) return;
  
  const ctx2d = ctx.getContext('2d');
  if (!ctx2d) return;
  
  emotionChart = new Chart(ctx2d, {
    type: 'bar',
    data: {
      labels: ['Senang', 'Cemas', 'Marah', 'Sedih'],
      datasets: [{
        label: 'Frekuensi Emosi',
        data: [0, 0, 0, 0],
        backgroundColor: [
          'rgba(46, 204, 113, 0.7)',  // Hijau untuk senang
          'rgba(241, 196, 15, 0.7)',  // Kuning untuk cemas
          'rgba(231, 76, 60, 0.7)',   // Merah untuk marah
          'rgba(52, 152, 219, 0.7)'   // Biru untuk sedih
        ],
        borderColor: [
          'rgba(46, 204, 113, 1)',
          'rgba(241, 196, 15, 1)',
          'rgba(231, 76, 60, 1)',
          'rgba(52, 152, 219, 1)'
        ],
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { 
          beginAtZero: true, 
          ticks: {
            stepSize: 1,
            precision: 0
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 13
          },
          padding: 12,
          cornerRadius: 6
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeInOutQuart'
      }
    }
  });
}

// Panggil fungsi inisialisasi saat halaman selesai dimuat
loadEmotionData();
initChart();

// Sembunyikan semua halaman terlebih dahulu
pages.forEach(page => page.style.display = 'none');
// Tampilkan halaman aktif
document.querySelector('.page.active').style.display = 'block';

// Update chart dan rekomendasi saat halaman dimuat
updateChart();
updateRecommendations();

// Navigasi antar halaman
navButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const target = btn.getAttribute('data-page');
    
    // Hapus class active dari semua tombol dan halaman
    navButtons.forEach(b => b.classList.remove('active'));
    pages.forEach(p => p.classList.remove('active'));
    
    // Tambah class active ke tombol dan halaman yang dipilih
    btn.classList.add('active');
    document.getElementById(target).classList.add('active');
    
    // Animasikan transisi halaman
    pages.forEach(p => {
      if (p.id === target) {
        p.style.display = 'block';
        p.style.animation = 'fadeIn 0.5s ease-out';
      } else {
        p.style.display = 'none';
      }
    });
    
    // Update chart setiap kali membuka dashboard
    if (target === 'dashboard') {
      updateChart();
    }
  });
});

// Update chart dengan data terbaru
async function updateChart() {
  const counts = {
    senang: 0, 
    cemas: 0, 
    marah: 0, 
    sedih: 0
  };
  
  try {
    // Pastikan data sudah dimuat
    await loadEmotionData();
    
    // Hitung frekuensi setiap emosi
    emotionData.forEach(e => counts[e.emotion_type]++);
    
    // Update data chart jika chart sudah diinisialisasi
    if (emotionChart) {
      emotionChart.data.datasets[0].data = [
        counts.senang,
        counts.cemas,
        counts.marah,
        counts.sedih
      ];
      
      // Update chart
      emotionChart.update();
    }
    
    return true;
  } catch (error) {
    console.error('Error updating chart:', error);
    return false;
  }
}

// Update rekomendasi berdasarkan emosi terakhir
async function updateRecommendations() {
  try {
    // Pastikan data sudah dimuat
    await loadEmotionData();
    
    if (emotionData.length === 0) {
      recommendationsDiv.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-comment-alt-smile"></i>
          <h3>Belum ada data</h3>
          <p>Rekomendasi akan muncul di sini setelah Anda mencatat emosi atau mengisi kuesioner.</p>
        </div>`;
      return;
    }
    
    // Ambil rekomendasi dari API
    const response = await fetch('api/recommendations.php');
    const result = await response.json();
    
    if (result.status !== 'success') {
      throw new Error(result.message || 'Gagal memuat rekomendasi');
    }
    
    const rec = result.data;
    
    // Bangun HTML rekomendasi
    const recHtml = `
      <div class="recommendation-card">
        <div class="recommendation-header" style="background: ${rec.color}20; border-left: 4px solid ${rec.color}">
          <i class="fas fa-${rec.icon}" style="color: ${rec.color}"></i>
          <h3>${rec.title}</h3>
        </div>
        <div class="recommendation-body">
          <p>${rec.description}</p>
          ${rec.quote ? `<blockquote>${rec.quote}</blockquote>` : ''}
          ${rec.tips && rec.tips.length > 0 ? `
            <div class="tips">
              <h4>Tips untuk Anda:</h4>
              <ul>
                ${rec.tips.map(tip => `<li>${tip}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      </div>
    `;
    
    // Update UI
    recommendationsDiv.innerHTML = recHtml;
    
  } catch (error) {
    console.error('Error updating recommendations:', error);
    
    // Tampilkan pesan error yang ramah pengguna
    recommendationsDiv.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Terjadi Kesalahan</h3>
        <p>Gagal memuat rekomendasi. Silakan coba lagi nanti.</p>
      </div>`;
  }
  
  // Simpan ke localStorage
  localStorage.setItem('emotionData', JSON.stringify(emotionData));
}

// Fungsi untuk mengirim data ke backend
async function sendToBackend(data) {
  try {
    const response = await fetch('api/save_data.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    if (result.success) {
      console.log('Data berhasil disimpan ke database');
    } else {
      console.error('Gagal menyimpan data:', result.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Submit form pencatatan emosi manual
form.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  // Dapatkan emosi yang dipilih
  let selectedEmotion = '';
  emotionRadios.forEach(radio => {
    if (radio.checked) {
      selectedEmotion = radio.value;
    }
  });
  
  const description = descriptionInput.value.trim();

  if (!selectedEmotion) {
    showAlert('error', 'Silakan pilih emosi terlebih dahulu');
    return;
  }
  
  // Tampilkan loading state
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
  
  try {
    // Kirim data ke API
    const response = await fetch('api/emotions.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emotion_type: selectedEmotion,
        description: description || 'Tidak ada deskripsi'
      })
    });
    
    const result = await response.json();
    
    if (result.status !== 'success') {
      throw new Error(result.message || 'Gagal menyimpan emosi');
    }
    
    // Update data lokal
    if (result.data) {
      // Tambahkan ke array emotionData jika ada
      emotionData.unshift(result.data);
      
      // Simpan ke localStorage untuk referensi cepat
      localStorage.setItem('lastEmotion', JSON.stringify(result.data));
    }
    
    // Update UI
    updateChart();
    updateRecommendations();
    
    // Reset form
    form.reset();
    
    // Tampilkan notifikasi sukses
    showAlert('success', result.message || 'Emosi berhasil dicatat!');
    
    // Berpindah ke halaman dashboard setelah 1 detik
    setTimeout(() => {
      document.querySelector('button[data-page="dashboard"]').click();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);
    
  } catch (error) {
    console.error('Error:', error);
    showAlert('error', error.message || 'Terjadi kesalahan saat menyimpan emosi');
  } finally {
    // Reset button state
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
});

// Fungsi untuk menampilkan notifikasi
function showAlert(type, message) {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  
  // Tambahkan ke body
  document.body.appendChild(alert);
  
  // Hilangkan setelah 3 detik
  setTimeout(() => {
    alert.classList.add('fade-out');
    setTimeout(() => alert.remove(), 500);
  }, 3000);
}

// Submit form kuesioner
questionnaireForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const q1 = parseInt(document.querySelector('input[name="q1"]:checked')?.value || 0);
  const q2 = parseInt(document.querySelector('input[name="q2"]:checked')?.value || 0);
  
  // Validasi apakah semua pertanyaan sudah diisi
  if (isNaN(q1) || isNaN(q2)) {
    showAlert('error', 'Silakan jawab semua pertanyaan kuesioner');
    return;
  }


  const totalScore = q1 + q2;

  // Tentukan emosi berdasarkan skor
  let detectedEmotion = 'senang';
  if (totalScore >= 5) detectedEmotion = 'marah';
  else if (totalScore >= 3) detectedEmotion = 'cemas';
  else if (totalScore >= 1) detectedEmotion = 'sedih';

  // Tambahkan emosi baru dari kuesioner
  emotionData.push({
    emotion: detectedEmotion, 
    description: 'Hasil kuesioner kesehatan mental', 
    timestamp: new Date().toISOString()
  });
  
  // Reset form
  questionnaireForm.reset();

  // Update UI
  updateChart();
  updateRecommendations();
  
  // Tampilkan notifikasi sukses
  showAlert('success', 'Kuesioner berhasil disubmit!');
  
  // Berpindah ke halaman rekomendasi dengan animasi
  document.querySelector('button[data-page="recommendation"]').click();
  
  // Scroll ke atas halaman rekomendasi
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Inisialisasi UI setelah DOM selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
  // Set halaman aktif berdasarkan URL hash
  const hash = window.location.hash.substring(1) || 'record';
  const activeBtn = document.querySelector(`button[data-page="${hash}"]`);
  if (activeBtn) activeBtn.click();
  
  // Tambahkan style untuk notifikasi
  const style = document.createElement('style');
  style.textContent = `
    .alert {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 24px;
      border-radius: var(--border-radius);
      color: white;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      opacity: 0;
      transform: translateX(100%);
      animation: slideIn 0.3s ease-out forwards;
    }
    
    .alert-success {
      background-color: var(--secondary-color);
    }
    
    .alert-error {
      background-color: var(--danger-color);
    }
    
    .fade-out {
      animation: fadeOut 0.5s ease-out forwards;
    }
    
    @keyframes slideIn {
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @keyframes fadeOut {
      to {
        opacity: 0;
        transform: translateX(100%);
      }
    }
    
    /* Style untuk rekomendasi */
    .recommendation-card {
      background: white;
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
      overflow: hidden;
      transition: var(--transition);
    }
    
    .recommendation-header {
      display: flex;
      align-items: center;
      padding: 1.5rem;
      background: linear-gradient(135deg, #f8f9fe 0%, #f1f3f9 100%);
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }
    
    .recommendation-header i {
      font-size: 1.75rem;
      margin-right: 1rem;
    }
    
    .recommendation-header h3 {
      margin: 0;
      color: var(--dark-color);
    }
    
    .recommendation-body {
      padding: 1.5rem;
    }
    
    .recommendation-body p {
      margin-bottom: 1.25rem;
      color: var(--text-color);
      line-height: 1.7;
    }
    
    .tips {
      background: rgba(0, 0, 0, 0.02);
      border-radius: var(--border-radius);
      padding: 1.25rem;
      margin-top: 1.5rem;
    }
    
    .tips h4 {
      margin-top: 0;
      margin-bottom: 0.75rem;
      color: var(--dark-color);
    }
    
    .tips ul {
      margin: 0;
      padding-left: 1.25rem;
    }
    
    .tips li {
      margin-bottom: 0.5rem;
      color: var(--text-color);
    }
    
    blockquote {
      border-left: 4px solid var(--primary-color);
      margin: 1.5rem 0;
      padding: 1rem 1.5rem;
      background: rgba(94, 114, 228, 0.05);
      border-radius: 0 var(--border-radius) var(--border-radius) 0;
      font-style: italic;
      color: var(--dark-color);
    }
    
    blockquote::before {
      content: '"';
      font-size: 3rem;
      color: var(--primary-color);
      opacity: 0.2;
      position: absolute;
      margin-left: -1.5rem;
      margin-top: -1rem;
    }
  `;
  
  document.head.appendChild(style);
});

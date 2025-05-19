// Inisialisasi variabel global
let emotionChart = null;
const pages = document.querySelectorAll('.page');
const navButtons = document.querySelectorAll('.nav-btn');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('nav');

// Form elements
const form = document.getElementById('emotionForm');
const emotionSelect = document.getElementById('emotion');
const descriptionInput = document.getElementById('description');
const questionnaireForm = document.getElementById('questionnaireForm');
const recommendationsDiv = document.getElementById('recommendations');

// Data emosi
let emotionData = [];

// Inisialisasi Chart.js
function initChart() {
  const ctx = document.getElementById('emotionChart');
  if (!ctx) return;
  
  // Hancurkan chart yang ada jika sudah ada
  if (emotionChart) {
    emotionChart.destroy();
  }
  
  emotionChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Senang', 'Cemas', 'Marah', 'Sedih'],
      datasets: [{
        label: 'Frekuensi Emosi',
        data: [0, 0, 0, 0],
        backgroundColor: [
          'rgba(76, 175, 80, 0.7)',
          'rgba(255, 193, 7, 0.7)',
          'rgba(244, 67, 54, 0.7)',
          'rgba(33, 150, 243, 0.7)'
        ],
        borderColor: [
          'rgba(76, 175, 80, 1)',
          'rgba(255, 193, 7, 1)',
          'rgba(244, 67, 54, 1)',
          'rgba(33, 150, 243, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: {
            family: "'Poppins', sans-serif"
          },
          bodyFont: {
            family: "'Poppins', sans-serif"
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            font: {
              family: "'Poppins', sans-serif"
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          ticks: {
            font: {
              family: "'Poppins', sans-serif"
            }
          },
          grid: {
            display: false
          }
        }
      }
    }
  });
}

// Fungsi untuk beralih halaman
function showPage(pageId) {
  // Sembunyikan semua halaman
  pages.forEach(page => {
    page.classList.remove('active');
  });
  
  // Tampilkan halaman yang dipilih
  const activePage = document.getElementById(pageId);
  if (activePage) {
    activePage.classList.add('active');
  }
  
  // Update status aktif pada navigasi
  navButtons.forEach(btn => {
    if (btn.getAttribute('data-page') === pageId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Tutup menu mobile jika terbuka
  if (nav.classList.contains('active')) {
    toggleMobileMenu();
  }
}

// Event listener untuk tombol navigasi
navButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const targetPage = btn.getAttribute('data-page');
    showPage(targetPage);
    
    // Simpan halaman aktif ke localStorage
    localStorage.setItem('activePage', targetPage);
  });
});

// Toggle menu mobile
function toggleMobileMenu() {
  nav.classList.toggle('active');
  document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
}

// Event listener untuk tombol menu mobile
if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', toggleMobileMenu);
}

// Tutup menu mobile saat mengklik di luar menu
document.addEventListener('click', (e) => {
  if (nav.classList.contains('active') && 
      !e.target.closest('nav') && 
      !e.target.closest('.mobile-menu-btn')) {
    toggleMobileMenu();
  }
});

// Update chart dengan data terbaru
function updateChart() {
  if (!emotionChart) {
    initChart();
    if (!emotionChart) return;
  }
  
  // Hitung frekuensi setiap emosi
  const counts = {senang: 0, cemas: 0, marah: 0, sedih: 0};
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);
  
  // Filter data 7 hari terakhir
  const recentData = emotionData.filter(entry => {
    if (!entry || !entry.timestamp) return false;
    try {
      const entryDate = new Date(entry.timestamp);
      return entryDate >= last7Days;
    } catch (e) {
      console.error('Error processing entry date:', e);
      return false;
    }
  });
  
  recentData.forEach(entry => {
    if (entry && entry.emotion && counts.hasOwnProperty(entry.emotion)) {
      counts[entry.emotion]++;
    }
  });
  
  try {
    // Update data chart
    emotionChart.data.datasets[0].data = [
      counts.senang || 0,
      counts.cemas || 0,
      counts.marah || 0,
      counts.sedih || 0
    ];
    
    // Update chart
    emotionChart.update();
    
    // Update ringkasan statistik
    updateStatsSummary(counts, recentData.length);
  } catch (error) {
    console.error('Error updating chart:', error);
    // Coba inisialisasi ulang chart jika terjadi error
    initChart();
  }
}

// Update ringkasan statistik
function updateStatsSummary(counts, totalEntries) {
  const statsContainer = document.getElementById('statsSummary');
  if (!statsContainer) return;
  
  // Temukan emosi yang paling sering muncul
  let mostFrequentEmotion = 'senang';
  let maxCount = counts.senang;
  
  for (const [emotion, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      mostFrequentEmotion = emotion;
    }
  }
  
  const emotionLabels = {
    senang: 'Kebahagiaan',
    cemas: 'Kecemasan',
    marah: 'Kemarahan',
    sedih: 'Kesedihan'
  };
  
  const emotionIcons = {
    senang: 'fa-smile-beam',
    cemas: 'fa-flushed',
    marah: 'fa-angry',
    sedih: 'fa-sad-tear'
  };
  
  const emotionColors = {
    senang: 'green',
    cemas: 'yellow',
    marah: 'red',
    sedih: 'blue'
  };
  
  const statsHTML = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">${totalEntries}</div>
        <div class="stat-label">Total Pencatatan</div>
        <i class="fas fa-clipboard-list mt-2 text-gray-400"></i>
      </div>
      <div class="stat-card">
        <div class="stat-value">${emotionLabels[mostFrequentEmotion]}</div>
        <div class="stat-label">Emosi Paling Sering</div>
        <i class="fas ${emotionIcons[mostFrequentEmotion]} mt-2 text-${emotionColors[mostFrequentEmotion]}-500"></i>
      </div>
      <div class="stat-card">
        <div class="stat-value">${Object.values(counts).reduce((a, b) => a + b, 0)}</div>
        <div class="stat-label">Total Emosi 7 Hari</div>
        <i class="fas fa-calendar-week mt-2 text-purple-500"></i>
      </div>
    </div>`;
    
  statsContainer.innerHTML = statsHTML;
}

// Update rekomendasi berdasarkan data emosi terbaru
function updateRecommendations() {
  if (!recommendationsDiv) return;
  
  if (emotionData.length === 0) {
    recommendationsDiv.innerHTML = `
      <div class="text-center p-4">
        <i class="fas fa-info-circle mb-2" style="font-size: 2rem; color: var(--gray-400);"></i>
        <p class="text-gray-600">Belum ada data emosi. Mulailah dengan mencatat perasaan Anda atau mengisi kuesioner.</p>
      </div>`;
    return;
  }
  
  const lastEmotion = emotionData[emotionData.length - 1].emotion;
  const emotionIcons = {
    senang: 'fa-smile-beam',
    cemas: 'fa-flushed',
    marah: 'fa-angry',
    sedih: 'fa-sad-tear'
  };
  
  const emotionTitles = {
    senang: 'Anda tampak dalam suasana hati yang baik!',
    cemas: 'Kecemasan bisa diatasi!',
    marah: 'Rasakan kemarahan sebagai energi positif.',
    sedih: 'Jangan ragu untuk berbagi.'
  };
  
  const emotionDescriptions = {
    senang: 'Terus lakukan hal yang membuat Anda bahagia. Berikut beberapa saran untuk Anda:',
    cemas: 'Coba beberapa teknik relaksasi untuk membantu meredakan kecemasan Anda:',
    marah: 'Salurkan energi marah Anda dengan cara yang positif:',
    sedih: 'Berikut beberapa hal yang mungkin bisa membantu Anda merasa lebih baik:'
  };
  
  const recommendations = {
    senang: [
      'Tulislah hal-hal yang Anda syukuri hari ini',
      'Bagikan kebahagiaan Anda dengan orang lain',
      'Coba aktivitas baru yang menyenangkan',
      'Simpan momen bahagia Anda dalam jurnal'
    ],
    cemas: [
      'Lakukan latihan pernapasan 4-7-8 (tarik napas 4 detik, tahan 7 detik, buang napas 8 detik)',
      'Berjalan-jalan di luar selama 10 menit',
      'Tuliskan kekhawatiran Anda di buku catatan',
      'Dengarkan musik yang menenangkan'
    ],
    marah: [
      'Lakukan olahraga ringan seperti jalan cepat atau lari',
      'Tarik napas dalam-dalam dan hitung sampai 10',
      'Tuliskan apa yang membuat Anda marah',
      'Coba teknik relaksasi otot progresif'
    ],
    sedih: [
      'Dengarkan lagu favorit Anda',
      'Hubungi teman atau keluarga untuk berbicara',
      'Tuliskan perasaan Anda dalam jurnal',
      'Lakukan aktivitas kreatif seperti menggambar atau mewarnai'
    ]
  };
  
  const quotes = {
    senang: [
      '"Kebahagiaan bukanlah sesuatu yang sudah jadi. Itu berasal dari tindakan Anda sendiri." - Dalai Lama',
      '"Kebahagiaan adalah ketika apa yang Anda pikirkan, apa yang Anda katakan, dan apa yang Anda lakukan berada dalam harmoni." - Mahatma Gandhi',
      '"Kebahagiaan bukanlah memiliki segalanya, tetapi menikmati apa yang Anda miliki." - Anonim',
      '"Kebahagiaan adalah kupu-kupu, yang ketika dikejar, selalu di luar jangkauan, tetapi, jika Anda duduk dengan tenang, mungkin hinggap di Anda." - Nathaniel Hawthorne'
    ],
    cemas: [
      '"Kekhawatiran tidak menghilangkan kesedihan hari esok, tetapi itu mengosongkan kekuatan hari ini." - Corrie Ten Boom',
      '"Anda tidak bisa selalu mengontrol apa yang terjadi di luar, tetapi Anda selalu bisa mengontrol apa yang terjadi di dalam." - Wayne Dyer',
      '"Kecemasan adalah pusingnya kebebasan." - Soren Kierkegaard',
      '"Hidup 10% adalah apa yang terjadi pada Anda dan 90% adalah bagaimana Anda menanggapinya." - Charles R. Swindoll'
    ],
    marah: [
      '"Menahan amarah itu seperti memegang bara panas dengan niat melemparkannya kepada orang lain; kamulah yang terbakar." - Buddha',
      '"Marah itu mudah. Tetapi marah kepada orang yang tepat, dengan kadar yang tepat, pada waktu yang tepat, dengan tujuan yang benar, dan dengan cara yang benar, tidaklah mudah." - Aristoteles',
      '"Kemarahan adalah asam yang bisa lebih merusak wadah tempatnya disimpan daripada apa pun yang ditujukannya." - Seneca',
      '"Ketika marah, hitung sampai sepuluh sebelum Anda berbicara. Jika Anda sangat marah, hitung sampai seratus." - Thomas Jefferson'
    ],
    sedih: [
      '"Air mata adalah kata-kata yang tidak bisa diucapkan oleh hati." - Anonim',
      '"Kesedihan memberi kedalaman. Kebahagiaan memberi ketinggian. Kesedihan memberi akar. Kebahagiaan memberi cabang. Kebahagiaan seperti pohon yang masuk ke langit, dan kesedihan seperti akar yang turun ke pangkuan bumi." - Osho',
      '"Tidak ada yang bisa menyembuhkan jiwa tetapi indra, seperti tidak ada yang bisa menyembuhkan tubuh tetapi kehidupan jiwa." - Oscar Wilde',
      '"Kesedihan mengalir di sepanjang sungai kesendirian menuju lautan kebahagiaan." - Khalil Gibran'
    ]
  };
  
  const randomQuote = quotes[lastEmotion][Math.floor(Math.random() * quotes[lastEmotion].length)];
  
  const recommendationItems = recommendations[lastEmotion]
    .map(item => `<li class="mb-2"><i class="fas fa-check-circle text-green-500 mr-2"></i>${item}</li>`)
    .join('');
  
  recommendationsDiv.innerHTML = `
    <div class="bg-${lastEmotion}-50 p-6 rounded-lg mb-6 border-l-4 border-${lastEmotion}-500">
      <div class="flex items-center mb-4">
        <i class="fas ${emotionIcons[lastEmotion]} text-3xl text-${lastEmotion}-600 mr-3"></i>
        <h3 class="text-xl font-semibold text-${lastEmotion}-800">${emotionTitles[lastEmotion]}</h3>
      </div>
      <p class="text-gray-700 mb-4">${emotionDescriptions[lastEmotion]}</p>
      <ul class="list-disc pl-5 mb-4 text-gray-700">
        ${recommendationItems}
      </ul>
      <div class="mt-4 p-4 bg-white rounded border-l-4 border-yellow-400">
        <i class="fas fa-quote-left text-yellow-400 text-xl opacity-50 mr-2"></i>
        <span class="italic text-gray-700">${randomQuote}</span>
      </div>
    </div>
    
    ${emotionData.length > 1 ? `
    <div class="bg-white p-6 rounded-lg shadow">
      <h4 class="font-semibold text-gray-800 mb-3">Riwayat Emosi Terakhir</h4>
      <div class="space-y-3">
        ${emotionData.slice(-5).reverse().map((entry, index) => {
          const date = new Date(entry.timestamp);
          const formattedDate = date.toLocaleDateString('id-ID', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
          
          return `
            <div class="flex items-center justify-between py-2 border-b border-gray-100">
              <div class="flex items-center">
                <i class="fas ${emotionIcons[entry.emotion] || 'fa-circle'} text-${entry.emotion}-500 mr-3"></i>
                <div>
                  <p class="font-medium text-gray-800 capitalize">${entry.emotion}</p>
                  <p class="text-sm text-gray-500">${entry.description || 'Tidak ada deskripsi'}</p>
                </div>
              </div>
              <span class="text-sm text-gray-400">${formattedDate}</span>
            </div>`;
        }).join('')}
      </div>
      ${emotionData.length > 5 ? `
      <div class="mt-3 text-center">
        <button id="viewAllHistory" class="text-sm text-blue-500 hover:text-blue-700 hover:underline">
          Lihat semua riwayat (${emotionData.length})
        </button>
      </div>` : ''}
    </div>` : ''}`;
  
  // Tambahkan event listener untuk tombol lihat semua riwayat
  const viewAllBtn = document.getElementById('viewAllHistory');
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
      // Implementasi untuk menampilkan semua riwayat
      showToast('Fitur melihat semua riwayat akan segera hadir!', 'info');
    });
  }
}

// Submit form pencatatan emosi manual
form.addEventListener('submit', function(e) {
  e.preventDefault();
  const emotion = emotionSelect.value;
  const description = descriptionInput.value.trim();

  if(!emotion) {
    alert("Silakan pilih emosi terlebih dahulu.");
    return;
  }

  emotionData.push({emotion, description, timestamp: new Date()});
  form.reset();

  updateChart();
  updateRecommendations();
});

// Submit form kuesioner
questionnaireForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const q1 = parseInt(document.querySelector('input[name="q1"]:checked')?.value || 0);
  const q2 = parseInt(document.querySelector('input[name="q2"]:checked')?.value || 0);

  const totalScore = q1 + q2;

  let detectedEmotion = 'senang';
  if (totalScore >= 5) detectedEmotion = 'marah';
  else if (totalScore >= 3) detectedEmotion = 'cemas';
  else if (totalScore >= 1) detectedEmotion = 'sedih';

  emotionData.push({emotion: detectedEmotion, description: 'Dari kuesioner', timestamp: new Date()});
  questionnaireForm.reset();

  updateChart();
  updateRecommendations();

  // Berpindah ke halaman rekomendasi otomatis setelah submit kuesioner
  pages.forEach(p => p.style.display = p.id === 'recommendation' ? 'block' : 'none');
});

// Fungsi untuk memuat data dari localStorage
function loadFromLocalStorage() {
  const savedData = localStorage.getItem('emotionData');
  if (savedData) {
    emotionData.push(...JSON.parse(savedData));
    updateChart();
    updateRecommendations();
  }
}

// Fungsi untuk menyimpan data ke localStorage
function saveToLocalStorage() {
  localStorage.setItem('emotionData', JSON.stringify(emotionData));
}

// Event listener untuk form pencatatan emosi
form.addEventListener('submit', function(e) {
  e.preventDefault();
  const emotion = emotionSelect.value;
  const description = descriptionInput.value.trim();

  if(!emotion) {
    showToast('Silakan pilih emosi terlebih dahulu', 'error');
    return;
  }

  const newEntry = {
    emotion, 
    description, 
    timestamp: new Date().toISOString(),
    type: 'manual'
  };
  
  emotionData.push(newEntry);
  saveToLocalStorage();
  form.reset();

  updateChart();
  updateRecommendations();
  
  // Tampilkan notifikasi sukses
  showToast('Emosi berhasil dicatat!', 'success');
  
  // Otomatis beralih ke halaman dashboard
  showPage('dashboard');
  localStorage.setItem('activePage', 'dashboard');
});

// Event listener untuk form kuesioner
questionnaireForm.addEventListener('submit', function(e) {
  e.preventDefault();

  // Ambil semua nilai dari pertanyaan
  const scores = [];
  for (let i = 1; i <= 10; i++) {
    const score = parseInt(document.querySelector(`input[name="q${i}"]:checked`)?.value || 0);
    if (isNaN(score)) {
      showToast('Silakan jawab semua pertanyaan', 'error');
      return;
    }
    scores.push(score);
  }

  // Hitung skor untuk setiap kategori emosi
  const negativeScore = scores.slice(0, 3).reduce((a, b) => a + b, 0) + scores[7]; // cemas, marah, sedih, putus asa
  const positiveScore = scores[3] + scores[5] + scores[6] + scores[9]; // bahagia, tenang, energik, puas
  const neutralScore = scores[4] + scores[8]; // stres, iri

  // Tentukan emosi berdasarkan skor
  let detectedEmotion = 'netral';
  
  if (negativeScore >= 10) {
    detectedEmotion = 'sedih';
  } else if (positiveScore >= 12) {
    detectedEmotion = 'senang';
  } else if (neutralScore >= 8) {
    detectedEmotion = 'cemas';
  } else {
    detectedEmotion = 'netral';
  }

  const newEntry = {
    emotion: detectedEmotion, 
    description: 'Hasil kuesioner', 
    timestamp: new Date().toISOString(),
    type: 'questionnaire',
    score: totalScore
  };
  
  emotionData.push(newEntry);
  saveToLocalStorage();
  questionnaireForm.reset();

  updateChart();
  updateRecommendations();
  
  // Tampilkan notifikasi sukses
  showToast('Kuesioner berhasil disubmit!', 'success');
  
  // Otomatis beralih ke halaman rekomendasi
  showPage('recommendation');
  localStorage.setItem('activePage', 'recommendation');
});

// Fungsi untuk menampilkan notifikasi toast
function showToast(message, type = 'info') {
  // Buat elemen toast jika belum ada
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.position = 'fixed';
    toastContainer.style.top = '20px';
    toastContainer.style.right = '20px';
    toastContainer.style.zIndex = '1100';
    document.body.appendChild(toastContainer);
  }
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.style.padding = '12px 20px';
  toast.style.marginBottom = '10px';
  toast.style.borderRadius = '4px';
  toast.style.color = 'white';
  toast.style.backgroundColor = type === 'error' ? '#e53e3e' : 
                               type === 'success' ? '#38a169' : '#2b6cb0';
  toast.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
  toast.style.transform = 'translateX(120%)';
  toast.style.transition = 'transform 0.3s ease-in-out';
  toast.textContent = message;
  
  toastContainer.appendChild(toast);
  
  // Trigger reflow
  void toast.offsetWidth;
  
  // Tampilkan toast
  toast.style.transform = 'translateX(0)';
  
  // Sembunyikan toast setelah 3 detik
  setTimeout(() => {
    toast.style.transform = 'translateX(120%)';
    
    // Hapus elemen setelah animasi selesai
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// Inisialisasi aplikasi saat DOM selesai dimuat
document.addEventListener('DOMContentLoaded', function() {
  try {
    // Muat data dari localStorage
    loadFromLocalStorage();
    
    // Inisialisasi chart
    initChart();
    
    // Set halaman aktif dari localStorage atau default ke 'record'
    const activePage = localStorage.getItem('activePage') || 'record';
    showPage(activePage);
    
    // Update chart dan rekomendasi setelah DOM sepenuhnya dimuat
    setTimeout(() => {
      updateChart();
      updateRecommendations();
      
      // Tambahkan animasi pada elemen card saat dimuat
      const cards = document.querySelectorAll('.card');
      cards.forEach((card, index) => {
        if (card) {
          card.style.animationDelay = `${index * 0.1}s`;
          card.classList.add('fade-in');
        }
      });
    }, 100);
    
    // Handle perubahan ukuran layar
    window.addEventListener('resize', function() {
      if (emotionChart) {
        emotionChart.resize();
      }
    });
  } catch (error) {
    console.error('Error during app initialization:', error);
    showToast('Terjadi kesalahan saat memuat aplikasi', 'error');
  }
});

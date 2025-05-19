// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Highlight active section in navigation
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - sectionHeight / 3) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Emotion calendar functionality
const calendarGrid = document.querySelector('.calendar-grid');
const monthYear = document.querySelector('.month-year');
const prevMonth = document.querySelector('.prev-month');
const nextMonth = document.querySelector('.next-month');

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function generateCalendar() {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const days = lastDay.getDate();
    const startDay = firstDay.getDay();

    calendarGrid.innerHTML = '';
    monthYear.textContent = new Date(currentYear, currentMonth).toLocaleString('id-ID', { month: 'long', year: 'numeric' });

    // Create days of the week header
    const daysOfWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const headerRow = document.createElement('div');
    headerRow.className = 'calendar-header-row';
    daysOfWeek.forEach(day => {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day-header';
        dayCell.textContent = day;
        headerRow.appendChild(dayCell);
    });
    calendarGrid.appendChild(headerRow);

    // Create calendar days
    let dayCount = 1;
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('div');
        row.className = 'calendar-row';

        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('div');
            cell.className = 'calendar-cell';

            if (i === 0 && j < startDay) {
                cell.className += ' empty';
            } else if (dayCount > days) {
                cell.className += ' empty';
            } else {
                cell.textContent = dayCount;
                cell.dataset.date = `${currentYear}-${currentMonth + 1}-${dayCount}`;
                
                // Add click event for logging emotion
                cell.addEventListener('click', () => {
                    const emotionForm = document.querySelector('.emotion-form');
                    emotionForm.style.display = 'block';
                    emotionForm.dataset.date = cell.dataset.date;
                });
                
                dayCount++;
            }
            row.appendChild(cell);
        }
        calendarGrid.appendChild(row);
    }
}

// Initialize calendar
prevMonth.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar();
});

nextMonth.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar();
});

// Initialize charts
const emotionChart = new Chart(document.getElementById('emotionChart'), {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Emosi',
                data: [],
                borderColor: '#4CAF50',
                tension: 0.4,
                fill: false,
                pointRadius: 8,
                pointHoverRadius: 12
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: function(context) {
                        return `Emosi: ${context.dataset.data[context.dataIndex]}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    stepSize: 20
                }
            }
        }
    }
});

// Time frame toggle
const timeFrameBtns = document.querySelectorAll('.time-frame-btn');
timeFrameBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        timeFrameBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update chart data based on time frame
        const timeframe = btn.dataset.timeframe;
        updateChartData(timeframe);
    });
});

// Activity cards hover effect
const activityCards = document.querySelectorAll('.activity-card');
activityCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'scale(1.05) translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'scale(1) translateY(0)';
    });
});

// Toggle switch animation
const toggleSwitch = document.querySelector('.toggle-switch');
const reminderToggle = document.querySelector('#reminder-toggle');

reminderToggle.addEventListener('change', () => {
    const label = toggleSwitch.querySelector('label');
    label.style.transition = 'background-color 0.3s ease, transform 0.3s ease';
    
    if (reminderToggle.checked) {
        label.style.transform = 'translateX(26px)';
        label.style.backgroundColor = '#4CAF50';
    } else {
        label.style.transform = 'translateX(0)';
        label.style.backgroundColor = '#ccc';
    }
});

// Social media icons hover effect
const socialIcons = document.querySelectorAll('.social-icon');
socialIcons.forEach(icon => {
    icon.addEventListener('mouseenter', () => {
        icon.style.transform = 'scale(1.1) translateY(-3px)';
    });
    
    icon.addEventListener('mouseleave', () => {
        icon.style.transform = 'scale(1) translateY(0)';
    });
});

// Initialize everything
generateCalendar();

// Placeholder function for updating chart data
function updateChartData(timeframe) {
    // This would be replaced with actual data fetching
    const labels = Array.from({ length: 7 }, (_, i) => `Hari ${i + 1}`);
    const data = Array.from({ length: 7 }, () => Math.floor(Math.random() * 100));
    
    emotionChart.data.labels = labels;
    emotionChart.data.datasets[0].data = data;
    emotionChart.update();
}

// Backend Storage
const EMOTION_STORAGE_KEY = 'emotion_history';
const ACTIVITY_RECOMMENDATIONS = {
    'senang': [
        { name: 'Meditasi', description: 'Menenangkan pikiran dan meredakan stres' },
        { name: 'Olahraga', description: 'Meningkatkan mood dan kesehatan' }
    ],
    'cemas': [
        { name: 'Meditasi', description: 'Menenangkan pikiran dan meredakan stres' },
        { name: 'Latihan Pernapasan', description: 'Meningkatkan konsentrasi dan ketenangan' }
    ],
    'marah': [
        { name: 'Olahraga', description: 'Meningkatkan mood dan kesehatan' },
        { name: 'Membaca', description: 'Meningkatkan pengetahuan dan relaksasi' }
    ],
    'sedih': [
        { name: 'Membaca', description: 'Meningkatkan pengetahuan dan relaksasi' },
        { name: 'Meditasi', description: 'Menenangkan pikiran dan meredakan stres' }
    ]
};

// Emotion Logger Class
class EmotionLogger {
    constructor() {
        this.emotions = this.loadEmotions();
    }

    loadEmotions() {
        const savedEmotions = localStorage.getItem(EMOTION_STORAGE_KEY);
        return savedEmotions ? JSON.parse(savedEmotions) : [];
    }

    saveEmotions() {
        localStorage.setItem(EMOTION_STORAGE_KEY, JSON.stringify(this.emotions));
    }

    logEmotion(emotion, note = '') {
        const newEmotion = {
            id: Date.now(),
            type: emotion,
            note: note,
            timestamp: new Date().toISOString(),
            date: new Date().toISOString().split('T')[0]
        };
        this.emotions.push(newEmotion);
        this.saveEmotions();
        return newEmotion;
    }

    getEmotionsByDate(date) {
        return this.emotions.filter(emotion => emotion.date === date);
    }

    getEmotionTrends(timeframe = 'week') {
        const now = new Date();
        const startDate = new Date(now);
        
        if (timeframe === 'week') {
            startDate.setDate(now.getDate() - 7);
        } else if (timeframe === 'month') {
            startDate.setMonth(now.getMonth() - 1);
        }

        return this.emotions.filter(emotion => {
            const emotionDate = new Date(emotion.timestamp);
            return emotionDate >= startDate;
        });
    }

    getEmotionDistribution() {
        const distribution = {
            senang: 0,
            cemas: 0,
            marah: 0,
            sedih: 0
        };

        this.emotions.forEach(emotion => {
            distribution[emotion.type]++;
        });

        const total = this.emotions.length;
        return Object.entries(distribution).map(([type, count]) => ({
            type,
            count,
            percentage: total > 0 ? (count / total * 100) : 0
        }));
    }
}

// Notification System
class NotificationSystem {
    constructor() {
        this.reminderSettings = this.loadReminderSettings();
        this.setupNotificationPermission();
    }

    loadReminderSettings() {
        const savedSettings = localStorage.getItem(REMINDER_STORAGE_KEY);
        return savedSettings ? JSON.parse(savedSettings) : {
            enabled: false,
            time: '09:00',
            lastNotified: null
        };
    }

    saveReminderSettings() {
        localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(this.reminderSettings));
    }

    setupNotificationPermission() {
        if ('Notification' in window) {
            Notification.requestPermission();
        }
    }

    setReminder(time) {
        this.reminderSettings.enabled = true;
        this.reminderSettings.time = time;
        this.saveReminderSettings();
        
        // Schedule reminder
        this.scheduleReminder();
    }

    scheduleReminder() {
        const now = new Date();
        const [hours, minutes] = this.reminderSettings.time.split(':').map(Number);
        const reminderTime = new Date(now);
        reminderTime.setHours(hours, minutes, 0);

        if (reminderTime <= now) {
            reminderTime.setDate(now.getDate() + 1);
        }

        const timeUntilReminder = reminderTime - now;
        setTimeout(() => this.sendReminder(), timeUntilReminder);
    }

    sendReminder() {
        if (Notification.permission === 'granted' && this.reminderSettings.enabled) {
            const notification = new Notification('Pemantauan Emosi', {
                body: 'Waktunya mencatat emosi Anda hari ini!',
                icon: '/icons/reminder.png'
            });

            notification.onclick = () => {
                window.focus();
            };
        }
    }
}

// Activity Recommendation System
class ActivityRecommender {
    constructor() {
        this.recommendations = ACTIVITY_RECOMMENDATIONS;
    }

    getRecommendationsForEmotion(emotion) {
        return this.recommendations[emotion] || [];
    }

    getTipsForEmotion(emotion) {
        const distribution = emotionLogger.getEmotionDistribution();
        const emotionData = distribution.find(e => e.type === emotion);
        
        if (!emotionData) return '';

        const tips = {
            senang: "Emosi positif Anda meningkat! Pertahankan dengan rutinitas baik.",
            cemas: "Cemas lebih banyak di awal minggu. Coba beristirahat lebih banyak.",
            marah: "Marah sering muncul. Cobalah latihan relaksasi.",
            sedih: "Sedih sering terjadi. Coba aktivitas yang membangun mood."
        };

        return tips[emotion] || "Perhatikan pola emosi Anda dan lakukan aktivitas yang membantu.";
    }
}

// Initialize Backend Systems
const emotionLogger = new EmotionLogger();
const notificationSystem = new NotificationSystem();
const activityRecommender = new ActivityRecommender();

// UI Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI Elements
    const emotionForm = document.querySelector('.emotion-form');
    const emotionSelect = document.getElementById('emotion');
    const emotionText = document.getElementById('emotion-text');
    const submitBtn = document.querySelector('.submit-btn');
    const timeFrameBtns = document.querySelectorAll('.time-frame-btn');
    const activityCards = document.querySelectorAll('.activity-card');
    const reminderToggle = document.querySelector('#reminder-toggle');
    const reminderTime = document.getElementById('reminder-time');
    const reminderBell = document.querySelector('.reminder-bell');

    // Emotion Form Submission
    emotionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emotion = emotionSelect.value;
        const note = emotionText.value;
        
        // Log emotion
        const newEmotion = emotionLogger.logEmotion(emotion, note);
        
        // Update UI
        updateEmotionCalendar();
        updateEmotionChart();
        updateActivityRecommendations(emotion);
        
        // Show success message
        showSuccessMessage('Emosi berhasil dicatat!');
        
        // Reset form
        emotionText.value = '';
    });

    // Time Frame Selection
    timeFrameBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            timeFrameBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateEmotionChart();
        });
    });

    // Activity Card Clicks
    activityCards.forEach(card => {
        card.addEventListener('click', () => {
            const activity = card.querySelector('h3').textContent;
            showActivityDetails(activity);
        });
    });

    // Reminder Toggle
    reminderToggle.addEventListener('change', () => {
        const reminderSettings = notificationSystem.reminderSettings;
        reminderSettings.enabled = reminderToggle.checked;
        notificationSystem.saveReminderSettings();
        
        if (reminderToggle.checked) {
            notificationSystem.setReminder(reminderTime.value);
            reminderBell.classList.add('active');
        } else {
            reminderBell.classList.remove('active');
        }
    });

    // Reminder Time Change
    reminderTime.addEventListener('change', () => {
        notificationSystem.setReminder(reminderTime.value);
    });

    // Initialize UI
    updateEmotionCalendar();
    updateEmotionChart();
    updateActivityRecommendations();
    updateReminderSettings();
});

// UI Update Functions
function updateEmotionCalendar() {
    const calendarGrid = document.querySelector('.calendar-grid');
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Clear existing cells
    calendarGrid.innerHTML = '';

    // Create days of the week header
    const daysOfWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const headerRow = document.createElement('div');
    headerRow.className = 'calendar-header-row';
    daysOfWeek.forEach(day => {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day-header';
        dayCell.textContent = day;
        headerRow.appendChild(dayCell);
    });
    calendarGrid.appendChild(headerRow);

    // Create calendar days
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const days = lastDay.getDate();
    const startDay = firstDay.getDay();

    let dayCount = 1;
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('div');
        row.className = 'calendar-row';

        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('div');
            cell.className = 'calendar-cell';

            if (i === 0 && j < startDay) {
                cell.className += ' empty';
            } else if (dayCount > days) {
                cell.className += ' empty';
            } else {
                cell.textContent = dayCount;
                cell.dataset.date = `${currentYear}-${currentMonth + 1}-${dayCount}`;
                
                // Add emotion indicators
                const emotions = emotionLogger.getEmotionsByDate(cell.dataset.date);
                if (emotions.length > 0) {
                    const indicator = document.createElement('div');
                    indicator.className = 'emotion-indicator';
                    indicator.dataset.emotion = emotions[0].type;
                    cell.appendChild(indicator);
                }
                
                dayCount++;
            }
            row.appendChild(cell);
        }
        calendarGrid.appendChild(row);
    }
}

function updateEmotionChart() {
    const chart = document.getElementById('emotionChart').getContext('2d');
    const emotions = emotionLogger.getEmotionTrends();
    
    const labels = [];
    const data = [];

    // Group emotions by date
    const groupedEmotions = {};
    emotions.forEach(emotion => {
        const date = new Date(emotion.timestamp).toLocaleDateString('id-ID');
        if (!groupedEmotions[date]) {
            groupedEmotions[date] = {
                date,
                count: 0
            };
        }
        groupedEmotions[date].count++;
    });

    // Sort by date
    Object.values(groupedEmotions).forEach(entry => {
        labels.push(entry.date);
        data.push(entry.count);
    });

    // Update chart
    const emotionChart = new Chart(chart, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Emosi Harian',
                data: data,
                borderColor: '#4CAF50',
                tension: 0.4,
                fill: false,
                pointRadius: 8,
                pointHoverRadius: 12
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `Emosi: ${context.dataset.data[context.dataIndex]}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: Math.max(...data) + 1,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function updateActivityRecommendations(emotion = null) {
    const activityGrid = document.querySelector('.activity-grid');
    const currentEmotion = emotion || emotionSelect.value;
    const recommendations = activityRecommender.getRecommendationsForEmotion(currentEmotion);

    // Clear existing cards
    activityGrid.innerHTML = '';

    // Create new cards
    recommendations.forEach(rec => {
        const card = document.createElement('div');
        card.className = 'activity-card';
        card.innerHTML = `
            <i class="fas ${getActivityIcon(rec.name)}"></i>
            <h3>${rec.name}</h3>
            <p>${rec.description}</p>
        `;
        activityGrid.appendChild(card);
    });
}

function updateReminderSettings() {
    const settings = notificationSystem.reminderSettings;
    reminderToggle.checked = settings.enabled;
    reminderTime.value = settings.time;
    reminderBell.classList.toggle('active', settings.enabled);
}

// Helper Functions
function showSuccessMessage(message) {
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function showActivityDetails(activity) {
    const details = document.createElement('div');
    details.className = 'activity-details';
    details.innerHTML = `
        <h3>${activity}</h3>
        <p>${ACTIVITY_RECOMMENDATIONS[emotionSelect.value].find(a => a.name === activity).description}</p>
        <button class="close-details">Tutup</button>
    `;
    document.body.appendChild(details);

    const closeButton = details.querySelector('.close-details');
    closeButton.addEventListener('click', () => details.remove());
}

function getActivityIcon(activity) {
    const icons = {
        'Meditasi': 'fa-meditation',
        'Olahraga': 'fa-running',
        'Membaca': 'fa-book',
        'Latihan Pernapasan': 'fa-heartbeat'
    };
    return icons[activity] || 'fa-star';
}

// Backend Storage Constants
const RECOMMENDATIONS = {
    'senang': [
        { name: 'Meditasi', description: 'Menenangkan pikiran dan meredakan stres' },
        { name: 'Olahraga', description: 'Meningkatkan mood dan kesehatan' },
        { name: 'Membaca', description: 'Meningkatkan pengetahuan dan relaksasi' }
    ],
    'cemas': [
        { name: 'Meditasi', description: 'Menenangkan pikiran dan meredakan stres' },
        { name: 'Latihan Pernapasan', description: 'Meningkatkan konsentrasi dan ketenangan' },
        { name: 'Berbicara dengan Seseorang', description: 'Membagikan perasaan Anda' }
    ],
    'marah': [
        { name: 'Olahraga', description: 'Meningkatkan mood dan kesehatan' },
        { name: 'Perenungan', description: 'Membantu mengendalikan emosi' },
        { name: 'Mendengarkan Musik', description: 'Menenangkan pikiran' }
    ],
    'sedih': [
        { name: 'Beristirahat', description: 'Memulihkan energi' },
        { name: 'Menulis Jurnal', description: 'Mengungkapkan perasaan' },
        { name: 'Berbicara dengan Teman', description: 'Mendapatkan dukungan' }
    ]
};

// Backend Storage Functions
function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function loadFromStorage(key) {
    return JSON.parse(localStorage.getItem(key) || '[]');
}

// Emotion Logging Functions
function logEmotion(emotionType, userNote) {
    const emotion = {
        id: Date.now(),
        type: emotionType,
        note: userNote,
        timestamp: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0]
    };
    
    const emotions = loadFromStorage(EMOTION_STORAGE_KEY);
    emotions.push(emotion);
    saveToStorage(EMOTION_STORAGE_KEY, emotions);
    
    // Update UI
    updateEmotionCalendar();
    updateEmotionChart();
    updateEmotionDistribution();
    updateActivityRecommendations(emotionType);
    
    // Show success message
    showSuccessMessage('Emosi berhasil dicatat!');
}

// Emotion Analysis Functions
function generateTrends(timeframe = 'week') {
    const emotions = loadFromStorage(EMOTION_STORAGE_KEY);
    const now = new Date();
    const startDate = new Date(now);
    
    if (timeframe === 'week') {
        startDate.setDate(now.getDate() - 7);
    } else if (timeframe === 'month') {
        startDate.setMonth(now.getMonth() - 1);
    }

    return emotions.filter(emotion => {
        const emotionDate = new Date(emotion.timestamp);
        return emotionDate >= startDate;
    });
}

function getEmotionDistribution() {
    const emotions = loadFromStorage(EMOTION_STORAGE_KEY);
    const distribution = {
        senang: 0,
        cemas: 0,
        marah: 0,
        sedih: 0
    };

    emotions.forEach(emotion => {
        distribution[emotion.type]++;
    });

    const total = emotions.length;
    return Object.entries(distribution).map(([type, count]) => ({
        type,
        count,
        percentage: total > 0 ? (count / total * 100) : 0
    }));
}

// Recommendation Functions
function generateRecommendations(emotionType) {
    return RECOMMENDATIONS[emotionType] || [];
}

function getEmotionTips(emotionType) {
    const distribution = getEmotionDistribution();
    const emotionData = distribution.find(e => e.type === emotionType);
    
    if (!emotionData) return '';

    const tips = {
        senang: "Emosi positif Anda meningkat! Pertahankan dengan rutinitas baik.",
        cemas: "Cemas lebih banyak di awal minggu. Coba beristirahat lebih banyak.",
        marah: "Marah sering muncul. Cobalah latihan relaksasi.",
        sedih: "Sedih sering terjadi. Coba aktivitas yang membangun mood."
    };

    return tips[emotionType] || "Perhatikan pola emosi Anda dan lakukan aktivitas yang membantu.";
}

// Reminder Functions
class ReminderSystem {
    constructor() {
        this.settings = this.loadSettings();
        this.setupNotifications();
    }

    loadSettings() {
        return JSON.parse(localStorage.getItem(REMINDER_STORAGE_KEY) || JSON.stringify({
            enabled: false,
            time: '09:00',
            lastNotified: null
        }));
    }

    saveSettings() {
        localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(this.settings));
    }

    setupNotifications() {
        if ('Notification' in window) {
            Notification.requestPermission();
        }
    }

    setReminder(time) {
        this.settings.enabled = true;
        this.settings.time = time;
        this.saveSettings();
        this.scheduleReminder();
    }

    scheduleReminder() {
        const now = new Date();
        const [hours, minutes] = this.settings.time.split(':').map(Number);
        const reminderTime = new Date(now);
        reminderTime.setHours(hours, minutes, 0);

        if (reminderTime <= now) {
            reminderTime.setDate(now.getDate() + 1);
        }

        const timeUntilReminder = reminderTime - now;
        setTimeout(() => this.sendReminder(), timeUntilReminder);
    }

    sendReminder() {
        if (Notification.permission === 'granted' && this.settings.enabled) {
            const notification = new Notification('Pemantauan Emosi', {
                body: 'Waktunya mencatat emosi Anda hari ini!',
                icon: '/icons/reminder.png',
                tag: 'emotion_reminder'
            });

            notification.onclick = () => {
                window.focus();
            };
        }
    }
}

// Chart Functions
function initializeCharts() {
    const emotionChart = new Chart(document.getElementById('emotionChart'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Emosi Harian',
                data: [],
                borderColor: '#4CAF50',
                tension: 0.4,
                fill: false,
                pointRadius: 8,
                pointHoverRadius: 12
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `Emosi: ${context.dataset.data[context.dataIndex]}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });

    const distributionChart = new Chart(document.getElementById('emotionDistribution'), {
        type: 'doughnut',
        data: {
            labels: ['Senang', 'Cemas', 'Marah', 'Sedih'],
            datasets: [{
                data: [0, 0, 0, 0],
                backgroundColor: ['#4CAF50', '#FFC107', '#F44336', '#2196F3']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    enabled: true
                }
            }
        }
    });

    return { emotionChart, distributionChart };
}

// UI Update Functions
function updateEmotionCalendar() {
    const calendarGrid = document.querySelector('.calendar-grid');
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Clear existing cells
    calendarGrid.innerHTML = '';

    // Create days of the week header
    const daysOfWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const headerRow = document.createElement('div');
    headerRow.className = 'calendar-header-row';
    daysOfWeek.forEach(day => {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day-header';
        dayCell.textContent = day;
        headerRow.appendChild(dayCell);
    });
    calendarGrid.appendChild(headerRow);

    // Create calendar days
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const days = lastDay.getDate();
    const startDay = firstDay.getDay();

    let dayCount = 1;
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('div');
        row.className = 'calendar-row';

        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('div');
            cell.className = 'calendar-cell';

            if (i === 0 && j < startDay) {
                cell.className += ' empty';
            } else if (dayCount > days) {
                cell.className += ' empty';
            } else {
                cell.textContent = dayCount;
                cell.dataset.date = `${currentYear}-${currentMonth + 1}-${dayCount}`;
                
                // Add emotion indicators
                const emotions = loadFromStorage(EMOTION_STORAGE_KEY).filter(
                    e => e.date === cell.dataset.date
                );
                
                if (emotions.length > 0) {
                    const indicator = document.createElement('div');
                    indicator.className = 'emotion-indicator';
                    indicator.dataset.emotion = emotions[0].type;
                    cell.appendChild(indicator);
                }
                
                dayCount++;
            }
            row.appendChild(cell);
        }
        calendarGrid.appendChild(row);
    }
}

function updateEmotionChart(timeframe = 'week') {
    const chart = document.getElementById('emotionChart').getContext('2d');
    const emotions = generateTrends(timeframe);
    
    const labels = [];
    const data = [];

    // Group emotions by date
    const groupedEmotions = {};
    emotions.forEach(emotion => {
        const date = new Date(emotion.timestamp).toLocaleDateString('id-ID');
        if (!groupedEmotions[date]) {
            groupedEmotions[date] = {
                date,
                count: 0
            };
        }
        groupedEmotions[date].count++;
    });

    // Sort by date
    Object.values(groupedEmotions).forEach(entry => {
        labels.push(entry.date);
        data.push(entry.count);
    });

    // Update chart
    const emotionChart = new Chart(chart, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Emosi Harian',
                data: data,
                borderColor: '#4CAF50',
                tension: 0.4,
                fill: false,
                pointRadius: 8,
                pointHoverRadius: 12
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `Emosi: ${context.dataset.data[context.dataIndex]}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: Math.max(...data) + 1,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function updateEmotionDistribution() {
    const distribution = getEmotionDistribution();
    const chart = document.getElementById('emotionDistribution').getContext('2d');
    
    const data = distribution.map(d => d.count);
    
    const distributionChart = new Chart(chart, {
        type: 'doughnut',
        data: {
            labels: ['Senang', 'Cemas', 'Marah', 'Sedih'],
            datasets: [{
                data: data,
                backgroundColor: ['#4CAF50', '#FFC107', '#F44336', '#2196F3']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    enabled: true
                }
            }
        }
    });
}

function updateActivityRecommendations(emotionType) {
    const recommendations = generateRecommendations(emotionType);
    const activityGrid = document.querySelector('.activity-grid');
    
    // Clear existing cards
    activityGrid.innerHTML = '';
    
    // Create new cards
    recommendations.forEach(rec => {
        const card = document.createElement('div');
        card.className = 'activity-card';
        card.innerHTML = `
            <i class="fas ${getActivityIcon(rec.name)}"></i>
            <h3>${rec.name}</h3>
            <p>${rec.description}</p>
        `;
        
        // Add click event for details
        card.addEventListener('click', () => showActivityDetails(rec));
        
        activityGrid.appendChild(card);
    });
}

// Helper Functions
function showSuccessMessage(message) {
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function showActivityDetails(activity) {
    const details = document.createElement('div');
    details.className = 'activity-details';
    details.innerHTML = `
        <h3>${activity.name}</h3>
        <p>${activity.description}</p>
        <button class="close-details">Tutup</button>
    `;
    document.body.appendChild(details);

    const closeButton = details.querySelector('.close-details');
    closeButton.addEventListener('click', () => details.remove());
}

function getActivityIcon(activity) {
    const icons = {
        'Meditasi': 'fa-meditation',
        'Olahraga': 'fa-running',
        'Membaca': 'fa-book',
        'Latihan Pernapasan': 'fa-heartbeat',
        'Perenungan': 'fa-thought-bubble',
        'Berbicara dengan Seseorang': 'fa-comments',
        'Berbicara dengan Teman': 'fa-users',
        'Beristirahat': 'fa-bed',
        'Menulis Jurnal': 'fa-pen',
        'Mendengarkan Musik': 'fa-music'
    };
    return icons[activity] || 'fa-star';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI Elements
    const emotionForm = document.querySelector('.emotion-form');
    const emotionSelect = document.getElementById('emotion');
    const emotionText = document.getElementById('emotion-text');
    const submitBtn = document.querySelector('.submit-btn');
    const timeFrameBtns = document.querySelectorAll('.time-frame-btn');
    const reminderToggle = document.querySelector('#reminder-toggle');
    const reminderTime = document.getElementById('reminder-time');
    const reminderBell = document.querySelector('.reminder-bell');
    
    // Initialize Charts
    initializeCharts();
    
    // Initialize Reminder System
    const reminderSystem = new ReminderSystem();
    
    // Emotion Form Submission
    emotionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        logEmotion(emotionSelect.value, emotionText.value);
        emotionText.value = '';
    });
    
    // Time Frame Selection
    timeFrameBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const timeframe = btn.dataset.timeframe;
            timeFrameBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateEmotionChart(timeframe);
        });
    });
    
    // Reminder Toggle
    reminderToggle.addEventListener('change', () => {
        const settings = reminderSystem.settings;
        settings.enabled = reminderToggle.checked;
        reminderSystem.saveSettings();
        
        if (reminderToggle.checked) {
            reminderSystem.setReminder(reminderTime.value);
            reminderBell.classList.add('active');
        } else {
            reminderBell.classList.remove('active');
        }
    });
    
    // Reminder Time Change
    reminderTime.addEventListener('change', () => {
        reminderSystem.setReminder(reminderTime.value);
    });
    
    // Initialize UI
    updateEmotionCalendar();
    updateEmotionChart();
    updateEmotionDistribution();
    updateActivityRecommendations();
});

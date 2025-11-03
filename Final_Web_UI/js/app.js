// ==================== AURATRACK APP - MAIN LOGIC ====================

const app = {
    // ==================== STATE ====================
    state: {
        currentPage: 'landing',
        selectedMood: null,
        selectedTags: [],
        moodEntries: [],
        streakCount: 0,
        currentAnalyticsRange: 7,
        userName: 'Anonymous User',
        userEmail: 'user@example.com'
    },

    // ==================== INITIALIZATION ====================
    init() {
        this.loadData();
        this.updateDate();
        this.updateStreakDisplay();
        this.displayEntries();
        console.log('✓ AuraTrack App Initialized');
    },

    loadData() {
        const entries = localStorage.getItem('auratrack_entries');
        const streak = localStorage.getItem('auratrack_streak');
        const user = localStorage.getItem('auratrack_user');

        this.state.moodEntries = entries ? JSON.parse(entries) : [];
        this.state.streakCount = streak ? parseInt(streak) : 0;
        
        if (user) {
            const userData = JSON.parse(user);
            this.state.userName = userData.name || 'Anonymous User';
            this.state.userEmail = userData.email || 'user@example.com';
        }
    },

    saveData() {
        localStorage.setItem('auratrack_entries', JSON.stringify(this.state.moodEntries));
        localStorage.setItem('auratrack_streak', this.state.streakCount.toString());
        localStorage.setItem('auratrack_user', JSON.stringify({
            name: this.state.userName,
            email: this.state.userEmail
        }));
    },

    // ==================== NAVIGATION ====================
    startOnboarding() {
        document.getElementById('landingPage').classList.add('hidden');
        document.getElementById('onboardingScreen1').classList.remove('hidden');
    },

    nextOnboarding(screenNumber) {
        const currentScreenEl = document.querySelector('.onboarding-screen:not(.hidden)');
        if (currentScreenEl) currentScreenEl.classList.add('hidden');
        document.getElementById('onboardingScreen' + screenNumber).classList.remove('hidden');
    },

    skipOnboarding() {
        this.finishOnboarding();
    },

    finishOnboarding() {
        const currentScreenEl = document.querySelector('.onboarding-screen:not(.hidden)');
        if (currentScreenEl) currentScreenEl.classList.add('hidden');
        
        document.getElementById('landingPage').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        
        if (this.state.moodEntries.length === 0) {
            setTimeout(() => {
                this.showToast('Welcome to AuraTrack! Log your first mood entry 👆', 5000);
            }, 1000);
        }
    },

    showLogin() {
        alert('👤 Login functionality will be implemented soon!\n\nFor now, you can use the app anonymously.');
    },

    showPage(pageName) {
        // Hide all pages
        document.querySelectorAll('.page-content').forEach(page => {
            page.classList.add('hidden');
        });
        
        // Remove active from all menu items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Show selected page
        const pageElement = document.getElementById('page-' + pageName);
        if (pageElement) {
            pageElement.classList.remove('hidden');
        }
        
        // Add active to clicked menu item
        event.target.closest('.nav-item').classList.add('active');
        
        // Update content based on page
        if (pageName === 'history') {
            this.displayHistory();
        } else if (pageName === 'analytics') {
            this.updateAnalytics(this.state.currentAnalyticsRange);
        }
    },

    logout() {
        if (confirm('Are you sure you want to logout? Your local data will be cleared.')) {
            localStorage.clear();
            location.reload();
        }
    },

    // ==================== MOOD LOGGING ====================
    selectMood(mood, element) {
        // Remove previous selection
        document.querySelectorAll('.mood-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Add selection to clicked element
        element.classList.add('selected');
        this.state.selectedMood = mood;
    },

    updateIntensity(value) {
        document.getElementById('intensityValue').textContent = value;
    },

    toggleTag(element) {
        element.classList.toggle('selected');
    },

    saveMood() {
        if (!this.state.selectedMood) {
            this.showToast('Please select a mood first! 😊', 3000);
            return;
        }
        
        const intensity = document.getElementById('intensitySlider').value;
        const note = document.getElementById('moodNote').value;
        const tags = Array.from(document.querySelectorAll('.tag-chip.selected'))
            .map(tag => tag.textContent.trim());
        
        const today = new Date().toDateString();
        
        // Check if already logged today
        const alreadyLoggedToday = this.state.moodEntries.some(entry => {
            return new Date(entry.date).toDateString() === today;
        });
        
        if (!alreadyLoggedToday) {
            this.state.streakCount++;
        }
        
        const entry = {
            id: Date.now(),
            mood: this.state.selectedMood,
            intensity: parseInt(intensity),
            note: note,
            tags: tags,
            date: new Date().toISOString(),
            dateFormatted: new Date().toLocaleDateString('vi-VN')
        };
        
        this.state.moodEntries.unshift(entry);
        this.saveData();
        
        // Show success
        if (this.state.moodEntries.length === 1) {
            this.showSuccessModal('🎉 Awesome! You logged your first mood entry!');
        } else {
            this.showToast('Mood saved successfully! 🎉', 3000);
        }
        
        this.resetForm();
        this.updateStreakDisplay();
        this.displayEntries();
    },

    resetForm() {
        document.querySelectorAll('.mood-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        document.querySelectorAll('.tag-chip').forEach(tag => {
            tag.classList.remove('selected');
        });
        document.getElementById('moodNote').value = '';
        document.getElementById('intensitySlider').value = 3;
        document.getElementById('intensityValue').textContent = 3;
        this.state.selectedMood = null;
    },

    // ==================== DISPLAY FUNCTIONS ====================
    displayEntries() {
        const entriesList = document.getElementById('entriesList');
        if (!entriesList) return;
        
        if (this.state.moodEntries.length === 0) {
            entriesList.innerHTML = `
                <p style="text-align: center; color: #999; padding: 40px;">
                    No entries yet. Start by logging your first mood above! 👆
                </p>
            `;
            return;
        }
        
        const moodEmojis = {
            'amazing': '😀',
            'good': '🙂',
            'neutral': '😐',
            'sad': '🙁',
            'terrible': '😞'
        };
        
        entriesList.innerHTML = this.state.moodEntries.slice(0, 5).map((entry, index) => `
            <div class="entry-card" style="animation-delay: ${index * 0.1}s;">
                <div class="entry-header">
                    <div class="entry-emoji">${moodEmojis[entry.mood]}</div>
                    <div class="entry-info">
                        <div class="entry-date">${entry.dateFormatted} - ${entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}</div>
                        <div class="entry-tags">
                            ${entry.tags.map(tag => `<span class="entry-tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
                ${entry.note ? `<div class="entry-note">"${entry.note}"</div>` : ''}
            </div>
        `).join('');
    },

    displayHistory() {
        this.displayCalendar();
        this.filterHistory();
    },

    displayCalendar() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        
        document.getElementById('calendarMonth').textContent = `${monthNames[month]} ${year}`;
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const calendarGrid = document.getElementById('calendarGrid');
        calendarGrid.innerHTML = '';
        
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day';
            emptyDay.style.opacity = '0.3';
            calendarGrid.appendChild(emptyDay);
        }
        
        // Add days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.textContent = day;
            
            // Check if this day has entries
            const dateStr = new Date(year, month, day).toDateString();
            const entry = this.state.moodEntries.find(e => 
                new Date(e.date).toDateString() === dateStr
            );
            
            if (entry) {
                dayEl.classList.add('has-entry');
                const moodEmojis = {
                    'amazing': '😀',
                    'good': '🙂',
                    'neutral': '😐',
                    'sad': '🙁',
                    'terrible': '😞'
                };
                dayEl.textContent = moodEmojis[entry.mood];
            }
            
            calendarGrid.appendChild(dayEl);
        }
    },

    filterHistory() {
        const filterMonth = document.getElementById('filterMonth')?.value || '';
        const filterMood = document.getElementById('filterMood')?.value || '';
        
        let filtered = this.state.moodEntries;
        
        if (filterMonth === 'current') {
            const today = new Date();
            const currentMonth = today.getMonth();
            const currentYear = today.getFullYear();
            filtered = filtered.filter(entry => {
                const entryDate = new Date(entry.date);
                return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
            });
        } else if (filterMonth === 'last7') {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            filtered = filtered.filter(entry => new Date(entry.date) >= sevenDaysAgo);
        } else if (filterMonth === 'last30') {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            filtered = filtered.filter(entry => new Date(entry.date) >= thirtyDaysAgo);
        }
        
        if (filterMood) {
            filtered = filtered.filter(entry => entry.mood === filterMood);
        }
        
        const historyList = document.getElementById('historyList');
        if (filtered.length === 0) {
            historyList.innerHTML = '<div class="no-data">No entries to display. Start logging your mood! 📝</div>';
            return;
        }
        
        const moodEmojis = {
            'amazing': '😀',
            'good': '🙂',
            'neutral': '😐',
            'sad': '🙁',
            'terrible': '😞'
        };
        
        historyList.innerHTML = filtered.map((entry, index) => `
            <div class="entry-card" style="animation-delay: ${index * 0.05}s;">
                <div class="entry-header">
                    <div class="entry-emoji">${moodEmojis[entry.mood]}</div>
                    <div class="entry-info">
                        <div class="entry-date">${entry.dateFormatted}</div>
                        <div class="entry-tags">
                            ${entry.tags.map(tag => `<span class="entry-tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
                ${entry.note ? `<div class="entry-note">"${entry.note}"</div>` : ''}
            </div>
        `).join('');
    },

    updateAnalytics(days) {
        this.state.currentAnalyticsRange = days;
        
        // Update range buttons
        document.querySelectorAll('.range-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.days === days.toString()) {
                btn.classList.add('active');
            }
        });
        
        // Calculate mood distribution
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        const recentEntries = this.state.moodEntries.filter(entry => 
            new Date(entry.date) >= cutoffDate
        );
        
        const moodCounts = {
            'amazing': 0,
            'good': 0,
            'neutral': 0,
            'sad': 0,
            'terrible': 0
        };
        
        recentEntries.forEach(entry => {
            if (moodCounts.hasOwnProperty(entry.mood)) {
                moodCounts[entry.mood]++;
            }
        });
        
        const total = Object.values(moodCounts).reduce((a, b) => a + b, 0) || 1;
        
        // Update stats display
        const moodStats = document.getElementById('moodStats');
        if (moodStats) {
            const statItems = moodStats.querySelectorAll('.stat-item');
            const moods = ['amazing', 'good', 'neutral', 'sad', 'terrible'];
            
            statItems.forEach((item, index) => {
                const mood = moods[index];
                const count = moodCounts[mood];
                const percentage = Math.round((count / total) * 100);
                
                const barFill = item.querySelector('.bar-fill');
                barFill.style.width = percentage + '%';
                
                const countEl = item.querySelector('.stat-count');
                countEl.textContent = percentage + '%';
            });
        }
        
        // Generate insights
        this.generateInsights(moodCounts, recentEntries, days);
    },

    generateInsights(moodCounts, entries, days) {
        const insightsList = document.getElementById('insightsList');
        if (!insightsList) return;
        
        const insights = [];
        
        // Find most common mood
        const mostCommon = Object.keys(moodCounts).reduce((a, b) => 
            moodCounts[a] > moodCounts[b] ? a : b
        );
        
        const moodLabels = {
            'amazing': 'Amazing 😀',
            'good': 'Good 🙂',
            'neutral': 'Neutral 😐',
            'sad': 'Sad 🙁',
            'terrible': 'Terrible 😞'
        };
        
        if (moodCounts[mostCommon] > 0) {
            insights.push(`Your most common mood is "${moodLabels[mostCommon]}" (${moodCounts[mostCommon]} times)`);
        }
        
        // Find best day of week
        const dayOfWeekCounts = {};
        entries.forEach(entry => {
            const dayName = new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long' });
            dayOfWeekCounts[dayName] = (dayOfWeekCounts[dayName] || 0) + 1;
        });
        
        if (Object.keys(dayOfWeekCounts).length > 0) {
            const bestDay = Object.keys(dayOfWeekCounts).reduce((a, b) => 
                dayOfWeekCounts[a] > dayOfWeekCounts[b] ? a : b
            );
            insights.push(`You logged the most on ${bestDay}s`);
        }
        
        // Tag insights
        const allTags = {};
        entries.forEach(entry => {
            entry.tags.forEach(tag => {
                allTags[tag] = (allTags[tag] || 0) + 1;
            });
        });
        
        if (Object.keys(allTags).length > 0) {
            const topTag = Object.keys(allTags).reduce((a, b) => 
                allTags[a] > allTags[b] ? a : b
            );
            insights.push(`"${topTag}" appears in ${allTags[topTag]} of your entries`);
        }
        
        // Consistency insight
        if (entries.length > 0) {
            const avgEntries = (entries.length / days).toFixed(1);
            insights.push(`You logged ${avgEntries} entries per day on average`);
        }
        
        if (insights.length === 0) {
            insightsList.innerHTML = '<div class="insight-item">Start logging more entries to see insights! 📊</div>';
            return;
        }
        
        insightsList.innerHTML = insights.map((insight, index) => `
            <div class="insight-item" style="animation-delay: ${index * 0.1}s;">
                • ${insight}
            </div>
        `).join('');
    },

    // ==================== SETTINGS ====================
    saveSettings() {
        this.state.userName = document.getElementById('userName')?.value || 'Anonymous User';
        this.state.userEmail = document.getElementById('userEmail')?.value || 'user@example.com';
        
        const darkMode = document.getElementById('darkMode')?.checked || false;
        const reducedAnimations = document.getElementById('reducedAnimations')?.checked || false;
        
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        localStorage.setItem('auratrack_darkMode', darkMode.toString());
        localStorage.setItem('auratrack_reducedAnimations', reducedAnimations.toString());
        
        this.saveData();
        this.showToast('Settings saved successfully! 💾', 3000);
    },

    exportData(format) {
        if (this.state.moodEntries.length === 0) {
            this.showToast('No data to export! 📭', 3000);
            return;
        }
        
        let content;
        let filename;
        
        if (format === 'json') {
            content = JSON.stringify(this.state.moodEntries, null, 2);
            filename = `auratrack_backup_${new Date().toISOString().split('T')[0]}.json`;
        } else {
            // CSV format
            const headers = ['Date', 'Mood', 'Intensity', 'Note', 'Tags'];
            const rows = this.state.moodEntries.map(entry => [
                entry.dateFormatted,
                entry.mood,
                entry.intensity,
                `"${entry.note}"`,
                entry.tags.join('; ')
            ]);
            
            content = [headers, ...rows]
                .map(row => row.join(','))
                .join('\n');
            
            filename = `auratrack_backup_${new Date().toISOString().split('T')[0]}.csv`;
        }
        
        const element = document.createElement('a');
        element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`);
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        
        element.click();
        document.body.removeChild(element);
        
        this.showToast(`Data exported as ${format.toUpperCase()}! 📥`, 3000);
    },

    clearAllData() {
        if (confirm('⚠️ WARNING: This will delete ALL your data. Are you sure?')) {
            if (confirm('This action cannot be undone. Really delete everything?')) {
                localStorage.clear();
                this.showToast('All data cleared! 🗑️', 2000);
                setTimeout(() => location.reload(), 2000);
            }
        }
    },

    // ==================== UI FEEDBACK ====================
    showToast(message, duration = 3000) {
        const toast = document.getElementById('toast');
        const messageEl = toast.querySelector('.toast-message');
        messageEl.textContent = message;
        
        toast.classList.remove('hidden');
        toast.classList.add('success');
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, duration);
    },

    showSuccessModal(message) {
        const modal = document.getElementById('successModal');
        const messageEl = document.getElementById('modalMessage');
        messageEl.textContent = message;
        modal.classList.remove('hidden');
    },

    closeModal() {
        const modal = document.getElementById('successModal');
        modal.classList.add('hidden');
    },

    // ==================== UTILITIES ====================
    updateDate() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date().toLocaleDateString('vi-VN', options);
        const dateEl = document.getElementById('currentDate');
        if (dateEl) dateEl.textContent = date;
    },

    updateStreakDisplay() {
        const streakEl = document.getElementById('streakCount');
        if (streakEl) streakEl.textContent = this.state.streakCount;
    }
};

// ==================== START APP ====================
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
class PomodoroTimer {
    constructor() {
        this.workDuration = { minutes: 25, seconds: 0 };
        this.breakDuration = { minutes: 5, seconds: 0 };
        this.minutes = this.workDuration.minutes;
        this.seconds = this.workDuration.seconds;
        this.isRunning = false;
        this.isWorkMode = true;
        this.cycles = 0;
        this.progress = 0;
        this.intervalId = null;
        this.workTitle = '';

        // DOM elements
        this.minutesDisplay = document.querySelector('.minutes');
        this.secondsDisplay = document.querySelector('.seconds');
        this.statusDisplay = document.querySelector('.status');
        this.playPauseButton = document.querySelector('.play-pause');
        this.playIcon = document.querySelector('.play-icon');
        this.resetButton = document.querySelector('.reset');
        this.settingsButton = document.querySelector('.settings-button');
        this.closeModalButton = document.querySelector('.close-modal');
        this.modal = document.querySelector('.modal');
        this.modalOverlay = document.querySelector('.modal-overlay');
        this.settingsForm = document.querySelector('.settings-form');
        this.progressRing = document.querySelector('.progress-ring__circle');
        this.workTitleInput = document.getElementById('work-title');

        // Initialize progress ring
        const circumference = 2 * Math.PI * 52;
        this.progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
        this.progressRing.style.strokeDashoffset = circumference;

        // Bind event listeners
        this.playPauseButton.addEventListener('click', () => this.toggleTimer());
        this.resetButton.addEventListener('click', () => this.reset());
        this.settingsButton.addEventListener('click', () => this.openModal());
        this.closeModalButton.addEventListener('click', () => this.closeModal());
        this.modalOverlay.addEventListener('click', () => this.closeModal());
        this.settingsForm.addEventListener('submit', (e) => this.saveSettings(e));

        this.updateDisplay();
    }

    toggleTimer() {
        if (this.isRunning) {
            this.stop();
        } else {
            this.start();
        }
    }

    start() {
        this.isRunning = true;
        this.playIcon.textContent = '⏸';
        this.intervalId = setInterval(() => this.updateTimer(), 1000);
    }

    stop() {
        this.isRunning = false;
        this.playIcon.textContent = '▶';
        clearInterval(this.intervalId);
    }

    reset() {
        this.stop();
        this.isWorkMode = true;
        this.cycles = 0;
        this.minutes = this.workDuration.minutes;
        this.seconds = this.workDuration.seconds;
        this.updateDisplay();
        this.updateProgress();
    }

    updateTimer() {
        if (this.seconds === 0) {
            if (this.minutes === 0) {
                this.switchMode();
                return;
            }
            this.minutes--;
            this.seconds = 59;
        } else {
            this.seconds--;
        }

        this.updateProgress();
        this.updateDisplay();
    }

    switchMode() {
        this.isWorkMode = !this.isWorkMode;
        if (this.isWorkMode) {
            this.cycles++;
            this.minutes = this.workDuration.minutes;
            this.seconds = this.workDuration.seconds;
        } else {
            this.minutes = this.breakDuration.minutes;
            this.seconds = this.breakDuration.seconds;
        }
        this.updateDisplay();
    }

    updateProgress() {
        const totalSeconds = (this.isWorkMode ? 
            (this.workDuration.minutes * 60 + this.workDuration.seconds) : 
            (this.breakDuration.minutes * 60 + this.breakDuration.seconds));
        const currentSeconds = this.minutes * 60 + this.seconds;
        const progress = 1 - (currentSeconds / totalSeconds);
        
        const circumference = 2 * Math.PI * 52;
        const offset = circumference * (1 - progress);
        this.progressRing.style.strokeDashoffset = offset;
    }

    updateDisplay() {
        this.minutesDisplay.textContent = String(this.minutes).padStart(2, '0');
        this.secondsDisplay.textContent = String(this.seconds).padStart(2, '0');
        const statusText = this.isWorkMode ? 
            (this.workTitle || 'Work') : 
            'Break';
        this.statusDisplay.textContent = `${statusText} (×${this.cycles})`;
    }

    openModal() {
        this.modal.hidden = false;
        this.modalOverlay.hidden = false;
        this.workTitleInput.value = this.workTitle;
        document.getElementById('work-minutes').value = this.workDuration.minutes;
        document.getElementById('work-seconds').value = this.workDuration.seconds;
        document.getElementById('break-minutes').value = this.breakDuration.minutes;
        document.getElementById('break-seconds').value = this.breakDuration.seconds;
    }

    closeModal() {
        this.modal.hidden = true;
        this.modalOverlay.hidden = true;
    }

    saveSettings(e) {
        e.preventDefault();
        this.workTitle = this.workTitleInput.value.trim();
        const newWorkMinutes = parseInt(document.getElementById('work-minutes').value) || 0;
        const newWorkSeconds = parseInt(document.getElementById('work-seconds').value) || 0;
        const newBreakMinutes = parseInt(document.getElementById('break-minutes').value) || 0;
        const newBreakSeconds = parseInt(document.getElementById('break-seconds').value) || 0;

        // Validate inputs
        if (newWorkMinutes === 0 && newWorkSeconds === 0) return;
        if (newBreakMinutes === 0 && newBreakSeconds === 0) return;

        this.workDuration = {
            minutes: newWorkMinutes,
            seconds: newWorkSeconds
        };
        this.breakDuration = {
            minutes: newBreakMinutes,
            seconds: newBreakSeconds
        };

        this.reset();
        this.closeModal();
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
}); 
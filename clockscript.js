// clockscript.js
let stopwatchInterval, countdownInterval;
let stopwatchTime = 0;
let alarms = [];
let currentAlarmSound = null;

function updateTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    document.getElementById('hours').textContent = 
        String(hours % 12 || 12).padStart(2, '0');
    document.getElementById('minutes').textContent = 
        String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = 
        String(seconds).padStart(2, '0');
    document.getElementById('ampm').textContent = ampm;
    
    document.getElementById('date').textContent = 
        now.toLocaleDateString(undefined, {
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        });

    checkAlarms(hours, minutes, seconds, ampm);
}

// Theme Switching
function changeTheme(theme) {
    document.body.className = `theme-${theme}`;
    localStorage.setItem('selected-theme', theme);
    
    // Add animation effect
    document.querySelector('.clock-housing').style.animation = 'themeChange 0.5s ease';
    setTimeout(() => {
        document.querySelector('.clock-housing').style.animation = '';
    }, 500);
}

// Event Listeners for Theme Buttons
document.querySelectorAll('.theme-button').forEach(button => {
    button.addEventListener('click', () => {
        const theme = button.getAttribute('data-theme');
        changeTheme(theme);
    });
});

// Load Saved Theme
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('selected-theme') || 'vintage';
    changeTheme(savedTheme);
    
    // Set initial time
    updateTime();
    setInterval(updateTime, 1000);
    
    // Add keyboard event for alarm input
    document.getElementById('alarmTime').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            setAlarm();
        }
    });
});

function setAlarm() {
    const alarmInput = document.getElementById('alarmTime');
    if (!alarmInput.value) return;
    
    const [alarmHours, alarmMinutes] = alarmInput.value.split(':');
    const ampm = parseInt(alarmHours) >= 12 ? 'PM' : 'AM';
    
    alarms.push({
        hours: String(parseInt(alarmHours) % 12 || 12).padStart(2, '0'),
        minutes: alarmMinutes.padStart(2, '0'),
        ampm: ampm
    });

    updateActiveAlarmsList();
    alarmInput.value = '';
    
    // Add visual feedback
    const feedback = document.createElement('div');
    feedback.textContent = 'Alarm Set!';
    feedback.className = 'alarm-feedback';
    document.querySelector('.alarm-section').appendChild(feedback);
    setTimeout(() => feedback.remove(), 2000);
}

function checkAlarms(currentHours, currentMinutes, currentSeconds, currentAMPM) {
    alarms.forEach((alarm, index) => {
        if (
            String(currentHours % 12 || 12).padStart(2, '0') === alarm.hours &&
            String(currentMinutes).padStart(2, '0') === alarm.minutes &&
            currentAMPM === alarm.ampm &&
            currentSeconds === 0
        ) {
            triggerAlarm(index);
        }
    });
}

function triggerAlarm(index) {
    const alarmSound = document.getElementById('alarmSound');
    alarmSound.currentTime = 0;
    alarmSound.play();
    
    const modal = document.getElementById('alarmModal');
    modal.style.display = 'flex';
    
    // Add shaking animation to the clock
    document.querySelector('.clock-housing').style.animation = 'shake 0.5s ease infinite';
    
    // Store the current alarm for snooze functionality
    currentAlarmSound = alarms[index];
    
    // Remove the triggered alarm
    alarms.splice(index, 1);
    updateActiveAlarmsList();
}

function updateActiveAlarmsList() {
    const activeAlarmsEl = document.getElementById('activeAlarms');
    activeAlarmsEl.innerHTML = alarms.map(
        (alarm, index) => `
            <div>
                ${alarm.hours}:${alarm.minutes} ${alarm.ampm}
                <button onclick="removeAlarm(${index})">✕</button>
            </div>
        `
    ).join('');
}

function removeAlarm(index) {
    alarms.splice(index, 1);
    updateActiveAlarmsList();
    
    // Add visual feedback
    const feedback = document.createElement('div');
    feedback.textContent = 'Alarm Removed';
    feedback.className = 'alarm-feedback removed';
    document.querySelector('.alarm-section').appendChild(feedback);
    setTimeout(() => feedback.remove(), 2000);
}

// Stopwatch Functions
function startStopwatch() {
    if (!stopwatchInterval) {
        stopwatchInterval = setInterval(() => {
            stopwatchTime++;
            updateStopwatchDisplay();
        }, 1000);
    }
}

function pauseStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
}

function resetStopwatch() {
    pauseStopwatch();
    stopwatchTime = 0;
    updateStopwatchDisplay();
}

function updateStopwatchDisplay() {
    const hours = Math.floor(stopwatchTime / 3600);
    const minutes = Math.floor((stopwatchTime % 3600) / 60);
    const seconds = stopwatchTime % 60;
    
    document.getElementById('stopwatchDisplay').textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Countdown Functions
function startCountdown() {
    const minutesInput = parseInt(document.getElementById('countdownMinutes').value) || 0;
    const secondsInput = parseInt(document.getElementById('countdownSeconds').value) || 0;
    let totalSeconds = minutesInput * 60 + secondsInput;
    
    if (totalSeconds <= 0) return;
    
    // Reset progress bar
    document.querySelector('.progress-fill').style.width = '100%';
    
    if (countdownInterval) clearInterval(countdownInterval);
    
    updateCountdownDisplay(totalSeconds);
    
    countdownInterval = setInterval(() => {
        totalSeconds--;
        updateCountdownDisplay(totalSeconds);
        
        // Update progress bar
        const totalTime = minutesInput * 60 + secondsInput;
        const percentage = (totalSeconds / totalTime) * 100;
        document.querySelector('.progress-fill').style.width = `${percentage}%`;
        
        if (totalSeconds <= 0) {
            clearInterval(countdownInterval);
            document.getElementById('countdownDisplay').textContent = "Time's up!";
            document.querySelector('.progress-fill').style.width = '0%';
            
            // Play alarm sound
            const alarmSound = document.getElementById('alarmSound');
            alarmSound.currentTime = 0;
            alarmSound.play();
            
            // Show modal
            document.getElementById('alarmModalText').textContent = "Countdown completed!";
            document.getElementById('alarmModal').style.display = 'flex';
        }
    }, 1000);
}

function updateCountdownDisplay(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    document.getElementById('countdownDisplay').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Modal Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('alarmModal');
    const closeBtn = document.querySelector('.close-btn');
    const snoozeBtn = document.getElementById('snoozeBtn');
    const dismissBtn = document.getElementById('dismissBtn');

    closeBtn.onclick = () => {
        modal.style.display = 'none';
        document.querySelector('.clock-housing').style.animation = '';
        document.getElementById('alarmSound').pause();
    }

    snoozeBtn.onclick = () => {
        if (currentAlarmSound) {
            // Snooze for 5 minutes
            const now = new Date();
            now.setMinutes(now.getMinutes() + 5);
            
            alarms.push({
                hours: String(now.getHours() % 12 || 12).padStart(2, '0'),
                minutes: String(now.getMinutes()).padStart(2, '0'),
                ampm: now.getHours() >= 12 ? 'PM' : 'AM'
            });

            updateActiveAlarmsList();
        }
        modal.style.display = 'none';
        document.querySelector('.clock-housing').style.animation = '';
        document.getElementById('alarmSound').pause();
    }

    dismissBtn.onclick = () => {
        modal.style.display = 'none';
        document.querySelector('.clock-housing').style.animation = '';
        document.getElementById('alarmSound').pause();
    }
});

// Initialize time and set intervals
updateTime();
setInterval(updateTime, 1000);

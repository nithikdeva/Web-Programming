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
}

// Event Listeners for Theme Buttons
document.querySelectorAll('.theme-switcher button').forEach(button => {
    button.addEventListener('click', () => {
        const theme = button.getAttribute('data-theme');
        changeTheme(theme);
    });
});

// Load Saved Theme
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('selected-theme') || 'light';
    changeTheme(savedTheme);
});

function setAlarm() {
    const alarmInput = document.getElementById('alarmTime');
    const [alarmHours, alarmMinutes] = alarmInput.value.split(':');
    const ampm = parseInt(alarmHours) >= 12 ? 'PM' : 'AM';
    
    alarms.push({
        hours: alarmHours,
        minutes: alarmMinutes,
        ampm: ampm
    });

    updateActiveAlarmsList();
    alarmInput.value = '';
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
    alarmSound.play();
    
    const modal = document.getElementById('alarmModal');
    modal.style.display = 'flex';
    
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
                <button onclick="removeAlarm(${index})">❌</button>
            </div>
        `
    ).join('');
}

function removeAlarm(index) {
    alarms.splice(index, 1);
    updateActiveAlarmsList();
}

// Modal Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('alarmModal');
    const closeBtn = document.querySelector('.close-btn');
    const snoozeBtn = document.getElementById('snoozeBtn');
    const dismissBtn = document.getElementById('dismissBtn');

    closeBtn.onclick = () => {
        modal.style.display = 'none';
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
    }

    dismissBtn.onclick = () => {
        modal.style.display = 'none';
    }
});

// Rest of the existing functions (startStopwatch, pauseStopwatch, etc.) remain the same

// Initialize time and set intervals
updateTime();
setInterval(updateTime, 1000);
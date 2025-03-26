// Clock functionality
function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Digital display
    document.getElementById('hours').textContent = String(hours % 12 || 12).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    document.getElementById('ampm').textContent = ampm;
    
    document.getElementById('date').textContent = now.toLocaleDateString(undefined, {
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    });

    // Analog clock
    const hourDegrees = (hours % 12) * 30 + minutes * 0.5;
    const minuteDegrees = minutes * 6;
    const secondDegrees = seconds * 6;
    
    document.getElementById('hourHand').style.transform = `rotateZ(${hourDegrees}deg)`;
    document.getElementById('minuteHand').style.transform = `rotateZ(${minuteDegrees}deg)`;
    document.getElementById('secondHand').style.transform = `rotateZ(${secondDegrees}deg)`;
    
    checkAlarms(hours, minutes, ampm);
}

// Create clock markers
function createMarkers() {
    const markersContainer = document.getElementById('clockMarkers');
    for (let i = 0; i < 60; i++) {
        const marker = document.createElement('div');
        marker.className = 'marker' + (i % 5 === 0 ? ' hour' : '');
        marker.style.transform = `rotateZ(${i * 6}deg)`;
        markersContainer.appendChild(marker);
    }
}

// Stopwatch functionality
let stopwatchInterval;
let stopwatchTime = 0;
let stopwatchRunning = false;

function updateStopwatch() {
    stopwatchTime++;
    const hours = Math.floor(stopwatchTime / 3600);
    const minutes = Math.floor((stopwatchTime % 3600) / 60);
    const seconds = stopwatchTime % 60;
    
    document.getElementById('stopwatchDisplay').textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

document.getElementById('startStopwatch').addEventListener('click', function() {
    if (stopwatchRunning) {
        clearInterval(stopwatchInterval);
        this.textContent = 'Start';
    } else {
        stopwatchInterval = setInterval(updateStopwatch, 1000);
        this.textContent = 'Stop';
    }
    stopwatchRunning = !stopwatchRunning;
});

document.getElementById('resetStopwatch').addEventListener('click', function() {
    clearInterval(stopwatchInterval);
    stopwatchTime = 0;
    stopwatchRunning = false;
    document.getElementById('stopwatchDisplay').textContent = '00:00:00';
    document.getElementById('startStopwatch').textContent = 'Start';
});

// Alarm functionality
let alarms = [];

function setAlarm() {
    const alarmInput = document.getElementById('alarmTime');
    if (!alarmInput.value) return;
    
    const [alarmHours, alarmMinutes] = alarmInput.value.split(':');
    const ampm = parseInt(alarmHours) >= 12 ? 'PM' : 'AM';
    
    const alarm = {
        time: alarmInput.value,
        displayTime: `${String(parseInt(alarmHours) % 12 || 12).padStart(2, '0')}:${alarmMinutes} ${ampm}`
    };

    alarms.push(alarm);
    updateAlarmList();
    alarmInput.value = '';
}

function checkAlarms(currentHours, currentMinutes, currentAMPM) {
    const currentTime = `${String(currentHours).padStart(2, '0')}:${String(currentMinutes).padStart(2, '0')}`;
    
    alarms.forEach((alarm, index) => {
        if (alarm.time === currentTime) {
            triggerAlarm(index);
        }
    });
}

function triggerAlarm(index) {
    const alarmSound = document.getElementById('alarmSound');
    alarmSound.currentTime = 0;
    alarmSound.play();
    
    // In a real implementation, you'd show a modal or notification
    alert(`Alarm: ${alarms[index].displayTime}`);
    alarms.splice(index, 1);
    updateAlarmList();
}

function updateAlarmList() {
    const alarmList = document.getElementById('alarmList');
    alarmList.innerHTML = alarms.map((alarm, index) => `
        <div class="alarm-item">
            <span>${alarm.displayTime}</span>
            <button class="delete-alarm" data-index="${index}">×</button>
        </div>
    `).join('');

    document.querySelectorAll('.delete-alarm').forEach(button => {
        button.addEventListener('click', function() {
            alarms.splice(parseInt(this.dataset.index), 1);
            updateAlarmList();
        });
    });
}

// Theme switching
document.querySelectorAll('.theme-btn').forEach(button => {
    button.addEventListener('click', function() {
        const theme = this.dataset.theme;
        document.body.className = `theme-${theme}`;
        
        // Update active button
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn === this);
        });
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    createMarkers();
    updateClock();
    setInterval(updateClock, 1000);
    
    // Set dark theme as active by default
    document.querySelector('.theme-btn[data-theme="dark"]').classList.add('active');
    
    // Event listeners
    document.getElementById('setAlarm').addEventListener('click', setAlarm);
    document.getElementById('alarmTime').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') setAlarm();
    });
});
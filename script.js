const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date');
const zoneElement = document.getElementById('zone');

const toggleRunButton = document.getElementById('toggle-run');
const toggleFormatButton = document.getElementById('toggle-format');
const toggleZoneButton = document.getElementById('toggle-zone');

let isRunning = true;
let use24Hour = false;
let showUtc = false;

function getCurrentTime() {
  return new Date();
}

function formatTime(now) {
  return now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: !use24Hour,
    timeZone: showUtc ? 'UTC' : undefined
  });
}

function formatDate(now) {
  return now.toLocaleDateString([], {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: showUtc ? 'UTC' : undefined
  });
}

function updateZoneLabel() {
  zoneElement.textContent = showUtc ? 'UTC time' : 'Local time';
}

function updateClock() {
  if (!isRunning) {
    return;
  }

  const now = getCurrentTime();
  timeElement.textContent = formatTime(now);
  dateElement.textContent = formatDate(now);
  updateZoneLabel();
}

function toggleRunning() {
  isRunning = !isRunning;
  toggleRunButton.textContent = isRunning ? 'Pause' : 'Resume';

  if (isRunning) {
    updateClock();
  }
}

function toggleFormat() {
  use24Hour = !use24Hour;
  toggleFormatButton.textContent = use24Hour ? 'Use 12-hour' : 'Use 24-hour';
  updateClock();
}

function toggleZone() {
  showUtc = !showUtc;
  toggleZoneButton.textContent = showUtc ? 'Show Local' : 'Show UTC';
  updateClock();
}

toggleRunButton.addEventListener('click', toggleRunning);
toggleFormatButton.addEventListener('click', toggleFormat);
toggleZoneButton.addEventListener('click', toggleZone);

updateClock();
setInterval(updateClock, 1000);

const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date');

function updateClock() {
  const now = new Date();

  timeElement.textContent = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  dateElement.textContent = now.toLocaleDateString([], {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

updateClock();
setInterval(updateClock, 1000);

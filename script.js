
const calendar = document.getElementById('calendar');
const notesField = document.getElementById('notes');
let selectedDay = null;

function generateCalendar() {
  for (let i = 1; i <= 30; i++) {
    const day = document.createElement('div');
    day.className = 'day';
    day.textContent = i;
    day.addEventListener('click', () => selectDay(i, day));
    calendar.appendChild(day);
  }
}

function selectDay(dayNumber, element) {
  if (selectedDay) selectedDay.classList.remove('selected');
  element.classList.add('selected');
  selectedDay = element;
  notesField.value = localStorage.getItem('note-' + dayNumber) || '';
}

function saveNote() {
  if (!selectedDay) {
    alert('Selecciona un día del calendario');
    return;
  }
  const dayNumber = selectedDay.textContent;
  localStorage.setItem('note-' + dayNumber, notesField.value);
  alert('Pendiente guardado para el día ' + dayNumber);
}

generateCalendar();

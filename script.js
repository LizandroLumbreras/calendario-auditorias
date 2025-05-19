
const calendar = document.getElementById('calendar');
const notesField = document.getElementById('notes');
const monthTitle = document.getElementById('month-title');

let selectedDay = null;
let currentDate = new Date();

const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

function updateCalendar() {
  calendar.innerHTML = "";
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  monthTitle.textContent = `Calendario de Pendientes - ${monthNames[month]} ${year}`;

  for (let i = 1; i <= daysInMonth; i++) {
    const day = document.createElement('div');
    day.className = 'day';
    day.textContent = i;
    day.addEventListener('click', () => selectDay(i, day));
    calendar.appendChild(day);
  }
}

function changeMonth(delta) {
  currentDate.setMonth(currentDate.getMonth() + delta);
  updateCalendar();
  notesField.value = "";
  selectedDay = null;
}

function getDocumentId(day) {
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const dayStr = String(day).padStart(2, '0');
  return `nota-${currentDate.getFullYear()}-${month}-${dayStr}`;
}

function selectDay(dayNumber, element) {
  if (selectedDay) selectedDay.classList.remove('selected');
  element.classList.add('selected');
  selectedDay = element;

  const docId = getDocumentId(dayNumber);

  db.collection("pendientes").doc(docId).get()
    .then((doc) => {
      if (doc.exists) {
        notesField.value = doc.data().nota;
      } else {
        notesField.value = "";
      }
    }).catch((error) => {
      console.error("Error al obtener datos: ", error);
    });
}

function saveNote() {
  if (!selectedDay) {
    alert('Selecciona un día del calendario');
    return;
  }
  const dayNumber = selectedDay.textContent;
  const noteText = notesField.value;
  const docId = getDocumentId(dayNumber);

  db.collection("pendientes").doc(docId).set({
    dia: dayNumber,
    mes: currentDate.getMonth() + 1,
    anio: currentDate.getFullYear(),
    nota: noteText,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    alert("Pendiente guardado en Firebase para el día " + dayNumber);
  }).catch((error) => {
    console.error("Error al guardar en Firebase: ", error);
  });
}

document.addEventListener("DOMContentLoaded", updateCalendar);

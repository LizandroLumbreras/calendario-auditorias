
const calendar = document.getElementById('calendar');
const notesField = document.getElementById('notes');
let selectedDay = null;

function generateCalendar() {
  for (let i = 1; i <= daysInMonth; i++) {
    const day = document.createElement('div');
    day.className = 'day';
    day.textContent = i;
    day.addEventListener('click', () => selectDay(i, day));
    calendar.appendChild(day);
  }
}

function getDocumentId(day) {
  return `nota-${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
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
    mes: currentMonth,
    anio: currentYear,
    nota: noteText,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    alert("Pendiente guardado en Firebase para el día " + dayNumber);
  }).catch((error) => {
    console.error("Error al guardar en Firebase: ", error);
  });
}

generateCalendar();

// Инициализация карты
const map = L.map('map').setView([55.75, 37.6], 13); // Начальные координаты (Москва)

// Подключение тайлов OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let selectedMarker = null;

// Обработка клика на карте
map.on('click', function(e) {
  const { lat, lng } = e.latlng;

  // Удаляем предыдущий маркер
  if (selectedMarker) {
    map.removeLayer(selectedMarker);
  }

  // Добавляем новый маркер
  selectedMarker = L.marker([lat, lng]).addTo(map);
  selectedMarker.bindPopup("Целевая точка").openPopup();
});

// Обработка нажатия кнопки "Отправить лодку"
document.getElementById('sendBtn').addEventListener('click', () => {
  if (!selectedMarker) {
    alert("Выберите точку на карте");
    return;
  }

  const coords = selectedMarker.getLatLng();

  // Отправляем данные на сервер
  fetch('http://localhost:5000/api/data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      lat: coords.lat,
      lon: coords.lng,
      timestamp: new Date().toISOString()
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log("Успех:", data);
    alert("Лодка отправлена!");
  })
  .catch((error) => {
    console.error('Ошибка:', error);
    alert("Не удалось отправить данные.");
  });
});
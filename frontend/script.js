const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');

// Область, которую отображает карта (виртуальные GPS-координаты)
const mapBounds = {
  minLat: 55.7,
  maxLat: 55.8,
  minLon: 37.5,
  maxLon: 37.7
};

let selectedPoint = null;

// Настройки камеры
let offsetX = 0;
let offsetY = 0;
let scale = 1;
let isDragging = false;
let dragStart = { x: 0, y: 0 };

// Перевод GPS в пиксели с учетом масштаба и смещения
function gpsToPixel(lat, lon) {
  const x = canvas.width * ((lon - mapBounds.minLon) / (mapBounds.maxLon - mapBounds.minLon));
  const y = canvas.height * (1 - (lat - mapBounds.minLat) / (mapBounds.maxLat - mapBounds.minLat));
  return {
    x: (x - offsetX) * scale,
    y: (y - offsetY) * scale
  };
}

// Перевод пикселей в GPS
function pixelToGps(x, y) {
  const lon = mapBounds.minLon + ((x / scale + offsetX) / canvas.width) * (mapBounds.maxLon - mapBounds.minLon);
  const lat = mapBounds.minLat + (1 - ((y / scale + offsetY) / canvas.height)) * (mapBounds.maxLat - mapBounds.minLat);
  return { lat, lon };
}

// Отрисовка карты
function drawMap() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Фон
  ctx.fillStyle = "#e0f7ff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Сетка
  ctx.strokeStyle = "#ddd";
  for (let i = 0; i < canvas.width; i += 50) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();
  }
  for (let i = 0; i < canvas.height; i += 50) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
  }

  // Маркер
  if (selectedPoint) {
    ctx.beginPath();
    ctx.arc(selectedPoint.x, selectedPoint.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.stroke();
  }
}

// Обработчики событий

canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const zoomFactor = 1.1;
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;

  if (e.deltaY < 0) {
    // Увеличение
    offsetX = mouseX - (mouseX - offsetX) * zoomFactor;
    offsetY = mouseY - (mouseY - offsetY) * zoomFactor;
    scale *= zoomFactor;
  } else {
    // Уменьшение
    offsetX = mouseX - (mouseX - offsetX) / zoomFactor;
    offsetY = mouseY - (mouseY - offsetY) / zoomFactor;
    scale /= zoomFactor;
  }

  drawMap();
});

canvas.addEventListener('mousedown', (e) => {
  isDragging = true;
  dragStart.x = e.clientX;
  dragStart.y = e.clientY;
});

canvas.addEventListener('mousemove', (e) => {
  if (isDragging) {
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    offsetX += dx / scale;
    offsetY += dy / scale;
    dragStart.x = e.clientX;
    dragStart.y = e.clientY;
    drawMap();
  }
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
});

canvas.addEventListener('mouseleave', () => {
  isDragging = false;
});

// Выбор точки
canvas.addEventListener('click', (e) => {
  const x = e.offsetX;
  const y = e.offsetY;

  const gps = pixelToGps(x, y);
  const { x: px, y: py } = gpsToPixel(gps.lat, gps.lon);

  selectedPoint = { x: px, y: py, lat: gps.lat, lon: gps.lon };
  drawMap();

  console.log("Выбранная точка:", gps);
});

// Отправка координат
document.getElementById('sendBtn').addEventListener('click', () => {
  if (!selectedPoint) {
    alert("Выберите точку на карте");
    return;
  }

  const data = {
    lat: selectedPoint.lat,
    lon: selectedPoint.lon,
    timestamp: new Date().toISOString()
  };

  console.log("Отправка координат:", data);

  // Здесь можно отправить через BLE или POST-запрос
  fetch('http://localhost:5000/api/data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
    alert("Лодка отправлена!");
    console.log("Успех:", result);
  })
  .catch(error => {
    alert("Ошибка отправки.");
    console.error("Ошибка:", error);
  });
});

// Первоначальная отрисовкаs
drawMap();
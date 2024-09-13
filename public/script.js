const ws = new WebSocket('ws://localhost:3000');
const messageList = document.getElementById('message-list');
const sendButton = document.getElementById('send');
const messageInput = document.getElementById('message');
const themeToggle = document.getElementById('theme-toggle');
const statusBar = document.getElementById('status-bar');
const notificationSound = document.getElementById('notification-sound'); // Referencia al sonido

// Toggle de modo oscuro/claro
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');  // Alterna entre 'dark-mode' y 'light-mode'
});

ws.onopen = () => {
  document.getElementById('status-bar').textContent = 'Connected to MQTT Broker';
  document.getElementById('status-bar').classList.remove('disconnected');
  document.getElementById('status-bar').classList.add('connected');
};

ws.onmessage = (event) => {
  const li = document.createElement('li');
  li.textContent = event.data;
  messageList.appendChild(li);

  // Reproducir el sonido de notificación cuando llegue un mensaje nuevo
  notificationSound.play();
};

ws.onclose = () => {
  document.getElementById('status-bar').textContent = 'Disconnected from MQTT Broker';
  document.getElementById('status-bar').classList.remove('connected');
  document.getElementById('status-bar').classList.add('disconnected');
};

sendButton.addEventListener('click', () => {
  const message = messageInput.value;
  if (message) {
    // Agregar un identificador único al mensaje
    const uniqueId = Date.now(); // Puedes usar un UUID aquí
    const messageWithId = `${uniqueId}|${message}`;
    ws.send(messageWithId);
    messageInput.value = '';
  }
});

messageInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    sendButton.click();
  }
});
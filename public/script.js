// Establecemos una conexión WebSocket con el servidor en la URL 'ws://localhost:3000'
const ws = new WebSocket('ws://localhost:3000');
//Obtenemos los elementos por ID
const messageList = document.getElementById('message-list');
const sendButton = document.getElementById('send');
const messageInput = document.getElementById('message');
const themeToggle = document.getElementById('theme-toggle');
const statusBar = document.getElementById('status-bar');
const notificationSound = document.getElementById('notification-sound');

// Funcionalidad de cambio de tema
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
});

// Evento que se dispara cuando se establece una conexión WebSocket correctamente
ws.onopen = () => {
  document.getElementById('status-bar').textContent = 'Connected to MQTT Broker';
  document.getElementById('status-bar').classList.remove('disconnected');
  document.getElementById('status-bar').classList.add('connected');
};

// Evento que se dispara cuando se recibe un mensaje a través del WebSocket
ws.onmessage = (event) => {
  const li = document.createElement('li');
  li.textContent = event.data;
  messageList.appendChild(li);
  notificationSound.play();
};

// Evento que se dispara cuando se cierra la conexión WebSocket
ws.onclose = () => {
  document.getElementById('status-bar').textContent = 'Disconnected from MQTT Broker';
  document.getElementById('status-bar').classList.remove('connected');
  document.getElementById('status-bar').classList.add('disconnected');
};

// Función que se ejecuta cuando se presiona el botón de enviar
sendButton.addEventListener('click', () => {
  const message = messageInput.value;
  if (message) {
    const uniqueId = Date.now();
    const messageWithId = `${uniqueId}|${message}`;
    ws.send(messageWithId);
    messageInput.value = '';
  }
});

// Invoca a la funcion sendButton al presionar "Enter"
messageInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    sendButton.click();
  }
});
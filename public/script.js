const socket = io();  // Conectar con Socket.io desde el frontend

const themeToggle = document.getElementById('theme-toggle');
const statusBar = document.getElementById('status-bar');
//const notificationSound = new Audio('notification.mp3'); // Sonido de notificación

// Toggle de modo oscuro/claro
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');  // Alterna entre 'dark-mode' y 'light-mode'
});

// Actualizar barra de estado según la conexión a Socket.io
socket.on('connect', () => {
  console.log('Connected to MQTT Broker');
  statusBar.textContent = 'Connected to MQTT Broker';
  statusBar.classList.add('connected');
  statusBar.classList.remove('disconnected');
});

socket.on('disconnect', () => {
  console.log('Disconnected from MQTT Broker');
  statusBar.textContent = 'Disconnected from MQTT Broker';
  statusBar.classList.add('disconnected');
  statusBar.classList.remove('connected');
});

// Recibir mensajes MQTT desde el servidor a través de Socket.io
socket.on('mqtt_message', (data) => {
  const list = document.getElementById('message-list');
  const listItem = document.createElement('li');
  listItem.className = 'message';
  listItem.innerHTML = `<img src="avatar.png" alt="User Avatar" class="avatar">
                        <span class="message-content">Received: ${data.message}</span>`;
  list.appendChild(listItem);
  notificationSound.play(); // Reproduce el sonido al recibir un mensaje
});

// Enviar mensajes al servidor para ser publicados en el broker MQTT
document.getElementById('send').addEventListener('click', () => {
  const message = document.getElementById('message').value;
  socket.emit('publish_message', { topic: 'test/topic', message });  // Envía el mensaje al servidor

  const list = document.getElementById('message-list');
  const listItem = document.createElement('li');
  listItem.className = 'message';
  listItem.innerHTML = `<img src="avatar.png" alt="User Avatar" class="avatar">
                        <span class="message-content">Sent: ${message}</span>`;
  list.appendChild(listItem);

  document.getElementById('message').value = '';  // Limpia el campo de texto después de enviar
});
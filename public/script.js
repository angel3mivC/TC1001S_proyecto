//const client = mqtt.connect('ws://your-aws-ip:1883'); // WebSocket URL
const themeToggle = document.getElementById('theme-toggle');
const statusBar = document.getElementById('status-bar');
//const notificationSound = new Audio('notification.mp3'); // Sonido de notificación

// Toggle de modo oscuro/claro
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');  // Alterna entre 'dark-mode' y 'light-mode'
});

// Conectar al broker MQTT
client.on('connect', () => {
  console.log('Connected to MQTT Broker');
  statusBar.textContent = 'Connected to MQTT Broker';
  statusBar.classList.add('connected');
  statusBar.classList.remove('disconnected');
  client.subscribe('test/topic');
});

// Desconectar del broker
client.on('disconnect', () => {
  console.log('Disconnected from MQTT Broker');
  statusBar.textContent = 'Disconnected from MQTT Broker';
  statusBar.classList.add('disconnected');
  statusBar.classList.remove('connected');
});

// Recibir mensajes
client.on('message', (topic, message) => {
  const list = document.getElementById('message-list');
  const listItem = document.createElement('li');
  listItem.className = 'message';
  listItem.innerHTML = `<img src="avatar.png" alt="User Avatar" class="avatar">
                        <span class="message-content">Received: ${message.toString()}</span>`;
  list.appendChild(listItem);
  notificationSound.play(); // Reproduce el sonido al recibir un mensaje
});

// Enviar mensajes
document.getElementById('send').addEventListener('click', () => {
  const message = document.getElementById('message').value;
  client.publish('test/topic', message);
  const list = document.getElementById('message-list');
  const listItem = document.createElement('li');
  listItem.className = 'message';
  listItem.innerHTML = `<img src="avatar.png" alt="User Avatar" class="avatar">
                        <span class="message-content">Sent: ${message}</span>`;
  list.appendChild(listItem);
  document.getElementById('message').value = '';
});
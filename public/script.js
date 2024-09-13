const ws = new WebSocket('ws://localhost:3000');
const messageList = document.getElementById('message-list');
const sendButton = document.getElementById('send');
const messageInput = document.getElementById('message');
const themeToggle = document.getElementById('theme-toggle');
const statusBar = document.getElementById('status-bar');

// Toggle de modo oscuro/claro
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');  // Alterna entre 'dark-mode' y 'light-mode'
});

ws.onopen = () => {
  statusBar.textContent = 'Connected to MQTT Broker';
  statusBar.classList.remove('disconnected');
  statusBar.classList.add('connected');
};

ws.onmessage = (event) => {
  const li = document.createElement('li');
  li.textContent = event.data;
  messageList.appendChild(li);
};

ws.onclose = () => {
  statusBar.textContent = 'Disconnected from MQTT Broker';
  statusBar.classList.remove('connected');
  statusBar.classList.add('disconnected');
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
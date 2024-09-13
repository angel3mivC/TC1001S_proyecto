document.addEventListener('DOMContentLoaded', () => {
  const ws = new WebSocket('ws://localhost:3000');
  const messageList = document.getElementById('message-list');
  const sendButton = document.getElementById('send');
  const messageInput = document.getElementById('message');

  ws.onopen = () => {
    document.getElementById('status-bar').textContent = 'Connected to MQTT Broker';
    document.getElementById('status-bar').classList.remove('disconnected');
    document.getElementById('status-bar').classList.add('connected');
  };

  ws.onmessage = (event) => {
    const li = document.createElement('li');
    li.textContent = event.data;
    messageList.appendChild(li);
  };

  ws.onclose = () => {
    document.getElementById('status-bar').textContent = 'Disconnected from MQTT Broker';
    document.getElementById('status-bar').classList.remove('connected');
    document.getElementById('status-bar').classList.add('disconnected');
  };

  sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message) {
      ws.send(message);
      messageInput.value = '';
    }
  });

  messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      sendButton.click();
    }
  });
});

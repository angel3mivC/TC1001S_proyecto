const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Iniciar el servidor en el puerto 3000
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

// Configurar WebSocket
wss.on('connection', ws => {
  console.log('WebSocket connection established');

  ws.on('message', message => {
    console.log('Received from client:', message);
    // Puedes añadir más lógica aquí para manejar mensajes de WebSocket
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

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

// Función para enviar mensaje a todos los clientes conectados
function broadcastMessage(message) {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
  
  // Configurar WebSocket
  wss.on('connection', ws => {
    console.log('WebSocket connection established');
  
    // Recibir mensajes desde los clientes web
    ws.on('message', message => {
      // Convertir el mensaje a texto si es un buffer
      const textMessage = typeof message === 'string' ? message : message.toString('utf-8');
      console.log('Received from client:', textMessage);
      // Enviar el mensaje recibido a todos los clientes conectados
      broadcastMessage(textMessage);
    });
  
    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });
  
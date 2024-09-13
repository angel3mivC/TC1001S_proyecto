const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mqtt = require('mqtt');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Configuración MQTT
const protocol = 'mqtt';
const host = '52.206.0.77';
const port = '1883';
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const connectUrl = `${protocol}://${host}:${port}`;
const mqttClient = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'yoMero',
  password: 'papasword',
  reconnectPeriod: 1000,
});

const topic = '/nodejs/mqtt';

// Bandera para evitar eco
let isPublishingFromWebSocket = false;

// Enviar mensaje a todos los clientes conectados
function broadcastMessage(message) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      console.log('Broadcasting to WebSocket client:', message);
      client.send(message);
    }
  });
}

// Configurar WebSocket
wss.on('connection', ws => {
  console.log('WebSocket connection established');

  ws.on('message', message => {
    // Asegurarse de que el mensaje sea una cadena
    const messageString = (typeof message === 'string') ? message : message.toString();
    
    // Separar el identificador del mensaje
    const [uniqueId, messageText] = messageString.split('|');
    console.log('Received from WebSocket client:', messageText);

    if (!isPublishingFromWebSocket) {
      isPublishingFromWebSocket = true;

      mqttClient.publish(topic, messageText, { qos: 0, retain: false }, (error) => {
        if (error) {
          console.error('MQTT Publish Error:', error);
        }
        isPublishingFromWebSocket = false;
      });
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

// Cuando llega un nuevo mensaje de MQTT
mqttClient.on('message', (topic, payload) => {
  const message = payload.toString();
  console.log('Received MQTT Message:', topic, message);

  if (!isPublishingFromWebSocket) {
    // Enviar el mensaje recibido de MQTT al servidor WebSocket
    broadcastMessage(message);
  }
});

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Iniciar el servidor en el puerto 3000
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

// Suscripción y Publicación en MQTT
mqttClient.on('connect', () => {
  console.log('MQTT Connected');
  mqttClient.subscribe([topic], () => {
    console.log(`Subscribed to topic '${topic}'`);
  });
});

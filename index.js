// Importacion de las librerias necesarias
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mqtt = require('mqtt');

//Instancia de Express 
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Configuración del cliente MQTT
const protocol = 'mqtt';
const host = '52.206.0.77';
const port = '1883';
// Creacion de un ID para el cliente MQTT
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
// Construccion de la URL
const connectUrl = `${protocol}://${host}:${port}`;

//Conexion al broker con la configuracion hecha
const mqttClient = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'yoMero',
  password: 'papasword',
  reconnectPeriod: 1000,
});

//Topico al se suscribira
const topic = '/nodejs/mqtt';

// Bandera para evitar eco
let isPublishingFromWebSocket = false;

// Funcion para enviar mensaje a todos los clientes conectados
function broadcastMessage(message) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      console.log('Broadcasting to WebSocket client:', message);
      client.send(message);
    }
  });
}

// Configuracion de eventos para el WebSocket
wss.on('connection', ws => {
  console.log('WebSocket connection established');

  // Escucha los mensajes de los clientes
  ws.on('message', message => {
    const messageString = (typeof message === 'string') ? message : message.toString(); // Asegurarse de que el mensaje sea una cadena
    const [uniqueId, messageText] = messageString.split('|'); // Separar el identificador del mensaje
    console.log('Received from WebSocket client:', messageText);

    // Evita el eco mientras se publica en MQTT
    if (!isPublishingFromWebSocket) {
      isPublishingFromWebSocket = true;

      // Publica el mensaje en el Broker
      mqttClient.publish(topic, messageText, { qos: 0, retain: false }, (error) => {
        //Manejo de errores en la publicación
        if (error) {
          console.error('MQTT Publish Error:', error);
        }
        isPublishingFromWebSocket = false;
      });
    }
  });

  //Evento cuando se cierra la conexion WebSocket
  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

// Escucha los mensajes entrantes en el broker
mqttClient.on('message', (topic, payload) => {
  const message = payload.toString();
  console.log('Received MQTT Message:', topic, message);

  // Si el mensaje no viene del WebSocket, lo envia a todos los clientes
  if (!isPublishingFromWebSocket) {
    broadcastMessage(message);
  }
});

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Iniciar el servidor en el puerto 3000
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

// Suscripción al topico y Publicación en MQTT
mqttClient.on('connect', () => {
  console.log('MQTT Connected');
  mqttClient.subscribe([topic], () => {
    console.log(`Subscribed to topic '${topic}'`);
  });
});
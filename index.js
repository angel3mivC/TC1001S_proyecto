const express = require('express');
const mqtt = require('mqtt');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = 3000;

// Configura el servidor para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Crear servidor HTTP
const server = http.createServer(app);
const io = new Server(server);

// Configura la conexión al broker MQTT
const protocol = 'mqtt';
const host = '54.236.211.18';
const port = '1883';
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `${protocol}://${host}:${port}`;
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'yoMero',
  password: 'papasword',
  reconnectPeriod: 1000,
});

const topic = '/nodejs/mqtt';
client.on('connect', () => {
  console.log('Connected to MQTT Broker');
  client.subscribe([topic], () => {
    console.log(`Subscribed to topic '${topic}'`);
    client.publish(topic, 'Test message from server', { qos: 0, retain: false });
  });
});

client.on('message', (topic, payload) => {
  console.log('Received Message:', topic, payload.toString());
  io.emit('mqtt_message', { topic, message: payload.toString() });  // Emitir mensaje a los clientes conectados
});

// Inicia el servidor HTTP
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
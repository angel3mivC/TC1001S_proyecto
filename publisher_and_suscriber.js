const mqtt = require('mqtt');
const WebSocket = require('ws');

// Conectar al WebSocket en el servidor
const ws = new WebSocket('ws://localhost:3000');

// Configuración MQTT
const protocol = 'mqtt';
const host = '54.236.211.188'; // Cambia esto si es necesario
const port = '1883';
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `${protocol}://${host}:${port}`;
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'yoMero', // Cambia esto si es necesario
  password: 'papasword', // Cambia esto si es necesario
  reconnectPeriod: 1000,
});

const topic = '/nodejs/mqtt';

// Suscripción y Publicación en MQTT
client.on('connect', () => {
  console.log('MQTT Connected');
  
  client.subscribe([topic], () => {
    console.log(`Subscribed to topic '${topic}'`);
    client.publish(topic, 'nodejs mqtt Prueba para publicador y suscriptor', { qos: 0, retain: false }, (error) => {
      if (error) {
        console.error('MQTT Publish Error:', error);
      }
    });
  });
});

// Cuando llega un nuevo mensaje de MQTT
client.on('message', (topic, payload) => {
  const message = payload.toString();
  console.log('Received MQTT Message:', topic, message);
  
  // Enviar el mensaje recibido de MQTT al servidor WebSocket
  ws.send(message);
});

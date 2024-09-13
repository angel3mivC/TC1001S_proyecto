const mqtt = require('mqtt');

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

client.on('message', (topic, payload) => {
  console.log('Received MQTT Message:', topic, payload.toString());
  // Puedes añadir lógica aquí para enviar el mensaje a WebSocket
});

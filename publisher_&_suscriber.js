const mqtt = require('mqtt')
const protocol = 'mqtt'
const host = '54.236.211.188'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `${protocol}://${host}:${port}`
const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: 'yoMero',
    password: 'papasword',
    reconnectPeriod: 1000,
  })
  const topic = '/nodejs/mqtt'
  client.on('connect', () => {
    console.log('Connected')
  
    client.subscribe([topic], () => {
      console.log(`Subscribe to topic '${topic}'`)
      client.publish(topic, 'nodejs mqtt Prueba para publicador y suscriptor', { qos: 0, retain: false }, (error) => {
        if (error) {
          console.error(error)
        }
      })
    })
  })
  
  client.on('message', (topic, payload) => {
    console.log('Received Message:', topic, payload.toString())
  })
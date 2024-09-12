const mqtt = require('mqtt')
const protocol = 'mqtt'
const host = '3.83.113.52'
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
    client.publish(topic, 'nodejs mqtt test', { qos: 0, retain: false }, (error) => {
      if (error) {
        console.error(error)
      }
    })
  })
  
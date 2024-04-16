require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: 'localhost',
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});


// DHT11 ----------------------------------------------------------------

// WebSocket
io.on('connection', (socket) => {
  console.log('Cliente conectado');

  app.post('/dht11', (req, res) => {
    const { humidity, temperature } = req.body;
    console.log(humidity);
    console.log(temperature);
    socket.emit('data', { temperature, humidity });
    res.sendStatus(200);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Save to database
app.post('/dht11', async (req, res) => {
  const { humidity, temperature } = req.body;
  
  try {
      const client = await pool.connect();
      const currentDateTime = new Date().toISOString();
      
      const save = await client.query('INSERT INTO dh_record (fechahora, temperatura, humedad) VALUES ($1, $2, $3)', [currentDateTime, temperature, humidity]);
      
      console.log("Humedad:", humidity);
      console.log("Temperatura:", temperature);
      
      res.sendStatus(200);
  } catch (error) {
      console.error('Error al insertar el registro en la base de datos:', error);
      res.status(500).send('Error interno del servidor');
  } finally {
      client.release();
  }
});

  // Vistas

  // Record
  app.get('/dh_record/', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM dh_records');
      const data = result.rows;
      client.release();
      res.json(data);
      console.log(data);
    } catch (err) {
      console.error('Error en la consulta:', err);
      res.status(500).send('Error en el servidor');
    }
  });

  // Leds
  app.post('/dh_leds', (req, res) => {
    const { led, state } = req.body;
    console.log(`LED ${led} ${state}`);
    
    const message = `${led}:${state}\n`;

    port.write(message, (err) => {
        if (err) {
            console.error('Error al escribir en el puerto serie:', err);
            res.status(500).send('Error al comunicarse con el Arduino');
        } else {
            res.sendStatus(200);
        }
    });
});

// BMP180 ----------------------------------------------------------------

// WebSocket
io.on('connection', (socket) => {
  console.log('Cliente conectado');

  app.post('/bmp180', (req, res) => {
    const { pressure, temperature } = req.body;
    socket.emit('data', { pressure, temperature });
    res.sendStatus(200);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Save to database
app.post('/bmp180', async (req, res) => {
  const { pressure, temperature } = req.body;
  
  try {
      const client = await pool.connect();
      const currentDateTime = new Date().toISOString();
      
      const save = await client.query('INSERT INTO bm_records (datetime, temperature, pressure) VALUES ($1, $2, $3)', [currentDateTime, temperature, pressure]);
      
      console.log("Pressure:", pressure);
      console.log("Temperatura:", temperature);
      
      res.sendStatus(200);
  } catch (error) {
      console.error('Error al insertar el registro en la base de datos:', error);
      res.status(500).send('Error interno del servidor');
  } finally {
      client.release();
  }
});

  // Vistas

  app.post('/bm_umbral_temperature', (req, res) => {
    const { umbral } = req.body;
    
    const message = `${umbral}\n`;

    port.write(message, (err) => {
        if (err) {
            console.error('Error al escribir en el puerto serie:', err);
            res.status(500).send('Error al comunicarse con el Arduino');
        } else {
            res.sendStatus(200);
        }
    });
});

  // Record
  app.get('/bm_record/', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM bm_records');
      const data = result.rows;
      client.release();
      res.json(data);
    } catch (err) {
      console.error('Error en la consulta:', err);
      res.status(500).send('Error en el servidor');
    }
  });

  // Leds
  app.post('/bm_leds', (req, res) => {
    const { led, state } = req.body;
    console.log(`LED ${led} ${state}`);
    
    const message = `${led}:${state}\n`;

    port.write(message, (err) => {
        if (err) {
            console.error('Error al escribir en el puerto serie:', err);
            res.status(500).send('Error al comunicarse con el Arduino');
        } else {
            res.sendStatus(200);
        }
    });
});

  
  server.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
  });
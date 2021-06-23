const express = require('express');
require('dotenv').config()
const PORT = process.env.PORT || 3001;
const { dbConnection } = require('./data/config')
const cors = require('cors')

const app = express();

// Base de datos
dbConnection()

app.use(cors())

//Directorio Publico
app.use(express.static('public'))
//lectura y parseo de body
app.use(express.json());

//Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/events', require('./routes/events'))

app.listen(PORT, () => console.log(`Listening ar port: ${PORT}`))
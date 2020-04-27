const express = require('express')
const mongoose = require('mongoose');
const app = express()
const port = 3000

mongoose.connect('mongodb://192.168.0.17:27017', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false,
}).then(() => console.log('MongoDB Connected...'))
    .catch(error => console.error('mongodb error', error));

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
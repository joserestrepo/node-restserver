require('./config/config');
const express = require('express');
const app = express();
const mongoose = require('mongoose');

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// parse application/json
app.use(express.json());

app.use(require('./routes/usuario'));

mongoose.connect(process.env.URL_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err, res) => {
    if (err) throw error;
    console.log("Base de datos conectada");
});

app.listen(process.env.PORT, () => {
    console.log("escuchando en el puerto:", process.env.PORT);
});
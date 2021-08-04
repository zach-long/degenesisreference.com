const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const app = express();

dotenv.config();

dbPath = process.env.MONGODB_URI

mongoose.connect(dbPath);
const db = mongoose.connection;
db.on('error', console.error.bind(console, `connection error:`));
db.once('open', () => {
    console.log(`MongoDB connected successfully.`);
});

const indexRoutes = require('./routes/index.js');
const itemRoutes = require('./routes/items.js');

app.use(express.static(path.join(__dirname, './../public')));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.use('/', indexRoutes);
app.use('/items', itemRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Application started on port ${port}.`);
});
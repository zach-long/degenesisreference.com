const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

const app = express();

dotenv.config();

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
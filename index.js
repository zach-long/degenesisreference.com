const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

const app = express();
const router = express.Router();

dotenv.config();

app.use(express.static(path.join(__dirname, 'public')));

router.get('/', (req, res) => {
    console.log(`* Rendering index.html`);
    res.render('index');
});

router.get('/items', (req, res) => {
    console.log(`* Rendering items.html`);
    res.render('items.html');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Application started on port ${port}.`);
});
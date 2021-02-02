const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

const app = express();
const router = express.Router();

dotenv.config();

app.use(express.static(path.join(__dirname, 'public')));

router.get('/*', (req, res) => {
    res.render('index');
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Application started on port ${port}.`);
});
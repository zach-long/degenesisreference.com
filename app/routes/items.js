const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log(`* Rendering items`);
    res.render('items');
});

module.exports = router;
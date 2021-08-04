import express from 'express';
const router = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
    console.log(`Rendering items`);
    res.render('items');
});

module.exports = router;
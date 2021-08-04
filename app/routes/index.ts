import express from 'express';
const router = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
    console.log(`Rendering index`);
    res.render('index');
});

module.exports = router;
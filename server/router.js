import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send(200);
});

router.post('/search', (req, res) => {
  res.send(200, req.body);
});

export default router;

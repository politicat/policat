import express from 'express';
import keywordController from './search/keywordController.js';

const router = express.Router();

router.get('/home', keywordController.home);
router.post('/search', keywordController.search);

export default router;

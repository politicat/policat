import express from 'express';
import keywordController from './search/keywordController.js';

const router = express.Router();

router.post('/search', keywordController.search);

export default router;

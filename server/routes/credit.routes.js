import { Router } from 'express';
import { authenticateJWT } from '../middleware/authenticateJWT.js';
import * as creditController from '../controllers/credit.controller.js';

const router = Router();

router.post('/claim', authenticateJWT, creditController.claimDaily);
router.get('/balance', authenticateJWT, creditController.getBalance);
router.get('/history', authenticateJWT, creditController.getHistory);

export default router;

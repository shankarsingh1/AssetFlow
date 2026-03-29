import { Router } from 'express';
import { query, validationResult } from 'express-validator';
import { authenticateJWT } from '../middleware/authenticateJWT.js';
import * as transactionController from '../controllers/transaction.controller.js';

const router = Router();

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }
  next();
}

router.get(
  '/',
  authenticateJWT,
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
  ],
  handleValidation,
  transactionController.getMyTransactions
);

export default router;

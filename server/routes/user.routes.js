import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import { authenticateJWT } from '../middleware/authenticateJWT.js';
import * as userController from '../controllers/user.controller.js';

const router = Router();

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }
  next();
}

router.get('/me', authenticateJWT, userController.getMe);

router.patch(
  '/me',
  authenticateJWT,
  [
    body('bio').optional().isString().isLength({ max: 2000 }),
    body('avatar_url').optional().isString().isLength({ max: 2048 }),
  ],
  handleValidation,
  userController.updateMe
);

router.get(
  '/profile/:username',
  [param('username').trim().isLength({ min: 3, max: 20 })],
  handleValidation,
  userController.getPublicProfile
);

export default router;

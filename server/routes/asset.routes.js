import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import { authenticateJWT } from '../middleware/authenticateJWT.js';
import { uploadSingle, uploadErrorHandler } from '../middleware/upload.js';
import * as assetController from '../controllers/asset.controller.js';

const router = Router();

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }
  next();
}

router.get('/mine', authenticateJWT, assetController.getMyAssets);

router.get(
  '/:id/history',
  [param('id').isMongoId()],
  handleValidation,
  assetController.getOwnershipHistory
);

router.get('/:id', [param('id').isMongoId()], handleValidation, assetController.getAsset);

router.post(
  '/',
  authenticateJWT,
  uploadSingle,
  uploadErrorHandler,
  [
    body('title').trim().notEmpty().isLength({ max: 200 }),
    body('description').optional().isString().isLength({ max: 5000 }),
    body('category').isIn(['art', 'music', 'collectible']),
    body('tags').optional(),
  ],
  handleValidation,
  assetController.uploadAsset
);

router.patch(
  '/:id',
  authenticateJWT,
  [
    param('id').isMongoId(),
    body('title').optional().trim().notEmpty().isLength({ max: 200 }),
    body('description').optional().isString().isLength({ max: 5000 }),
    body('tags').optional(),
  ],
  handleValidation,
  assetController.updateAsset
);

router.delete(
  '/:id',
  authenticateJWT,
  [param('id').isMongoId()],
  handleValidation,
  assetController.deleteAsset
);

router.post(
  '/:id/generate-card',
  authenticateJWT,
  [param('id').isMongoId()],
  handleValidation,
  assetController.generateCardJob
);

export default router;

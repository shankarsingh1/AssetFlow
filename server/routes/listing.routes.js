import { Router } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { authenticateJWT } from '../middleware/authenticateJWT.js';
import * as listingController from '../controllers/listing.controller.js';

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
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 24 }),
    query('category').optional().isIn(['art', 'music', 'collectible', '']),
    query('sort').optional().isIn(['newest', 'price_asc', 'price_desc', '']),
    query('search').optional().isString(),
  ],
  handleValidation,
  listingController.getListings
);

router.get('/mine', authenticateJWT, listingController.getMyListings);

router.get('/:id', [param('id').isMongoId()], handleValidation, listingController.getListing);

router.post(
  '/',
  authenticateJWT,
  [
    body('asset_id').isMongoId(),
    body('price_credits').isInt({ min: 5 }),
    body('description').optional().isString().isLength({ max: 5000 }),
  ],
  handleValidation,
  listingController.createListing
);

router.post(
  '/:id/buy',
  authenticateJWT,
  [param('id').isMongoId()],
  handleValidation,
  listingController.buyListing
);

router.post(
  '/:id/cancel',
  authenticateJWT,
  [param('id').isMongoId()],
  handleValidation,
  listingController.cancelListing
);

export default router;

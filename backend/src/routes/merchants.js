const { Router } = require('express');
const { body, query } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const {
  getMerchants,
  getMerchantById,
  redeemAtMerchant,
} = require('../controllers/merchantsController');

const router = Router();

/**
 * GET /api/merchants
 * List merchants. Optional query: ?city=Mumbai&category=cafe
 */
router.get('/', getMerchants);

/**
 * GET /api/merchants/:id
 * Get a specific merchant by id.
 */
router.get('/:id', getMerchantById);

/**
 * POST /api/merchants/:id/redeem
 * Redeem $WISP tokens at this merchant.
 * Body: { wispAmount }
 */
router.post(
  '/:id/redeem',
  authenticate,
  [body('wispAmount').isFloat({ min: 0.00000001 }).withMessage('wispAmount must be > 0')],
  validate,
  redeemAtMerchant
);

module.exports = router;

const { Router } = require('express');
const { body }   = require('express-validator');
const { validate }       = require('../middleware/validate');
const { authenticate }   = require('../middleware/auth');
const { actionsLimiter } = require('../middleware/rateLimiter');
const {
  submitAction,
  submitTicketPhotoAction,
  getActions,
  getActionById,
} = require('../controllers/actionsController');

const router = Router();

/**
 * POST /api/actions
 * Submit an anonymized proof from the local agent (rate-limited: 20/hr).
 */
router.post(
  '/ticket-photo',
  authenticate,
  actionsLimiter,
  [
    body('imageDataUrl')
      .isString()
      .withMessage('imageDataUrl must be a string')
      .isLength({ min: 100 })
      .withMessage('imageDataUrl appears too small to be a valid image data URL'),
  ],
  validate,
  submitTicketPhotoAction
);

/**
 * POST /api/actions
 * Submit an anonymized proof from the local agent (rate-limited: 20/hr).
 */
router.post(
  '/',
  authenticate,
  actionsLimiter,
  [
    body('category').notEmpty().withMessage('category is required'),
    body('proofHash').notEmpty().withMessage('proofHash is required'),
    body('daySequence').isInt({ min: 1 }).withMessage('daySequence must be a positive integer'),
  ],
  validate,
  submitAction
);

/**
 * GET /api/actions
 */
router.get('/', authenticate, getActions);

/**
 * GET /api/actions/:id
 */
router.get('/:id', authenticate, getActionById);

module.exports = router;

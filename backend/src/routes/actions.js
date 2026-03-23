const { Router } = require('express');
const { body }   = require('express-validator');
const { validate }       = require('../middleware/validate');
const { authenticate }   = require('../middleware/auth');
const { actionsLimiter } = require('../middleware/rateLimiter');
const {
  submitAction,
  submitTicketPhotoAction,
  submitManualAction,
  submitElectricityBillAction,
  submitScreenTimeAction,
  submitPlantMealAction,
  submitRecyclingPhotoAction,
  submitTimelineScreenshotAction,
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
 * POST /api/actions/manual
 * Manual verification for non-ticket green actions.
 */
router.post(
  '/manual',
  authenticate,
  actionsLimiter,
  [
    body('category').isString().notEmpty().withMessage('category is required'),
  ],
  validate,
  submitManualAction
);

/**
 * POST /api/actions/electricity-bill
 * Extract electricity units from uploaded monthly bill and reward by score.
 */
router.post(
  '/electricity-bill',
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
  submitElectricityBillAction
);

/**
 * POST /api/actions/screen-time
 * Extract total daily screen-time from screenshot and reward low usage.
 */
router.post(
  '/screen-time',
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
  submitScreenTimeAction
);

/**
 * POST /api/actions/meal-photo
 * Verify uploaded meal image as plant-based.
 */
router.post(
  '/meal-photo',
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
  submitPlantMealAction
);

/**
 * POST /api/actions/recycling-photo
 * Verify uploaded recycling image proof.
 */
router.post(
  '/recycling-photo',
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
  submitRecyclingPhotoAction
);

/**
 * POST /api/actions/timeline-screenshot
 * Verify Google Maps Timeline screenshot and reward low-carbon commute.
 */
router.post(
  '/timeline-screenshot',
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
  submitTimelineScreenshotAction
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

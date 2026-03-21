const { Router } = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { register, login, me } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user with their Hedera wallet address.
 */
router.post(
  '/register',
  [body('walletAddress').notEmpty().withMessage('walletAddress is required')],
  validate,
  register
);

/**
 * POST /api/auth/login
 * Login using wallet address + signed challenge (signature verification).
 * Returns a JWT for subsequent authenticated requests.
 */
router.post(
  '/login',
  [
    body('walletAddress').notEmpty(),
    body('signature').notEmpty().withMessage('Signed challenge required'),
  ],
  validate,
  login
);

/**
 * GET /api/auth/me
 * Returns the currently authenticated user's profile.
 */
router.get('/me', authenticate, me);

module.exports = router;

const { Router } = require('express');
const { body, query: qv } = require('express-validator');
const { validate } = require('../middleware/validate');
const { register, login, me, getChallenge } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

const router = Router();

/**
 * GET /api/auth/challenge?walletAddress=0.0.xxxxx
 * Returns a one-time nonce for the wallet to sign.
 * Client signs the nonce with their Hedera private key,
 * then posts the signature to POST /api/auth/login.
 */
router.get(
  '/challenge',
  authLimiter,
  [qv('walletAddress').notEmpty().withMessage('walletAddress query param required')],
  validate,
  getChallenge
);

/**
 * POST /api/auth/register
 * Register a new user with their Hedera wallet address.
 */
router.post(
  '/register',
  authLimiter,
  [body('walletAddress').notEmpty().withMessage('walletAddress is required')],
  validate,
  register
);

/**
 * POST /api/auth/login
 * Login using wallet address + signed challenge.
 * Returns a JWT for subsequent authenticated requests.
 */
router.post(
  '/login',
  authLimiter,
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

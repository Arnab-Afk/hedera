const { Router } = require('express');
const { body, query: qv } = require('express-validator');
const { validate }   = require('../middleware/validate');
const { register, login, me, getChallenge } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { authLimiter }  = require('../middleware/rateLimiter');

const router = Router();

// Apply auth-specific rate limit to ALL auth routes
router.use(authLimiter);

/**
 * GET /api/auth/challenge?walletAddress=0.0.xxxxx
 * Returns a one-time nonce for the wallet to sign.
 */
router.get(
  '/challenge',
  [qv('walletAddress').notEmpty().withMessage('walletAddress query param is required')],
  validate,
  getChallenge
);

/**
 * POST /api/auth/register
 */
router.post(
  '/register',
  [body('walletAddress').notEmpty().withMessage('walletAddress is required')],
  validate,
  register
);

/**
 * POST /api/auth/login
 * Body: { walletAddress, signature }
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
 */
router.get('/me', authenticate, me);

module.exports = router;

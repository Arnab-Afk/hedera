const { Router } = require('express');
const { body, query: qv } = require('express-validator');
const { validate }   = require('../middleware/validate');
const { register, login, socialLogin, me, getChallenge } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { authLimiter }  = require('../middleware/rateLimiter');

const router = Router();

router.use(authLimiter);

router.get(
  '/challenge',
  [qv('walletAddress').notEmpty().withMessage('walletAddress query param is required')],
  validate,
  getChallenge
);

router.post(
  '/register',
  [body('walletAddress').notEmpty().withMessage('walletAddress is required')],
  validate,
  register
);

router.post(
  '/login',
  [
    body('walletAddress').notEmpty(),
    body('signature').notEmpty().withMessage('Signed challenge required'),
  ],
  validate,
  login
);

router.post(
  '/social-login',
  [
    body('email').isEmail().optional(),
    body('socialId').notEmpty(),
    body('walletAddress').notEmpty(),
  ],
  validate,
  socialLogin
);

router.get('/me', authenticate, me);

module.exports = router;

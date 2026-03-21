const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const { getUser } = require('../controllers/usersController');

const router = Router();

/**
 * GET /api/users/:walletAddress
 * Get a user's public profile by wallet address.
 */
router.get('/:walletAddress', getUser);

module.exports = router;

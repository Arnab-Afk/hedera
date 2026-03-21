const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const { getMyStreak, getLeaderboard } = require('../controllers/streaksController');

const router = Router();

/**
 * GET /api/streaks/me
 * Get the authenticated user's current streak data.
 */
router.get('/me', authenticate, getMyStreak);

/**
 * GET /api/streaks/leaderboard
 * Get top 50 streak holders (by wallet address — no PII).
 */
router.get('/leaderboard', getLeaderboard);

module.exports = router;

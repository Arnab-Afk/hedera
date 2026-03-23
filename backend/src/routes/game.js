const { Router } = require('express');
const gameController = require('../controllers/gameController');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.get('/profile', authenticate, gameController.getGameProfile);
router.get('/leaderboard', authenticate, gameController.getLeaderboard);
router.post('/spirit/rename', authenticate, gameController.renameSpirit);

module.exports = router;

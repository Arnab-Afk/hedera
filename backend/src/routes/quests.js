const { Router } = require('express');
const questController = require('../controllers/questController');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.get('/', authenticate, questController.getQuests);
router.post('/:id/claim', authenticate, questController.claimQuest);

module.exports = router;

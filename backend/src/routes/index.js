const { Router } = require('express');
const authRoutes      = require('./auth');
const usersRoutes     = require('./users');
const actionsRoutes   = require('./actions');
const streaksRoutes   = require('./streaks');
const merchantsRoutes = require('./merchants');

const router = Router();

router.use('/auth',      authRoutes);
router.use('/users',     usersRoutes);
router.use('/actions',   actionsRoutes);
router.use('/streaks',   streaksRoutes);
router.use('/merchants', merchantsRoutes);

module.exports = router;

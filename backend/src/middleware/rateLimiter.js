/**
 * Rate limiting middleware — three tiers:
 *  global:   100 req / 15 min per IP
 *  auth:      10 req / 15 min per IP
 *  actions:   20 req / hr  per IP
 */
const rateLimit = require('express-rate-limit');

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests — please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts — please wait 15 minutes.' },
});

const actionsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many action submissions — maximum 20 per hour.' },
});

module.exports = { globalLimiter, authLimiter, actionsLimiter };

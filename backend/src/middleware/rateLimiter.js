/**
 * Rate limiting middleware for the Wisp API.
 *
 * Applied in tiers:
 *  - Global:           100 req / 15 min per IP
 *  - Auth endpoints:    10 req / 15 min per IP  (brute-force protection)
 *  - Action submit:     20 req / hr  per IP     (proof spam protection)
 */

const rateLimit = require('express-rate-limit');

/** Global limiter — applied to all routes */
const globalLimiter = rateLimit({
  windowMs:         15 * 60 * 1000, // 15 minutes
  max:              100,
  standardHeaders:  true,   // Return rate limit info in RateLimit-* headers
  legacyHeaders:    false,
  message:          { error: 'Too many requests — please try again later.' },
});

/** Auth limiter — tighter, applied only to /api/auth/* */
const authLimiter = rateLimit({
  windowMs:         15 * 60 * 1000,
  max:              10,
  standardHeaders:  true,
  legacyHeaders:    false,
  message:          { error: 'Too many authentication attempts — please wait 15 minutes.' },
});

/** Actions limiter — per IP, applied to POST /api/actions */
const actionsLimiter = rateLimit({
  windowMs:         60 * 60 * 1000, // 1 hour
  max:              20,
  standardHeaders:  true,
  legacyHeaders:    false,
  message:          { error: 'Too many action submissions — maximum 20 per hour.' },
});

module.exports = { globalLimiter, authLimiter, actionsLimiter };

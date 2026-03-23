/**
 * Rate limiting middleware — DISABLED
 * All limiters are now pass-through for development/unrestricted use.
 */

const globalLimiter = (req, res, next) => next();
const authLimiter = (req, res, next) => next();
const actionsLimiter = (req, res, next) => next();

module.exports = { globalLimiter, authLimiter, actionsLimiter };

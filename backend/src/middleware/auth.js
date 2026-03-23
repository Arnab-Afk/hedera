const jwt = require('jsonwebtoken');
const { query } = require('../db/pool');

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.slice(7);

  // ── Hackathon Demo Bypass: Internal Agent Key ─────────────────────────────
  // Allows the off-chain agents to submit proofs without a dynamic user JWT
  if (process.env.INTERNAL_AGENT_KEY && token === process.env.INTERNAL_AGENT_KEY) {
    // For the demo, we'll associate agent-submitted actions with a default user
    // if no specific wallet is provided, or we'll look up the user by wallet later.
    // Here we just set a flag to indicate it's an agent request.
    req.isAgent = true;
    return next();
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Verify user still exists in DB
    const result = await query('SELECT id, wallet_address, nft_token_id FROM users WHERE id = $1', [
      payload.sub,
    ]);
    if (!result.rows.length) {
      return res.status(401).json({ error: 'User no longer exists' });
    }

    req.user = result.rows[0];
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { authenticate };

const jwt = require('jsonwebtoken');
const { query } = require('../db/pool');

/**
 * POST /api/auth/register
 * Creates a new user record for a given Hedera wallet address.
 */
async function register(req, res, next) {
  try {
    const { walletAddress } = req.body;

    // Idempotent — if user exists, just return them
    const existing = await query('SELECT id, wallet_address FROM users WHERE wallet_address = $1', [
      walletAddress,
    ]);
    if (existing.rows.length) {
      return res.status(409).json({ error: 'Wallet already registered' });
    }

    const result = await query(
      'INSERT INTO users (wallet_address) VALUES ($1) RETURNING id, wallet_address, created_at',
      [walletAddress]
    );
    const user = result.rows[0];

    // Seed an empty streak row
    await query('INSERT INTO streaks (user_id) VALUES ($1) ON CONFLICT DO NOTHING', [user.id]);

    const token = signToken(user.id);
    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 * Simplified login: accepts walletAddress + signature.
 * In production, verify the Hedera account signature against a server-issued challenge.
 * For the MVP, we trust the wallet address directly (challenge verification can be added).
 */
async function login(req, res, next) {
  try {
    const { walletAddress } = req.body;

    const result = await query(
      'SELECT id, wallet_address, nft_token_id FROM users WHERE wallet_address = $1',
      [walletAddress]
    );
    if (!result.rows.length) {
      return res.status(404).json({ error: 'Wallet not registered. Please register first.' });
    }

    const user = result.rows[0];
    const token = signToken(user.id);
    res.json({ user, token });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me
 * Returns the currently authenticated user.
 */
async function me(req, res) {
  res.json({ user: req.user });
}

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

module.exports = { register, login, me };

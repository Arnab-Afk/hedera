const { query } = require('../db/pool');

async function getUser(req, res, next) {
  try {
    const result = await query(
      `SELECT u.id, u.wallet_address, u.nft_token_id, u.nft_serial, u.created_at,
              s.current_streak, s.longest_streak, s.total_actions
       FROM users u
       LEFT JOIN streaks s ON s.user_id = u.id
       WHERE u.wallet_address = $1`,
      [req.params.walletAddress]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'User not found' });
    res.json({ user: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

module.exports = { getUser };

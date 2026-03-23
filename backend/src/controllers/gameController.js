const { query } = require('../db/pool');
const { getXpToNextLevel } = require('../lib/gameLogic');

/**
 * GET /api/game/profile
 * Returns the user's game profile including level, XP, energy, and gold.
 */
async function getGameProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const result = await query(
      `SELECT level, experience, energy, gold, spirit_name, nft_token_id, nft_serial 
       FROM users WHERE id = $1`,
      [userId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    const xpToNext = getXpToNextLevel(user.experience);

    // Get streak info
    const streakResult = await query(
      'SELECT current_streak, longest_streak, total_actions FROM streaks WHERE user_id = $1',
      [userId]
    );

    res.json({
      ...user,
      xp_to_next_level: xpToNext,
      streak: streakResult.rows[0] || { current_streak: 0, longest_streak: 0, total_actions: 0 }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/game/leaderboard
 * Returns top players by level and total experience.
 */
async function getLeaderboard(req, res, next) {
  try {
    const result = await query(
      `SELECT wallet_address, spirit_name, level, experience 
       FROM users 
       ORDER BY level DESC, experience DESC 
       LIMIT 10`
    );
    res.json({ leaderboard: result.rows });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/game/spirit/rename
 */
async function renameSpirit(req, res, next) {
  try {
    const { name } = req.body;
    if (!name || name.length > 32) {
      return res.status(400).json({ error: 'Invalid name' });
    }

    await query('UPDATE users SET spirit_name = $1 WHERE id = $2', [name, req.user.id]);
    res.json({ message: 'Spirit renamed successfully', spirit_name: name });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getGameProfile,
  getLeaderboard,
  renameSpirit
};

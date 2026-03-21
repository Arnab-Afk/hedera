const { query } = require('../db/pool');

async function getMyStreak(req, res, next) {
  try {
    const result = await query(
      'SELECT * FROM streaks WHERE user_id = $1',
      [req.user.id]
    );
    const streak = result.rows[0] || { current_streak: 0, longest_streak: 0, total_actions: 0 };
    res.json({ streak });
  } catch (err) {
    next(err);
  }
}

async function getLeaderboard(req, res, next) {
  try {
    const result = await query(
      `SELECT u.wallet_address, s.current_streak, s.longest_streak, s.total_actions
       FROM streaks s
       JOIN users u ON u.id = s.user_id
       ORDER BY s.current_streak DESC
       LIMIT 50`
    );
    res.json({ leaderboard: result.rows });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMyStreak, getLeaderboard };

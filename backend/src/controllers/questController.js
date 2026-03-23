const { query } = require('../db/pool');

/**
 * GET /api/quests
 * Returns active quests for the current user.
 */
async function getQuests(req, res, next) {
  try {
    const userId = req.user.id;
    const now = new Date();

    // Ensure user has their daily quests assigned
    await _ensureDailyQuests(userId);

    const result = await query(
      `SELECT uq.*, qd.title, qd.description, qd.category, qd.requirement_count, qd.xp_reward, qd.wisp_reward
       FROM user_quests uq
       JOIN quest_definitions qd ON uq.quest_id = qd.id
       WHERE uq.user_id = $1 
         AND (uq.expires_at IS NULL OR uq.expires_at > $2)
         AND (uq.claimed = FALSE OR uq.completed = FALSE)`,
      [userId, now]
    );

    res.json({ quests: result.rows });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/quests/:id/claim
 * Claims rewards for a completed quest.
 */
async function claimQuest(req, res, next) {
  try {
    const userId = req.user.id;
    const questInstanceId = req.params.id;

    const questResult = await query(
      `SELECT uq.*, qd.xp_reward, qd.wisp_reward
       FROM user_quests uq
       JOIN quest_definitions qd ON uq.quest_id = qd.id
       WHERE uq.id = $1 AND uq.user_id = $2`,
      [questInstanceId, userId]
    );

    if (!questResult.rows.length) {
      return res.status(404).json({ error: 'Quest not found' });
    }

    const quest = questResult.rows[0];

    if (!quest.completed) {
      return res.status(400).json({ error: 'Quest is not yet completed' });
    }

    if (quest.claimed) {
      return res.status(400).json({ error: 'Quest reward already claimed' });
    }

    // Mark as claimed and grant rewards
    await query('BEGIN');
    try {
      await query('UPDATE user_quests SET claimed = TRUE WHERE id = $1', [questInstanceId]);
      
      await query(
        `UPDATE users 
         SET experience = experience + $1, 
             gold = gold + $2, 
             updated_at = NOW() 
         WHERE id = $3`,
        [quest.xp_reward, quest.wisp_reward, userId]
      );
      
      await query('COMMIT');
    } catch (err) {
      await query('ROLLBACK');
      throw err;
    }

    res.json({ 
      message: 'Quest rewards claimed successfully', 
      xp_reward: quest.xp_reward, 
      wisp_reward: quest.wisp_reward 
    });
  } catch (err) {
    next(err);
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function _ensureDailyQuests(userId) {
  const today = new Date().toISOString().slice(0, 10);
  const startOfDay = new Date(today + 'T00:00:00Z');
  const endOfDay = new Date(today + 'T23:59:59Z');

  // Check if daily quests already exist
  const existing = await query(
    `SELECT id FROM user_quests 
     WHERE user_id = $1 AND expires_at >= $2 AND expires_at <= $3`,
    [userId, startOfDay, endOfDay]
  );

  if (!existing.rows.length) {
    // Assign 3 random daily quests
    const dailyDefs = await query(
      `SELECT id FROM quest_definitions WHERE type = 'daily' AND is_active = TRUE ORDER BY RANDOM() LIMIT 3`
    );

    const insertions = dailyDefs.rows.map(def => 
      query(
        `INSERT INTO user_quests (user_id, quest_id, expires_at) 
         VALUES ($1, $2, $3) 
         ON CONFLICT DO NOTHING`,
        [userId, def.id, endOfDay]
      )
    );

    await Promise.all(insertions);
  }
}

module.exports = {
  getQuests,
  claimQuest
};

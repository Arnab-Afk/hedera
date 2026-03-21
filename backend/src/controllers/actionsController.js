const { query } = require('../db/pool');
const { calculateWispReward } = require('../lib/rewards');

/**
 * POST /api/actions
 * Submit an anonymized green action proof.
 * Updates the user's streak in the same transaction.
 */
async function submitAction(req, res, next) {
  try {
    const { category, proofHash, daySequence, hcsTopicId, hcsSequenceNumber } = req.body;
    const userId = req.user.id;

    // Reject duplicate proofs
    const dup = await query('SELECT id FROM actions WHERE proof_hash = $1', [proofHash]);
    if (dup.rows.length) {
      return res.status(409).json({ error: 'Duplicate proof — this action has already been submitted' });
    }

    const wispEarned = calculateWispReward(category, daySequence);

    const result = await query(
      `INSERT INTO actions
         (user_id, category, proof_hash, hcs_topic_id, hcs_sequence_number, day_sequence, wisp_earned)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [userId, category, proofHash, hcsTopicId || null, hcsSequenceNumber || null, daySequence, wispEarned]
    );

    // Update streak
    await updateStreak(userId, daySequence);

    res.status(201).json({ action: result.rows[0], wispEarned });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/actions
 */
async function getActions(req, res, next) {
  try {
    const userId = req.user.id;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const offset = parseInt(req.query.offset) || 0;
    const category = req.query.category;

    let sql = 'SELECT * FROM actions WHERE user_id = $1';
    const params = [userId];

    if (category) {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }

    sql += ` ORDER BY submitted_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);
    res.json({ actions: result.rows, count: result.rowCount });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/actions/:id
 */
async function getActionById(req, res, next) {
  try {
    const result = await query(
      'SELECT * FROM actions WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Action not found' });
    res.json({ action: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function updateStreak(userId, daySequence) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  await query(
    `INSERT INTO streaks (user_id, current_streak, longest_streak, last_action_date, total_actions)
     VALUES ($1, $2, $2, $3, 1)
     ON CONFLICT (user_id) DO UPDATE SET
       current_streak   = GREATEST($2, streaks.current_streak),
       longest_streak   = GREATEST($2, streaks.longest_streak),
       last_action_date = $3,
       total_actions    = streaks.total_actions + 1,
       updated_at       = NOW()`,
    [userId, daySequence, today]
  );
}

module.exports = { submitAction, getActions, getActionById };

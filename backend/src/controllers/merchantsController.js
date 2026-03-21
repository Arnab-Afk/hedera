const { query } = require('../db/pool');

async function getMerchants(req, res, next) {
  try {
    const { city, category } = req.query;
    const params = [];
    let sql = 'SELECT * FROM merchants WHERE wisp_accepted = TRUE';

    if (city) {
      params.push(`%${city}%`);
      sql += ` AND city ILIKE $${params.length}`;
    }
    if (category) {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }

    sql += ' ORDER BY name ASC';
    const result = await query(sql, params);
    res.json({ merchants: result.rows });
  } catch (err) {
    next(err);
  }
}

async function getMerchantById(req, res, next) {
  try {
    const result = await query('SELECT * FROM merchants WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Merchant not found' });
    res.json({ merchant: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function redeemAtMerchant(req, res, next) {
  try {
    const { wispAmount } = req.body;
    const userId = req.user.id;
    const merchantId = req.params.id;

    // Verify merchant exists
    const m = await query('SELECT id, name FROM merchants WHERE id = $1 AND wisp_accepted = TRUE', [merchantId]);
    if (!m.rows.length) return res.status(404).json({ error: 'Merchant not found or not accepting $WISP' });

    // Record redemption (actual HTS transfer would be triggered here by the Hedera SDK)
    const result = await query(
      'INSERT INTO redemptions (user_id, merchant_id, wisp_amount) VALUES ($1, $2, $3) RETURNING *',
      [userId, merchantId, wispAmount]
    );

    res.status(201).json({
      redemption: result.rows[0],
      message: `Redeemed ${wispAmount} $WISP at ${m.rows[0].name}`,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMerchants, getMerchantById, redeemAtMerchant };

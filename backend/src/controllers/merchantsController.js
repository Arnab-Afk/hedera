const { query } = require('../db/pool');
const { getClient } = require('../lib/hederaClient');
const {
  TransferTransaction,
  TokenId,
  AccountId,
} = require('@hashgraph/sdk');

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
    const userId     = req.user.id;
    const merchantId = req.params.id;

    // ── Verify merchant exists and accepts $WISP ────────────────────────────
    const m = await query(
      'SELECT id, name, wallet_address FROM merchants WHERE id = $1 AND wisp_accepted = TRUE',
      [merchantId]
    );
    if (!m.rows.length) {
      return res.status(404).json({ error: 'Merchant not found or not accepting $WISP' });
    }
    const merchant = m.rows[0];

    // ── Fetch user wallet address ────────────────────────────────────────────
    const u = await query('SELECT wallet_address FROM users WHERE id = $1', [userId]);
    if (!u.rows.length) return res.status(404).json({ error: 'User not found' });
    const userWallet = u.rows[0].wallet_address;

    // ── Convert amount to smallest unit (8 decimals) ─────────────────────────
    const tinybars = Math.round(parseFloat(wispAmount) * 1e8);

    // ── Execute HTS token transfer ────────────────────────────────────────────
    let txId = null;
    const tokenIdStr = process.env.WISP_TOKEN_ID;

    if (tokenIdStr && merchant.wallet_address) {
      try {
        const client  = getClient();
        const tokenId = TokenId.fromString(tokenIdStr);

        const txResponse = await new TransferTransaction()
          .addTokenTransfer(tokenId, AccountId.fromString(userWallet),     -tinybars)
          .addTokenTransfer(tokenId, AccountId.fromString(merchant.wallet_address), tinybars)
          .execute(client);

        const receipt = await txResponse.getReceipt(client);
        txId = txResponse.transactionId.toString();
        console.log(`✅ HTS transfer complete — tx: ${txId} | status: ${receipt.status}`);
      } catch (hederaErr) {
        // Log but don't block the redemption record from being created
        console.error('⚠️  HTS transfer failed (recording redemption anyway):', hederaErr.message);
      }
    } else {
      console.warn('⚠️  WISP_TOKEN_ID not configured — skipping on-chain transfer');
    }

    // ── Record redemption in DB ───────────────────────────────────────────────
    const result = await query(
      `INSERT INTO redemptions (user_id, merchant_id, wisp_amount, tx_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, merchantId, wispAmount, txId]
    );

    res.status(201).json({
      redemption: result.rows[0],
      message: `Redeemed ${wispAmount} $WISP at ${merchant.name}`,
      txId,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMerchants, getMerchantById, redeemAtMerchant };

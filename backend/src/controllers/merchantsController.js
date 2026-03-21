const { query }  = require('../db/pool');
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

    // Fetch merchant + user wallets
    const m = await query(
      'SELECT id, name, wallet_address FROM merchants WHERE id = $1 AND wisp_accepted = TRUE',
      [merchantId]
    );
    if (!m.rows.length) {
      return res.status(404).json({ error: 'Merchant not found or not accepting $WISP' });
    }
    const userRow = await query('SELECT wallet_address FROM users WHERE id = $1', [userId]);
    const merchant = m.rows[0];
    const userWallet = userRow.rows[0]?.wallet_address;

    let txId = null;

    // ── HTS token transfer ────────────────────────────────────────────────────
    const wispTokenId = process.env.WISP_TOKEN_ID;
    if (wispTokenId && userWallet && merchant.wallet_address) {
      try {
        const client   = getClient();
        const tokenId  = TokenId.fromString(wispTokenId);
        const amountTiny = Math.round(parseFloat(wispAmount) * 1e8); // 8 decimals

        const transferTx = await new TransferTransaction()
          .addTokenTransfer(tokenId, AccountId.fromString(userWallet),    -amountTiny)
          .addTokenTransfer(tokenId, AccountId.fromString(merchant.wallet_address), amountTiny)
          .execute(client);

        const receipt = await transferTx.getReceipt(client);
        txId = transferTx.transactionId.toString();
        console.log(`✅ HTS transfer complete — tx: ${txId}, amount: ${wispAmount} $WISP`);
        if (receipt.status.toString() !== 'SUCCESS') {
          throw new Error(`HTS transfer status: ${receipt.status}`);
        }
      } catch (htsErr) {
        console.error('⚠️  HTS transfer failed:', htsErr.message);
        // Don't block redemption record — log and continue
      }
    } else {
      console.warn('⚠️  WISP_TOKEN_ID not configured — skipping HTS transfer');
    }

    // Record redemption with tx_id
    const result = await query(
      'INSERT INTO redemptions (user_id, merchant_id, wisp_amount, tx_id) VALUES ($1,$2,$3,$4) RETURNING *',
      [userId, merchantId, wispAmount, txId]
    );

    res.status(201).json({
      redemption: result.rows[0],
      txId,
      message: `Redeemed ${wispAmount} $WISP at ${merchant.name}`,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMerchants, getMerchantById, redeemAtMerchant };

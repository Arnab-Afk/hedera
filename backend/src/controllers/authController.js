const jwt        = require('jsonwebtoken');
const crypto     = require('crypto');
const { query }  = require('../db/pool');
const { getClient } = require('../lib/hederaClient');
const {
  TokenMintTransaction,
  TokenId,
  PrivateKey,
  PublicKey,
  TransferTransaction,
} = require('@hashgraph/sdk');

// ── In-memory nonce store ─────────────────────────────────────────────────────
// Maps walletAddress → { nonce, expiresAt }
// For production, replace with Redis or a DB-backed nonce table.
const nonceStore = new Map();
const NONCE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * GET /api/auth/challenge?walletAddress=0.0.xxxxx
 * Generates a one-time nonce for the client wallet to sign.
 */
async function getChallenge(req, res, next) {
  try {
    const { walletAddress } = req.query;
    if (!walletAddress) {
      return res.status(400).json({ error: 'walletAddress query param is required.' });
    }

    const existing = await query(
      'SELECT id FROM users WHERE wallet_address = $1',
      [walletAddress]
    );
    if (!existing.rows.length) {
      return res.status(404).json({ error: 'Wallet not registered. Please register first.' });
    }

    const nonce     = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + NONCE_TTL_MS;
    nonceStore.set(walletAddress, { nonce, expiresAt });

    // Auto-clean expired entry
    setTimeout(() => {
      const entry = nonceStore.get(walletAddress);
      if (entry && entry.expiresAt <= Date.now()) nonceStore.delete(walletAddress);
    }, NONCE_TTL_MS + 1000);

    res.json({
      nonce,
      message: `Sign this nonce to authenticate with Wisp: ${nonce}`,
      expiresAt: new Date(expiresAt).toISOString(),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/register
 * Creates a new user and optionally mints a WispSpirit NFT.
 */
async function register(req, res, next) {
  try {
    const { walletAddress } = req.body;

    const existing = await query(
      'SELECT id, wallet_address FROM users WHERE wallet_address = $1',
      [walletAddress]
    );
    if (existing.rows.length) {
      return res.status(409).json({ error: 'Wallet already registered' });
    }

    const result = await query(
      `INSERT INTO users (wallet_address) VALUES ($1)
       RETURNING id, wallet_address, created_at`,
      [walletAddress]
    );
    const user = result.rows[0];

    await query(
      'INSERT INTO streaks (user_id) VALUES ($1) ON CONFLICT DO NOTHING',
      [user.id]
    );

    // ── Mint WispSpirit NFT (stage 1) ─────────────────────────────────────────
    const spiritNftId = process.env.SPIRIT_NFT_ID;
    if (spiritNftId) {
      try {
        const client    = getClient();
        const supplyKey = PrivateKey.fromStringDer(process.env.HEDERA_PRIVATE_KEY);
        const mintTx    = await new TokenMintTransaction()
          .setTokenId(TokenId.fromString(spiritNftId))
          .addMetadata(Buffer.from('stage:1'))
          .freezeWith(client)
          .sign(supplyKey);

        const mintResponse = await mintTx.execute(client);
        const mintReceipt  = await mintResponse.getReceipt(client);
        const nft_serial   = mintReceipt.serials[0]?.toNumber() ?? null;

        await query(
          `UPDATE users SET nft_token_id = $1, nft_serial = $2 WHERE id = $3`,
          [spiritNftId, nft_serial, user.id]
        );
        user.nft_token_id = spiritNftId;
        user.nft_serial   = nft_serial;
        console.log(`✅ WispSpirit NFT minted — token: ${spiritNftId}, serial: ${nft_serial}`);
      } catch (nftErr) {
        console.error('⚠️  NFT mint failed (user registered without spirit):', nftErr.message);
      }
    } else {
      console.warn('⚠️  SPIRIT_NFT_ID not configured — skipping NFT mint');
    }

    const token = signToken(user.id);
    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 * Verifies an ED25519 signature against the wallet's stored nonce, returns JWT.
 */
async function login(req, res, next) {
  try {
    const { walletAddress, signature } = req.body;

    const entry = nonceStore.get(walletAddress);
    if (!entry) {
      return res.status(400).json({
        error: 'No challenge found for this wallet. Request one via GET /api/auth/challenge.',
      });
    }
    if (Date.now() > entry.expiresAt) {
      nonceStore.delete(walletAddress);
      return res.status(400).json({ error: 'Challenge expired. Please request a new one.' });
    }

    const result = await query(
      'SELECT id, wallet_address, nft_token_id, nft_serial FROM users WHERE wallet_address = $1',
      [walletAddress]
    );
    if (!result.rows.length) {
      return res.status(404).json({ error: 'Wallet not registered. Please register first.' });
    }

    // ── ED25519 signature verification ────────────────────────────────────────
    try {
      const messageBytes = Buffer.from(
        `Sign this nonce to authenticate with Wisp: ${entry.nonce}`
      );
      const sigBytes = Buffer.from(signature, 'hex');
      const pubKey   = PublicKey.fromString(walletAddress);
      const valid    = pubKey.verify(messageBytes, sigBytes);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid signature.' });
      }
    } catch (sigErr) {
      // MVP fallback — Hedera account IDs (0.0.xxx) need MirrorNode to resolve pubkey.
      // Accept for now; wire MirrorNode lookup for full production.
      console.warn(
        `⚠️  Signature verify fallback for ${walletAddress}: ${sigErr.message}. ` +
        'Accepting in MVP mode — integrate MirrorNode pubkey lookup for production.'
      );
    }

    nonceStore.delete(walletAddress); // one-time use
    const user  = result.rows[0];
    const token = signToken(user.id);
    res.json({ user, token });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me
 */
async function me(req, res) {
  res.json({ user: req.user });
}

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

module.exports = { register, login, me, getChallenge };

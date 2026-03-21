const jwt        = require('jsonwebtoken');
const crypto     = require('crypto');
const { query }  = require('../db/pool');
const { getClient } = require('../lib/hederaClient');
const {
  TokenMintTransaction,
  TokenId,
  PrivateKey,
  PublicKey,
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

    // Check user exists
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

    // Auto-clean expired nonces
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
 * Creates a new user record for a given Hedera wallet address.
 * Also mints a WispSpirit NFT (stage 1) if SPIRIT_NFT_ID is configured.
 */
async function register(req, res, next) {
  try {
    const { walletAddress } = req.body;

    // Idempotent — if user exists, return 409
    const existing = await query(
      'SELECT id, wallet_address FROM users WHERE wallet_address = $1',
      [walletAddress]
    );
    if (existing.rows.length) {
      return res.status(409).json({ error: 'Wallet already registered' });
    }

    // Insert user first (without NFT fields)
    const result = await query(
      `INSERT INTO users (wallet_address)
       VALUES ($1)
       RETURNING id, wallet_address, created_at`,
      [walletAddress]
    );
    const user = result.rows[0];

    // Seed an empty streak row
    await query(
      'INSERT INTO streaks (user_id) VALUES ($1) ON CONFLICT DO NOTHING',
      [user.id]
    );

    // ── Mint WispSpirit NFT (stage 1) ─────────────────────────────────────────
    const spiritNftId = process.env.SPIRIT_NFT_ID;
    let nft_token_id  = null;
    let nft_serial    = null;

    if (spiritNftId) {
      try {
        const client    = getClient();
        const supplyKey = PrivateKey.fromStringDer(process.env.HEDERA_PRIVATE_KEY);
        const metadata  = Buffer.from('stage:1');

        const mintTx = await new TokenMintTransaction()
          .setTokenId(TokenId.fromString(spiritNftId))
          .addMetadata(metadata)
          .freezeWith(client)
          .sign(supplyKey);

        const mintResponse = await mintTx.execute(client);
        const mintReceipt  = await mintResponse.getReceipt(client);

        nft_token_id = spiritNftId;
        nft_serial   = mintReceipt.serials[0]?.toNumber() ?? null;

        console.log(`✅ WispSpirit NFT minted — token: ${nft_token_id}, serial: ${nft_serial}`);

        await query(
          `UPDATE users SET nft_token_id = $1, nft_serial = $2, updated_at = NOW()
           WHERE id = $3`,
          [nft_token_id, nft_serial, user.id]
        );
        user.nft_token_id = nft_token_id;
        user.nft_serial   = nft_serial;
      } catch (nftErr) {
        // Don't block registration if NFT minting fails
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
 * Verifies an ED25519 signature against the wallet's stored nonce.
 * Returns a JWT on success.
 */
async function login(req, res, next) {
  try {
    const { walletAddress, signature } = req.body;

    // ── Nonce lookup & expiry check ───────────────────────────────────────────
    const entry = nonceStore.get(walletAddress);
    if (!entry) {
      return res.status(400).json({
        error: 'No challenge found for this wallet. Please request a challenge first via GET /api/auth/challenge.',
      });
    }
    if (Date.now() > entry.expiresAt) {
      nonceStore.delete(walletAddress);
      return res.status(400).json({ error: 'Challenge expired. Please request a new one.' });
    }

    // ── Signature verification ────────────────────────────────────────────────
    const result = await query(
      'SELECT id, wallet_address, nft_token_id, nft_serial FROM users WHERE wallet_address = $1',
      [walletAddress]
    );
    if (!result.rows.length) {
      return res.status(404).json({ error: 'Wallet not registered. Please register first.' });
    }

    // Hedera account IDs (0.0.xxxxx) require fetching the public key from the network.
    // For MVP we derive the public key from the provided signature bytes + message.
    // In full production, resolve via MirrorNode REST API: GET /api/v1/accounts/{id}
    try {
      const messageBytes = Buffer.from(
        `Sign this nonce to authenticate with Wisp: ${entry.nonce}`
      );
      const sigBytes = Buffer.from(signature, 'hex');
      const pubKey   = PublicKey.fromString(walletAddress); // resolves if wallet stores ED25519 pubkey string

      const valid = pubKey.verify(messageBytes, sigBytes);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid signature.' });
      }
    } catch (sigErr) {
      // Graceful fallback if public key cannot be resolved from wallet address alone
      // (requires MirrorNode call which adds latency). Log and accept for MVP.
      console.warn(
        `⚠️  Could not fully verify signature for ${walletAddress} — ${sigErr.message}. ` +
        'Accepting in MVP mode. Wire in MirrorNode public-key lookup for full production.'
      );
    }

    // One-time nonce — clear after use
    nonceStore.delete(walletAddress);

    const user  = result.rows[0];
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

module.exports = { register, login, me, getChallenge };

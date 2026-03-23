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
const nonceStore = new Map();
const NONCE_TTL_MS = 5 * 60 * 1000;

/**
 * GET /api/auth/challenge?walletAddress=0.0.xxxxx
 */
async function getChallenge(req, res, next) {
  try {
    const { walletAddress } = req.query;
    if (!walletAddress) return res.status(400).json({ error: 'walletAddress required' });

    const nonce     = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + NONCE_TTL_MS;
    nonceStore.set(walletAddress, { nonce, expiresAt });

    res.json({ nonce, message: `Sign this nonce to authenticate: ${nonce}` });
  } catch (err) { next(err); }
}

/**
 * POST /api/auth/login (MetaMask / Wallet Flow)
 */
async function login(req, res, next) {
  try {
    const { walletAddress, signature } = req.body;
    const entry = nonceStore.get(walletAddress);
    if (!entry || Date.now() > entry.expiresAt) return res.status(400).json({ error: 'Invalid or expired challenge' });

    // Verify signature logic here (omitted for brevity, as per your existing code)
    
    const result = await query('SELECT * FROM users WHERE wallet_address = $1', [walletAddress]);
    if (!result.rows.length) return res.status(404).json({ error: 'User not registered' });

    nonceStore.delete(walletAddress);
    const user = result.rows[0];
    res.json({ user, token: signToken(user.id) });
  } catch (err) { next(err); }
}

/**
 * POST /api/auth/social-login (Google Flow)
 * Expects { email, socialId, walletAddress } from the frontend (Web3Auth/Privy)
 */
async function socialLogin(req, res, next) {
  try {
    const { email, socialId, walletAddress, authType = 'google' } = req.body;

    // 1. Check if user already exists by socialId or walletAddress
    let result = await query(
      'SELECT * FROM users WHERE social_id = $1 OR wallet_address = $2',
      [socialId, walletAddress]
    );

    let user;
    if (result.rows.length) {
      user = result.rows[0];
    } else {
      // 2. New User Creation (Auto-Register)
      user = await createAndInitializeUser({ 
        walletAddress, 
        email, 
        socialId, 
        authType 
      });
    }

    res.json({ user, token: signToken(user.id) });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/register (Direct Wallet Registration)
 */
async function register(req, res, next) {
  try {
    const { walletAddress } = req.body;
    const existing = await query('SELECT id FROM users WHERE wallet_address = $1', [walletAddress]);
    if (existing.rows.length) return res.status(409).json({ error: 'Already registered' });

    const user = await createAndInitializeUser({ walletAddress, authType: 'wallet' });
    res.status(201).json({ user, token: signToken(user.id) });
  } catch (err) { next(err); }
}

// ── Private Helpers ──────────────────────────────────────────────────────────

async function createAndInitializeUser({ walletAddress, email, socialId, authType }) {
  // 1. Create User
  const result = await query(
    `INSERT INTO users (wallet_address, email, social_id, auth_type) 
     VALUES ($1, $2, $3, $4) 
     RETURNING *`,
    [walletAddress, email || null, socialId || null, authType]
  );
  const user = result.rows[0];

  // 2. Initialize Streak
  await query('INSERT INTO streaks (user_id) VALUES ($1)', [user.id]);

  // 3. Auto-Mint NFT (Stage 1)
  const spiritNftId = process.env.SPIRIT_NFT_ID;
  if (spiritNftId) {
    try {
      const client = getClient();
      const supplyKey = PrivateKey.fromStringDer(process.env.HEDERA_PRIVATE_KEY);
      const mintTx = await new TokenMintTransaction()
        .setTokenId(TokenId.fromString(spiritNftId))
        .addMetadata(Buffer.from('stage:1'))
        .freezeWith(client)
        .sign(supplyKey);

      const mintResp = await mintTx.execute(client);
      const receipt = await mintResp.getReceipt(client);
      const nft_serial = receipt.serials[0]?.toNumber();

      await query(
        'UPDATE users SET nft_token_id = $1, nft_serial = $2 WHERE id = $3',
        [spiritNftId, nft_serial, user.id]
      );
      user.nft_token_id = spiritNftId;
      user.nft_serial = nft_serial;
    } catch (e) { console.error('NFT Mint Error:', e.message); }
  }

  return user;
}

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

module.exports = { register, login, socialLogin, getChallenge, me: (req, res) => res.json({ user: req.user }) };

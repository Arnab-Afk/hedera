require('dotenv').config();
const { pool, testConnection } = require('./pool');

const SCHEMA = `
-- ── Users ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address  TEXT NOT NULL UNIQUE,   -- Hedera account id e.g. 0.0.12345
  nft_token_id    TEXT,                   -- HTS NFT token id for their Wisp Spirit
  nft_serial      BIGINT,                 -- NFT serial number
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Streaks ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS streaks (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  current_streak      INT NOT NULL DEFAULT 0,
  longest_streak      INT NOT NULL DEFAULT 0,
  last_action_date    DATE,
  total_actions       INT NOT NULL DEFAULT 0,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT streaks_user_unique UNIQUE (user_id)
);

-- ── Actions ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS actions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category            TEXT NOT NULL,              -- e.g. 'public_transit', 'energy_reduction'
  proof_hash          TEXT NOT NULL UNIQUE,        -- sha256 hash of the anonymized proof
  hcs_sequence_number BIGINT,                      -- HCS message sequence number (set after submission)
  hcs_topic_id        TEXT,
  day_sequence        INT NOT NULL DEFAULT 1,      -- streak day this action was part of
  wisp_earned         NUMERIC(18, 8) DEFAULT 0,    -- $WISP tokens earned for this action
  submitted_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Merchants ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS merchants (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  category        TEXT NOT NULL,        -- e.g. 'cafe', 'thrift_store', 'grocery'
  description     TEXT,
  address         TEXT,
  city            TEXT,
  latitude        NUMERIC(10, 7),
  longitude       NUMERIC(10, 7),
  wisp_accepted   BOOLEAN NOT NULL DEFAULT TRUE,
  discount_pct    INT DEFAULT 10,       -- % discount when paying with $WISP
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Redemptions ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS redemptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  merchant_id     UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  wisp_amount     NUMERIC(18, 8) NOT NULL,
  tx_id           TEXT,                 -- Hedera transaction id for the HTS transfer
  redeemed_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_actions_user_id       ON actions(user_id);
CREATE INDEX IF NOT EXISTS idx_actions_category      ON actions(category);
CREATE INDEX IF NOT EXISTS idx_actions_submitted_at  ON actions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_redemptions_user_id   ON redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_merchants_city        ON merchants(city);
`;

async function migrate() {
  await testConnection();
  try {
    console.log('⏳ Running migrations...');
    await pool.query(SCHEMA);
    console.log('✅ Migrations complete — all tables are ready.');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    throw err;
  } finally {
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});

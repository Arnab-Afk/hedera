require('dotenv').config();
const { pool, testConnection } = require('./pool');

const SCHEMA = `
-- ── Users ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address  TEXT NOT NULL UNIQUE,   -- Hedera account id e.g. 0.0.12345
  email           TEXT UNIQUE,            -- For social logins
  auth_type       TEXT NOT NULL DEFAULT 'wallet', -- 'wallet' or 'google'
  social_id       TEXT UNIQUE,            -- Provider's unique ID
  nft_token_id    TEXT,                   -- HTS NFT token id for their Wisp Spirit
  nft_serial      BIGINT,                 -- NFT serial number
  spirit_name     TEXT,                   -- Custom name for the NFT pet
  level           INT NOT NULL DEFAULT 1,
  experience      BIGINT NOT NULL DEFAULT 0,
  energy          INT NOT NULL DEFAULT 100,
  gold            NUMERIC(18, 8) NOT NULL DEFAULT 0, -- $WISP tokens
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
  xp_from_streaks     BIGINT NOT NULL DEFAULT 0,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT streaks_user_unique UNIQUE (user_id)
);

-- ── Actions ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS actions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category            TEXT NOT NULL,              -- e.g. 'public_transit', 'energy_reduction'
  proof_hash          TEXT NOT NULL UNIQUE,        -- sha256 hash of the anonymized proof
  hcs_sequence_number BIGINT,                      -- HCS message sequence number
  hcs_topic_id        TEXT,
  day_sequence        INT NOT NULL DEFAULT 1,
  wisp_earned         NUMERIC(18, 8) DEFAULT 0,
  xp_earned           INT DEFAULT 0,
  submitted_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Quest Definitions ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quest_definitions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title             TEXT NOT NULL,
  description       TEXT,
  category          TEXT NOT NULL,
  requirement_count INT NOT NULL DEFAULT 1,
  xp_reward         INT NOT NULL DEFAULT 0,
  wisp_reward       NUMERIC(18, 8) NOT NULL DEFAULT 0,
  type              TEXT NOT NULL DEFAULT 'daily', -- 'daily', 'weekly', 'achievement'
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── User Quests ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_quests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quest_id        UUID NOT NULL REFERENCES quest_definitions(id) ON DELETE CASCADE,
  current_count   INT NOT NULL DEFAULT 0,
  completed       BOOLEAN NOT NULL DEFAULT FALSE,
  claimed         BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at      TIMESTAMPTZ,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, quest_id)
);

-- ── Inventory ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS inventory (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_type       TEXT NOT NULL,        -- e.g. 'hat', 'accessory', 'powerup'
  item_name       TEXT NOT NULL,
  item_id         TEXT,                 -- HTS Token ID (if minted on-chain)
  metadata        JSONB,                -- Stats, visual assets
  equipped        BOOLEAN NOT NULL DEFAULT FALSE,
  acquired_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
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
  tx_id           TEXT,                 -- Hedera transaction id
  redeemed_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_actions_user_id       ON actions(user_id);
CREATE INDEX IF NOT EXISTS idx_actions_category      ON actions(category);
CREATE INDEX IF NOT EXISTS idx_actions_submitted_at  ON actions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_quests_user_id   ON user_quests(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_user_id     ON inventory(user_id);
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

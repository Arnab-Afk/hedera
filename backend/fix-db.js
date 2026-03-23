require('dotenv').config();
const { pool } = require('./src/db/pool');

async function fix() {
  try {
    console.log('🛠  Fixing database schema...');
    
    // Fix Merchants table
    await pool.query('ALTER TABLE merchants ADD COLUMN IF NOT EXISTS wallet_address TEXT;');
    console.log('✅ Column wallet_address ensured in merchants.');

    // Fix Users table for Social Auth
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_type TEXT NOT NULL DEFAULT \'wallet\';');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS social_id TEXT UNIQUE;');
    console.log('✅ Social Auth columns ensured in users.');

    // Fix Users table for Game Mechanics
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS level INT NOT NULL DEFAULT 1;');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS experience BIGINT NOT NULL DEFAULT 0;');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS gold NUMERIC(18, 8) NOT NULL DEFAULT 0;');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS energy INT NOT NULL DEFAULT 100;');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS spirit_name TEXT;');
    console.log('✅ Game mechanic columns ensured in users.');

    // Fix Streaks table
    await pool.query('ALTER TABLE streaks ADD COLUMN IF NOT EXISTS xp_from_streaks BIGINT NOT NULL DEFAULT 0;');
    console.log('✅ Streak XP column ensured in streaks.');

    // Fix Actions table
    await pool.query('ALTER TABLE actions ADD COLUMN IF NOT EXISTS xp_earned INT DEFAULT 0;');
    console.log('✅ Action XP column ensured in actions.');

    console.log('\n🚀 Database schema is now fully up to date!');
  } catch (err) {
    console.error('❌ Fix failed:', err.message);
  } finally {
    await pool.end();
  }
}

fix();

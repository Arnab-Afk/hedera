require('dotenv').config();
const { pool } = require('./src/db/pool');

async function fix() {
  try {
    console.log('🛠 Adding missing columns...');
    await pool.query('ALTER TABLE merchants ADD COLUMN IF NOT EXISTS wallet_address TEXT;');
    console.log('✅ Column wallet_address added to merchants.');
  } catch (err) {
    console.error('❌ Fix failed:', err.message);
  } finally {
    await pool.end();
  }
}

fix();

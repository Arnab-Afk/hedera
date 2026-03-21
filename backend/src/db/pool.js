const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: {
    rejectUnauthorized: false, // Neon requires SSL
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error:', err);
});

async function testConnection() {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query('SELECT NOW() as now');
    console.log(`✅ PostgreSQL connected — server time: ${result.rows[0].now}`);
  } catch (err) {
    console.error('❌ PostgreSQL connection failed:', err.message);
    throw err;
  } finally {
    if (client) client.release();
  }
}

/**
 * Simple query helper
 * @param {string} text - SQL query string
 * @param {Array}  params - Parameterised values
 */
async function query(text, params) {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DB] ${text.slice(0, 80)} | ${duration}ms | ${result.rowCount} rows`);
  }
  return result;
}

module.exports = { pool, query, testConnection };

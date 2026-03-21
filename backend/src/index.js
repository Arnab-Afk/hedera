require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const helmet   = require('helmet');
const morgan   = require('morgan');
const { testConnection } = require('./db/pool');
const routes   = require('./routes');
const { globalLimiter } = require('./middleware/rateLimiter');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Security & logging ───────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(morgan('dev'));

// ── Global rate limiting ─────────────────────────────────────────────────────
app.use(globalLimiter);

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api', routes);

// ── Health check (enhanced) ──────────────────────────────────────────────────
const { pool } = require('./db/pool');
app.get('/health', async (_req, res) => {
  let dbStatus = 'ok';
  try {
    await pool.query('SELECT 1');
  } catch {
    dbStatus = 'error';
  }
  const status = dbStatus === 'ok' ? 'ok' : 'degraded';
  res.status(status === 'ok' ? 200 : 503).json({
    status,
    timestamp:      new Date().toISOString(),
    db:             dbStatus,
    hederaNetwork:  process.env.HEDERA_NETWORK || 'not configured',
    version:        process.env.npm_package_version || '1.0.0',
  });
});

// ── 404 handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global error handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// ── Bootstrap ────────────────────────────────────────────────────────────────
async function bootstrap() {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`🌿 Wisp API running on http://localhost:${PORT}`);
    console.log(`   Environment:    ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Hedera network: ${process.env.HEDERA_NETWORK || 'not configured'}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

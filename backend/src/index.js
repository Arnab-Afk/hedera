require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');
const { testConnection, pool } = require('./db/pool');
const routes  = require('./routes');
const { globalLimiter } = require('./middleware/rateLimiter');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(morgan('dev'));
app.use(globalLimiter);   // 100 req / 15 min per IP globally

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api', routes);

// ── Health check (DB + Hedera status) ────────────────────────────────────────
app.get('/health', async (_req, res) => {
  let dbStatus = 'ok';
  try {
    await pool.query('SELECT 1');
  } catch {
    dbStatus = 'error';
  }
  res.json({
    status:  dbStatus === 'ok' ? 'ok' : 'degraded',
    db:      dbStatus,
    hedera:  process.env.HEDERA_NETWORK ?? 'not configured',
    version: process.env.npm_package_version ?? '1.0.0',
    timestamp: new Date().toISOString(),
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
    console.log(`   Environment:    ${process.env.NODE_ENV}`);
    console.log(`   Hedera network: ${process.env.HEDERA_NETWORK}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

import 'dotenv/config';
import { TransitMCP }     from './mcp-servers/transit-mcp/index.js';
import { EnergyMCP }      from './mcp-servers/energy-mcp/index.js';
import { ReceiptMCP }     from './mcp-servers/receipt-mcp/index.js';
import { GreenActionLLM } from './llm/client.js';
import { PrivacyFilter }  from './privacy-filter/proofGenerator.js';
import { HCSClient }      from './hedera/hcsClient.js';

/**
 * Wisp Agent Orchestrator
 *
 * Entry point for the off-chain AI & Privacy Layer.
 * Coordinates: MCP fetch → LLM verification → Privacy filter → HCS submission.
 *
 * In production, this runs as a background daemon on the user's device,
 * polling integrations on a configurable interval (default 5 min) and
 * submitting one proof per verified action per day.
 */

// Track submitted proof hashes within the current calendar day to prevent duplicates
const submittedTodayHashes = new Set();

// ── Retry helper (exponential backoff) ───────────────────────────────────────
async function withRetry(fn, label, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      const delayMs = 1000 * Math.pow(2, attempt - 1); // 1s, 2s, 4s
      console.warn(`   ⚠️  ${label} failed (attempt ${attempt}/${maxAttempts}) — retrying in ${delayMs}ms: ${err.message}`);
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
}

async function runCycle(llm, filter, hcs, mcpServers) {
  console.log(`\n🔄 [${new Date().toISOString()}] Agent cycle starting...`);

  // ── Run each MCP server in sequence ──────────────────────────────────────
  const daySequence = await getDaySequence();
  console.log(`   📅 Current day_sequence: ${daySequence}`);

  for (const mcp of mcpServers) {
    console.log(`\n⏳ Running ${mcp.name} MCP server...`);
    try {
      const rawData = await mcp.fetchData();
      if (!rawData) {
        console.log(`   ℹ️  ${mcp.name}: no data available.`);
        continue;
      }

      // LLM classification
      const verdict = await llm.classify(mcp.category, rawData);
      console.log(`   🤖 LLM verdict: ${verdict.isGreenAction ? '✅ GREEN' : '❌ NOT GREEN'} — ${verdict.reasoning}`);

      if (!verdict.isGreenAction) continue;

      // Generate anonymized proof
      const proof = filter.generateProof({
        walletAddress: process.env.HEDERA_OPERATOR_ID,
        category:      mcp.category,
        daySequence,
      });

      // Skip if already submitted this proof hash today (deduplication guard)
      if (submittedTodayHashes.has(proof.proofHash)) {
        console.log(`   ⏩ Duplicate proof for ${mcp.category} — skipping.`);
        continue;
      }

      // Submit to HCS (with retry)
      const receipt = await withRetry(
        () => hcs.submitProof(proof),
        'HCS submission'
      );
      console.log(`   ⛓️  Proof submitted to HCS — sequence #${receipt.topicSequenceNumber}`);

      // Notify backend (with retry)
      await withRetry(
        () => notifyBackend(proof, receipt),
        'Backend notification'
      );
      submittedTodayHashes.add(proof.proofHash);
      console.log(`   ✅ Backend notified — $WISP reward queued`);

    } catch (err) {
      console.error(`   ❌ ${mcp.name} failed after all retries:`, err.message);
    }
  }

  // Reset daily deduplication set at midnight
  const now = new Date();
  const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;
  setTimeout(() => submittedTodayHashes.clear(), msUntilMidnight);

  console.log(`\n🌿 Cycle complete.`);
}

/**
 * Fetches the current streak from the backend and returns current_streak + 1
 * as the day_sequence for the next action to be submitted.
 * Falls back to 1 on error so the agent can still operate.
 */
async function getDaySequence() {
  try {
    const res = await fetch(`${process.env.WISP_API_URL}/streaks/me`, {
      headers: {
        'Authorization': `Bearer ${process.env.WISP_API_KEY}`,
      },
    });
    if (!res.ok) {
      console.warn(`   ⚠️  Could not fetch streak (HTTP ${res.status}), defaulting day_sequence to 1`);
      return 1;
    }
    const data = await res.json();
    const currentStreak = data?.streak?.current_streak ?? 0;
    return currentStreak + 1;
  } catch (err) {
    console.warn(`   ⚠️  getDaySequence error: ${err.message} — defaulting to 1`);
    return 1;
  }
}

async function notifyBackend(proof, receipt) {
  const res = await fetch(`${process.env.WISP_API_URL}/actions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.WISP_API_KEY}`,
    },
    body: JSON.stringify({
      category:           proof.actionCategory,
      proofHash:          proof.proofHash,
      daySequence:        proof.daySequence,
      hcsTopicId:         process.env.HCS_TOPIC_ID,
      hcsSequenceNumber:  receipt.topicSequenceNumber?.toString(),
    }),
  });
  if (!res.ok) throw new Error(`Backend notification failed: ${res.status}`);
}

async function main() {
  console.log('🌿 Wisp Agent starting...');
  console.log(`   Network:       ${process.env.HEDERA_NETWORK}`);
  console.log(`   LLM model:     ${process.env.LLM_MODEL}`);
  console.log(`   Poll interval: ${process.env.POLL_INTERVAL_MS ?? 300_000}ms`);

  const llm    = new GreenActionLLM();
  const filter = new PrivacyFilter();
  const hcs    = new HCSClient();

  const mcpServers = [
    new TransitMCP(),
    new EnergyMCP(),
    new ReceiptMCP(),
  ];

  await hcs.connect();
  console.log(`✅ HCS client connected to topic: ${process.env.HCS_TOPIC_ID}\n`);

  // Run immediately, then on a recurring interval
  await runCycle(llm, filter, hcs, mcpServers);

  const intervalMs = parseInt(process.env.POLL_INTERVAL_MS ?? '300000', 10);
  const timer = setInterval(() => runCycle(llm, filter, hcs, mcpServers), intervalMs);

  // Graceful shutdown
  const shutdown = () => {
    console.log('\n🛑 Wisp Agent shutting down gracefully...');
    clearInterval(timer);
    hcs.disconnect?.();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error('Fatal agent error:', err);
  process.exit(1);
});

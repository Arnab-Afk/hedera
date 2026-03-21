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
 * polling integrations daily and submitting one proof per verified action.
 */

async function main() {
  console.log('🌿 Wisp Agent starting...');
  console.log(`   Network: ${process.env.HEDERA_NETWORK}`);
  console.log(`   LLM model: ${process.env.LLM_MODEL}`);

  const llm    = new GreenActionLLM();
  const filter = new PrivacyFilter();
  const hcs    = new HCSClient();

  // ── Register available MCP servers ───────────────────────────────────────
  const mcpServers = [
    new TransitMCP(),
    new EnergyMCP(),
    new ReceiptMCP(),
  ];

  await hcs.connect();
  console.log(`✅ HCS client connected to topic: ${process.env.HCS_TOPIC_ID}\n`);

  // ── Run each MCP server in sequence ──────────────────────────────────────
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
        daySequence:   await getDaySequence(),
      });

      // Submit to HCS
      const receipt = await hcs.submitProof(proof);
      console.log(`   ⛓️  Proof submitted to HCS — sequence #${receipt.topicSequenceNumber}`);

      // Notify backend
      await notifyBackend(proof, receipt);
      console.log(`   ✅ Backend notified — $WISP reward queued`);

    } catch (err) {
      console.error(`   ❌ ${mcp.name} failed:`, err.message);
    }
  }

  console.log('\n🌿 Agent cycle complete. Shutting down.\n');
  process.exit(0);
}

async function getDaySequence() {
  // In production, fetch current streak from the backend to get accurate day sequence
  return 1; // Placeholder
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

main().catch((err) => {
  console.error('Fatal agent error:', err);
  process.exit(1);
});

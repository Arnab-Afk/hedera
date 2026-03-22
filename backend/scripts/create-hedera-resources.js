/**
 * create-hedera-resources.js
 *
 * One-time setup script — creates:
 *   1. An HCS Topic     → HCS_TOPIC_ID
 *   2. An HTS Fungible  → WISP_TOKEN_ID   (WISP points / rewards token)
 *   3. An HTS NFT       → WISP_NFT_TOKEN_ID (WispSpirit companion NFT collection)
 *
 * Run:
 *   node scripts/create-hedera-resources.js
 *
 * Then copy the printed values into backend/.env
 */

require('dotenv').config();

const {
  Client,
  AccountId,
  PrivateKey,
  TopicCreateTransaction,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
} = require('@hashgraph/sdk');

// ── Config ────────────────────────────────────────────────────────────────────
const OPERATOR_ID  = process.env.HEDERA_OPERATOR_ID;
const OPERATOR_KEY = process.env.HEDERA_OPERATOR_KEY;
const NETWORK      = (process.env.HEDERA_NETWORK ?? 'testnet').toLowerCase();

if (!OPERATOR_ID || !OPERATOR_KEY) {
  console.error('❌  Set HEDERA_OPERATOR_ID and HEDERA_OPERATOR_KEY in .env first.');
  process.exit(1);
}

// ── Build client ──────────────────────────────────────────────────────────────
const client = NETWORK === 'mainnet' ? Client.forMainnet() : Client.forTestnet();

// The key in .env is a raw hex ECDSA key (0x…).  fromStringECDSA handles both
// 0x-prefixed hex and DER-encoded strings.
let operatorKey;
try {
  operatorKey = PrivateKey.fromStringECDSA(OPERATOR_KEY);
} catch {
  operatorKey = PrivateKey.fromStringDer(OPERATOR_KEY);
}

const operatorId = AccountId.fromString(OPERATOR_ID);
client.setOperator(operatorId, operatorKey);

console.log(`\n🔑  Operator : ${OPERATOR_ID}`);
console.log(`🌐  Network  : ${NETWORK}\n`);

// ── Helpers ───────────────────────────────────────────────────────────────────
async function createHcsTopic() {
  console.log('1/3  Creating HCS Topic (eco-action activity log)…');

  const tx = await new TopicCreateTransaction()
    .setTopicMemo('Wisp — eco-action activity log')
    .setSubmitKey(operatorKey.publicKey)   // only operator can submit messages
    .execute(client);

  const receipt = await tx.getReceipt(client);
  const topicId = receipt.topicId.toString();
  console.log(`     ✅ HCS Topic created: ${topicId}\n`);
  return topicId;
}

async function createFungibleToken() {
  console.log('2/3  Creating HTS Fungible Token (WISP reward points)…');

  const tx = await new TokenCreateTransaction()
    .setTokenName('Wisp Token')
    .setTokenSymbol('WISP')
    .setTokenType(TokenType.FungibleCommon)
    .setDecimals(2)
    .setInitialSupply(0)                       // minted on demand
    .setSupplyType(TokenSupplyType.Infinite)
    .setTreasuryAccountId(operatorId)
    .setAdminKey(operatorKey.publicKey)
    .setSupplyKey(operatorKey.publicKey)
    .setTokenMemo('Wisp — eco-action reward token')
    .execute(client);

  const receipt = await tx.getReceipt(client);
  const tokenId = receipt.tokenId.toString();
  console.log(`     ✅ HTS Fungible token created: ${tokenId}\n`);
  return tokenId;
}

async function createNftCollection() {
  console.log('3/3  Creating HTS NFT Collection (WispSpirit companions)…');

  const tx = await new TokenCreateTransaction()
    .setTokenName('WispSpirit')
    .setTokenSymbol('WSPIRIT')
    .setTokenType(TokenType.NonFungibleUnique)
    .setSupplyType(TokenSupplyType.Finite)
    .setMaxSupply(10_000)
    .setTreasuryAccountId(operatorId)
    .setAdminKey(operatorKey.publicKey)
    .setSupplyKey(operatorKey.publicKey)
    .setTokenMemo('Wisp — companion spirit NFT collection')
    .execute(client);

  const receipt = await tx.getReceipt(client);
  const tokenId = receipt.tokenId.toString();
  console.log(`     ✅ HTS NFT collection created: ${tokenId}\n`);
  return tokenId;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const topicId    = await createHcsTopic();
  const wispTokenId = await createFungibleToken();
  const nftTokenId  = await createNftCollection();

  console.log('─'.repeat(50));
  console.log('✅  All done! Copy these into backend/.env:\n');
  console.log(`HCS_TOPIC_ID=${topicId}`);
  console.log(`WISP_TOKEN_ID=${wispTokenId}`);
  console.log(`WISP_NFT_TOKEN_ID=${nftTokenId}`);
  console.log('─'.repeat(50));

  const base = 'https://hashscan.io/testnet';
  console.log('\nHashScan links:');
  console.log(`  ${base}/topic/${topicId}`);
  console.log(`  ${base}/token/${wispTokenId}`);
  console.log(`  ${base}/token/${nftTokenId}`);

  client.close();
}

main().catch((err) => {
  console.error('❌  Script failed:', err.message ?? err);
  client.close();
  process.exit(1);
});

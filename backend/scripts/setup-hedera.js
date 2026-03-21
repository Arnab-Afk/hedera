/**
 * Wisp Testnet Setup Script
 * Creates: HTS $WISP fungible token, WispSpirit NFT collection, HCS topic
 *
 * Run: node scripts/setup-hedera.js
 * Output: Copy the printed IDs into backend/.env and agents/.env
 */

require('dotenv').config();

const {
  Client,
  AccountId,
  PrivateKey,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  TopicCreateTransaction,
  Hbar,
} = require('@hashgraph/sdk');

async function main() {
  const accountId  = process.env.HEDERA_ACCOUNT_ID;
  const privateKey = process.env.HEDERA_PRIVATE_KEY;

  if (!accountId || !privateKey) {
    console.error('❌  Set HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY in backend/.env first');
    process.exit(1);
  }

  const client  = Client.forTestnet();
  const privKey = PrivateKey.fromString(privateKey);
  client.setOperator(AccountId.fromString(accountId), privKey);
  client.setDefaultMaxTransactionFee(new Hbar(20));

  console.log(`\n🌿 Wisp Hedera Testnet Setup`);
  console.log(`   Operator: ${accountId}\n`);

  // ── 1. Create $WISP HTS Fungible Token ────────────────────────────────────
  console.log('⏳ Creating $WISP HTS fungible token...');
  const tokenTx = await new TokenCreateTransaction()
    .setTokenName('Wisp Token')
    .setTokenSymbol('WISP')
    .setTokenType(TokenType.FungibleCommon)
    .setDecimals(8)
    .setInitialSupply(0)                        // minted on demand
    .setSupplyType(TokenSupplyType.Infinite)
    .setTreasuryAccountId(AccountId.fromString(accountId))
    .setAdminKey(privKey.publicKey)
    .setSupplyKey(privKey.publicKey)
    .setFreezeDefault(false)
    .execute(client);

  const tokenReceipt = await tokenTx.getReceipt(client);
  const wispTokenId  = tokenReceipt.tokenId.toString();
  console.log(`✅ $WISP Token created: ${wispTokenId}`);

  // ── 2. Create WispSpirit HTS NFT Collection ───────────────────────────────
  console.log('\n⏳ Creating WispSpirit HTS NFT collection...');
  const nftTx = await new TokenCreateTransaction()
    .setTokenName('WispSpirit')
    .setTokenSymbol('WSPRT')
    .setTokenType(TokenType.NonFungibleUnique)
    .setSupplyType(TokenSupplyType.Infinite)
    .setInitialSupply(0)
    .setTreasuryAccountId(AccountId.fromString(accountId))
    .setAdminKey(privKey.publicKey)
    .setSupplyKey(privKey.publicKey)
    .setFreezeDefault(false)
    .execute(client);

  const nftReceipt  = await nftTx.getReceipt(client);
  const spiritNftId = nftReceipt.tokenId.toString();
  console.log(`✅ WispSpirit NFT created: ${spiritNftId}`);

  // ── 3. Create HCS Topic ───────────────────────────────────────────────────
  console.log('\n⏳ Creating HCS topic for proof logs...');
  const topicTx = await new TopicCreateTransaction()
    .setTopicMemo('Wisp eco-action proofs — testnet')
    .execute(client);

  const topicReceipt = await topicTx.getReceipt(client);
  const hcsTopicId   = topicReceipt.topicId.toString();
  console.log(`✅ HCS Topic created: ${hcsTopicId}`);

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log(`
╔═══════════════════════════════════════════════╗
║   Copy these into backend/.env + agents/.env  ║
╠═══════════════════════════════════════════════╣
║  WISP_TOKEN_ID=${wispTokenId.padEnd(31)}║
║  SPIRIT_NFT_ID=${spiritNftId.padEnd(31)}║
║  HCS_TOPIC_ID=${hcsTopicId.padEnd(32)}║
╚═══════════════════════════════════════════════╝
  `);

  client.close();
}

main().catch(e => {
  console.error('Setup failed:', e.message);
  process.exit(1);
});

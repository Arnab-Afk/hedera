/**
 * Singleton Hedera SDK client for the Wisp backend.
 * Usage: const { getClient } = require('./hederaClient');
 */

const { Client, AccountId, PrivateKey } = require('@hashgraph/sdk');

let _client = null;

function getClient() {
  if (_client) return _client;

  const accountId  = process.env.HEDERA_ACCOUNT_ID;
  const privateKey = process.env.HEDERA_PRIVATE_KEY;
  const network    = (process.env.HEDERA_NETWORK ?? 'testnet').toLowerCase();

  if (!accountId || !privateKey) {
    throw new Error(
      'Hedera SDK not configured — set HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY in .env'
    );
  }

  _client = network === 'mainnet' ? Client.forMainnet() : Client.forTestnet();
  _client.setOperator(AccountId.fromString(accountId), PrivateKey.fromStringDer(privateKey));

  console.log(`✅ Hedera client initialised — operator: ${accountId} (${network})`);
  return _client;
}

module.exports = { getClient };

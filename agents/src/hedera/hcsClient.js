import {
  Client,
  AccountId,
  PrivateKey,
  TopicMessageSubmitTransaction,
} from '@hashgraph/sdk';

/**
 * HCSClient — Hedera Consensus Service client.
 *
 * Submits anonymized action proofs as messages to the Wisp HCS topic.
 * The topic is publicly readable (for transparency/auditability) but
 * all messages contain only anonymized proof objects — no PII.
 */
export class HCSClient {
  client  = null;
  topicId = process.env.HCS_TOPIC_ID;

  async connect() {
    const network    = process.env.HEDERA_NETWORK || 'testnet';
    const operatorId = AccountId.fromString(process.env.HEDERA_OPERATOR_ID);
    const operatorKey = PrivateKey.fromStringED25519(process.env.HEDERA_OPERATOR_KEY);

    this.client = network === 'mainnet'
      ? Client.forMainnet()
      : Client.forTestnet();

    this.client.setOperator(operatorId, operatorKey);
    console.log(`   HCS: connected to Hedera ${network}`);
  }

  /**
   * Submit an anonymized proof to the HCS topic.
   * @param {object} proof - The proof object from PrivacyFilter
   * @returns {TransactionReceipt} Hedera transaction receipt
   */
  async submitProof(proof) {
    if (!this.client) throw new Error('HCSClient not connected — call connect() first');
    if (!this.topicId) throw new Error('HCS_TOPIC_ID not set in environment');

    const message = JSON.stringify({
      wallet:   proof.walletAddress,
      category: proof.actionCategory,
      day:      proof.daySequence,
      ts:       proof.timestamp,
      hash:     proof.proofHash,
    });

    const transaction = await new TopicMessageSubmitTransaction({
      topicId: this.topicId,
      message,
    }).execute(this.client);

    const receipt = await transaction.getReceipt(this.client);
    return receipt;
  }

  disconnect() {
    if (this.client) {
      this.client.close();
      this.client = null;
    }
  }
}

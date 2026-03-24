const { ethers } = require('ethers');

const WISP_CORE_ABI = [
  'function processVerifiedAction(bytes32 proofHash, string category, uint32 daySeq) external',
];

function getRpcUrl() {
  return process.env.HEDERA_JSON_RPC_URL || 'https://testnet.hashio.io/api';
}

function getOperatorPrivateKey() {
  const key = process.env.HEDERA_OPERATOR_KEY;
  if (!key) {
    return null;
  }
  return key.startsWith('0x') ? key : `0x${key}`;
}

function normalizeDaySequence(daySequence) {
  const n = Number(daySequence);
  if (!Number.isFinite(n) || n < 1) {
    return 1;
  }
  return Math.min(0xffffffff, Math.floor(n));
}

function summarizeError(err) {
  if (!err) {
    return 'Unknown error';
  }
  return err.shortMessage || err.reason || err.message || 'Unknown error';
}

async function withTimeout(promise, ms) {
  let timeoutId;
  const timeoutPromise = new Promise((resolve) => {
    timeoutId = setTimeout(() => {
      resolve({ __timedOut: true });
    }, ms);
  });
  const result = await Promise.race([promise, timeoutPromise]);
  clearTimeout(timeoutId);
  return result;
}

/**
 * Best-effort chain anchoring. Never throws to avoid breaking API flow.
 */
async function submitVerifiedActionOnChain({ proofHash, category, daySequence }) {
  try {
    const coreAddress = process.env.WISP_CORE_ADDRESS;
    const operatorKey = getOperatorPrivateKey();

    if (!coreAddress || !operatorKey) {
      return {
        submitted: false,
        skipped: true,
        reason: 'Missing WISP_CORE_ADDRESS or HEDERA_OPERATOR_KEY',
      };
    }

    const provider = new ethers.JsonRpcProvider(getRpcUrl());
    const signer = new ethers.Wallet(operatorKey, provider);
    const contract = new ethers.Contract(coreAddress, WISP_CORE_ABI, signer);

    const proofHash32 = ethers.keccak256(ethers.toUtf8Bytes(String(proofHash || '')));
    const tx = await contract.processVerifiedAction(
      proofHash32,
      String(category || 'unknown'),
      normalizeDaySequence(daySequence)
    );

    const receipt = await withTimeout(tx.wait(), 15000);
    if (receipt && receipt.__timedOut) {
      return {
        submitted: true,
        pending: true,
        txHash: tx.hash,
        proofHash32,
      };
    }

    return {
      submitted: true,
      pending: false,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      status: receipt.status,
      proofHash32,
    };
  } catch (err) {
    return {
      submitted: false,
      skipped: false,
      error: summarizeError(err),
    };
  }
}

module.exports = {
  submitVerifiedActionOnChain,
};

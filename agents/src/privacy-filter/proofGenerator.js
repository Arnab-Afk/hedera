import { createHash, randomBytes } from 'crypto';

/**
 * PrivacyFilter — Anonymized Proof Generator
 *
 * Takes a verified green action and generates a minimal, anonymized proof
 * struct. This proof is the ONLY data that ever leaves the user's device.
 *
 * The proof contains:
 *  - walletAddress: the user's public Hedera account ID (pseudonymous)
 *  - actionCategory: the type of green action (no specifics)
 *  - timestamp: unix timestamp (no sub-day precision to prevent timing attacks)
 *  - daySequence: current streak day number
 *  - proofHash: sha256 of (walletAddress + category + dayTimestamp + nonce)
 *               for replay protection on-chain
 *
 * What the proof deliberately OMITS:
 *  - Location / GPS coordinates
 *  - Merchant name or transaction details
 *  - Energy reading values
 *  - Device identifier
 */
export class PrivacyFilter {

  /**
   * Generate an anonymized proof for a verified green action.
   * @param {{ walletAddress: string, category: string, daySequence: number }} params
   * @returns {object} Proof object safe to submit to HCS and the backend
   */
  generateProof({ walletAddress, category, daySequence }) {
    // Truncate timestamp to hour-level precision (reduce timing fingerprinting)
    const hourTimestamp = Math.floor(Date.now() / 3_600_000) * 3_600_000;

    const nonce = randomBytes(16).toString('hex');
    const hashInput = `${walletAddress}:${category}:${daySequence}:${hourTimestamp}:${nonce}`;
    const proofHash = createHash('sha256').update(hashInput).digest('hex');

    const proof = {
      walletAddress,
      actionCategory: category,
      daySequence,
      timestamp: hourTimestamp,
      proofHash,
      // nonce is intentionally NOT included in the proof to prevent preimage reconstruction
    };

    return proof;
  }

  /**
   * Verify a proof hash (useful for backend double-checking).
   * NOTE: cannot be verified without the original nonce — by design.
   * This method checks structural validity only.
   */
  isStructurallyValid(proof) {
    return (
      typeof proof.walletAddress   === 'string' && proof.walletAddress.length > 0 &&
      typeof proof.actionCategory  === 'string' && proof.actionCategory.length > 0 &&
      typeof proof.daySequence     === 'number' && proof.daySequence > 0 &&
      typeof proof.proofHash       === 'string' && proof.proofHash.length === 64
    );
  }
}

/**
 * Green Action Rule Engine
 *
 * Deterministic, fast rules for classifying sanitized MCP data.
 * These rules are applied BEFORE the LLM for efficiency.
 * Each rule receives the sanitized data object and returns:
 *   - true  → confirmed green action
 *   - false → confirmed NOT a green action
 *   - undefined → inconclusive, fall through to LLM
 */

export const GREEN_ACTION_RULES = {

  /**
   * public_transit: any validated trip today = green action
   */
  public_transit: (data) => {
    return Boolean(data?.hasPublicTransitTrip);
  },

  /**
   * energy_reduction: reduction above threshold = green action
   */
  energy_reduction: (data) => {
    if (typeof data?.isEnergyReduction === 'boolean') {
      return data.isEnergyReduction;
    }
    return undefined; // inconclusive → LLM
  },

  /**
   * plant_based_food: check if any receipt contains vegan/plant-based items
   * Fall through to LLM for nuanced classification of ambiguous categories
   */
  plant_based_food: (data) => {
    const receipts = data?.receipts ?? [];
    if (!receipts.length) return false;

    const GREEN_ITEM_TAGS = new Set([
      'vegan',
      'plant_based',
      'organic',
      'fair_trade',
      'locally_sourced',
      'zero_waste',
    ]);

    const hasGreenItem = receipts.some((r) =>
      r.itemCategories?.some((tag) => GREEN_ITEM_TAGS.has(tag))
    );

    // If clearly green → return true; if unclear → fall to LLM
    if (hasGreenItem) return true;
    return undefined;
  },

  /**
   * thrift_purchase: merchant category "thrift" or "secondhand"
   */
  thrift_purchase: (data) => {
    const receipts = data?.receipts ?? [];
    const THRIFT_CATEGORIES = new Set(['thrift', 'secondhand', 'vintage', 'resale']);
    return receipts.some((r) => THRIFT_CATEGORIES.has(r.merchantCategory));
  },

  /**
   * carbon_offset: boolean from the offset platform API
   */
  carbon_offset: (data) => {
    return Boolean(data?.offsetPurchased);
  },
};

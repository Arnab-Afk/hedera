/**
 * Reward calculation for $WISP token distribution.
 *
 * Base reward: 1 $WISP per verified green action.
 * Streak multiplier: scales linearly from ×1.0 (day 1) to ×2.5 (day 30+).
 * Category bonus: high-impact categories get up to ×1.5 extra.
 */

const BASE_REWARD = 1.0; // $WISP

const CATEGORY_MULTIPLIERS = {
  public_transit:    1.5,
  energy_reduction:  1.3,
  screen_time_reduction: 1.15,
  plant_based_food:  1.2,
  recycling:         1.1,
  thrift_purchase:   1.1,
  carbon_offset:     1.5,
  default:           1.0,
};

/**
 * Returns streak multiplier between 1.0 and 2.5 based on current day sequence.
 * @param {number} daySequence
 */
function streakMultiplier(daySequence) {
  const capped = Math.min(daySequence, 30);
  return 1.0 + (1.5 * (capped / 30));
}

/**
 * Calculate the $WISP reward for a given action.
 * @param {string} category
 * @param {number} daySequence
 * @returns {number} reward amount (up to 8 decimal places)
 */
function calculateWispReward(category, daySequence) {
  const catMultiplier = CATEGORY_MULTIPLIERS[category] ?? CATEGORY_MULTIPLIERS.default;
  const streakMult = streakMultiplier(daySequence);
  const reward = BASE_REWARD * catMultiplier * streakMult;
  return Math.round(reward * 1e8) / 1e8; // 8 decimal precision
}

module.exports = { calculateWispReward, CATEGORY_MULTIPLIERS };

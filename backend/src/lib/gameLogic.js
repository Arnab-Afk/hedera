/**
 * gameLogic.js
 * Core game mechanics for Wisp.
 */

// XP curve: level = floor(sqrt(total_xp / 100)) + 1
// XP for level n: 100 * (n-1)^2
function calculateLevel(experience) {
  if (experience <= 0) return 1;
  return Math.floor(Math.sqrt(experience / 100)) + 1;
}

function getXpForLevel(level) {
  if (level <= 1) return 0;
  return 100 * Math.pow(level - 1, 2);
}

function getXpToNextLevel(experience) {
  const currentLevel = calculateLevel(experience);
  const nextLevelXp = getXpForLevel(currentLevel + 1);
  return nextLevelXp - experience;
}

const CATEGORY_XP = {
  'public_transit': 50,
  'energy_reduction': 100,
  'recycling': 30,
  'water_conservation': 40,
  'sustainable_purchase': 60
};

function getActionXp(category) {
  return CATEGORY_XP[category] || 25;
}

/**
 * Updates user quest progress for a given action category.
 */
async function updateQuestProgress(dbQuery, userId, category) {
  const now = new Date();
  
  // Find active quests for this category
  const activeQuests = await dbQuery(
    `SELECT uq.*, qd.requirement_count 
     FROM user_quests uq
     JOIN quest_definitions qd ON uq.quest_id = qd.id
     WHERE uq.user_id = $1 
       AND qd.category = $2 
       AND uq.completed = FALSE
       AND (uq.expires_at IS NULL OR uq.expires_at > $3)`,
    [userId, category, now]
  );

  const updates = [];
  for (const quest of activeQuests.rows) {
    const newCount = quest.current_count + 1;
    const isCompleted = newCount >= quest.requirement_count;
    
    updates.push(dbQuery(
      `UPDATE user_quests 
       SET current_count = $1, 
           completed = $2, 
           updated_at = NOW() 
       WHERE id = $3`,
      [newCount, isCompleted, quest.id]
    ));
  }

  await Promise.all(updates);
}

module.exports = {
  calculateLevel,
  getXpForLevel,
  getXpToNextLevel,
  getActionXp,
  updateQuestProgress
};

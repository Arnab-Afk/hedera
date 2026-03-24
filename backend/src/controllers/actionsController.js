const { query } = require('../db/pool');
const crypto = require('crypto');
const { calculateWispReward } = require('../lib/rewards');
const { getActionXp, calculateLevel, updateQuestProgress } = require('../lib/gameLogic');
const { verifyTicketWithOpenRouter } = require('../lib/ticketPhotoVerifier');
const { verifyElectricityBillWithAI } = require('../lib/electricityBillVerifier');
const { verifyScreenTimeScreenshotWithAI } = require('../lib/screenTimeVerifier');
const { verifyPlantMealWithAI } = require('../lib/plantMealVerifier');
const { verifyRecyclingPhotoWithAI } = require('../lib/recyclingPhotoVerifier');
const { verifyTimelineScreenshotWithAI, toLocalDateKey } = require('../lib/timelineVerifier');
const { submitVerifiedActionOnChain } = require('../lib/wispCoreClient');

/**
 * POST /api/actions
 * Submit an anonymized green action proof.
 * Updates the user's XP, level, and streak in the same transaction.
 */
async function submitAction(req, res, next) {
  try {
    const { 
      category, 
      proofHash, 
      daySequence, 
      hcsTopicId, 
      hcsSequenceNumber,
      walletAddress // Optional, provided by agent for bypass auth
    } = req.body;

    let userId;
    if (req.isAgent) {
      if (!walletAddress) {
        return res.status(400).json({ error: 'walletAddress is required for agent-bypass submission' });
      }
      const userRes = await query('SELECT id FROM users WHERE wallet_address = $1', [walletAddress]);
      if (!userRes.rows.length) {
        return res.status(404).json({ error: 'User with provided walletAddress not found' });
      }
      userId = userRes.rows[0].id;
    } else {
      userId = req.user.id;
    }

    // Reject duplicate proofs
    const dup = await query('SELECT id FROM actions WHERE proof_hash = $1', [proofHash]);
    if (dup.rows.length) {
      return res.status(409).json({ error: 'Duplicate proof — this action has already been submitted' });
    }

    const wispEarned = calculateWispReward(category, daySequence);
    const xpEarned = getActionXp(category);

    // Save action
    const result = await query(
      `INSERT INTO actions
         (user_id, category, proof_hash, hcs_topic_id, hcs_sequence_number, day_sequence, wisp_earned, xp_earned)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [userId, category, proofHash, hcsTopicId || null, hcsSequenceNumber || null, daySequence, wispEarned, xpEarned]
    );

    // Update user XP and Gold
    const userUpdate = await query(
      `UPDATE users 
       SET experience = experience + $1,
           gold = gold + $2,
           updated_at = NOW()
       WHERE id = $3
       RETURNING experience, level`,
      [xpEarned, wispEarned, userId]
    );

    const { experience, level: oldLevel } = userUpdate.rows[0];
    const newLevel = calculateLevel(experience);

    if (newLevel > oldLevel) {
      await query('UPDATE users SET level = $1 WHERE id = $2', [newLevel, userId]);
      // Trigger level-up logic (e.g., notify user, evolve spirit)
    }

    // Update streak and quest progress
    await updateStreak(userId, daySequence, xpEarned);
    await updateQuestProgress(query, userId, category);
    const onChain = await submitVerifiedActionOnChain({ proofHash, category, daySequence });

    res.status(201).json({ 
      action: result.rows[0], 
      wispEarned, 
      xpEarned,
      newLevel: newLevel > oldLevel ? newLevel : null,
      onChain,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/actions/ticket-photo
 * Accepts a ticket image data URL, verifies via OpenRouter vision,
 * and credits rewards when a valid public-transit action is detected.
 */
async function submitTicketPhotoAction(req, res, next) {
  try {
    const userId = req.user.id;
    const { imageDataUrl } = req.body;

    const verification = await verifyTicketWithOpenRouter({ imageDataUrl });

    if (!verification.isValidTransitTicket || verification.confidence < 0.45) {
      return res.status(422).json({
        error: 'Ticket could not be verified as valid public transit proof',
        verification: {
          confidence: verification.confidence,
          reasoning: verification.reasoning,
        },
      });
    }

    const duplicate = await query(
      'SELECT id FROM actions WHERE proof_hash = $1 OR proof_hash = $2 LIMIT 1',
      [verification.imageHash, verification.ticketFingerprint]
    );
    if (duplicate.rows.length) {
      return res.status(409).json({
        error: 'Duplicate ticket submission detected',
      });
    }

    const daySequence = await getDaySequenceForUser(userId);
    const category = 'public_transit';
    const proofHash = verification.ticketFingerprint;

    const baseWisp = calculateWispReward(category, daySequence);
    const impactBonus = 1 + Math.min(1, verification.estimatedCo2SavedKg / 2);
    const wispEarned = round8(baseWisp * impactBonus);

    const baseXp = getActionXp(category);
    const impactXpBonus = Math.min(20, Math.round(verification.estimatedCo2SavedKg * 10));
    const xpEarned = baseXp + impactXpBonus;

    const actionInsert = await query(
      `INSERT INTO actions
         (user_id, category, proof_hash, hcs_topic_id, hcs_sequence_number, day_sequence, wisp_earned, xp_earned)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        userId,
        category,
        proofHash,
        null,
        null,
        daySequence,
        wispEarned,
        xpEarned,
      ]
    );

    const userUpdate = await query(
      `UPDATE users
       SET experience = experience + $1,
           gold = gold + $2,
           updated_at = NOW()
       WHERE id = $3
       RETURNING experience, level`,
      [xpEarned, wispEarned, userId]
    );

    const { experience, level: oldLevel } = userUpdate.rows[0];
    const newLevel = calculateLevel(experience);
    if (newLevel > oldLevel) {
      await query('UPDATE users SET level = $1 WHERE id = $2', [newLevel, userId]);
    }

    await updateStreak(userId, daySequence, xpEarned);
    await updateQuestProgress(query, userId, category);
    const onChain = await submitVerifiedActionOnChain({ proofHash, category, daySequence });

    return res.status(201).json({
      action: actionInsert.rows[0],
      reward: {
        wispEarned,
        xpEarned,
      },
      verification: {
        confidence: verification.confidence,
        transportType: verification.transportType,
        oneWayDistanceKm: verification.oneWayDistanceKm,
        estimatedCo2SavedKg: verification.estimatedCo2SavedKg,
        reasoning: verification.reasoning,
      },
      levelUp: newLevel > oldLevel ? newLevel : null,
      onChain,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/actions/manual
 * Manual in-app verification for non-ticket actions (energy, food, etc.).
 */
async function submitManualAction(req, res, next) {
  try {
    const userId = req.user.id;
    const { category } = req.body;

    const ALLOWED_CATEGORIES = new Set([
      'energy_reduction',
      'plant_based_food',
      'thrift_purchase',
      'carbon_offset',
    ]);

    if (!ALLOWED_CATEGORIES.has(category)) {
      return res.status(400).json({ error: 'Unsupported category for manual verification' });
    }

    const existingToday = await query(
      `SELECT id
       FROM actions
       WHERE user_id = $1
         AND category = $2
         AND submitted_at::date = CURRENT_DATE
       LIMIT 1`,
      [userId, category]
    );

    if (existingToday.rows.length) {
      return res.status(409).json({ error: 'This action was already verified today' });
    }

    const daySequence = await getDaySequenceForUser(userId);
    const proofHash = crypto
      .createHash('sha256')
      .update(`${userId}:${category}:${Date.now()}:${Math.random()}`)
      .digest('hex');

    const wispEarned = calculateWispReward(category, daySequence);
    const xpEarned = getActionXp(category);

    const actionInsert = await query(
      `INSERT INTO actions
         (user_id, category, proof_hash, hcs_topic_id, hcs_sequence_number, day_sequence, wisp_earned, xp_earned)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [userId, category, proofHash, null, null, daySequence, wispEarned, xpEarned]
    );

    const userUpdate = await query(
      `UPDATE users
       SET experience = experience + $1,
           gold = gold + $2,
           updated_at = NOW()
       WHERE id = $3
       RETURNING experience, level`,
      [xpEarned, wispEarned, userId]
    );

    const { experience, level: oldLevel } = userUpdate.rows[0];
    const newLevel = calculateLevel(experience);
    if (newLevel > oldLevel) {
      await query('UPDATE users SET level = $1 WHERE id = $2', [newLevel, userId]);
    }

    await updateStreak(userId, daySequence, xpEarned);
    await updateQuestProgress(query, userId, category);
    const onChain = await submitVerifiedActionOnChain({ proofHash, category, daySequence });

    return res.status(201).json({
      action: actionInsert.rows[0],
      reward: {
        wispEarned,
        xpEarned,
      },
      levelUp: newLevel > oldLevel ? newLevel : null,
      onChain,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/actions/electricity-bill
 * Upload monthly electricity bill, extract consumed units with AI,
 * derive a bill score, and credit rewards accordingly.
 */
async function submitElectricityBillAction(req, res, next) {
  try {
    const userId = req.user.id;
    const { imageDataUrl } = req.body;

    const bill = await verifyElectricityBillWithAI({ imageDataUrl });

    if (!bill.isElectricityBill || bill.confidence < 0.4) {
      return res.status(422).json({
        error: 'Could not verify a valid electricity bill from the uploaded image',
        verification: {
          confidence: bill.confidence,
          reasoning: bill.reasoning,
        },
      });
    }

    if (!bill.billingMonth || !bill.billingYear) {
      return res.status(422).json({
        error: 'Could not determine billing month/year from bill',
        verification: {
          unitsConsumed: bill.unitsConsumed,
          confidence: bill.confidence,
          reasoning: bill.reasoning,
        },
      });
    }

    const monthlyDup = await query(
      `SELECT id
       FROM actions
       WHERE user_id = $1
         AND category = 'energy_reduction'
         AND proof_hash = $2
       LIMIT 1`,
      [userId, `bill:${bill.billingYear}:${bill.billingMonth.toLowerCase()}`]
    );

    if (monthlyDup.rows.length) {
      return res.status(409).json({ error: 'This monthly bill was already submitted' });
    }

    const daySequence = await getDaySequenceForUser(userId);
    const category = 'energy_reduction';
    const proofHash = `bill:${bill.billingYear}:${bill.billingMonth.toLowerCase()}`;

    const baseWisp = calculateWispReward(category, daySequence);
    const scoreMultiplier = 0.5 + (bill.score / 100); // 0.7x to 1.5x range from score bands
    const wispEarned = round8(baseWisp * scoreMultiplier);

    const baseXp = getActionXp(category);
    const xpEarned = baseXp + Math.round(bill.score / 10);

    const actionInsert = await query(
      `INSERT INTO actions
         (user_id, category, proof_hash, hcs_topic_id, hcs_sequence_number, day_sequence, wisp_earned, xp_earned)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [userId, category, proofHash, null, null, daySequence, wispEarned, xpEarned]
    );

    const userUpdate = await query(
      `UPDATE users
       SET experience = experience + $1,
           gold = gold + $2,
           updated_at = NOW()
       WHERE id = $3
       RETURNING experience, level`,
      [xpEarned, wispEarned, userId]
    );

    const { experience, level: oldLevel } = userUpdate.rows[0];
    const newLevel = calculateLevel(experience);
    if (newLevel > oldLevel) {
      await query('UPDATE users SET level = $1 WHERE id = $2', [newLevel, userId]);
    }

    await updateStreak(userId, daySequence, xpEarned);
    await updateQuestProgress(query, userId, category);
    const onChain = await submitVerifiedActionOnChain({ proofHash, category, daySequence });

    return res.status(201).json({
      action: actionInsert.rows[0],
      reward: {
        wispEarned,
        xpEarned,
      },
      bill: {
        unitsConsumed: bill.unitsConsumed,
        billingMonth: bill.billingMonth,
        billingYear: bill.billingYear,
        score: bill.score,
        confidence: bill.confidence,
        reasoning: bill.reasoning,
      },
      levelUp: newLevel > oldLevel ? newLevel : null,
      onChain,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/actions/screen-time
 * Upload daily screen-time screenshot, extract usage minutes with AI,
 * estimate energy use, and reward low screen-time behavior.
 */
async function submitScreenTimeAction(req, res, next) {
  try {
    const userId = req.user.id;
    const { imageDataUrl } = req.body;

    const screen = await verifyScreenTimeScreenshotWithAI({ imageDataUrl });

    if (!screen.isScreenTimeScreenshot || screen.confidence < 0.4) {
      return res.status(422).json({
        error: 'Could not verify a valid daily screen-time screenshot',
        verification: {
          confidence: screen.confidence,
          reasoning: screen.reasoning,
        },
      });
    }

    const existingToday = await query(
      `SELECT id
       FROM actions
       WHERE user_id = $1
         AND category = 'screen_time_reduction'
         AND submitted_at::date = CURRENT_DATE
       LIMIT 1`,
      [userId]
    );

    if (existingToday.rows.length) {
      return res.status(409).json({ error: 'Screen-time screenshot already submitted today' });
    }

    const daySequence = await getDaySequenceForUser(userId);
    const category = 'screen_time_reduction';
    const proofHash = `screentime:${new Date().toISOString().slice(0, 10)}:${screen.totalMinutes}`;

    const baseWisp = calculateWispReward(category, daySequence);
    const scoreMultiplier = 0.5 + (screen.score / 100); // lower usage gives higher score and reward
    const wispEarned = round8(baseWisp * scoreMultiplier);

    const baseXp = getActionXp(category);
    const xpEarned = baseXp + Math.round(screen.score / 10);

    const actionInsert = await query(
      `INSERT INTO actions
         (user_id, category, proof_hash, hcs_topic_id, hcs_sequence_number, day_sequence, wisp_earned, xp_earned)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [userId, category, proofHash, null, null, daySequence, wispEarned, xpEarned]
    );

    const userUpdate = await query(
      `UPDATE users
       SET experience = experience + $1,
           gold = gold + $2,
           updated_at = NOW()
       WHERE id = $3
       RETURNING experience, level`,
      [xpEarned, wispEarned, userId]
    );

    const { experience, level: oldLevel } = userUpdate.rows[0];
    const newLevel = calculateLevel(experience);
    if (newLevel > oldLevel) {
      await query('UPDATE users SET level = $1 WHERE id = $2', [newLevel, userId]);
    }

    await updateStreak(userId, daySequence, xpEarned);
    await updateQuestProgress(query, userId, category);
    const onChain = await submitVerifiedActionOnChain({ proofHash, category, daySequence });

    return res.status(201).json({
      action: actionInsert.rows[0],
      reward: {
        wispEarned,
        xpEarned,
      },
      screen: {
        totalMinutes: screen.totalMinutes,
        estimatedEnergyWh: screen.estimatedEnergyWh,
        score: screen.score,
        confidence: screen.confidence,
        screenshotDate: screen.screenshotDate,
        reasoning: screen.reasoning,
      },
      levelUp: newLevel > oldLevel ? newLevel : null,
      onChain,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/actions/meal-photo
 * Upload plant-based meal photo, verify with AI, and credit rewards.
 */
async function submitPlantMealAction(req, res, next) {
  try {
    const userId = req.user.id;
    const { imageDataUrl } = req.body;

    const meal = await verifyPlantMealWithAI({ imageDataUrl });

    if (!meal.isPlantBasedMeal || meal.confidence < 0.4) {
      return res.status(422).json({
        error: 'Could not verify a plant-based meal from the uploaded photo',
        verification: {
          confidence: meal.confidence,
          reasoning: meal.reasoning,
        },
      });
    }

    const existingToday = await query(
      `SELECT id
       FROM actions
       WHERE user_id = $1
         AND category = 'plant_based_food'
         AND submitted_at::date = CURRENT_DATE
       LIMIT 1`,
      [userId]
    );

    if (existingToday.rows.length) {
      return res.status(409).json({ error: 'Plant-based meal already submitted today' });
    }

    const daySequence = await getDaySequenceForUser(userId);
    const category = 'plant_based_food';
    const proofHash = `meal:${new Date().toISOString().slice(0, 10)}:${meal.dishName.toLowerCase()}`;

    const baseWisp = calculateWispReward(category, daySequence);
    const impactBonus = 1 + Math.min(0.8, meal.estimatedCo2SavedKg / 2);
    const wispEarned = round8(baseWisp * impactBonus);

    const baseXp = getActionXp(category);
    const xpEarned = baseXp + Math.min(15, Math.round(meal.estimatedCo2SavedKg * 10));

    const actionInsert = await query(
      `INSERT INTO actions
         (user_id, category, proof_hash, hcs_topic_id, hcs_sequence_number, day_sequence, wisp_earned, xp_earned)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [userId, category, proofHash, null, null, daySequence, wispEarned, xpEarned]
    );

    const userUpdate = await query(
      `UPDATE users
       SET experience = experience + $1,
           gold = gold + $2,
           updated_at = NOW()
       WHERE id = $3
       RETURNING experience, level`,
      [xpEarned, wispEarned, userId]
    );

    const { experience, level: oldLevel } = userUpdate.rows[0];
    const newLevel = calculateLevel(experience);
    if (newLevel > oldLevel) {
      await query('UPDATE users SET level = $1 WHERE id = $2', [newLevel, userId]);
    }

    await updateStreak(userId, daySequence, xpEarned);
    await updateQuestProgress(query, userId, category);
    const onChain = await submitVerifiedActionOnChain({ proofHash, category, daySequence });

    return res.status(201).json({
      action: actionInsert.rows[0],
      reward: {
        wispEarned,
        xpEarned,
      },
      meal: {
        dishName: meal.dishName,
        estimatedCo2SavedKg: meal.estimatedCo2SavedKg,
        confidence: meal.confidence,
        reasoning: meal.reasoning,
      },
      levelUp: newLevel > oldLevel ? newLevel : null,
      onChain,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/actions/recycling-photo
 * Upload recycling photo, verify with AI, and credit rewards.
 */
async function submitRecyclingPhotoAction(req, res, next) {
  try {
    const userId = req.user.id;
    const { imageDataUrl } = req.body;

    const recycle = await verifyRecyclingPhotoWithAI({ imageDataUrl });

    if (!recycle.isRecyclingProof || recycle.confidence < 0.4) {
      return res.status(422).json({
        error: 'Could not verify recycling proof from the uploaded photo',
        verification: {
          confidence: recycle.confidence,
          reasoning: recycle.reasoning,
        },
      });
    }

    const existingToday = await query(
      `SELECT id
       FROM actions
       WHERE user_id = $1
         AND category = 'recycling'
         AND submitted_at::date = CURRENT_DATE
       LIMIT 1`,
      [userId]
    );

    if (existingToday.rows.length) {
      return res.status(409).json({ error: 'Recycling proof already submitted today' });
    }

    const daySequence = await getDaySequenceForUser(userId);
    const category = 'recycling';
    const proofHash = `recycle:${new Date().toISOString().slice(0, 10)}:${recycle.recyclableItemCount}`;

    const baseWisp = calculateWispReward(category, daySequence);
    const impactBonus = 1 + Math.min(0.8, recycle.estimatedWasteDivertedKg / 3);
    const wispEarned = round8(baseWisp * impactBonus);

    const baseXp = getActionXp(category);
    const xpEarned = baseXp + Math.min(15, Math.round(recycle.estimatedWasteDivertedKg * 5));

    const actionInsert = await query(
      `INSERT INTO actions
         (user_id, category, proof_hash, hcs_topic_id, hcs_sequence_number, day_sequence, wisp_earned, xp_earned)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [userId, category, proofHash, null, null, daySequence, wispEarned, xpEarned]
    );

    const userUpdate = await query(
      `UPDATE users
       SET experience = experience + $1,
           gold = gold + $2,
           updated_at = NOW()
       WHERE id = $3
       RETURNING experience, level`,
      [xpEarned, wispEarned, userId]
    );

    const { experience, level: oldLevel } = userUpdate.rows[0];
    const newLevel = calculateLevel(experience);
    if (newLevel > oldLevel) {
      await query('UPDATE users SET level = $1 WHERE id = $2', [newLevel, userId]);
    }

    await updateStreak(userId, daySequence, xpEarned);
    await updateQuestProgress(query, userId, category);
    const onChain = await submitVerifiedActionOnChain({ proofHash, category, daySequence });

    return res.status(201).json({
      action: actionInsert.rows[0],
      reward: {
        wispEarned,
        xpEarned,
      },
      recycling: {
        recyclableItemCount: recycle.recyclableItemCount,
        estimatedWasteDivertedKg: recycle.estimatedWasteDivertedKg,
        confidence: recycle.confidence,
        reasoning: recycle.reasoning,
      },
      levelUp: newLevel > oldLevel ? newLevel : null,
      onChain,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/actions/timeline-screenshot
 * Verify Google Maps Timeline screenshot and reward low-carbon commuting.
 */
async function submitTimelineScreenshotAction(req, res, next) {
  try {
    const userId = req.user.id;
    const { imageDataUrl } = req.body;

    const timeline = await verifyTimelineScreenshotWithAI({ imageDataUrl });

    if (!timeline.isGoogleTimeline || timeline.confidence < 0.4) {
      return res.status(422).json({
        error: 'Could not verify a Google Maps Timeline screenshot',
        verification: {
          confidence: timeline.confidence,
          reasoning: timeline.reasoning,
        },
      });
    }

    const today = toLocalDateKey(new Date());
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const yesterday = toLocalDateKey(y);

    if (!timeline.screenshotDate || ![today, yesterday].includes(timeline.screenshotDate)) {
      return res.status(422).json({
        error: `Screenshot date must be today (${today}) or yesterday (${yesterday})`,
        verification: {
          screenshotDate: timeline.screenshotDate,
          confidence: timeline.confidence,
          reasoning: timeline.reasoning,
        },
      });
    }

    const existingForDate = await query(
      `SELECT id
       FROM actions
       WHERE user_id = $1
         AND category = 'low_carbon_commute'
         AND proof_hash = $2
       LIMIT 1`,
      [userId, `timeline:${timeline.screenshotDate}`]
    );

    if (existingForDate.rows.length) {
      return res.status(409).json({ error: 'Timeline screenshot for this date was already submitted' });
    }

    const daySequence = await getDaySequenceForUser(userId);
    const category = 'low_carbon_commute';
    const proofHash = `timeline:${timeline.screenshotDate}`;

    const tooHighEmission = timeline.actualEmissionKg > 6 || timeline.drivingKm > 20;
    const baseWisp = calculateWispReward(category, daySequence);
    const scoreMultiplier = 0.6 + (timeline.score / 100); // 0.6x to 1.6x

    const wispEarned = tooHighEmission ? 0 : round8(baseWisp * scoreMultiplier);
    const baseXp = getActionXp(category);
    const xpEarned = tooHighEmission ? 0 : baseXp + Math.round(timeline.score / 8);

    const actionInsert = await query(
      `INSERT INTO actions
         (user_id, category, proof_hash, hcs_topic_id, hcs_sequence_number, day_sequence, wisp_earned, xp_earned)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [userId, category, proofHash, null, null, daySequence, wispEarned, xpEarned]
    );

    const userUpdate = await query(
      `UPDATE users
       SET experience = experience + $1,
           gold = gold + $2,
           updated_at = NOW()
       WHERE id = $3
       RETURNING experience, level`,
      [xpEarned, wispEarned, userId]
    );

    const { experience, level: oldLevel } = userUpdate.rows[0];
    const newLevel = calculateLevel(experience);
    if (newLevel > oldLevel) {
      await query('UPDATE users SET level = $1 WHERE id = $2', [newLevel, userId]);
    }

    await updateStreak(userId, daySequence, xpEarned);
    await updateQuestProgress(query, userId, category);
    const onChain = await submitVerifiedActionOnChain({ proofHash, category, daySequence });

    return res.status(201).json({
      action: actionInsert.rows[0],
      reward: {
        wispEarned,
        xpEarned,
      },
      timeline: {
        screenshotDate: timeline.screenshotDate,
        totalSteps: timeline.totalSteps,
        walkingKm: timeline.walkingKm,
        transitKm: timeline.transitKm,
        drivingKm: timeline.drivingKm,
        actualEmissionKg: timeline.actualEmissionKg,
        score: timeline.score,
        tooHighEmission,
        confidence: timeline.confidence,
        reasoning: timeline.reasoning,
      },
      levelUp: newLevel > oldLevel ? newLevel : null,
      onChain,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/actions
 */
async function getActions(req, res, next) {
  try {
    const userId = req.user.id;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const offset = parseInt(req.query.offset) || 0;
    const category = req.query.category;

    let sql = 'SELECT * FROM actions WHERE user_id = $1';
    const params = [userId];

    if (category) {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }

    sql += ` ORDER BY submitted_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);
    res.json({ actions: result.rows, count: result.rowCount });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/actions/:id
 */
async function getActionById(req, res, next) {
  try {
    const result = await query(
      'SELECT * FROM actions WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Action not found' });
    res.json({ action: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function updateStreak(userId, daySequence, xpEarned) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  await query(
    `INSERT INTO streaks (user_id, current_streak, longest_streak, last_action_date, total_actions, xp_from_streaks)
     VALUES ($1, $2, $2, $3, 1, $4)
     ON CONFLICT (user_id) DO UPDATE SET
       current_streak   = GREATEST($2, streaks.current_streak),
       longest_streak   = GREATEST($2, streaks.longest_streak),
       last_action_date = $3,
       total_actions    = streaks.total_actions + 1,
       xp_from_streaks  = streaks.xp_from_streaks + $4,
       updated_at       = NOW()`,
    [userId, daySequence, today, xpEarned]
  );
}

async function getDaySequenceForUser(userId) {
  const streak = await query(
    'SELECT current_streak, last_action_date FROM streaks WHERE user_id = $1 LIMIT 1',
    [userId]
  );

  if (!streak.rows.length) {
    return 1;
  }

  const { current_streak, last_action_date } = streak.rows[0];
  const today = new Date().toISOString().slice(0, 10);

  if (last_action_date && String(last_action_date).slice(0, 10) === today) {
    return Math.max(1, current_streak || 1);
  }
  return (current_streak || 0) + 1;
}

function round8(value) {
  return Math.round(value * 1e8) / 1e8;
}

module.exports = {
  submitAction,
  submitTicketPhotoAction,
  submitManualAction,
  submitElectricityBillAction,
  submitScreenTimeAction,
  submitPlantMealAction,
  submitRecyclingPhotoAction,
  submitTimelineScreenshotAction,
  getActions,
  getActionById,
};

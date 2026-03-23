/**
 * Seed script — populates merchants and quest_definitions tables.
 * Run: npm run db:seed
 */
require('dotenv').config();
const { pool, testConnection } = require('./pool');

const MERCHANTS = [
  // San Francisco
  { name: 'Green Brew Café',       category: 'cafe',         description: 'Zero-waste specialty coffee',             city: 'San Francisco', discount_pct: 15, wallet_address: '0.0.100001' },
  { name: 'Thrift Haven SF',       category: 'thrift_store', description: 'Curated second-hand clothing',            city: 'San Francisco', discount_pct: 20, wallet_address: '0.0.100002' },
  { name: 'Roots Organic Market',  category: 'grocery',      description: 'Local + organic, no plastics',            city: 'San Francisco', discount_pct: 10, wallet_address: '0.0.100003' },
  { name: 'Zero Waste Studio',     category: 'retail',       description: 'Home goods, zero-waste packaging',        city: 'San Francisco', discount_pct: 25, wallet_address: '0.0.100004' },
  { name: 'The Vegan Kitchen',     category: 'restaurant',   description: 'Plant-based, locally sourced',            city: 'San Francisco', discount_pct: 12, wallet_address: '0.0.100005' },
  // New York
  { name: 'Brooklyn Eco Roast',    category: 'cafe',         description: 'Compostable cups, fair-trade coffee',     city: 'New York',      discount_pct: 15, wallet_address: '0.0.100006' },
  { name: 'Secondhand Stories',    category: 'thrift_store', description: 'Vintage fashion & upcycled decor',        city: 'New York',      discount_pct: 18, wallet_address: '0.0.100007' },
  { name: 'GreenLeaf Market NYC',  category: 'grocery',      description: 'Farmers-market, package-free options',    city: 'New York',      discount_pct: 10, wallet_address: '0.0.100008' },
  { name: 'EcoThreads NYC',        category: 'retail',       description: 'Ethical sustainable apparel',             city: 'New York',      discount_pct: 20, wallet_address: '0.0.100009' },
  { name: 'Sprout Plant Bar',      category: 'restaurant',   description: '100% plant-based smoothie bowls',         city: 'New York',      discount_pct: 12, wallet_address: '0.0.100010' },
  // Austin
  { name: 'Lone Star Brew',        category: 'cafe',         description: 'Reusable-cup discount program',           city: 'Austin',        discount_pct: 15, wallet_address: '0.0.100011' },
  { name: 'Austin ReWear',         category: 'thrift_store', description: 'Community thrift with curated drops',     city: 'Austin',        discount_pct: 20, wallet_address: '0.0.100012' },
  { name: 'Barton Springs Market', category: 'grocery',      description: 'Texas local produce, zero-plastic',       city: 'Austin',        discount_pct: 10, wallet_address: '0.0.100013' },
  // Portland
  { name: 'Moss & Grain Café',     category: 'cafe',         description: 'Vegan bakes, BYOC discount',              city: 'Portland',      discount_pct: 15, wallet_address: '0.0.100014' },
  { name: 'Cascade Thrift',        category: 'thrift_store', description: 'Donation-driven vintage & outdoor wear',  city: 'Portland',      discount_pct: 22, wallet_address: '0.0.100015' },
  { name: 'Field & Forest Market', category: 'grocery',      description: 'PNW local farms, refillable station',     city: 'Portland',      discount_pct: 10, wallet_address: '0.0.100016' },
  { name: 'EcoGlow PDX',           category: 'retail',       description: 'Natural skincare & home cleaning',         city: 'Portland',      discount_pct: 18, wallet_address: '0.0.100017' },
  // Seattle
  { name: 'Rainforest Roasts',     category: 'cafe',         description: 'Carbon-neutral, reusable cup program',    city: 'Seattle',       discount_pct: 15, wallet_address: '0.0.100018' },
  { name: 'ReWoven Seattle',       category: 'thrift_store', description: 'Artisan repaired & upcycled clothing',    city: 'Seattle',       discount_pct: 20, wallet_address: '0.0.100019' },
  { name: 'Pike Eco Provisions',   category: 'grocery',      description: 'Certified plastic-free grocery',          city: 'Seattle',       discount_pct: 10, wallet_address: '0.0.100020' },
];

const QUESTS = [
  { title: 'Commuter Hero', description: 'Take public transit 3 times today.', category: 'public_transit', requirement_count: 3, xp_reward: 150, wisp_reward: 5, type: 'daily' },
  { title: 'Energy Saver', description: 'Reduce your energy consumption today.', category: 'energy_reduction', requirement_count: 1, xp_reward: 100, wisp_reward: 3, type: 'daily' },
  { title: 'Recycling Pro', description: 'Recycle 5 items.', category: 'recycling', requirement_count: 5, xp_reward: 50, wisp_reward: 1, type: 'daily' },
  { title: 'Water Guardian', description: 'Save 10 gallons of water.', category: 'water_conservation', requirement_count: 1, xp_reward: 80, wisp_reward: 2, type: 'daily' },
  { title: 'Sustainable Shopper', description: 'Make a purchase at a certified merchant.', category: 'sustainable_purchase', requirement_count: 1, xp_reward: 120, wisp_reward: 10, type: 'daily' },
  { title: 'Eco Warrior', description: 'Complete 10 green actions.', category: 'any', requirement_count: 10, xp_reward: 500, wisp_reward: 50, type: 'weekly' },
];

async function seed() {
  await testConnection();
  try {
    console.log('🌱 Seeding merchants...');
    let mInserted = 0, mSkipped = 0;
    for (const m of MERCHANTS) {
      const existing = await pool.query('SELECT id FROM merchants WHERE name = $1 AND city = $2', [m.name, m.city]);
      if (existing.rows.length) { mSkipped++; continue; }
      await pool.query(
        `INSERT INTO merchants (name, category, description, city, discount_pct, wallet_address, wisp_accepted)
         VALUES ($1,$2,$3,$4,$5,$6,TRUE)`,
        [m.name, m.category, m.description, m.city, m.discount_pct, m.wallet_address]
      );
      mInserted++;
    }
    console.log(`✅ Merchants - Inserted: ${mInserted} | Skipped: ${mSkipped}`);

    console.log('🌱 Seeding quest definitions...');
    let qInserted = 0, qSkipped = 0;
    for (const q of QUESTS) {
      const existing = await pool.query('SELECT id FROM quest_definitions WHERE title = $1', [q.title]);
      if (existing.rows.length) { qSkipped++; continue; }
      await pool.query(
        `INSERT INTO quest_definitions (title, description, category, requirement_count, xp_reward, wisp_reward, type)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [q.title, q.description, q.category, q.requirement_count, q.xp_reward, q.wisp_reward, q.type]
      );
      qInserted++;
    }
    console.log(`✅ Quests - Inserted: ${qInserted} | Skipped: ${qSkipped}`);

  } finally {
    await pool.end();
  }
}

seed().catch(e => { console.error(e); process.exit(1); });

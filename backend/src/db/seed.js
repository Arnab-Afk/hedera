/**
 * Seed script — populates merchants table.
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

async function seed() {
  await testConnection();
  try {
    console.log('🌱 Seeding merchants...');
    let inserted = 0, skipped = 0;

    for (const m of MERCHANTS) {
      const existing = await pool.query(
        'SELECT id FROM merchants WHERE name = $1 AND city = $2', [m.name, m.city]
      );
      if (existing.rows.length) { skipped++; continue; }

      await pool.query(
        `INSERT INTO merchants (name, category, description, city, discount_pct, wallet_address, wisp_accepted)
         VALUES ($1,$2,$3,$4,$5,$6,TRUE)`,
        [m.name, m.category, m.description, m.city, m.discount_pct, m.wallet_address]
      );
      inserted++;
    }

    console.log(`✅ Inserted: ${inserted} | Skipped: ${skipped}`);
  } finally {
    await pool.end();
  }
}

seed().catch(e => { console.error(e); process.exit(1); });

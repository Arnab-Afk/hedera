require('dotenv').config();
const hre = require('hardhat');

/**
 * Deployment script for all Wisp contracts.
 *
 * Order:
 *  1. WispToken   (needs team/merchant/community wallet addresses)
 *  2. WispSpirit  (needs IPFS URIs for each evolution stage)
 *  3. WispCore    (needs WispSpirit + WispToken addresses)
 *  4. Wire up:    set WispCore address in both WispToken and WispSpirit
 */
async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(`\n🌿 Deploying Wisp contracts`);
  console.log(`   Deployer: ${deployer.address}`);
  console.log(`   Network:  ${hre.network.name}`);
  console.log(`   Balance:  ${hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address))} HBAR\n`);

  // ── 1. WispToken ───────────────────────────────────────────────────────────
  console.log('1️⃣  Deploying WispToken...');
  const WispToken = await hre.ethers.getContractFactory('WispToken');
  const wispToken = await WispToken.deploy(
    deployer.address, // team wallet (use real multisig in production)
    deployer.address, // merchant wallet
    deployer.address  // community wallet
  );
  await wispToken.waitForDeployment();
  console.log(`   ✅ WispToken: ${await wispToken.getAddress()}`);

  // ── 2. WispSpirit ──────────────────────────────────────────────────────────
  // Replace these placeholder IPFS CIDs with real ones after uploading metadata
  const stageURIs = [
    'ipfs://QmPlaceholderStage0/metadata.json', // Seedling
    'ipfs://QmPlaceholderStage1/metadata.json', // Sprout
    'ipfs://QmPlaceholderStage2/metadata.json', // Sapling
    'ipfs://QmPlaceholderStage3/metadata.json', // Grove
    'ipfs://QmPlaceholderStage4/metadata.json', // Ancient
    'ipfs://QmPlaceholderStage5/metadata.json', // Elder
    'ipfs://QmPlaceholderStage6/metadata.json', // Legendary
  ];

  console.log('\n2️⃣  Deploying WispSpirit...');
  const WispSpirit = await hre.ethers.getContractFactory('WispSpirit');
  const wispSpirit = await WispSpirit.deploy(stageURIs);
  await wispSpirit.waitForDeployment();
  console.log(`   ✅ WispSpirit: ${await wispSpirit.getAddress()}`);

  // ── 3. WispCore ───────────────────────────────────────────────────────────
  console.log('\n3️⃣  Deploying WispCore...');
  const WispCore = await hre.ethers.getContractFactory('WispCore');
  const wispCore = await WispCore.deploy(
    await wispSpirit.getAddress(),
    await wispToken.getAddress()
  );
  await wispCore.waitForDeployment();
  console.log(`   ✅ WispCore: ${await wispCore.getAddress()}`);

  // ── 4. Wire up permissions ────────────────────────────────────────────────
  console.log('\n4️⃣  Wiring up contract permissions...');
  await (await wispToken.setWispCore(await wispCore.getAddress())).wait();
  await (await wispSpirit.setWispCore(await wispCore.getAddress())).wait();
  console.log('   ✅ WispCore set as minter on WispToken');
  console.log('   ✅ WispCore set as evolver on WispSpirit');

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n─────────────────────────────────────────────');
  console.log('🚀 Deployment complete! Add these to your .env:');
  console.log(`WISP_CORE_ADDRESS=${await wispCore.getAddress()}`);
  console.log(`WISP_SPIRIT_ADDRESS=${await wispSpirit.getAddress()}`);
  console.log(`WISP_TOKEN_ADDRESS=${await wispToken.getAddress()}`);
  console.log('─────────────────────────────────────────────\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

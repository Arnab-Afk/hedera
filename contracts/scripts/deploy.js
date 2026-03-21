require('dotenv').config();
const { ethers } = require('hardhat');

const STAGE_URIS = [
  'ipfs://bafybeigm3dpouilek7amswqbycy4qn4aiu4sapnbskigodp3q64cukijl4',
  'ipfs://bafybeidm4lstvivibu75whhokzn7hyb7eixq5kqzwrvstwvmml4k5tyefm',
  'ipfs://bafybeialy5a5shv5b2blzj6fuconrsgz3j7tdpm63h72oxsrcxvdlcruem',
  'ipfs://bafybeiguold6werevhsh3easeezsyxntufwlzvmskmf5tkn5zbxaz2ggaa',
  'ipfs://bafybeiarl5uk3rt37xmsmlyldiatga6t4vspepzgdaultpgf7iflqorb5m',
  'ipfs://bafybeid4iubzem4tarjne4u3imygvydojf4jzyucprt7bspbcf4qhce5zi',
  'ipfs://bafybeifc7wwasib5we7zxijzvdsogfye3jukbyfqyrtgac7pa26slld4za',
];

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('\nDeploying Wisp contracts to Hedera Testnet');
  console.log(`Deployer: ${deployer.address}\n`);

  console.log('1/3 Deploying WispToken...');
  const WispToken = await ethers.getContractFactory('WispToken');
  const wispToken = await WispToken.deploy(deployer.address, deployer.address, deployer.address);
  await wispToken.waitForDeployment();
  const wispTokenAddress = await wispToken.getAddress();
  console.log(`WispToken deployed: ${wispTokenAddress}`);

  console.log('\n2/3 Deploying WispSpirit...');
  const WispSpirit = await ethers.getContractFactory('WispSpirit');
  const wispSpirit = await WispSpirit.deploy(STAGE_URIS);
  await wispSpirit.waitForDeployment();
  const wispSpiritAddress = await wispSpirit.getAddress();
  console.log(`WispSpirit deployed: ${wispSpiritAddress}`);

  console.log('\n3/3 Deploying WispCore...');
  const WispCore = await ethers.getContractFactory('WispCore');
  const wispCore = await WispCore.deploy(wispSpiritAddress, wispTokenAddress);
  await wispCore.waitForDeployment();
  const wispCoreAddress = await wispCore.getAddress();
  console.log(`WispCore deployed: ${wispCoreAddress}`);

  console.log('\nWiring permissions...');
  await (await wispToken.setWispCore(wispCoreAddress)).wait();
  console.log('WispCore set as minter on WispToken');
  await (await wispSpirit.setWispCore(wispCoreAddress)).wait();
  console.log('WispCore set as evolver on WispSpirit');

  console.log('\n--- Copy these to backend/.env ---');
  console.log(`WISP_CORE_ADDRESS=${wispCoreAddress}`);
  console.log(`WISP_SPIRIT_ADDRESS=${wispSpiritAddress}`);
  console.log(`WISP_TOKEN_ADDRESS=${wispTokenAddress}`);
  console.log(`\nhttps://hashscan.io/testnet/contract/${wispCoreAddress}`);
  console.log(`https://hashscan.io/testnet/contract/${wispSpiritAddress}`);
  console.log(`https://hashscan.io/testnet/contract/${wispTokenAddress}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

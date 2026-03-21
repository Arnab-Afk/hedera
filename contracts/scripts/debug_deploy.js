require('dotenv').config();
require('@nomicfoundation/hardhat-toolbox');
const { ethers } = require('hardhat');
const fs = require('fs');

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deployer:', deployer.address);

  try {
    console.log('Deploying WispToken...');
    const WispToken = await ethers.getContractFactory('WispToken');
    const wispToken = await WispToken.deploy(deployer.address, deployer.address, deployer.address);
    await wispToken.waitForDeployment();
    const addr = await wispToken.getAddress();
    console.log('WispToken deployed:', addr);
  } catch (e) {
    const msg = e?.error?.message || e?.message || String(e);
    fs.writeFileSync('deploy_error.txt', msg);
    console.error('FULL ERROR:', msg);
    throw e;
  }
}

main().catch((err) => {
  process.exit(1);
});

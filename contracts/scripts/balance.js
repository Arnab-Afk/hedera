require('dotenv').config();
const { ethers } = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Address : ${deployer.address}`);
  console.log(`Balance : ${ethers.formatEther(balance)} HBAR`);
  console.log(`Wei     : ${balance.toString()}`);
}

main().catch(console.error);

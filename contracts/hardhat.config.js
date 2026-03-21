require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    // Local Hardhat node for rapid iteration
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
    // Hedera Testnet (JSON-RPC relay)
    hedera_testnet: {
      url: 'https://testnet.hashio.io/api',
      chainId: 296,
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
    },
    // Hedera Mainnet
    hedera_mainnet: {
      url: 'https://mainnet.hashio.io/api',
      chainId: 295,
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
    },
  },
  paths: {
    sources:   './contracts',
    tests:     './test',
    cache:     './cache',
    artifacts: './artifacts',
  },
};

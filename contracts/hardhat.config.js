require('dotenv').config();
require('@nomicfoundation/hardhat-toolbox');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.28',
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: 'cancun',
    },
  },
  networks: {
    hedera_testnet: {
      url: process.env.HEDERA_RPC_URL || 'https://testnet.hashio.io/api',
      chainId: 296,
      accounts: process.env.HEDERA_PRIVATE_KEY ? [process.env.HEDERA_PRIVATE_KEY] : [],
    },
    hedera_mainnet: {
      url: 'https://mainnet.hashio.io/api',
      chainId: 295,
      accounts: process.env.HEDERA_PRIVATE_KEY ? [process.env.HEDERA_PRIVATE_KEY] : [],
    },
  },
};

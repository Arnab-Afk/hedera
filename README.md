<div align="center">

<br />

# 🌿 Wisp

### *The Privacy-First Eco-Companion*

[![Hedera](https://img.shields.io/badge/Powered%20by-Hedera-3a3a8c?style=for-the-badge&logo=hedera)](https://hedera.com)
[![Next.js PWA](https://img.shields.io/badge/Next.js-PWA-000000?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![AI Agents](https://img.shields.io/badge/AI-MCP_Agents-8b5cf6?style=for-the-badge)](#)

<br />

> **Wisp** is a gamified, zero-knowledge Progressive Web App (PWA) that turns your daily sustainable habits into tangible, on-chain rewards—without ever exposing your personal data. 

<br />

</div>

---

## ⚡ The Trilemma We Solved

Sustainability apps force a choice between gamification, true verification, or real incentives. **Wisp delivers all three.** 

By utilizing **Local AI Agents (MCP)** and **Hedera (HCS & HTS)**, Wisp verifies your real-world green actions entirely on-device. Your raw data never leaves your phone, but your streak is verified and your digital plant evolves.

---

## ✨ Core Features & Hackathon Alignment

Wisp was purpose-built to dominate the **Hedera Future Hack Apex** (Sustainability + AI Agents tracks):

### 🗺️ Zero-Knowledge Timeline Integration (AI Track)
Our **TimelineMCP** reads your daily movement data directly on-device. A local LLM parses this to detect "Green Commutes" (like taking the train) and generates an anonymous cryptographic proof. 

*Hedera knows you took the train; it doesn't know where you live.*

### 🌱 The Wisp Flora (Sustainability Track)
A dynamic Soulbound NFT that evolves from a seed to an Ancient Ecosystem based on your verified streak. Miss a day? Your plant wilts. It's fully managed via Hedera Token Service (HTS).

### 🏪 The Local Green Economy
Verified actions earn **$WISP** utility tokens, which can be redeemed at partnered local eco-businesses. Hedera's sub-cent fees make this micro-economy viable.

---

## 📋 Table of Contents

- [The Trilemma We Solved](#-the-trilemma-we-solved)
- [Core Features & Hackathon Alignment](#-core-features--hackathon-alignment)
- [Architecture Flow](#-architecture-flow)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🏗️ Architecture Flow

Data minimization at the source. PII never touches the public ledger.

```
 1. USER ACTION ──► 2. MCP SERVER ──► 3. LOCAL AI AGENT ──► 4. PRIVACY FILTER ──► 5. HEDERA NETWORK
 (Takes the train)  (Timeline Data)   (LLM parses data)     (Strips all PII)      (HCS & HTS)
```

### Client Layer (app/)
**Next.js Progressive Web App (PWA)** with Framer Motion animations. Connects via HashPack/Blade Wallet to the Hedera network. Beautiful, responsive UI that abstracts blockchain complexity.

### Brain Layer (agents/)
**Model Context Protocol (MCP) servers** fetch local data (Timeline, Receipts, Energy). A local LLM verifies actions and generates a zero-knowledge hash.

### Engine Layer (contracts/ & backend/)
Anonymous proofs are logged to the **Hedera Consensus Service (HCS)**. A smart contract triggers **Hedera Token Service (HTS)** to evolve your Flora NFT and mint $WISP tokens.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, React, TypeScript, Framer Motion, TailwindCSS |
| **Backend** | Node.js, Express, PostgreSQL |
| **AI/Agents** | Ollama (local LLM), MCP Servers (Timeline, Receipts, Energy) |
| **Blockchain** | Hedera (HCS, HTS), Solidity Smart Contracts, Hardhat |
| **Wallet** | HashPack, Blade Wallet |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Hedera Testnet Account
- Ollama (for local LLM)
- Git

### 1. Clone & Setup Contracts

```bash
git clone https://github.com/your-org/wisp.git
cd wisp/contracts
npm install
cp .env.example .env  # Add your Hedera Testnet keys
npx hardhat run scripts/deploy.js --network hedera_testnet
```

### 2. Start the Backend & AI Agents

```bash
cd ../backend
npm install
cp .env.example .env  # Add deployed contract addresses
npm run dev
```

### 3. Launch the Next.js PWA

```bash
cd ../app
npm install
npm run dev
```

Open **http://localhost:3000** to view the Wisp app.

---

## 📁 Project Structure

```
wisp/
├── app/                    # Next.js PWA frontend
│   ├── components/         # Reusable React components
│   ├── app/                # App routes & layouts
│   ├── context/            # React context (auth, state)
│   ├── lib/                # Utilities & helpers
│   └── public/             # Static assets
│
├── backend/                # Express API server
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── routes/         # API endpoints
│   │   ├── db/             # Database layer
│   │   ├── middleware/     # Auth, validation, rate-limiting
│   │   └── lib/            # Hedera client, game logic, rewards
│   └── scripts/            # Database setup & migration
│
├── agents/                 # AI agents & MCP servers
│   ├── src/
│   │   ├── mcp-servers/    # Timeline, Receipt, Energy servers
│   │   ├── llm/            # Ollama client configuration
│   │   ├── hedera/         # HCS client for proof logging
│   │   ├── privacy-filter/ # Zero-knowledge proof generation
│   │   └── rules/          # Green action validation rules
│
└── contracts/              # Solidity smart contracts
    ├── contracts/          # WispCore, WispSpirit, WispToken
    ├── scripts/            # Deploy & test scripts
    └── hardhat.config.js   # Hardhat configuration
```

---

## 🤝 Contributing

We welcome contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

---

## 📄 License

This project is licensed under the GPL-3.0 License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with 💚 by Team Big(O) for the Hedera Hello Future Hackathon.

</div>

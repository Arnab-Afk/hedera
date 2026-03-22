<div align="center">

<br />

# 🌿 Wisp

### *The Privacy-First Eco-Companion*

[![Hedera](https://img.shields.io/badge/Powered%20by-Hedera-3a3a8c?style=for-the-badge&logo=hedera)](https://hedera.com)
[![License](https://img.shields.io/badge/License-GPL--3.0-22c55e?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-a3e635?style=for-the-badge)](CONTRIBUTING.md)
[![React](https://img.shields.io/badge/React-Frontend-61dafb?style=for-the-badge&logo=react)](https://react.dev)
[![Built at](https://img.shields.io/badge/Built%20at-Hackathon-f59e0b?style=for-the-badge)](#)

<br />

> **Wisp** is a gamified, privacy-preserving mobile web app that turns your daily sustainable habits into tangible, on-chain rewards — without ever exposing your personal data.

<br />

</div>

---

## 📑 Table of Contents

- [The Problem](#-the-problem)
- [The Elevator Pitch](#-the-elevator-pitch)
- [Core Features](#-core-features)
- [How It Works](#-how-it-works-end-to-end-flow)
- [Technical Architecture](#%EF%B8%8F-technical-architecture)
  - [Frontend — Client Layer](#1-%EF%B8%8F-frontend--client-layer)
  - [Off-Chain AI & Privacy Layer](#2--off-chain-ai--privacy-layer--the-brain)
  - [Hedera On-Chain Layer](#3-%EF%B8%8F-hedera-on-chain-layer--the-engine)
- [Privacy Deep Dive](#-privacy-deep-dive)
- [The $WISP Token Economy](#-the-wisp-token-economy)
- [Why Hedera?](#-why-hedera)
- [Why This Architecture Wins](#-why-this-architecture-wins)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Roadmap](#%EF%B8%8F-roadmap)
- [FAQ](#-faq)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌍 The Problem

Consumer sustainability apps are broken in three fundamental ways:

1. **Privacy Betrayal** — To verify your green habits, apps demand access to your location history, bank transactions, and home energy data. This data is then stored on centralized servers or, worse, broadcast to public blockchains where anyone can trace your lifestyle from your wallet address.

2. **No Real Incentive** — "Eco-points" that expire and can only be spent in a walled garden are not real value. There is no tangible, portable reward that flows back into your local community.

3. **Verification vs. Fun** — Apps that are fun (gamified pets, streaks, leaderboards) tend to rely on the honor system with no verification. Apps that verify actions are rigid, surveillance-heavy, and joyless.

**Wisp was built to solve all three simultaneously.**

---

## ✨ The Elevator Pitch

Most sustainability apps ask you to make a choice: **gamification** or **privacy**. You can have the dopamine hit of maintaining a streak and nurturing a digital pet, *or* you can refuse to broadcast your location, shopping habits, and utility data to a public ledger. You've never been able to have both.

**Wisp solves that trilemma.**

By combining intelligent **off-chain AI agents** with **Hedera's high-throughput network**, Wisp verifies your real-world green actions locally — on your own device — and only commits an anonymous proof on-chain. Your raw data never leaves your hardware. Your streak is still fully verified. Your pet still evolves. And you still earn real rewards.

---

## 🔑 Core Features

### 🐾 The Wisp Spirit — A Living Dynamic NFT

Every Wisp user receives a **Wisp Spirit**, a dynamic NFT whose metadata and visual appearance evolve directly in response to your real-world green streak.

- **Day 1–7**: Your Spirit is a tiny seedling — small, fragile, full of potential.
- **Day 14**: Leaves begin to bloom. Your Spirit gains its first elemental trait.
- **Day 30**: A fully realized creature, radiating with color, animated particle effects, and unique traits generated from your streak history.
- **Missed a day?** Your spirit begins to wilt. Miss three consecutive days and it enters a dormant state — recoverable, but a visual reminder that consistency matters.

The NFT's metadata is managed on-chain via **Hedera Token Service (HTS)**, and updates are triggered by a smart contract that listens for verified action proofs on **Hedera Consensus Service (HCS)**. No JavaScript tricks — the evolution is fully on-chain and tamper-proof.

---

### 🔒 Zero-Knowledge Data Ingestion

Connect your data sources without fear. Supported integrations include:

| Data Source | What It Verifies |
|---|---|
| Public Transit APIs | Validated bus/metro/rail ticket scans |
| Smart Plug / Thermostat APIs | Below-average energy consumption days |
| Digital Receipt APIs | Purchases from partner eco-businesses |
| Grocery Loyalty Cards | Plant-based or sustainably sourced purchases |
| Carbon Offset Platforms | Verified offset certificate purchases |

**The key guarantee:** A local AI agent running entirely on your device fetches this data via secure **MCP (Model Context Protocol) Servers** and validates it against green-action criteria. The raw receipt, the store name, the energy reading — none of it ever leaves your phone. Not to Wisp's servers, not to a public ledger.

---

### 🏪 The Local Green Economy

Streaks earn you fractional **$WISP** utility tokens. These are real, transferable Hedera HTS fungible tokens, not locked points. They can be:

- **Redeemed** at partnered local eco-businesses (zero-waste cafes, thrift stores, local organic grocers) for discounts and perks.
- **Held** as they accumulate, since the token has a fixed supply tied to streak performance across the network.
- **Gifted** to friends or family on the Hedera network.

Partner merchants display a **"Wisp Accepted"** badge and receive a simple merchant dashboard to validate QR-code redemptions. A genuine, localized B2C micro-economy — powered by your habits.

---

## 🔄 How It Works: End-to-End Flow

Here is the complete journey from real-world action to on-chain reward:

```
 USER TAKES A GREEN ACTION
 (e.g., takes the bus to work)
          │
          ▼
 ┌────────────────────────┐
 │  MCP SERVER            │
 │  Fetches transit API   │──► Raw ticket validation data
 │  data securely         │    (stays local, encrypted)
 └────────────┬───────────┘
              │
              ▼
 ┌────────────────────────┐
 │  LOCAL AI AGENT (LLM)  │
 │  Parses raw data        │──► "Does this count as a green action?"
 │  Applies rule engine    │    Answer: YES / NO
 └────────────┬───────────┘
              │
              ▼
 ┌────────────────────────┐
 │  PRIVACY FILTER        │
 │  Generates anonymous   │──► Proof: "Wallet 0x... | Action: transit
 │  cryptographic proof   │           | Category: transport | TS: 1234"
 └────────────┬───────────┘
              │  (Only this proof leaves the device)
              ▼
 ┌────────────────────────┐
 │  HEDERA CONSENSUS      │
 │  SERVICE (HCS)         │──► Proof logged immutably to topic
 │  Immutable audit trail │    Timestamped, tamper-proof, anonymous
 └────────────┬───────────┘
              │
              ▼
 ┌────────────────────────┐
 │  SMART CONTRACT        │
 │  Listens to HCS topic  │──► Validates proof, updates streak counter
 │  Triggers rewards      │    on-chain
 └────────────┬───────────┘
              │
    ┌─────────┴─────────┐
    ▼                   ▼
 ┌──────────┐      ┌──────────────┐
 │ HTS NFT  │      │ HTS Fungible │
 │ Update   │      │ Token Mint   │
 │ pet meta │      │ $WISP sent   │
 │ on-chain │      │ to wallet    │
 └──────────┘      └──────────────┘
```

---

## 🏗️ Technical Architecture

Wisp's architecture is split into three distinct layers, each with a specialized responsibility and a hard boundary between them.

```
┌─────────────────────────────────────────────────┐
│              CLIENT LAYER (Frontend)            │
│   React Web App · HashPack / Blade Wallet       │
│   Pet Dashboard · Streak Counter · Marketplace  │
└────────────────────┬────────────────────────────┘
                     │  (User-facing interactions only)
┌────────────────────▼────────────────────────────┐
│     OFF-CHAIN AI & PRIVACY LAYER (The Brain)    │
│   MCP Servers · Local LLM · Privacy Filter      │
│   Anonymized Proof Generation (no PII emitted)  │
└────────────────────┬────────────────────────────┘
                     │  (Only anonymous proof crosses this boundary)
┌────────────────────▼────────────────────────────┐
│       HEDERA ON-CHAIN LAYER (The Engine)        │
│   HCS (Audit Trail) · HTS NFTs · HTS Fungible  │
│   Smart Contracts · $WISP Token Distribution   │
└─────────────────────────────────────────────────┘
```

---

### 1. 🖥️ Frontend — Client Layer

The frontend is a **mobile-first React web application** designed to feel indistinguishable from a polished Web2 consumer product. The blockchain is entirely abstracted from the user experience.

| Component | Technology | Details |
|---|---|---|
| **Framework** | React + Vite | Fast HMR, optimized production builds, mobile-first responsive design |
| **Wallet Integration** | HashPack / Blade | One-click Hedera account creation and wallet connection; no seed phrase management for new users |
| **Pet Dashboard** | React + CSS Animations | Animated Wisp Spirit rendered from on-chain NFT metadata; visual state reflects current streak health |
| **Streak Counter** | HCS Event Listener | Real-time streak data fetched from the on-chain HCS topic, displayed as a calendar heat map |
| **Marketplace** | React + Geolocation | Interactive map of local merchant partners where $WISP tokens can be redeemed |
| **Data Connection UI** | OAuth / MCP Auth Flow | Clean interface for users to authorize data source connections (no credentials stored by Wisp) |

---

### 2. 🧠 Off-Chain AI & Privacy Layer — The Brain

This layer is the heart of Wisp's privacy guarantee and where the AI Agent architecture is most prominent. **Nothing from this layer is publicly logged.**

#### MCP Servers (Model Context Protocol)

MCP Servers act as secure, scoped bridges to external data APIs. Each MCP Server is purpose-built for a specific data source:

| MCP Server | External API | Data Fetched | PII Exposure |
|---|---|---|---|
| `transit-mcp` | City transit validation APIs | Ticket scan confirmation (boolean) | None |
| `energy-mcp` | Smart plug / thermostat APIs | kWh usage for a day | None |
| `receipt-mcp` | Digital wallet / receipt APIs | Merchant category, purchase flag | None |

Each MCP Server communicates with the Local Agent over a local socket. API credentials are stored in the device's secure enclave — **Wisp's backend never sees them**.

#### Local LLM & Rule Engine

Once the MCP Server delivers the raw data packet to the device, a **locally-hosted LLM** (e.g., a quantized Mistral or Phi model running via llama.cpp or Ollama) parses it and runs it through a green-action rule engine:

- **Receipt validation**: Does the merchant category and item classifications pass our sustainability criteria? (e.g., vegan food = ✅, fast fashion = ❌)
- **Energy validation**: Is today's kWh reading below the user's 30-day baseline? Reduction threshold adjustable per user.
- **Transit validation**: Did a public transit scan occur today? Simple boolean check.

The LLM provides a transparent, auditable reasoning trace — visible only to the user — explaining exactly *why* an action was or wasn't counted.

#### Privacy Filter & Proof Generator

After local verification, the Privacy Filter creates a minimal, structured proof object:

```json
{
  "wallet": "0.0.XXXXXXX",
  "action_category": "public_transit",
  "timestamp": 1710000000,
  "day_sequence": 14,
  "proof_hash": "sha256:abc123..."
}
```

This is the *only* data that ever leaves the device. No store names. No energy readings. No receipt line-items. Just enough information for the on-chain layer to log, verify, and reward.

---

### 3. ⛓️ Hedera On-Chain Layer — The Engine

| Service | Role | Implementation Detail |
|---|---|---|
| **Hedera Consensus Service (HCS)** | Immutable, timestamped audit trail of verified user actions | Each proof is submitted as a message to a dedicated HCS topic. The topic is public (anyone can verify), but the messages contain only anonymized proof objects — no PII. |
| **HTS — Dynamic NFT (Wisp Spirit)** | Manages the living, evolving pet NFT | A smart contract subscribes to the HCS topic via a mirror node. On streak milestone events (Day 7, 14, 30, 60, 90), it calls `updateNFT()` to mutate the token's metadata URI, pointing to a new IPFS-hosted visual state. |
| **HTS — Fungible Token ($WISP)** | Reward token minted and distributed to users | The same smart contract triggers `transferToken()` to distribute a calculated quantity of $WISP from the rewards treasury to the user's wallet on each verified action. |
| **Smart Contracts** | Orchestration logic between HCS events and HTS operations | Written in Solidity, deployed on Hedera. Single entry point: `processVerifiedAction(proof)`. Handles streak state, milestone logic, NFT evolution triggers, and token distribution math. |

---

## 🔏 Privacy Deep Dive

Wisp's privacy model is built on the principle of **data minimization at the source**. Here is a detailed breakdown of what data is handled, where, and by whom:

| Data Type | Collected By | Stored Where | Sent To Wisp? | Sent On-Chain? |
|---|---|---|---|---|
| Transit API credentials | User | Device secure enclave | ❌ Never | ❌ Never |
| Raw transit ticket data | MCP Server | Device RAM (ephemeral) | ❌ Never | ❌ Never |
| Raw energy readings | MCP Server | Device RAM (ephemeral) | ❌ Never | ❌ Never |
| Raw receipt data | MCP Server | Device RAM (ephemeral) | ❌ Never | ❌ Never |
| Local LLM reasoning trace | Local Agent | Device local storage (optional) | ❌ Never | ❌ Never |
| Anonymized action proof | Privacy Filter | Submitted to HCS | ✅ (proof only) | ✅ (proof only) |
| Wallet address | User | Hedera ledger | ✅ (public key) | ✅ (public key) |
| Streak count | Smart Contract | Hedera ledger | ✅ (on-chain state) | ✅ (on-chain state) |
| $WISP token balance | Smart Contract | Hedera ledger | ✅ (on-chain state) | ✅ (on-chain state) |

**The Core Guarantee**: An adversary with full access to Wisp's backend servers and the entire Hedera blockchain can learn: (1) which wallets have streaks, (2) what category of green action they performed, and (3) when. They cannot learn *who* owns the wallet (pseudonymous by default), *where* the action took place, or *what specific product or service* was purchased.

---

## 💰 The $WISP Token Economy

$WISP is a fixed-supply HTS fungible token with a simple, transparent emission schedule designed to reward early adopters and long-term streakers.

| Parameter | Value |
|---|---|
| **Token Standard** | Hedera Token Service (HTS) Fungible |
| **Total Supply** | 100,000,000 $WISP |
| **Allocation — Rewards Treasury** | 70% (distributed via streak milestones) |
| **Allocation — Team & Development** | 15% (2-year vesting) |
| **Allocation — Partner Merchant Incentives** | 10% |
| **Allocation — Community & Grants** | 5% |

**Emission Logic (per verified action):**
- Base reward: `1 $WISP` per verified green action
- Streak multiplier: `×1.0` at day 1 → `×2.5` at day 30+ (linear scale)
- Category bonus: High-impact categories (e.g., carpooling > transit > energy reduction) receive up to `×1.5` bonus

---

## ⚡ Why Hedera?

Wisp's architecture is not blockchain-agnostic — it is **specifically designed for Hedera's unique capabilities**. Here is why any other chain would make Wisp non-viable:

### 1. Predictable, Sub-Cent Transaction Fees
Wisp's model requires logging a proof for *every verified action* by *every user*, *every day*. At scale (100,000 daily active users), that's 100,000 HCS messages and up to 100,000 token distributions *per day*.

- **On Ethereum**: At even $0.10/tx average, that's $10,000/day in gas — a project-ending cost.
- **On Hedera**: HCS messages cost ~$0.0001 and HTS transfers ~$0.001. The same 100,000 actions cost well under $150/day. This makes the micro-economy viable.

### 2. Hedera Consensus Service (HCS)
HCS is a unique primitive. Unlike bloating transaction history on a general-purpose ledger, HCS provides an **ordered, timestamped, immutable message log** designed exactly for audit trail use cases. It's a first-class fit for Wisp's anonymous proof logging system.

### 3. Energy Efficiency
As an **eco-focused** application, using a Proof-of-Work chain would be a fundamental contradiction. Hedera's governance model and consensus mechanism make it one of the most energy-efficient distributed ledgers available — a non-negotiable requirement for Wisp's brand integrity.

### 4. Native Token Service (HTS)
HTS provides built-in, high-performance fungible and non-fungible token operations without requiring complex, gas-heavy ERC-20 / ERC-721 smart contracts. NFT metadata updates and fractional token distributions are first-class, cheap operations on HTS — critical for Wisp's daily reward cycles.

---

## 🏆 Why This Architecture Wins

### 🎯 Hits Multiple Bounties
Dominates the **Sustainability track** by creating a real-world incentive structure with verifiable on-chain impact. Perfectly targets the **AI Agent bounty** by utilizing MCP Servers and locally-run LLMs for secure, intelligent data ingestion — the agents do real work, not just LLM API calls.

### ⚖️ Solves the Real Trilemma
Wisp simultaneously achieves **Gamification** (dynamic pet, streaks, leaderboards), **Verification** (MCP + local LLM + HCS audit trail), and **Privacy** (zero PII on-chain, zero PII on Wisp servers). Most projects sacrifice privacy for verification — Wisp refuses to compromise on any axis.

### ⚡ Built for Hedera's Strengths
Micro-distributing reward tokens and updating dynamic NFT metadata daily for thousands of users would be financially untenable on Ethereum. On Hedera, with its **low, predictable fees**, it's trivial. Wisp is an architecture that *only* makes sense on Hedera.

### 🌱 Real-World Behavior Change
Unlike carbon credit speculation or one-time NFT drops, Wisp targets **daily, repeatable behaviors** — taking the bus, lowering your thermostat, choosing a plant-based meal. The gamification loop is designed by behavioral economists to drive habit formation, not just app engagement.

---

## 🚀 Getting Started

> ⚠️ Wisp is currently in active development. The following setup guide targets contributors and hackathon evaluators.

### Prerequisites

- Node.js 18+
- A Hedera testnet account ([create one free at portal.hedera.com](https://portal.hedera.com))
- HashPack or Blade wallet browser extension (for frontend testing)
- Ollama or llama.cpp (for running the local LLM agent)

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/wisp.git
cd wisp
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Configure Environment

Copy the example environment file and fill in your Hedera testnet credentials:

```bash
cp .env.example .env
```

```env
# Hedera Testnet Configuration
HEDERA_NETWORK=testnet
HEDERA_OPERATOR_ID=0.0.XXXXXXX
HEDERA_OPERATOR_KEY=your_private_key_here

# HCS Topic ID (create one on testnet first)
HCS_TOPIC_ID=0.0.XXXXXXX

# HTS Token IDs (deploy contracts first)
WISP_TOKEN_ID=0.0.XXXXXXX
WISP_NFT_TOKEN_ID=0.0.XXXXXXX

# Local LLM endpoint (Ollama default)
LOCAL_LLM_ENDPOINT=http://localhost:11434
LOCAL_LLM_MODEL=mistral
```

### 4. Deploy Smart Contracts (Hedera Testnet)

```bash
cd contracts
npm install
npx hardhat run scripts/deploy.js --network hedera_testnet
```

### 5. Start the Local Agent

```bash
cd agent
npm install
npm run start
```

### 6. Start the Frontend

```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and connect your Hedera wallet.

---

## 📁 Project Structure

```
wisp/
├── frontend/                  # React + Vite mobile-first web app
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── WispSpirit/    # Dynamic NFT pet renderer
│   │   │   ├── StreakCalendar/ # HCS-driven streak visualization
│   │   │   └── Marketplace/   # Local merchant map & redemption UI
│   │   ├── hooks/             # Custom React hooks (wallet, HCS events)
│   │   ├── pages/             # Route-level page components
│   │   └── lib/               # Hedera SDK utilities, HCS listener
│   └── public/
│
├── agent/                     # Off-chain AI & Privacy Layer
│   ├── mcp-servers/           # MCP server implementations per data source
│   │   ├── transit-mcp/       # Public transit API bridge
│   │   ├── energy-mcp/        # Smart home energy API bridge
│   │   └── receipt-mcp/       # Digital receipt / loyalty card bridge
│   ├── llm/                   # Local LLM interface (Ollama / llama.cpp)
│   ├── rules/                 # Green action rule engine definitions
│   └── privacy-filter/        # Proof generator & anonymizer
│
├── contracts/                 # Hedera smart contracts (Solidity)
│   ├── WispCore.sol           # Main orchestration contract
│   ├── WispSpirit.sol         # Dynamic NFT logic
│   └── scripts/               # Deployment & setup scripts
│
└── docs/                      # Additional documentation & architecture diagrams
```

---

## 🛣️ Roadmap

### Phase 1 — Foundation *(Current)*
- [x] Core architecture design & documentation
- [x] Hedera testnet environment setup
- [ ] Smart contract development (`WispCore.sol`, `WispSpirit.sol`)
- [ ] HCS topic creation & proof submission scripts

### Phase 2 — The Brain
- [ ] MCP Server implementation (transit, energy, receipt)
- [ ] Local LLM integration via Ollama
- [ ] Green action rule engine
- [ ] Privacy filter & cryptographic proof generator

### Phase 3 — The Frontend
- [ ] Mobile-first React app foundation
- [ ] HashPack / Blade wallet integration
- [ ] Dynamic Wisp Spirit NFT renderer
- [ ] Streak calendar & dashboard

### Phase 4 — The Economy
- [ ] $WISP token deployment on HTS
- [ ] Token distribution via smart contract
- [ ] Merchant partner dashboard
- [ ] QR-code redemption flow

### Phase 5 — Polish & Launch
- [ ] Mainnet deployment
- [ ] Merchant onboarding portal
- [ ] Mobile app wrapper (PWA / Capacitor)
- [ ] Public beta launch

---

## ❓ FAQ

**Q: Is Wisp a blockchain app? Will I need crypto to use it?**
> Not in any scary way. Wisp abstracts the blockchain entirely. To new users, it feels like signing up with a social login. HashPack's "Smart Accounts" handle wallet creation in the background. You earn and spend $WISP tokens like loyalty points — the fact that they're on Hedera is an implementation detail.

**Q: Can the local LLM be bypassed to fake green actions?**
> No. The LLM is not the source of truth — it's a parser. The proof it generates must reference a verifiable data source (e.g., a transit API response that Wisp can independently check against a public record hash). Fabricating a proof without a corresponding HCS-logged data fingerprint causes the smart contract to reject it.

**Q: What happens to my Wisp Spirit NFT if I stop using the app?**
> Your Spirit enters a "dormant" visual state after 3 missed days and a "faded" state after 30 missed days. The NFT is never burned — it remains in your wallet forever as a record of your past streak. If you return, the Spirit begins to recover from its current state, not from scratch.

**Q: Are $WISP tokens exchangeable for real money?**
> $WISP is a utility token designed for redemption at partner merchants. Wisp does not operate a liquidity pool or facilitate token-to-fiat exchange. The token's value is derived entirely from its utility within the partner merchant network.

**Q: Why not use a zero-knowledge proof library like ZK-SNARKs instead of on-device processing?**
> Great question. ZK-SNARKs are mathematically elegant but generate proofs that are computationally expensive on mobile devices and difficult to audit by non-cryptographers. Our privacy model achieves equivalent guarantees for Wisp's threat model (preventing on-chain PII leakage) using simpler, faster techniques (local processing + anonymized proof structs) that are more practical at launch. ZK proof integration is a future roadmap consideration.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Here's how to get involved:

1. **Fork the repository** and create your feature branch: `git checkout -b feature/my-new-feature`
2. **Commit your changes**: `git commit -am 'Add some feature'`
3. **Push to the branch**: `git push origin feature/my-new-feature`
4. **Open a Pull Request** and describe what you've built and why

Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a PR. All contributors are expected to follow our [Code of Conduct](CODE_OF_CONDUCT.md).

For bugs and feature requests, please use the [issues page](#).

---

## 📄 License

Distributed under the GNU General Public License v3.0. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">

Built with 💚 by Team Big(O) for a greener future · Powered by [Hedera](https://hedera.com)

</div>

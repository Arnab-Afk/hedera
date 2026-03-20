<div align="center">

<br />

# 🌿 Wisp

### *The Privacy-First Eco-Companion*

[![Hedera](https://img.shields.io/badge/Powered%20by-Hedera-3a3a8c?style=for-the-badge&logo=hedera)](https://hedera.com)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-a3e635?style=for-the-badge)](CONTRIBUTING.md)
[![Built at](https://img.shields.io/badge/Built%20at-Hackathon-f59e0b?style=for-the-badge)](#)

<br />

> **Wisp** is a gamified, privacy-preserving mobile web app that turns your daily sustainable habits into tangible, on-chain rewards — without ever exposing your personal data.

<br />

</div>

---

## ✨ The Elevator Pitch

Most sustainability apps ask you to make a choice: **gamification** or **privacy**. You can have the dopamine hit of maintaining a streak and nurturing a digital pet, *or* you can refuse to broadcast your location, shopping habits, and utility data to a public ledger. You've never been able to have both.

**Wisp solves that trilemma.**

By combining intelligent **off-chain AI agents** with **Hedera's high-throughput network**, Wisp verifies your real-world green actions locally — on your own device — and only commits an anonymous proof on-chain. Your raw data never leaves your hardware. Your streak is still fully verified. Your pet still evolves. And you still earn real rewards.

---

## 🔑 Core Features

### 🐾 The Eco-Gotchi — A Living Dynamic NFT
Every Wisp user receives a **Wisp Spirit**, a dynamic NFT whose metadata and visual appearance evolve directly in response to your real-world green streak. Miss a day, your spirit fades. Keep it up, and it blooms.

### 🔒 Zero-Knowledge Data Ingestion
Connect your data sources — transit APIs, smart plugs, digital receipts. **Local AI agents** process all data *on-device*, verifying your action before anything is sent outward. Your raw Personal Identifiable Information (PII) never leaves your hardware.

### 🏪 The Local Green Economy
Streaks earn you fractional **$WISP** utility tokens, redeemable for discounts at partnered eco-businesses: local cafes, thrift stores, zero-waste shops. A genuine, localized B2C micro-economy — powered by your habits.

---

## 🏗️ Technical Architecture

Wisp's architecture is split into three distinct layers, each with a specialized responsibility.

```
┌─────────────────────────────────────────────────┐
│              CLIENT LAYER (Frontend)            │
│   React Web App · HashPack / Blade Wallet       │
│   Pet Dashboard · Streak Counter · Marketplace  │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│     OFF-CHAIN AI & PRIVACY LAYER (The Brain)    │
│   MCP Servers · Local LLM · Privacy Filter      │
│   Anonymized Proof Generation (no PII emitted)  │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│       HEDERA ON-CHAIN LAYER (The Engine)        │
│   HCS (Audit Trail) · HTS NFTs · HTS Fungible  │
│   Smart Contracts · $WISP Token Distribution   │
└─────────────────────────────────────────────────┘
```

---

### 1. 🖥️ Frontend — Client Layer

| Component | Details |
|---|---|
| **Framework** | Responsive, mobile-first React Web App — feels like a polished Web2 consumer app, with blockchain abstracted away |
| **Wallet Integration** | HashPack or Blade Wallet for seamless Hedera onboarding |
| **UI** | Dynamic pet dashboard, streak counter, and an interactive map/marketplace of local business partners |

---

### 2. 🧠 Off-Chain AI & Privacy Layer — The Brain

This is where user privacy is protected and the AI Agent bounty is targeted.

| Component | Details |
|---|---|
| **MCP Servers** | Act as a secure bridge to fetch data from external APIs (e.g., transit ticket validation, smart thermostat readings) without exposing credentials or raw data |
| **Local LLMs & Agents** | Once the MCP Server fetches raw data (e.g., an unstructured digital receipt from a vegan cafe), a local LLM parses it to verify it qualifies as a "green action" — entirely on-device, never touching OpenAI or a public endpoint |
| **Privacy Filter** | After local verification, the agent generates a cryptographic proof: *"Wallet X completed a valid action of Category Y at Timestamp Z"* — no location, no transaction details leaked |

---

### 3. ⛓️ Hedera On-Chain Layer — The Engine

| Service | Role |
|---|---|
| **Hedera Consensus Service (HCS)** | The anonymous proof is logged immutably to HCS, creating a tamper-proof audit trail of verified user actions. Prevents streak cheating while preserving data privacy. |
| **Hedera Token Service (HTS) — NFTs** | Manages the Wisp Spirit (dynamic pet). A smart contract listens for verified HCS events; on streak milestones, it updates the HTS token metadata, evolving the pet's visual traits. |
| **Hedera Token Service (HTS) — Fungible** | The same contract triggers HTS to mint and distribute fractional `$WISP` reward tokens to the user's wallet, redeemable at partnered merchants. |

---

## 🏆 Why This Architecture Wins

**🎯 Hits Multiple Bounties**
Dominates the **Sustainability track** by creating a real-world incentive structure. Perfectly targets the **AI Agent bounty** by utilizing MCP Servers and local LLMs for secure, intelligent data ingestion.

**⚖️ Solves the Real Trilemma**
Wisp simultaneously achieves **Gamification**, **Verification**, and **Privacy**. Most projects sacrifice privacy for verification — Wisp refuses to compromise.

**⚡ Built for Hedera's Strengths**
Micro-distributing reward tokens and updating dynamic NFT metadata daily for thousands of users would be financially untenable on Ethereum. On Hedera, with its **low, predictable fees**, it's trivial. Wisp is an architecture that *only* makes sense on Hedera.

---

## 🛣️ Roadmap

- [x] Core architecture design
- [ ] Frontend React app (mobile-first)
- [ ] Wallet integration (HashPack / Blade)
- [ ] MCP Server implementation
- [ ] Local LLM-based green action verifier
- [ ] Privacy filter & proof generator
- [ ] HCS proof logging
- [ ] Dynamic NFT smart contract (Wisp Spirit)
- [ ] $WISP token minting & distribution
- [ ] Local merchant partner marketplace

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](#).

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

Built with 💚 for a greener future · Powered by [Hedera](https://hedera.com)

</div>
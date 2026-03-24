import Link from 'next/link';

export const metadata = {
  title: 'Whitepaper | WISP',
  description: 'WISP: The Privacy-First Eco-Companion — A Whitepaper on Decentralized, Zero-Knowledge Sustainability Tracking',
};

const sections = [
  {
    id: 'abstract',
    label: 'Abstract',
    content: (
      <p className="text-on-surface-variant leading-relaxed text-base">
        Consumer sustainability applications are failing to achieve mainstream adoption due to a fundamental trilemma: they cannot simultaneously offer engaging gamification, rigorous verification, and absolute data privacy. Current models rely either on easily manipulated "honor systems" or invasive surveillance architectures that require raw GPS and financial data. Wisp introduces a novel paradigm. By utilizing on-device Local AI Agents (via the Model Context Protocol) and the Hedera network, Wisp verifies real-world green actions locally—generating anonymous cryptographic proofs logged to the Hedera Consensus Service (HCS), triggering dynamic Hedera Token Service (HTS) rewards—without ever exposing Personal Identifiable Information (PII) to the cloud or a public ledger.
      </p>
    ),
  },
];

export default function WhitepaperPage() {
  return (
    <div className="min-h-screen bg-background text-on-background">
      {/* Nav strip */}
      <header className="sticky top-0 z-40 border-b border-outline-variant/15 bg-background/90 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-headline font-bold text-green-800 uppercase tracking-[0.18em] text-sm hover:opacity-70 transition-opacity">
            ← WISP
          </Link>
          <a
            href="https://app.wisp3.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 bg-primary text-on-primary rounded-full font-headline font-bold uppercase tracking-widest text-xs hover:bg-primary-dim transition-colors"
          >
            Launch App
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">

        {/* Hero */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-px bg-primary" />
            <span className="text-primary text-xs font-headline tracking-[0.25em] uppercase">Whitepaper · v1.0</span>
          </div>
          <h1 className="font-headline font-black uppercase leading-tight tracking-tight text-on-background mb-4"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            WISP: The Privacy&#8209;First Eco&#8209;Companion
          </h1>
          <p className="text-on-surface-variant text-lg mb-6">
            A Whitepaper on Decentralized, Zero-Knowledge Sustainability Tracking
          </p>
          <div className="flex flex-wrap gap-3 text-xs font-lexend text-outline uppercase tracking-widest">
            <span className="px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/15">Version 1.0</span>
            <span className="px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/15">Team Big(O)</span>
            <span className="px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/15">Hedera Future Hack Apex</span>
          </div>
        </div>

        {/* Table of contents */}
        <nav className="mb-16 p-6 rounded-2xl bg-surface-container-low border border-outline-variant/15">
          <p className="text-xs font-headline tracking-[0.25em] uppercase text-primary mb-4">Table of Contents</p>
          <ol className="space-y-2">
            {[
              ['abstract',    'Abstract'],
              ['problem',     '1. The Sustainability App Trilemma'],
              ['solution',    '2. The Wisp Solution'],
              ['architecture','3. Core Architecture'],
              ['hedera',      '4. Hedera Network Integration'],
              ['gamification','5. Gamification & Behavioral Economics'],
              ['tokenomics',  '6. Tokenomics & The Local Green Economy'],
              ['roadmap',     '7. Roadmap'],
              ['conclusion',  '8. Conclusion'],
            ].map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} className="font-lexend text-sm text-on-surface-variant hover:text-primary transition-colors">
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Body */}
        <div className="space-y-20 font-lexend">

          {/* Abstract */}
          <section id="abstract">
            <SectionLabel>Abstract</SectionLabel>
            <p className="text-on-surface-variant leading-relaxed text-base">
              Consumer sustainability applications are failing to achieve mainstream adoption due to a fundamental trilemma: they cannot simultaneously offer engaging gamification, rigorous verification, and absolute data privacy. Current models rely either on easily manipulated &ldquo;honor systems&rdquo; or invasive surveillance architectures that require raw GPS and financial data. Wisp introduces a novel paradigm. By utilizing on-device Local AI Agents (via the Model Context Protocol) and the Hedera network, Wisp verifies real-world green actions locally—generating anonymous cryptographic proofs logged to the Hedera Consensus Service (HCS), triggering dynamic Hedera Token Service (HTS) rewards—without ever exposing Personal Identifiable Information (PII) to the cloud or a public ledger.
            </p>
          </section>

          {/* 1 */}
          <section id="problem">
            <SectionLabel n="1">The Sustainability App Trilemma</SectionLabel>
            <p className="text-on-surface-variant leading-relaxed text-base mb-8">
              The current landscape of consumer &ldquo;eco-apps&rdquo; suffers from three conflicting friction points:
            </p>
            <div className="space-y-4">
              {[
                ['The Verification Deficit', 'Apps that rely on manual logging are easily gamified by bad actors, rendering their associated "eco-points" worthless.'],
                ['The Privacy Betrayal', 'To combat fraud, modern apps demand full access to user location timelines, bank APIs, and smart home data. Environmentally conscious users are largely unwilling to participate in this surveillance capitalism.'],
                ['The Incentive Void', 'Rewards are typically confined to walled gardens—expiring points with no real-world monetary value or liquidity.'],
              ].map(([title, body]) => (
                <div key={title as string} className="flex gap-4 p-5 rounded-xl border border-outline-variant/15 bg-surface-container-low">
                  <span className="material-symbols-outlined text-primary text-lg mt-0.5 shrink-0">arrow_right</span>
                  <div>
                    <p className="font-headline font-bold text-on-surface text-sm uppercase tracking-wider mb-1">{title as string}</p>
                    <p className="text-on-surface-variant text-sm leading-relaxed">{body as string}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-on-surface-variant leading-relaxed text-base mt-8">
              Wisp solves this trilemma by decoupling action verification from user identity.
            </p>
          </section>

          {/* 2 */}
          <section id="solution">
            <SectionLabel n="2">The Wisp Solution</SectionLabel>
            <p className="text-on-surface-variant leading-relaxed text-base mb-4">
              Wisp is a gamified, zero-knowledge Progressive Web App (PWA) that transforms daily sustainable habits into tangible, on-chain rewards.
            </p>
            <p className="text-on-surface-variant leading-relaxed text-base">
              Instead of uploading user data to a centralized server for verification, Wisp brings the verification engine to the user. Using edge computing and localized Large Language Models (LLMs), Wisp acts as an impenetrable filter between the user&apos;s raw life data and the public blockchain. Hedera knows <em>what</em> green action occurred, but it mathematically cannot know <em>where</em> it happened or <em>who</em> the user is in the real world.
            </p>
          </section>

          {/* 3 */}
          <section id="architecture">
            <SectionLabel n="3">Core Architecture: The &ldquo;Zero-Knowledge via Local AI&rdquo; Model</SectionLabel>
            <p className="text-on-surface-variant leading-relaxed text-base mb-10">
              Wisp&apos;s architecture is strictly layered to enforce data minimization at the source.
            </p>

            <SubSection title="3.1 The Brain Layer (Off-Chain AI)">
              <p className="text-on-surface-variant leading-relaxed text-sm mb-6">
                Wisp utilizes Model Context Protocol (MCP) servers to securely fetch unstructured, real-world data natively on the user&apos;s device. A lightweight, locally hosted LLM parses this data against established sustainability rulesets. The MVP encompasses five distinct local verifiers:
              </p>
              <div className="space-y-3">
                {[
                  ['Timeline Verifier', 'Ingests native OS movement data to identify and verify "Green Commutes" (e.g., public transit, walking) without exposing coordinates.'],
                  ['Electricity Bill Verifier', 'Parses utility bills or smart meter APIs to verify week-over-week energy reductions.'],
                  ['Plant-Meal Verifier', 'Analyzes digital receipts for vegan, vegetarian, or sustainably sourced purchases, stripping away merchant names and locations.'],
                  ['Recycling Verifier', 'Utilizes local vision models to verify recycling actions via camera input.'],
                  ['Screen Time Verifier', 'Rewards digital wellness and reduced device power consumption.'],
                ].map(([title, body]) => (
                  <div key={title as string} className="flex gap-3 p-4 rounded-lg bg-primary-container/20 border border-primary/10">
                    <span className="material-symbols-outlined text-primary text-base mt-0.5 shrink-0">check_circle</span>
                    <div>
                      <span className="font-headline font-bold text-on-surface text-xs uppercase tracking-wider">{title as string}: </span>
                      <span className="text-on-surface-variant text-xs leading-relaxed">{body as string}</span>
                    </div>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title="3.2 The Privacy Filter">
              <p className="text-on-surface-variant leading-relaxed text-sm mb-4">
                Once the local LLM determines a green action is valid, it generates an anonymized payload:
              </p>
              <pre className="bg-surface-container-high rounded-xl p-5 text-sm font-mono text-on-surface overflow-x-auto border border-outline-variant/15">
                {`{ "wallet": "0.0.X", "category": "transit", "timestamp": 171... }`}
              </pre>
              <p className="text-on-surface-variant leading-relaxed text-sm mt-4">
                The LLM instantly flushes the raw data (GPS, store names, raw images) from local memory. The anonymized payload is hashed and prepared for on-chain submission.
              </p>
            </SubSection>
          </section>

          {/* 4 */}
          <section id="hedera">
            <SectionLabel n="4">The Engine Layer: Hedera Network Integration</SectionLabel>
            <p className="text-on-surface-variant leading-relaxed text-base mb-10">
              Wisp leverages the Hedera network exclusively. A traditional EVM blockchain cannot support Wisp due to the extreme gas costs associated with daily, high-frequency consumer micro-actions.
            </p>

            <SubSection title="4.1 Hedera Consensus Service (HCS)">
              <p className="text-on-surface-variant leading-relaxed text-sm">
                The anonymous proof generated by the Privacy Filter is submitted as a message to a public HCS topic. This creates an immutable, timestamped, and publicly auditable trail of a user&apos;s verified green streak. It prevents double-spending and streak manipulation without logging any PII.
              </p>
            </SubSection>

            <SubSection title="4.2 Hedera Token Service (HTS)">
              <p className="text-on-surface-variant leading-relaxed text-sm mb-4">
                Smart contracts mirror the HCS topic. Upon detecting a verified proof, the contract triggers HTS to execute two high-throughput operations at a sub-cent cost:
              </p>
              <ul className="space-y-2">
                {[
                  'Dynamic NFT Mutation: Evolving the user\'s visual avatar.',
                  'Token Minting: Distributing fractional reward tokens.',
                ].map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-on-surface-variant">
                    <span className="text-primary mt-1">•</span>{item}
                  </li>
                ))}
              </ul>
            </SubSection>
          </section>

          {/* 5 */}
          <section id="gamification">
            <SectionLabel n="5">Gamification & Behavioral Economics</SectionLabel>
            <p className="text-on-surface-variant leading-relaxed text-base mb-10">
              Wisp applies behavioral science to drive long-term habit formation.
            </p>
            <SubSection title="5.1 The Wisp Flora (Soulbound NFT)">
              <p className="text-on-surface-variant leading-relaxed text-sm mb-4">
                Upon onboarding, every user mints a Wisp Flora—a Soulbound (non-transferable) NFT. Because it is Soulbound, users cannot simply purchase a high-level status symbol; they must earn it through consistency.
              </p>
              <div className="space-y-3">
                {[
                  ['Evolution', 'As the user\'s verified streak grows on HCS, the smart contract updates the NFT\'s metadata URI. The Flora physically evolves from a fragile seed (Day 1) to a sapling (Day 14), culminating in a massive Ancient Ecosystem (Day 180+).'],
                  ['The Wilting Mechanic', 'If a user breaks their daily streak, the smart contract downgrades the Flora\'s visual state (wilting, dropping leaves). A subsequent verified action sparks immediate visual recovery.'],
                ].map(([title, body]) => (
                  <div key={title as string} className="p-4 rounded-lg bg-secondary-container/20 border border-outline-variant/10">
                    <p className="font-headline font-bold text-on-surface text-xs uppercase tracking-wider mb-1">{title as string}</p>
                    <p className="text-on-surface-variant text-sm leading-relaxed">{body as string}</p>
                  </div>
                ))}
              </div>
            </SubSection>
          </section>

          {/* 6 */}
          <section id="tokenomics">
            <SectionLabel n="6">Tokenomics & The Local Green Economy</SectionLabel>
            <p className="text-on-surface-variant leading-relaxed text-base mb-10">
              Wisp introduces the $WISP token, a fixed-supply HTS fungible utility token designed to bootstrap a localized B2C micro-economy.
            </p>

            <SubSection title="6.1 Token Supply & Allocation">
              <p className="text-on-surface-variant text-sm mb-6">Total Supply: <strong className="text-on-surface font-headline">100,000,000 $WISP</strong></p>
              <div className="space-y-3">
                {[
                  { label: 'Rewards Treasury',         pct: 70, note: 'Distributed programmatically via daily streaks', color: '#4a6741' },
                  { label: 'Team & Development',       pct: 15, note: 'Locked / Vested',                                 color: '#43627e' },
                  { label: 'Merchant Partner Incentives', pct: 10, note: 'Partner onboarding rewards',                   color: '#6e5e10' },
                  { label: 'Community & Grants',       pct:  5, note: 'Ecosystem grants',                                color: '#5a7a72' },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <div>
                        <span className="text-on-surface text-xs font-headline font-bold uppercase tracking-wider">{row.label}</span>
                        <span className="ml-2 text-outline text-[10px] uppercase tracking-wider">{row.note}</span>
                      </div>
                      <span className="font-headline font-black text-sm text-on-surface">{row.pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-container-high overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${row.pct}%`, background: row.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title="6.2 Emission Logic & Multipliers">
              <p className="text-on-surface-variant text-sm mb-4">
                Users earn a base reward of <strong className="text-on-surface">1 $WISP</strong> per verified action. Streak multipliers apply:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { range: 'Day 1–7',   mult: '1.0x' },
                  { range: 'Day 8–14',  mult: '1.5x' },
                  { range: 'Day 15–29', mult: '2.0x' },
                  { range: 'Day 30+',   mult: '2.5x' },
                ].map((m) => (
                  <div key={m.range} className="text-center p-4 rounded-xl bg-primary-container/25 border border-primary/10">
                    <p className="font-headline font-black text-primary text-xl">{m.mult}</p>
                    <p className="text-outline text-[10px] uppercase tracking-widest mt-1">{m.range}</p>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title="6.3 Utility & The Merchant Ecosystem">
              <p className="text-on-surface-variant leading-relaxed text-sm">
                $WISP is not meant for speculative trading. It is designed for immediate local utility. Users redeem $WISP for discounts at partnered zero-waste cafes, thrift stores, and sustainable grocers. Merchants utilize a lightweight Wisp Dashboard to scan QR-code redemptions, driving provable, eco-conscious foot traffic to their physical storefronts.
              </p>
            </SubSection>
          </section>

          {/* 7 */}
          <section id="roadmap">
            <SectionLabel n="7">Roadmap</SectionLabel>
            <div className="space-y-6">
              {[
                {
                  phase: 'Phase 1',
                  title: 'MVP & Architecture Validation',
                  status: 'Current',
                  color: 'bg-primary-container/40 border-primary/20',
                  items: [
                    'Implementation of MCP Local AI Agents.',
                    'Deployment of 5 core local verifiers.',
                    'Integration of HCS for audit trails and HTS for Flora NFTs.',
                  ],
                },
                {
                  phase: 'Phase 2',
                  title: 'Cryptographic Rigor & Native Mobile',
                  status: 'Q3 2026',
                  color: 'bg-secondary-container/30 border-outline-variant/15',
                  items: [
                    'ZK-SNARK Integration: Transitioning from simple cryptographic hashing to formal Zero-Knowledge proofs.',
                    'Native App Deployment: Migrating the Next.js PWA into fully native iOS/Android applications (via Capacitor).',
                  ],
                },
                {
                  phase: 'Phase 3',
                  title: 'Mainnet Launch & Merchant Onboarding',
                  status: 'Q4 2026',
                  color: 'bg-tertiary-container/25 border-outline-variant/15',
                  items: [
                    'Deployment to Hedera Mainnet.',
                    'Launch of the self-serve Merchant Portal for automated eco-business onboarding and $WISP redemption settlement.',
                  ],
                },
              ].map((phase) => (
                <div key={phase.phase} className={`p-6 rounded-2xl border ${phase.color}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-headline font-black text-xs uppercase tracking-widest text-primary">{phase.phase}</span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container text-outline text-[10px] uppercase tracking-widest font-headline">{phase.status}</span>
                  </div>
                  <p className="font-headline font-bold text-on-surface uppercase tracking-wide text-sm mb-4">{phase.title}</p>
                  <ul className="space-y-2">
                    {phase.items.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-on-surface-variant">
                        <span className="text-primary mt-1 shrink-0">•</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* 8 */}
          <section id="conclusion">
            <SectionLabel n="8">Conclusion</SectionLabel>
            <p className="text-on-surface-variant leading-relaxed text-base">
              Wisp proves that protecting the planet does not require sacrificing personal privacy. By synthesizing localized AI verification with the unparalleled speed and predictable cost of the Hedera network, Wisp creates a sustainable, fraud-resistant incentive layer for everyday consumer behavior. It is a fully scalable green economy, built on a carbon-negative ledger.
            </p>
          </section>

          {/* CTA */}
          <div className="pt-8 border-t border-outline-variant/15 flex flex-wrap gap-4">
            <a
              href="https://app.wisp3.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-primary text-on-primary rounded-full font-headline font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform"
            >
              Launch App
            </a>
            <a
              href="https://github.com/Arnab-Afk/hedera"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full font-headline font-bold uppercase tracking-widest text-sm border-2 border-outline/20 text-on-surface hover:bg-surface-container transition-colors"
            >
              View Source
            </a>
          </div>
        </div>
      </main>

      <footer className="border-t border-outline-variant/15 py-8 px-6 text-center">
        <p className="font-lexend text-xs text-outline uppercase tracking-widest">
          © 2026 WISP · Team Big(O) · All rights reserved.
        </p>
      </footer>
    </div>
  );
}

function SectionLabel({ n, children }: { n?: string | number; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="w-8 h-px bg-primary shrink-0" />
      <h2 className="font-headline font-black uppercase tracking-tight text-on-background text-xl md:text-2xl leading-tight">
        {n && <span className="text-primary mr-2">{n}.</span>}{children}
      </h2>
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <p className="font-headline font-bold text-on-surface text-sm uppercase tracking-wider mb-4 text-primary/80">{title}</p>
      {children}
    </div>
  );
}

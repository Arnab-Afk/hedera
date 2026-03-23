import Navbar from './navbar';
import PlantAnimation from './plant-animation';

export default function Home() {
  return (
    <>
      {/* ── TopNavBar ─────────────────────────────── */}
      <Navbar />

      <main>
        {/* ── Hero ─────────────────────────────────────── */}
        <section
          id="about"
          className="relative min-h-screen flex items-center overflow-hidden"
          style={{
            background:
              'radial-gradient(ellipse 110% 90% at 65% 40%, #d4ead0 0%, #fff8f1 55%, #faf2e9 100%)',
          }}
        >
          {/* Grid texture */}
          <div
            className="absolute inset-0 opacity-[0.032]"
            style={{
              backgroundImage:
                'linear-gradient(#4a6741 1px,transparent 1px),linear-gradient(90deg,#4a6741 1px,transparent 1px)',
              backgroundSize: '56px 56px',
            }}
          />

          {/* Background glow */}
          <div
            className="absolute top-1/2 right-[30%] -translate-y-1/2 w-[550px] h-[550px] rounded-full pointer-events-none animate-pulse-glow"
            style={{ background: 'radial-gradient(circle, rgba(74,103,65,0.09) 0%, transparent 70%)' }}
          />

          {/* Floating decorative orbs */}
          <div className="absolute top-24 left-[22%] animate-spin-slow pointer-events-none hidden lg:block">
            <div
              className="w-20 h-20 rounded-full"
              style={{
                border: '1px solid rgba(74,103,65,0.1)',
                borderTopColor: 'rgba(74,103,65,0.4)',
                borderRightColor: 'rgba(74,103,65,0.2)',
              }}
            />
          </div>
          <div className="absolute top-1/3 left-[12%] animate-float delay-4000 pointer-events-none hidden md:block">
            <div
              className="w-12 h-12 rounded-full"
              style={{
                background: 'rgba(202,236,188,0.5)',
                boxShadow: '0 4px 16px rgba(74,103,65,0.15)',
                border: '1px solid rgba(74,103,65,0.15)',
              }}
            />
          </div>
          <div className="absolute bottom-24 left-[6%] animate-float-slow delay-1000 pointer-events-none hidden md:block">
            <div
              className="w-36 h-36 animate-morph"
              style={{
                background: 'radial-gradient(circle at 35% 35%, rgba(202,236,188,0.85) 0%, rgba(167,215,148,0.3) 65%)',
                boxShadow: '0 8px 32px rgba(74,103,65,0.12)',
              }}
            />
          </div>

          {/* ── Two-column hero layout ── */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-36 lg:py-0 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-screen">

            {/* Left: Text */}
            <div>
              <p
                className="mb-6 inline-flex items-center gap-3 text-primary text-xs font-headline tracking-[0.25em] uppercase animate-fade-up"
                style={{ animationDelay: '0.1s' }}
              >
                <span className="w-5 h-px bg-primary" />
                Privacy First · On-Chain · Gamified
              </p>

              <h1
                className="font-headline font-black leading-[1.08] tracking-tight text-on-background animate-fade-up"
                style={{ fontSize: 'clamp(2.8rem, 5.5vw, 4.8rem)', animationDelay: '0.25s' }}
              >
                Go green.
                <br />
                <span className="text-primary">Stay private.</span>
                <br />
                Get rewarded.
              </h1>

              <p
                className="mt-6 text-on-surface-variant text-base leading-relaxed max-w-sm animate-fade-up"
                style={{ animationDelay: '0.45s' }}
              >
                Turn everyday sustainable choices into on chain rewards — without sharing a byte of personal data.
              </p>

              <div
                className="mt-10 flex flex-wrap gap-4 animate-fade-up"
                style={{ animationDelay: '0.6s' }}
              >
                <button className="px-8 py-4 bg-primary text-on-primary rounded-full font-headline font-bold uppercase tracking-widest text-sm hover:bg-primary-dim hover:scale-105 transition-all duration-200">
                  Start Earning
                </button>
                <a
                  href="#how-it-works"
                  className="px-8 py-4 border border-outline/20 text-on-surface rounded-full font-headline font-bold uppercase tracking-widest text-sm hover:bg-surface-container transition-colors duration-200"
                >
                  See How It Works
                </a>
              </div>

              {/* Social proof */}
              <div
                className="mt-10 flex items-center gap-5 animate-fade-up"
                style={{ animationDelay: '0.75s' }}
              >
                <div className="flex -space-x-2">
                  {['#4a6741', '#43627e', '#6e5e10', '#4a6741'].map((c, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-surface flex items-center justify-center"
                      style={{ background: c }}
                    >
                      <span className="text-white text-[8px] font-bold">
                        {['AB', 'IB', 'SK', 'OL'][i]}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-outline text-xs font-lexend tracking-widest uppercase">
                  2,400+ early members growing their flora
                </p>
              </div>
            </div>

            {/* Right: Plant animation */}
            <div
              className="hidden lg:flex items-center justify-center"
              style={{ animationDelay: '0.3s' }}
            >
              <div
                className="p-10 rounded-3xl"
                style={{
                  background: 'rgba(255,248,241,0.55)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(74,103,65,0.1)',
                  boxShadow: '0 24px 64px rgba(74,103,65,0.1)',
                }}
              >
                <PlantAnimation />
              </div>
            </div>
          </div>
        </section>

        {/* ── Ticker Tape ──────────────────────────── */}
        <section className="py-10 bg-surface-container-low border-y border-outline-variant/15 ticker-wrap">
          <div className="ticker-move">
            {[
              { icon: 'lock',           label: 'ZERO KNOWLEDGE' },
              { icon: 'filter_vintage', label: 'SOULBOUND NFT' },
              { icon: 'token',          label: '$WISP TOKENS' },
              { icon: 'hub',            label: 'HEDERA POWERED' },
              { icon: 'map',            label: 'MAPS TIMELINE' },
              { icon: 'public',         label: 'CARBON NEGATIVE' },
              { icon: 'lock',           label: 'ZERO KNOWLEDGE' },
              { icon: 'filter_vintage', label: 'SOULBOUND NFT' },
              { icon: 'token',          label: '$WISP TOKENS' },
              { icon: 'hub',            label: 'HEDERA POWERED' },
              { icon: 'map',            label: 'MAPS TIMELINE' },
              { icon: 'public',         label: 'CARBON NEGATIVE' },
            ].map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-4 text-outline font-headline font-bold uppercase tracking-[0.2em] text-xs mr-20"
              >
                <span className="material-symbols-outlined text-primary">{item.icon}</span>
                {item.label}
              </span>
            ))}
          </div>
        </section>

        {/* ── Features ──────────────────────────────── */}
        <section id="features" className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-px bg-primary" />
              <span className="text-primary text-xs font-headline tracking-[0.25em] uppercase">Features</span>
            </div>
            <h2 className="font-headline text-4xl md:text-5xl font-black uppercase tracking-tight text-on-background mb-16 max-w-lg leading-tight">
              Built for real impact
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: 'lock',
                  title: 'Zero Knowledge Tracking',
                  body: 'Your habits are verified entirely on-device. Nothing personal ever leaves your phone — just an anonymous proof that you did the right thing.',
                },
                {
                  icon: 'filter_vintage',
                  title: 'Grow Your Wisp Flora',
                  body: 'Every action nurtures a living Soulbound NFT. Watch it evolve from a seed into a full tree — or wilt if your streak breaks.',
                },
                {
                  icon: 'storefront',
                  title: 'Local Green Economy',
                  body: 'Forget expiring eco-points. Earn real $WISP utility tokens redeemable at zero-waste cafes and sustainable stores near you.',
                },
                {
                  icon: 'map',
                  title: 'Google Maps Timeline',
                  body: 'Connect your Google Maps Timeline and let Wisp auto-detect green routes — public transit, cycling, or walking — converting them into eco tokens automatically.',
                },
                {
                  icon: 'hub',
                  title: 'Powered by Hedera',
                  body: "Every verified action is logged to Hedera's carbon-negative network for sub-cent, immutable tracking via HCS and dynamic rewards via HTS.",
                },
                {
                  icon: 'psychology',
                  title: 'Local AI Verification',
                  body: 'An on-device LLM reads your raw data, confirms the green action, deletes the source, and generates only the anonymous proof that earns your reward.',
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="group flex flex-col gap-4 p-7 rounded-2xl border border-outline-variant/15 bg-surface-container-low hover:bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl">{card.icon}</span>
                  </div>
                  <h3 className="font-headline font-bold text-on-surface text-sm uppercase tracking-wider leading-tight">
                    {card.title}
                  </h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ──────────────────────────── */}
        <section id="how-it-works" className="py-32 px-6 bg-surface-container-low">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-px bg-primary" />
              <span className="text-primary text-xs font-headline tracking-[0.25em] uppercase">How It Works</span>
            </div>
            <h2 className="font-headline text-4xl md:text-5xl font-black uppercase tracking-tight text-on-background mb-20 max-w-md leading-tight">
              Three steps, real change
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 justify-items-center">
              {[
                {
                  step: '01',
                  title: 'Live Sustainably',
                  body: 'Take the train, cycle to work, or shop plant-based. Connect Maps Timeline securely.',
                  icon: 'directions_transit',
                  shape: 'rounded-[40%_60%_70%_30%/40%_50%_60%_50%]',
                  bg: 'bg-surface-container-high',
                },
                {
                  step: '02',
                  title: 'AI Verifies, Privately',
                  body: 'On-device LLM reads your data, confirms the green action, then deletes your personal info.',
                  icon: 'psychology',
                  shape: 'rounded-[60%_40%_30%_70%/60%_30%_70%_40%]',
                  bg: 'bg-secondary-container/40',
                },
                {
                  step: '03',
                  title: 'Earn & Evolve',
                  body: 'Your Flora NFT evolves and $WISP tokens land in your wallet  no middleman, no data leak.',
                  icon: 'token',
                  shape: 'rounded-[50%_50%_20%_80%/30%_80%_20%_70%]',
                  bg: 'bg-tertiary-container/30',
                },
              ].map((step) => (
                <div key={step.step} className="flex flex-col items-center gap-5">
                  {/* Fixed-size blob with overflow-hidden so text never escapes */}
                  <div
                    className={`w-72 h-72 ${step.shape} ${step.bg} overflow-hidden flex flex-col items-center justify-center text-center p-10 gap-3 border border-outline-variant/10 shadow-sm hover:scale-105 transition-transform duration-500`}
                  >
                    <span className="font-headline font-black text-5xl text-primary/20 leading-none">{step.step}</span>
                    <span className="material-symbols-outlined text-primary text-2xl">{step.icon}</span>
                    <p className="text-on-surface text-sm leading-relaxed font-medium">{step.body}</p>
                  </div>
                  <span className="font-headline font-bold uppercase tracking-[0.2em] text-primary text-xs">
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Tokenomics ────────────────────────────── */}
        <section id="tokenomics" className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-px bg-primary" />
              <span className="text-primary text-xs font-headline tracking-[0.25em] uppercase">Tokenomics</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
              {/* Left: info */}
              <div>
                <h2 className="font-headline text-4xl md:text-5xl font-black uppercase tracking-tight text-on-background mb-4 leading-tight">
                  The $WISP token
                </h2>
                <p className="text-on-surface-variant text-base leading-relaxed mb-10 max-w-sm">
                  A utility token that rewards real-world green behaviour earned by doing, spent locally, governed by the community.
                </p>

                {/* Total supply badge */}
                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-primary-container mb-10">
                  <span className="material-symbols-outlined text-primary text-lg">generating_tokens</span>
                  <span className="font-headline font-bold text-on-primary-container text-sm uppercase tracking-widest">
                    Total Supply · 1,000,000,000 $WISP
                  </span>
                </div>

                {/* Distribution bars */}
                <div className="space-y-5">
                  {[
                    { label: 'Community Rewards', pct: 40, note: 'Earn via verified actions', color: '#4a6741' },
                    { label: 'Ecosystem Fund',    pct: 20, note: '4-year linear release',    color: '#43627e' },
                    { label: 'Team & Advisors',   pct: 20, note: '2yr cliff + 2yr vest',     color: '#6e5e10' },
                    { label: 'Liquidity',          pct: 10, note: 'DEX & CEX provision',      color: '#5a7a72' },
                    { label: 'Treasury / DAO',     pct: 10, note: 'Community governed',       color: '#7a6a90' },
                  ].map((row) => (
                    <div key={row.label}>
                      <div className="flex justify-between items-baseline mb-1.5">
                        <div>
                          <span className="text-on-surface text-xs font-headline font bold uppercase tracking widest">
                            {row.label}
                          </span>
                          <span className="ml-2 text-outline text-[10px] uppercase tracking-wider">{row.note}</span>
                        </div>
                        <span className="font-headline font-black text-sm text-on-surface">{row.pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-surface-container-high overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${row.pct}%`, background: row.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: utility cards */}
              <div className="space-y-4">
                <p className="text-outline text-xs font-headline tracking-[0.25em] uppercase mb-6">Token Utility</p>
                {[
                  {
                    icon: 'eco',
                    title: 'Earn',
                    body: 'Every verified green action transit, low energy usage, plant-based shopping mints $WISP directly to your wallet.',
                    bg: 'bg-primary-container/40',
                  },
                  {
                    icon: 'storefront',
                    title: 'Spend',
                    body: 'Redeem tokens for real discounts at partnered zero-waste cafes, sustainable stores, and eco-service providers.',
                    bg: 'bg-secondary-container/30',
                  },
                  {
                    icon: 'how_to_vote',
                    title: 'Stake & Govern',
                    body: 'Lock $WISP to vote on new merchant partnerships, reward rates, and protocol upgrades. Stakers earn bonus yield.',
                    bg: 'bg-tertiary-container/30',
                  },
                ].map((card) => (
                  <div
                    key={card.title}
                    className={`flex gap-4 items-start p-6 rounded-2xl border border-outline-variant/10 ${card.bg} hover:shadow-md transition-all duration-300`}
                  >
                    <div className="w-9 h-9 shrink-0 rounded-lg bg-white/60 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-lg">{card.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-headline font-bold text-on-surface text-xs uppercase tracking-widest mb-1">
                        {card.title}
                      </h3>
                      <p className="text-on-surface-variant text-sm leading-relaxed">{card.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Team ──────────────────────────────────── */}
        <section className="py-32 px-6 bg-surface-container-low">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-20">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="w-8 h-px bg-primary" />
                  <span className="text-primary text-xs font-headline tracking-[0.25em] uppercase">The Team</span>
                </div>
                <h2 className="font-headline text-4xl md:text-5xl font-black uppercase tracking-widest text-on-background">
                  Voices for
                  <br />
                  the planet
                </h2>
              </div>
              <p className="text-outline uppercase font-headline font-bold tracking-widest text-sm hidden md:block">
                Est. 2026
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
              {[
                {
                  quote: '"If we\'re fighting climate change, our infrastructure can\'t add to it."',
                  name: 'Arnab Bhowmik',
                  role: 'Co-founder',
                  shape: 'rounded-[60%_40%_70%_30%/50%_60%_40%_50%]',
                  bg: 'bg-surface-container-low',
                  offset: '',
                },
                {
                  quote: '"I still get excited watching the Flora evolve. That\'s when you know a feature works."',
                  name: 'Ishika Bhoyar',
                  role: 'Co-founder',
                  shape: 'rounded-[40%_60%_30%_70%/60%_40%_60%_40%]',
                  bg: 'bg-secondary-container/25',
                  offset: 'lg:mt-12',
                },
                {
                  quote: '"Privacy and sustainability aren\'t opposites. Wisp is that proof."',
                  name: 'Saish Korgaonkar',
                  role: 'Co-founder',
                  shape: 'rounded-[50%_50%_60%_40%/40%_60%_40%_60%]',
                  bg: 'bg-tertiary-container/20',
                  offset: '',
                },
                {
                  quote: '"Proving something without oversharing that\'s just good design."',
                  name: 'Om Lanke',
                  role: 'Co-founder',
                  shape: 'rounded-[30%_70%_50%_50%/60%_30%_70%_40%]',
                  bg: 'bg-primary-container/30',
                  offset: 'lg:mt-12',
                },
              ].map((t) => (
                <div key={t.name} className={`flex flex-col items-center gap-4 ${t.offset}`}>
                  {/* Blob quote card */}
                  <div
                    className={`w-64 h-64 ${t.shape} ${t.bg} overflow-hidden flex items-center justify-center text-center p-10 border border-outline-variant/10 shadow-sm hover:scale-105 transition-transform duration-500`}
                  >
                    <p className="text-base italic text-on-surface leading-relaxed">{t.quote}</p>
                  </div>
                  <div className="text-center">
                    <div className="h-px w-8 bg-outline-variant/30 mx-auto mb-2" />
                    <h4 className="font-headline font-bold uppercase tracking-widest text-xs text-on-surface">{t.name}</h4>
                    <p className="text-[10px] uppercase tracking-widest text-outline mt-0.5">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Combined Blue CTA ──────────────────────── */}
        <section className="px-6 md:px-20 mb-20 pt-20">
          <div className="max-w-6xl mx-auto rounded-[3rem] py-20 px-12 md:px-20" style={{ background: '#c8daf4' }}>
            <h2
              className="font-headline font-black uppercase leading-none mb-16"
              style={{ color: '#1e3a5f', fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', letterSpacing: '-0.02em' }}
            >
              Every green step<br />should be verifiable.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                { icon: 'lock', value: 'Zero data stored',  sub: 'All verification happens on-device' },
                { icon: 'hub',  value: 'Hedera secured',    sub: 'Carbon-negative, sub-cent transactions' },
                { icon: 'eco',  value: 'Early access open', sub: 'Be among the first to grow your Flora' },
              ].map((item) => (
                <div key={item.value} className="flex flex-col gap-2">
                  <span className="material-symbols-outlined text-2xl" style={{ color: '#1e3a5f', opacity: 0.55 }}>{item.icon}</span>
                  <span className="font-headline font-black text-lg" style={{ color: '#1e3a5f' }}>{item.value}</span>
                  <span className="font-lexend text-xs" style={{ color: '#1e3a5f', opacity: 0.55 }}>{item.sub}</span>
                </div>
              ))}
            </div>

            <div className="h-px mb-12" style={{ background: 'rgba(30,58,95,0.12)' }} />
            <div className="flex flex-wrap gap-4">
              <a
                href="/app"
                className="px-8 py-4 rounded-full font-headline font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform inline-block"
                style={{ background: '#1e3a5f', color: '#c8daf4' }}
              >
                Join the collective
              </a>
              <a
                href="https://github.com/Arnab-Afk/hedera"
                target="_blank" rel="noopener noreferrer"
                className="px-8 py-4 rounded-full font-headline font-bold uppercase tracking-widest text-sm inline-flex items-center gap-2 hover:gap-3 transition-all border-2"
                style={{ color: '#1e3a5f', borderColor: 'rgba(30,58,95,0.3)' }}
              >
                View source <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────── */}
      <footer className="w-full bg-surface-container border-t border-stone-400/10 overflow-hidden">

        {/* Top: tagline | links col 1 | links col 2 + socials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-10 md:px-16 pt-16 pb-4">
          <p className="font-lexend text-base text-stone-500 leading-snug">
            Go green.<br />Stay private.<br />Get rewarded.
          </p>

          <div className="flex flex-col gap-3">
            {[
              { label: 'GitHub',     href: 'https://github.com/Arnab-Afk/hedera', external: true },
              { label: 'Tokenomics', href: '#tokenomics',                          external: false },
              { label: 'Whitepaper', href: '#',                                    external: false },
            ].map((l) => (
              <a key={l.label} href={l.href}
                target={l.external ? '_blank' : undefined}
                rel={l.external ? 'noopener noreferrer' : undefined}
                className="font-lexend text-sm text-stone-500 hover:text-green-800 transition-colors w-fit"
              >{l.label}</a>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {[
              { label: 'Discord', href: 'https://discord.com',  external: true },
              { label: 'Privacy', href: '#',                    external: false },
              { label: 'Contact', href: 'mailto:team@wisp.eco', external: true },
            ].map((l) => (
              <a key={l.label} href={l.href}
                target={l.external ? '_blank' : undefined}
                rel={l.external ? 'noopener noreferrer' : undefined}
                className="font-lexend text-sm text-stone-500 hover:text-green-800 transition-colors w-fit"
              >{l.label}</a>
            ))}
            <div className="flex gap-4 mt-2">
              <a href="https://github.com/Arnab-Afk/hedera" target="_blank" rel="noopener noreferrer"
                className="text-stone-400 hover:text-green-800 transition-colors" aria-label="GitHub">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="text-stone-400 hover:text-green-800 transition-colors" aria-label="Twitter">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer"
                className="text-stone-400 hover:text-green-800 transition-colors" aria-label="Discord">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Giant display wordmark */}
        <div className="overflow-hidden px-2">
          <p
            className="font-headline font-black uppercase select-none"
            style={{ fontSize: 'clamp(5rem, 21vw, 17rem)', letterSpacing: '-0.03em', lineHeight: 0.82, opacity: 0.75, color: '#4a6741' }}
          >
            WISP
          </p>
        </div>

        {/* Copyright strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-10 md:px-16 py-5 border-t border-stone-400/10">
          <p className="font-lexend text-xs tracking-[0.15em] uppercase text-stone-400">
            © 2026 WISP. All rights reserved.
          </p>
          <p className="font-lexend text-xs text-stone-400">
            Made with ♥ by <span className="text-primary font-semibold">Team Big(O)</span>
          </p>
        </div>
      </footer>
    </>
  );
}

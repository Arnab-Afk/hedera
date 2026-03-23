export default function Home() {
  return (
    <>
      {/* ── TopNavBar ─────────────────────────────── */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-stone-50/70 backdrop-blur-xl border-b border-stone-300/15">
        <div className="flex justify-between items-center px-6 md:px-12 py-5 w-full max-w-7xl mx-auto">
          <div className="text-lg font-bold tracking-[0.2em] text-green-800 uppercase font-headline">
            WISP
          </div>
          <div className="hidden md:flex gap-8 items-center">
            {[
              { label: "About", href: "#about" },
              { label: "Features", href: "#features" },
              { label: "How It Works", href: "#how-it-works" },
              { label: "Tokenomics", href: "#tokenomics" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-lexend tracking-widest uppercase text-xs font-medium text-stone-500 hover:text-green-700 transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>
          <button className="bg-primary text-on-primary px-6 py-2 rounded-full font-lexend tracking-widest uppercase text-xs font-bold hover:bg-primary-dim active:scale-95 transition-all duration-200">
            Launch App
          </button>
        </div>
      </nav>

      <main>
        {/* ── Hero ─────────────────────────────────────── */}
        <section
          id="about"
          className="relative min-h-screen flex items-center overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse 100% 80% at 60% 40%, #d4ead0 0%, #fff8f1 55%, #faf2e9 100%)",
          }}
        >
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(#4a6741 1px, transparent 1px), linear-gradient(90deg, #4a6741 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />

          {/* ── Floating orbs ── */}
          <div
            className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none animate-pulse-glow"
            style={{ background: "radial-gradient(circle, rgba(74,103,65,0.1) 0%, transparent 70%)" }}
          />
          <div className="absolute top-20 right-[6%] animate-float delay-300 pointer-events-none hidden md:block">
            <div
              className="w-52 h-52 rounded-full"
              style={{
                background: "radial-gradient(135deg at 30% 25%, rgba(202,236,188,0.9) 0%, rgba(74,103,65,0.25) 75%)",
                boxShadow: "0 8px 48px rgba(74,103,65,0.2), inset 0 0 30px rgba(202,236,188,0.3)",
              }}
            />
            <div
              className="absolute inset-3 rounded-full animate-spin-slow"
              style={{ border: "1px solid rgba(74,103,65,0.18)", borderTopColor: "rgba(74,103,65,0.55)" }}
            />
          </div>
          <div className="absolute bottom-24 left-[5%] animate-float-slow delay-1000 pointer-events-none hidden md:block">
            <div
              className="w-40 h-40 animate-morph"
              style={{
                background: "radial-gradient(circle at 35% 35%, rgba(202,236,188,0.85) 0%, rgba(167,215,148,0.35) 65%)",
                boxShadow: "0 8px 32px rgba(74,103,65,0.15)",
              }}
            />
          </div>
          <div className="absolute top-1/2 right-[15%] -translate-y-1/3 animate-orb-drift delay-2000 pointer-events-none hidden md:block">
            <div
              className="w-20 h-20 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(202,236,188,0.7) 0%, transparent 70%)",
                boxShadow: "0 4px 20px rgba(74,103,65,0.2)",
                border: "1px solid rgba(74,103,65,0.12)",
              }}
            />
          </div>
          <div className="absolute top-1/3 left-[14%] animate-float delay-4000 pointer-events-none hidden md:block">
            <div
              className="w-14 h-14 rounded-full"
              style={{
                background: "rgba(202,236,188,0.5)",
                boxShadow: "0 4px 16px rgba(74,103,65,0.15)",
                border: "1px solid rgba(74,103,65,0.15)",
              }}
            />
          </div>
          <div className="absolute top-24 left-[22%] animate-spin-slow pointer-events-none hidden lg:block">
            <div
              className="w-20 h-20 rounded-full"
              style={{
                border: "1px solid rgba(74,103,65,0.1)",
                borderTopColor: "rgba(74,103,65,0.4)",
                borderRightColor: "rgba(74,103,65,0.2)",
              }}
            />
          </div>

          {/* Floating NFT card */}
          <div
            className="absolute right-[4%] top-1/2 -translate-y-1/2 w-56 animate-float delay-500 pointer-events-none hidden lg:block"
            style={{
              border: "1px solid rgba(74,103,65,0.12)",
              borderRadius: "1.5rem",
              background: "rgba(255,248,241,0.65)",
              backdropFilter: "blur(18px)",
              boxShadow: "0 20px 60px rgba(74,103,65,0.1), 0 2px 8px rgba(74,103,65,0.06)",
            }}
          >
            <div className="p-5">
              <div
                className="w-full aspect-square rounded-xl mb-4 flex items-center justify-center"
                style={{
                  background: "radial-gradient(ellipse at 40% 30%, rgba(202,236,188,0.7) 0%, rgba(245,237,226,0.8) 70%)",
                  border: "1px solid rgba(74,103,65,0.1)",
                }}
              >
                <span className="material-symbols-outlined text-primary" style={{ fontSize: "3.5rem" }}>
                  filter_vintage
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-on-surface text-xs font-headline font-bold tracking-wider uppercase">Wisp Flora</p>
                  <p className="text-outline text-[10px] tracking-widest uppercase">Soulbound NFT</p>
                </div>
                <div className="text-right">
                  <p className="text-primary text-xs font-bold">Lv. 4</p>
                  <p className="text-outline text-[10px]">Seedling</p>
                </div>
              </div>
              <div className="mt-3 h-1 rounded-full bg-stone-200 overflow-hidden">
                <div className="w-3/5 h-full rounded-full bg-primary" />
              </div>
            </div>
          </div>

          {/* Status pills */}
          <div
            className="absolute right-[7%] top-[18%] animate-float delay-3000 pointer-events-none hidden lg:flex items-center gap-2 px-4 py-2"
            style={{
              border: "1px solid rgba(74,103,65,0.15)",
              borderRadius: "999px",
              background: "rgba(255,248,241,0.6)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-on-surface-variant text-[11px] font-headline tracking-widest uppercase">Privacy Verified</span>
          </div>
          <div
            className="absolute right-[19%] bottom-[22%] animate-orb-drift delay-1000 pointer-events-none hidden lg:flex items-center gap-2 px-4 py-2"
            style={{
              border: "1px solid rgba(74,103,65,0.12)",
              borderRadius: "999px",
              background: "rgba(255,248,241,0.6)",
              backdropFilter: "blur(12px)",
            }}
          >
            <span className="material-symbols-outlined text-primary" style={{ fontSize: "1rem" }}>token</span>
            <span className="text-on-surface-variant text-[11px] font-headline tracking-widest uppercase">+12 $WISP</span>
          </div>

          {/* ── Hero text ── */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-40 lg:py-0">
            <div className="max-w-xl">
              <p
                className="mb-6 inline-flex items-center gap-3 text-primary text-xs font-headline tracking-[0.25em] uppercase animate-fade-up"
                style={{ animationDelay: "0.1s" }}
              >
                <span className="w-5 h-px bg-primary" />
                Privacy-First · On-Chain · Gamified
              </p>

              <h1
                className="font-headline font-black leading-[1.08] tracking-tight text-on-background animate-fade-up"
                style={{ fontSize: "clamp(2.8rem, 6.5vw, 5rem)", animationDelay: "0.25s" }}
              >
                Go green.
                <br />
                <span className="text-primary">Stay private.</span>
                <br />
                Get rewarded.
              </h1>

              <p
                className="mt-6 text-on-surface-variant text-base leading-relaxed max-w-sm animate-fade-up"
                style={{ animationDelay: "0.45s" }}
              >
                Turn everyday sustainable choices into on-chain rewards — all without sharing a byte of personal data.
              </p>

              <div
                className="mt-10 flex flex-wrap gap-4 animate-fade-up"
                style={{ animationDelay: "0.6s" }}
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
            </div>
          </div>
        </section>

        {/* ── Ticker Tape ──────────────────────────── */}
        <section className="py-10 bg-surface-container-low border-y border-outline-variant/15 ticker-wrap">
          <div className="ticker-move">
            {[
              { icon: "lock", label: "ZERO KNOWLEDGE" },
              { icon: "filter_vintage", label: "SOULBOUND NFT" },
              { icon: "token", label: "$WISP TOKENS" },
              { icon: "hub", label: "HEDERA POWERED" },
              { icon: "map", label: "MAPS TIMELINE" },
              { icon: "public", label: "CARBON NEGATIVE" },
              { icon: "lock", label: "ZERO KNOWLEDGE" },
              { icon: "filter_vintage", label: "SOULBOUND NFT" },
              { icon: "token", label: "$WISP TOKENS" },
              { icon: "hub", label: "HEDERA POWERED" },
              { icon: "map", label: "MAPS TIMELINE" },
              { icon: "public", label: "CARBON NEGATIVE" },
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
                  icon: "lock",
                  title: "Zero-Knowledge Tracking",
                  body: "Your habits are verified entirely on-device. Nothing personal ever leaves your phone — just an anonymous proof that you did the right thing.",
                },
                {
                  icon: "filter_vintage",
                  title: "Grow Your Wisp Flora",
                  body: "Every action you take nurtures a living Soulbound NFT. Watch it evolve from a fragile seed into a full ecosystem as your impact compounds.",
                },
                {
                  icon: "storefront",
                  title: "Local Green Economy",
                  body: "Forget expiring eco-points. Earn real $WISP utility tokens redeemable at zero-waste cafes and sustainable stores near you.",
                },
                {
                  icon: "map",
                  title: "Google Maps Timeline",
                  body: "Connect your Google Maps Timeline and let Wisp auto-detect your green routes — public transit, cycling, or walking — and convert them into eco tokens automatically.",
                },
                {
                  icon: "hub",
                  title: "Powered by Hedera",
                  body: "Every verified action is logged to Hedera's carbon-negative network for sub-cent, immutable tracking via HCS and dynamic rewards via HTS.",
                },
                {
                  icon: "psychology",
                  title: "Local AI Verification",
                  body: "An on-device LLM reads your raw data, confirms the green action, then deletes the source — generating only the anonymous proof that earns your reward.",
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

        {/* ── Impact Statement ──────────────────────── */}
        <section id="tokenomics" className="py-40 bg-secondary-container">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="font-headline text-5xl md:text-7xl font-black uppercase tracking-tight text-on-secondary-container mb-12 leading-none">
              Impact should be measurable.
            </h2>
            <button className="inline-flex items-center gap-3 px-8 py-3 bg-white text-secondary font-headline font-bold uppercase tracking-widest text-xs rounded-full shadow-lg hover:shadow-xl transition-all">
              View the dashboard
              <span className="material-symbols-outlined">north_east</span>
            </button>
          </div>
        </section>

        {/* ── How It Works ──────────────────────────── */}
        <section id="how-it-works" className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-px bg-primary" />
              <span className="text-primary text-xs font-headline tracking-[0.25em] uppercase">How It Works</span>
            </div>
            <h2 className="font-headline text-4xl md:text-5xl font-black uppercase tracking-tight text-on-background mb-20 max-w-md leading-tight">
              Three steps, real change
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              {[
                {
                  step: "01",
                  title: "Live Sustainably",
                  body: "Take the train, cycle to work, or shop plant-based. Connect Google Maps Timeline or other local data sources securely via MCP servers.",
                  icon: "directions_transit",
                  shape: "rounded-[40%_60%_70%_30%/40%_50%_60%_50%]",
                  bg: "bg-surface-container-high",
                  rotation: "group-hover:rotate-6",
                },
                {
                  step: "02",
                  title: "AI Verifies, Privately",
                  body: "Wisp's on-device LLM reads your data, confirms the green action, then deletes everything personal — leaving only an anonymous proof.",
                  icon: "psychology",
                  shape: "rounded-[60%_40%_30%_70%/60%_30%_70%_40%]",
                  bg: "bg-secondary-container/30",
                  rotation: "group-hover:-rotate-6",
                },
                {
                  step: "03",
                  title: "Earn & Evolve",
                  body: "The proof hits Hedera's Consensus Service. Your Flora NFT evolves and $WISP tokens land in your wallet — no middleman, no data leak.",
                  icon: "token",
                  shape: "rounded-[50%_50%_20%_80%/30%_80%_20%_70%]",
                  bg: "bg-tertiary-container/20",
                  rotation: "group-hover:rotate-3",
                },
              ].map((step) => (
                <div key={step.step} className="group relative flex flex-col items-center">
                  <div
                    className={`w-80 h-80 ${step.shape} ${step.bg} flex flex-col items-center justify-center p-12 transition-all duration-700 ${step.rotation} group-hover:scale-105 border border-outline-variant/10 shadow-sm gap-3`}
                  >
                    <span className="font-headline font-black text-5xl text-primary/20">{step.step}</span>
                    <span className="material-symbols-outlined text-primary text-2xl">{step.icon}</span>
                    <p className="text-on-surface font-medium leading-relaxed text-center text-sm">{step.body}</p>
                  </div>
                  <span className="mt-8 font-headline font-bold uppercase tracking-widest text-primary text-sm">
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Team Testimonials ─────────────────────── */}
        <section className="py-32 px-6">
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
                Est. 2024
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  quote: '"Building on Hedera felt like an obvious choice — if we\'re fighting climate change, our infrastructure can\'t add to it."',
                  name: "Arnab Bhowmik",
                  role: "Co-founder",
                  bg: "bg-surface-container-low",
                  offset: "",
                },
                {
                  quote: '"The Flora NFT was my idea and I still get excited watching it evolve. That\'s when you know a feature works."',
                  name: "Ishika Bhoyar",
                  role: "Co-founder",
                  bg: "bg-surface-container",
                  offset: "lg:mt-12",
                },
                {
                  quote: '"I wanted to prove that privacy and sustainability aren\'t opposites. Wisp is that proof."',
                  name: "Saish Korgaonkar",
                  role: "Co-founder",
                  bg: "bg-surface-container-high",
                  offset: "",
                },
                {
                  quote: '"Zero-knowledge proofs sound scary until you realise all they do is let you prove something without oversharing. That\'s just good design."',
                  name: "Om Lanke",
                  role: "Co-founder",
                  bg: "bg-surface-container-lowest",
                  offset: "lg:mt-12",
                },
              ].map((t) => (
                <div
                  key={t.name}
                  className={`p-10 rounded-xl ${t.bg} border border-outline-variant/10 flex flex-col justify-between min-h-80 ${t.offset} hover:shadow-lg transition-all duration-300`}
                >
                  <p className="text-lg italic text-on-surface leading-relaxed">{t.quote}</p>
                  <div>
                    <div className="h-px bg-outline-variant/20 w-12 mb-4" />
                    <h4 className="font-headline font-bold uppercase tracking-widest text-sm text-on-surface">
                      {t.name}
                    </h4>
                    <p className="text-xs text-outline uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────── */}
        <section className="px-6 md:px-20 mb-32">
          <div className="max-w-6xl mx-auto bg-tertiary-container rounded-[4rem] p-16 md:p-28 text-center relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
            <h2 className="relative z-10 font-headline text-5xl md:text-7xl font-black uppercase tracking-tight text-on-tertiary-container mb-10 leading-none">
              Be part of
              <br />
              the change
            </h2>
            <div className="relative z-10 flex flex-wrap justify-center gap-6">
              <button className="px-10 py-4 bg-primary text-on-primary rounded-full font-headline font-bold uppercase tracking-widest text-sm shadow-xl hover:scale-105 transition-transform">
                Join the collective
              </button>
              <button className="px-10 py-4 border-2 border-primary/20 text-primary rounded-full font-headline font-bold uppercase tracking-widest text-sm hover:bg-white/30 transition-colors">
                Partnerships
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────── */}
      <footer className="w-full rounded-t-xl mt-20 bg-surface-container border-t border-stone-400/10">
        <div className="flex flex-col items-center justify-center gap-10 px-8 py-20 w-full">
          <div className="text-lg font-black tracking-[0.2em] text-green-900 font-headline uppercase">
            WISP
          </div>
          <div className="flex flex-wrap justify-center gap-10">
            {["Privacy", "Tokenomics", "Press", "Careers", "Contact"].map((link) => (
              <a
                key={link}
                className="font-lexend text-xs tracking-widest uppercase text-stone-500 hover:text-green-800 transition-all hover:-translate-y-0.5"
                href="#"
              >
                {link}
              </a>
            ))}
          </div>
          <div className="flex gap-8">
            {["language", "diversity_3", "temp_preferences_eco"].map((icon) => (
              <span
                key={icon}
                className="material-symbols-outlined text-stone-400 hover:text-primary cursor-pointer transition-colors"
              >
                {icon}
              </span>
            ))}
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="font-lexend text-xs tracking-[0.2em] uppercase text-stone-400">
              © 2026 WISP. ALL RIGHTS RESERVED.
            </p>
            <p className="font-lexend text-xs text-stone-400">
              Made with ♥ by{" "}
              <span className="text-primary font-semibold">Team Big(O)</span>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

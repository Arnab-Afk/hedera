export default function Home() {
  return (
    <>
      {/* TopNavBar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-stone-50/60 backdrop-blur-xl border-b border-stone-300/15">
        <div className="flex justify-between items-center px-6 md:px-12 py-5 w-full max-w-360 mx-auto">
          <div className="text-xl font-bold tracking-[0.15em] text-green-800 uppercase font-headline">
            CURATOR
          </div>
          <div className="hidden md:flex gap-8 items-center">
            {["About", "Initiatives", "Impact", "Blog", "Contact"].map((link) => (
              <a
                key={link}
                className="font-lexend tracking-widest uppercase text-sm font-medium text-stone-500 hover:text-green-700 transition-colors duration-300"
                href="#"
              >
                {link}
              </a>
            ))}
          </div>
          <button className="bg-primary text-on-primary px-6 py-2 rounded-full font-lexend tracking-widest uppercase text-xs font-bold active:scale-95 transition-transform duration-200">
            Get Involved
          </button>
        </div>
      </nav>

      <main className="pt-32">
        {/* Hero Section */}
        <section className="px-6 md:px-20 mb-32">
          <div className="max-w-360 mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-12 order-2 md:order-1">
              <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-black leading-tight tracking-[0.05em] uppercase text-on-background">
                ENTERING SUSTAINABLE ECO SYSTEM ISN&apos;T EASY BUT EASY BUSY!
              </h1>
              <p className="text-xl text-on-surface-variant max-w-lg leading-relaxed">
                Curating a future where every whisper of intent becomes a gale of change. Wisp designs tools for the modern environmental steward.
              </p>
              <div className="flex flex-wrap gap-6">
                <button className="px-8 py-4 bg-primary text-on-primary rounded-full font-headline font-bold uppercase tracking-widest text-sm hover:bg-primary-dim transition-colors">
                  Explore our impact
                </button>
                <button className="px-8 py-4 border border-outline/20 text-on-surface rounded-full font-headline font-bold uppercase tracking-widest text-sm hover:bg-surface-container transition-colors">
                  Our story
                </button>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative w-full aspect-4/5 rounded-[4rem] overflow-hidden bg-linear-to-br from-secondary-container via-surface-container to-tertiary-container shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Dreamy mountain landscape with soft pastel gradient sky"
                  className="w-full h-full object-cover mix-blend-overlay opacity-80"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_ipvndRx7oCQYQQgyHVogY69mfzPRU0nh1FLKDdFxY0fOOfc6b1tnt6JbITq8rNEYlMKRSO5rUknF75GrXTRYW6WWCqG4Php3NB-S3Zpq7BTdXGsK7nt45Wzbt3RvfBA8tLptFmk3tK3kIDW0DZjld7v4QOJMTNecoriluMYg3VrnGXg-9IcA6AMjvTWfWqSGqarTQX-Hw0MWVJR04BMiH3y9nSnwshCZToMGkWyrRAqi2qy3tetar0JncN9XaQEND1kP_RyCXM"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background/40 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Ticker Tape */}
        <section className="py-12 bg-surface-container-low border-y border-outline-variant/15 ticker-wrap">
          <div className="ticker-move flex gap-20 items-center">
            {[
              { icon: "eco", label: "B-CORP CERTIFIED" },
              { icon: "filter_vintage", label: "100% RECYCLED" },
              { icon: "water_drop", label: "WATER NEUTRAL" },
              { icon: "public", label: "CLIMATE POSITIVE" },
              { icon: "energy_savings_leaf", label: "RENEWABLE FIRST" },
              { icon: "eco", label: "B-CORP CERTIFIED" },
              { icon: "filter_vintage", label: "100% RECYCLED" },
              { icon: "water_drop", label: "WATER NEUTRAL" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 text-outline font-headline font-bold uppercase tracking-[0.2em] text-xs"
              >
                <span className="material-symbols-outlined text-primary">{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </section>

        {/* Why We Exist */}
        <section className="py-32 px-6">
          <div className="max-w-360 mx-auto text-center">
            <h2 className="font-headline text-4xl md:text-5xl font-black uppercase tracking-widest mb-24">
              Why We Exist
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="group relative flex flex-col items-center">
                <div className="w-80 h-80 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-surface-container-high flex items-center justify-center p-12 transition-all duration-700 group-hover:rotate-6 group-hover:scale-105 border border-outline-variant/10 shadow-sm">
                  <p className="text-on-surface font-medium leading-relaxed">
                    Systemic problems require systemic whispers. We dismantle the old to breed the new.
                  </p>
                </div>
                <span className="mt-8 font-headline font-bold uppercase tracking-widest text-primary text-sm">
                  Curation of Change
                </span>
              </div>
              <div className="group relative flex flex-col items-center mt-12 lg:mt-0">
                <div className="w-80 h-80 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-secondary-container/30 flex items-center justify-center p-12 transition-all duration-700 group-hover:-rotate-6 group-hover:scale-105 border border-outline-variant/10 shadow-sm">
                  <p className="text-on-surface font-medium leading-relaxed">
                    A futuristic approach to the ancient art of living with the land, not on it.
                  </p>
                </div>
                <span className="mt-8 font-headline font-bold uppercase tracking-widest text-primary text-sm">
                  Futuristic Roots
                </span>
              </div>
              <div className="group relative flex flex-col items-center">
                <div className="w-80 h-80 rounded-[50%_50%_20%_80%/30%_80%_20%_70%] bg-tertiary-container/20 flex items-center justify-center p-12 transition-all duration-700 group-hover:rotate-3 group-hover:scale-105 border border-outline-variant/10 shadow-sm">
                  <p className="text-on-surface font-medium leading-relaxed">
                    Every decision is a vote. We curate the options that make the vote count.
                  </p>
                </div>
                <span className="mt-8 font-headline font-bold uppercase tracking-widest text-primary text-sm">
                  Ethical Velocity
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Statement */}
        <section className="py-40 bg-secondary-container">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="font-headline text-5xl md:text-7xl font-black uppercase tracking-tight text-on-secondary-container mb-12 leading-none">
              We believe impact should be measurable.
            </h2>
            <button className="inline-flex items-center gap-3 px-8 py-3 bg-white text-secondary font-headline font-bold uppercase tracking-widest text-xs rounded-full shadow-lg hover:shadow-xl transition-all">
              View the dashboard{" "}
              <span className="material-symbols-outlined">north_east</span>
            </button>
          </div>
        </section>

        {/* Voices for the Planet */}
        <section className="py-32 px-6">
          <div className="max-w-360 mx-auto">
            <div className="flex justify-between items-end mb-20">
              <h2 className="font-headline text-4xl md:text-5xl font-black uppercase tracking-widest">
                Voices for
                <br />
                the planet
              </h2>
              <p className="text-outline uppercase font-headline font-bold tracking-widest text-sm hidden md:block">
                Est. 2024
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  quote: '"Wisp doesn\'t just talk about sustainability; they build the canvas for it. The curation is unmatched."',
                  name: "Elena Voss",
                  role: "Architect",
                  bg: "bg-surface-container-low",
                  offset: "",
                },
                {
                  quote: '"The approach to data and beauty in harmony is something the industry has missed for decades."',
                  name: "Marcus Aris",
                  role: "Eco-Strategist",
                  bg: "bg-surface-container",
                  offset: "lg:mt-12",
                },
                {
                  quote: '"A breathe of fresh air in a crowded marketplace of empty promises. Truly editorial sustainability."',
                  name: "Sarah Jen",
                  role: "Biologist",
                  bg: "bg-surface-container-high",
                  offset: "",
                },
                {
                  quote: '"They treat nature as a collaborator, not a resource. That mindset shift is everything."',
                  name: "Julian Low",
                  role: "Designer",
                  bg: "bg-surface-container-lowest",
                  offset: "lg:mt-12",
                },
              ].map((t) => (
                <div
                  key={t.name}
                  className={`p-10 rounded-xl ${t.bg} border border-outline-variant/10 flex flex-col justify-between min-h-80 ${t.offset}`}
                >
                  <p className="text-lg italic text-on-surface">{t.quote}</p>
                  <div>
                    <div className="h-px bg-outline-variant/20 w-12 mb-4" />
                    <h4 className="font-headline font-bold uppercase tracking-widest text-sm">
                      {t.name}
                    </h4>
                    <p className="text-xs text-outline uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Block */}
        <section className="px-6 md:px-20 mb-32">
          <div className="max-w-360 mx-auto bg-tertiary-container rounded-[4rem] p-16 md:p-32 text-center relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
            <h2 className="relative z-10 font-headline text-5xl md:text-8xl font-black uppercase tracking-tight text-on-tertiary-container mb-12 leading-none">
              Be part of
              <br />
              the change
            </h2>
            <div className="relative z-10 flex flex-wrap justify-center gap-6">
              <button className="px-12 py-5 bg-primary text-on-primary rounded-full font-headline font-bold uppercase tracking-widest text-sm shadow-xl hover:scale-105 transition-transform">
                Join the collective
              </button>
              <button className="px-12 py-5 border-2 border-primary/20 text-primary rounded-full font-headline font-bold uppercase tracking-widest text-sm hover:bg-white/30 transition-colors">
                Partnerships
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full rounded-t-xl mt-20 bg-surface-container border-t border-stone-400/10">
        <div className="flex flex-col items-center justify-center gap-12 px-8 py-24 w-full">
          <div className="text-lg font-black tracking-tighter text-green-900 font-headline uppercase">
            THE DIGITAL CURATOR
          </div>
          <div className="flex flex-wrap justify-center gap-12">
            {["Sustainability", "Ethics", "Press", "Careers", "Privacy"].map((link) => (
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
          <p className="font-lexend text-xs tracking-[0.2em] uppercase text-stone-400">
            © 2024 THE DIGITAL CURATOR. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </>
  );
}

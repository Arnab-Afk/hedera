'use client';
import { useState, useEffect } from 'react';

const links = [
  { label: 'About',        href: '#about' },
  { label: 'Features',     href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Tokenomics',   href: '#tokenomics' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    /*
      Outer wrapper: always full-width, flex-centered.
      Adding top padding when scrolled moves the pill away from the edge
      symmetrically — no left/right position jumps.
    */
    <div
      className="fixed left-0 right-0 z-50 flex justify-center"
      style={{
        paddingTop:  scrolled ? '0.9rem' : '0',
        paddingLeft: scrolled ? '1rem'   : '0',
        paddingRight:scrolled ? '1rem'   : '0',
        transition:  'padding 0.5s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <nav
        style={{
          width:         scrolled ? 'auto' : '100%',
          maxWidth:      scrolled ? '680px' : '100%',
          transition:    'all 0.5s cubic-bezier(0.4,0,0.2,1)',
          background:    scrolled ? 'rgba(255,248,241,0.92)' : 'rgba(250,242,233,0.75)',
          backdropFilter:'blur(24px)',
          borderRadius:  scrolled ? '9999px' : '0',
          boxShadow:     scrolled
            ? '0 8px 40px rgba(74,103,65,0.13), 0 2px 8px rgba(74,103,65,0.07), inset 0 1px 0 rgba(255,255,255,0.6)'
            : 'none',
          border:        scrolled ? '1px solid rgba(74,103,65,0.12)' : 'none',
          borderBottom:  scrolled ? 'none' : '1px solid rgba(184,177,165,0.15)',
          padding:       scrolled ? '0.8rem 1.2rem' : '1rem 1.25rem',
          paddingLeft:   scrolled ? '1.8rem' : 'clamp(1rem, 5vw, 3rem)',
          paddingRight:  scrolled ? '1.8rem' : 'clamp(1rem, 5vw, 3rem)',
          display:       'flex',
          alignItems:    'center',
          justifyContent:'space-between',
          gap:           '1rem',
          whiteSpace:    'nowrap',
        }}
      >
        {/* Logo */}
        <a
          href="/"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="font-headline font-bold text-green-800 uppercase"
          style={{
            fontSize:      scrolled ? '0.85rem' : '1.1rem',
            letterSpacing: '0.18em',
            transition:    'font-size 0.5s cubic-bezier(0.4,0,0.2,1)',
            flexShrink:    0,
            textDecoration:'none',
          }}
        >
          WISP
        </a>

        {/* Nav links — always in markup, clip via max-width */}
        <div
          className="hidden md:flex items-center"
          style={{
            gap:           scrolled ? '1.5rem' : '2rem',
            transition:    'gap 0.5s ease',
            overflow:      'hidden',
          }}
        >
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="font-lexend text-stone-500 hover:text-green-700 transition-colors duration-200"
              style={{
                fontSize:      scrolled ? '0.7rem' : '0.72rem',
                fontWeight:    600,
                letterSpacing: '0.13em',
                textTransform: 'uppercase',
                transition:    'font-size 0.5s ease',
              }}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA */}
          <a
          href="https://app.wisp3.xyz/"
          className="bg-primary text-on-primary font-lexend uppercase font-bold tracking-widest hover:bg-primary-dim active:scale-95 transition-colors duration-200"
          style={{
            fontSize:    '0.65rem',
            padding:     scrolled ? '0.45rem 1rem' : '0.5rem 1.15rem',
            borderRadius:'9999px',
            flexShrink:  0,
            transition:  'padding 0.5s cubic-bezier(0.4,0,0.2,1)',
            whiteSpace:  'nowrap',
          }}
        >
          Launch App
        </a>
      </nav>
    </div>
  );
}

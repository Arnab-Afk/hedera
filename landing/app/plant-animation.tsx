'use client';
import { useState, useEffect } from 'react';

/*
  Stage progression:
  0 – seed sprout  (just a tiny stem, no blob)
  1 – seedling     (stem + 1 leaf, no blob)
  2 – young plant  (stem + 2 leaves, blob starts ghosting in)
  3 – morphing     (stem fades, blob solidifies, ear-leaves emerge)
  4 – full character (kawaii blob with face, ear leaves, pot)
*/
const STAGES = [
  { stemScale: 0.15, leaf1: 0,   leaf2: 0,   blob: 0,    ear: 0,    face: 0, label: 'Seed planted 🌱' },
  { stemScale: 0.42, leaf1: 1,   leaf2: 0,   blob: 0,    ear: 0,    face: 0, label: 'Day 3 · Sprouting' },
  { stemScale: 0.72, leaf1: 1,   leaf2: 1,   blob: 0.25, ear: 0,    face: 0, label: 'Day 7 · Seedling' },
  { stemScale: 0.90, leaf1: 0.4, leaf2: 0.4, blob: 0.75, ear: 0.6,  face: 0, label: 'Day 14 · Transforming ✨' },
  { stemScale: 0,    leaf1: 0,   leaf2: 0,   blob: 1,    ear: 1,    face: 1, label: 'Day 30 · Flourishing 🌟' },
];

const ease = '0.85s cubic-bezier(0.34,1.3,0.64,1)';
const easeLinear = '0.7s ease';

export default function PlantAnimation() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const delay = idx >= STAGES.length - 1 ? 3200 : 2200;
    const t = setTimeout(() => setIdx((i) => (i + 1) % STAGES.length), delay);
    return () => clearTimeout(t);
  }, [idx]);

  const s = STAGES[idx];
  const bodyCx = 100;
  const bodyCy = 170;

  /* Stem top Y: grows upward from soil (y=252) */
  const stemTopY = 252 - s.stemScale * 140;

  return (
    <div className="flex flex-col items-center gap-5 select-none">
      <svg viewBox="0 0 200 295" width={260} height={338} className="overflow-visible">

        {/* ── Pot ── (always visible) */}
        <ellipse cx={100} cy={260} rx={52} ry={11} fill="#c9633a" />
        <path d="M 52 260 Q 48 283 58 288 L 142 288 Q 152 283 148 260 Z" fill="#e07b54" />
        <path d="M 58 263 Q 56 274 62 281" stroke="rgba(255,255,255,0.18)" strokeWidth={4} fill="none" strokeLinecap="round" />
        <ellipse cx={100} cy={260} rx={48} ry={9} fill="#7a5c3a" />
        <ellipse cx={92} cy={258} rx={15} ry={4} fill="rgba(255,255,255,0.07)" />

        {/* ══ REALISTIC SEEDLING LAYER ══ */}

        {/* Stem */}
        <rect
          x={97} y={stemTopY} width={6} height={252 - stemTopY} rx={3}
          fill="#4a7a30"
          style={{ opacity: Math.max(0, 1 - s.blob), transition: `${easeLinear}` }}
        />

        {/* Leaf 1 — grows to the right from stem */}
        <ellipse
          cx={118} cy={stemTopY + 18} rx={22} ry={11}
          fill="#6ab04c"
          style={{
            transformOrigin: `${98}px ${stemTopY + 20}px`,
            transform: `rotate(20deg) scale(${s.leaf1})`,
            opacity: s.leaf1 * Math.max(0, 1 - s.blob * 1.5),
            transition: ease,
          }}
        />
        <ellipse
          cx={115} cy={stemTopY + 14} rx={8} ry={4}
          fill="rgba(255,255,255,0.22)"
          style={{
            transformOrigin: `${98}px ${stemTopY + 20}px`,
            transform: `rotate(20deg) scale(${s.leaf1})`,
            opacity: s.leaf1 * Math.max(0, 1 - s.blob * 1.5),
            transition: ease,
          }}
        />

        {/* Leaf 2 — grows to the left */}
        <ellipse
          cx={80} cy={stemTopY + 40} rx={22} ry={11}
          fill="#52a03a"
          style={{
            transformOrigin: `${100}px ${stemTopY + 42}px`,
            transform: `rotate(-25deg) scale(${s.leaf2})`,
            opacity: s.leaf2 * Math.max(0, 1 - s.blob * 1.5),
            transition: `${ease} 0.08s`,
          }}
        />
        <ellipse
          cx={82} cy={stemTopY + 36} rx={8} ry={4}
          fill="rgba(255,255,255,0.2)"
          style={{
            transformOrigin: `${100}px ${stemTopY + 42}px`,
            transform: `rotate(-25deg) scale(${s.leaf2})`,
            opacity: s.leaf2 * Math.max(0, 1 - s.blob * 1.5),
            transition: `${ease} 0.08s`,
          }}
        />

        {/* ══ KAWAII BLOB LAYER ══ */}

        {/* Ear leaves (bunny-style) */}
        <ellipse cx={74} cy={110} rx={22} ry={32} fill="#6be875"
          style={{ transformOrigin: `${bodyCx}px ${bodyCy}px`, transform: `scale(${s.ear})`, opacity: s.ear, transition: ease }} />
        <ellipse cx={70} cy={103} rx={9} ry={13} fill="rgba(255,255,255,0.2)"
          style={{ transformOrigin: `${bodyCx}px ${bodyCy}px`, transform: `scale(${s.ear})`, opacity: s.ear, transition: ease }} />
        <ellipse cx={126} cy={110} rx={22} ry={32} fill="#6be875"
          style={{ transformOrigin: `${bodyCx}px ${bodyCy}px`, transform: `scale(${s.ear})`, opacity: s.ear, transition: `${ease} 0.06s` }} />
        <ellipse cx={122} cy={103} rx={9} ry={13} fill="rgba(255,255,255,0.2)"
          style={{ transformOrigin: `${bodyCx}px ${bodyCy}px`, transform: `scale(${s.ear})`, opacity: s.ear, transition: `${ease} 0.06s` }} />

        {/* Body shadow */}
        <ellipse cx={bodyCx} cy={bodyCy + 4} rx={63} ry={60} fill="#1f7a70"
          style={{ transformOrigin: `${bodyCx}px 256px`, transform: `scale(${s.blob})`, opacity: s.blob, transition: ease }} />
        {/* Main body */}
        <circle cx={bodyCx} cy={bodyCy} r={63} fill="#2a9d8f"
          style={{ transformOrigin: `${bodyCx}px 256px`, transform: `scale(${s.blob})`, opacity: s.blob, transition: ease }} />
        {/* Sheen */}
        <ellipse cx={76} cy={147} rx={20} ry={15} fill="rgba(255,255,255,0.22)"
          style={{ transformOrigin: `${bodyCx}px 256px`, transform: `scale(${s.blob})`, opacity: s.blob, transition: ease }} />

        {/* Eyes */}
        <circle cx={84} cy={168} r={9} fill="#1a1a2e"
          style={{ opacity: s.face, transform: `scale(${s.face})`, transformOrigin: '84px 168px', transition: '0.5s ease 0.6s' }} />
        <circle cx={87} cy={164} r={3.5} fill="white"
          style={{ opacity: s.face, transform: `scale(${s.face})`, transformOrigin: '87px 164px', transition: '0.5s ease 0.65s' }} />
        <circle cx={116} cy={168} r={9} fill="#1a1a2e"
          style={{ opacity: s.face, transform: `scale(${s.face})`, transformOrigin: '116px 168px', transition: '0.5s ease 0.6s' }} />
        <circle cx={119} cy={164} r={3.5} fill="white"
          style={{ opacity: s.face, transform: `scale(${s.face})`, transformOrigin: '119px 164px', transition: '0.5s ease 0.65s' }} />

        {/* Blush */}
        <ellipse cx={72} cy={178} rx={9} ry={6} fill="rgba(255,160,130,0.55)"
          style={{ opacity: s.face, transition: '0.5s ease 0.8s' }} />
        <ellipse cx={128} cy={178} rx={9} ry={6} fill="rgba(255,160,130,0.55)"
          style={{ opacity: s.face, transition: '0.5s ease 0.8s' }} />

        {/* Smile */}
        <path d="M 91 184 Q 100 193 109 184"
          stroke="#1a1a2e" strokeWidth={2.5} strokeLinecap="round" fill="none"
          style={{ opacity: s.face, transition: '0.5s ease 0.9s' }} />
      </svg>

      {/* Stage progress */}
      <div className="text-center">
        <p className="text-xs font-headline font-bold uppercase tracking-widest text-primary">
          {s.label}
        </p>
        <div className="mt-2 flex gap-1.5 justify-center">
          {STAGES.map((_, i) => (
            <div key={i} className="rounded-full transition-all duration-500"
              style={{
                width: i === idx ? '1.25rem' : '0.375rem',
                height: '0.375rem',
                background: i <= idx ? '#4a6741' : '#d4d0c8',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

const slides = [
  {
    emoji: "🌱",
    bg: "linear-gradient(160deg, #0d2818 0%, #071a0f 60%, #050d0a 100%)",
    glow: "rgba(52,211,153,.22)",
    accent: "#34d399",
    dark: "#022c22",
    title: "Meet Your Wisp Spirit",
    body: "Your Spirit is a living plant NFT that grows as you build eco-habits. Miss a day and it begins to wilt — come back and watch it bloom again.",
  },
  {
    emoji: "🔒",
    bg: "linear-gradient(160deg, #1e1654 0%, #0f0c2e 60%, #050508 100%)",
    glow: "rgba(129,140,248,.22)",
    accent: "#818cf8",
    dark: "#1e1b4b",
    title: "Zero-Knowledge Privacy",
    body: "Verify your green actions locally on your device. Your raw data — receipts, energy readings, transit tickets — never leaves your phone.",
  },
  {
    emoji: "💰",
    bg: "linear-gradient(160deg, #271a00 0%, #1a1000 60%, #050300 100%)",
    glow: "rgba(251,191,36,.22)",
    accent: "#fbbf24",
    dark: "#451a03",
    title: "Earn Real $WISP Tokens",
    body: "Every verified eco-action earns you $WISP — Hedera tokens redeemable at local partner merchants. Real rewards for real habits.",
  },
];

interface Props {
  onDone: () => void;
}

export default function WelcomeSlides({ onDone }: Props) {
  const [idx, setIdx] = useState(0);

  const next = () => {
    if (idx < slides.length - 1) setIdx(idx + 1);
    else onDone();
  };

  const s = slides[idx];

  return (
    <div
      className="slides-root"
      style={{ background: s.bg }}
    >
      {/* Radial glow top */}
      <div
        className="slides-glow"
        style={{
          background: `radial-gradient(ellipse 70% 55% at 50% 10%, ${s.glow} 0%, transparent 70%)`,
        }}
      />

      {/* Skip */}
      {idx < slides.length - 1 && (
        <button className="slide-skip" onClick={onDone}>
          Skip
        </button>
      )}

      <div className="slide-content" key={idx}>
        {/* Illustration orb */}
        <div
          className="slide-orb"
          style={{ boxShadow: `0 0 80px 20px ${s.glow}` }}
        >
          <span className="slide-emoji">{s.emoji}</span>
        </div>

        {/* Text */}
        <div className="slide-text">
          <h2 className="slide-title">{s.title}</h2>
          <p className="slide-body">{s.body}</p>
        </div>

        {/* Dots */}
        <div className="slide-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className="dot"
              style={{
                width: i === idx ? "24px" : "8px",
                background: i === idx ? s.accent : "rgba(255,255,255,.25)",
              }}
              onClick={() => setIdx(i)}
            />
          ))}
        </div>

        {/* CTA */}
        <button
          className="slide-btn"
          style={{ background: s.accent, color: s.dark }}
          onClick={next}
        >
          {idx < slides.length - 1 ? (
            <>
              Next <ChevronRight size={18} />
            </>
          ) : (
            "Get Started 🌿"
          )}
        </button>
      </div>

      <style>{`
        .slides-root {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .slides-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .slide-skip {
          position: absolute;
          top: 2.5rem;
          right: 1.5rem;
          background: rgba(255,255,255,.12);
          border: 1px solid rgba(255,255,255,.2);
          color: rgba(255,255,255,.75);
          padding: .4rem 1rem;
          border-radius: 999px;
          font-size: .85rem;
          cursor: pointer;
          backdrop-filter: blur(8px);
          z-index: 10;
          font-family: inherit;
        }
        .slide-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem 2rem 4rem;
          gap: 2.25rem;
          max-width: 420px;
          width: 100%;
          animation: slide-in .4s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(32px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .slide-orb {
          width: 190px;
          height: 190px;
          border-radius: 50%;
          background: radial-gradient(circle at 38% 32%, rgba(255,255,255,.15), rgba(0,0,0,.25));
          border: 1.5px solid rgba(255,255,255,.12);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(8px);
          flex-shrink: 0;
        }
        .slide-emoji {
          font-size: 5.5rem;
          line-height: 1;
          animation: bob 3s ease-in-out infinite;
          display: block;
        }
        @keyframes bob {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }
        .slide-text {
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: .75rem;
        }
        .slide-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0;
          letter-spacing: -.02em;
          line-height: 1.2;
        }
        .slide-body {
          font-size: 1rem;
          color: rgba(255,255,255,.65);
          margin: 0;
          line-height: 1.65;
        }
        .slide-dots {
          display: flex;
          gap: 6px;
          align-items: center;
        }
        .dot {
          height: 8px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          transition: width .3s ease, background .3s ease;
          padding: 0;
        }
        .slide-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: .45rem;
          padding: 1rem 2rem;
          border: none;
          border-radius: 999px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: transform .15s, box-shadow .15s;
          box-shadow: 0 4px 24px rgba(0,0,0,.5);
          width: 100%;
          font-family: inherit;
        }
        .slide-btn:active { transform: scale(.97); }
      `}</style>
    </div>
  );
}

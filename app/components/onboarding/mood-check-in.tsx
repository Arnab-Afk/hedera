"use client";

import { useState } from "react";

const moods = [
  { emoji: "😟", label: "Rough" },
  { emoji: "😔", label: "Down" },
  { emoji: "😐", label: "Okay" },
  { emoji: "🙂", label: "Good" },
  { emoji: "😄", label: "Great" },
];

interface Props {
  onDone: () => void;
}

export default function MoodCheckIn({ onDone }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  const greet = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  const handleSelect = (i: number) => {
    setSelected(i);
    setTimeout(onDone, 800);
  };

  return (
    <div className="mood-root">
      <div className="mood-bg" />

      {/* Stars */}
      {[...Array(20)].map((_, i) => (
        <span key={i} className="star" style={{ "--i": i } as React.CSSProperties} />
      ))}

      {/* Sun/Moon toggle icon */}
      <div className="mood-icon">☀️</div>

      <div className="mood-content">
        <div className="mood-header">
          <h1 className="mood-greeting">{greet()}</h1>
          <p className="mood-tagline">Every day is a new opportunity</p>
        </div>

        {/* Plant placeholder */}
        <div className="mood-plant-wrap">
          <div className="mood-plant-glow" />
          <span className="mood-plant">🌿</span>
        </div>

        <div className="mood-question">
          <h2>How are you feeling today?</h2>
        </div>

        <div className="mood-emojis">
          {moods.map((m, i) => (
            <button
              key={i}
              className={`mood-emoji-btn ${selected === i ? "selected" : ""}`}
              onClick={() => handleSelect(i)}
              aria-label={m.label}
            >
              <span className="mood-face">{m.emoji}</span>
            </button>
          ))}
        </div>

        <p className="mood-hint">Tap on an emoji to select your mood</p>
      </div>

      <style>{`
        .mood-root {
          position: fixed;
          inset: 0;
          background: linear-gradient(160deg, #1e1b4b 0%, #312e81 40%, #1e3a5f 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .mood-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(129,140,248,.22) 0%, transparent 65%);
          pointer-events: none;
        }
        .star {
          position: absolute;
          width: calc(2px + var(--i) * .5px);
          height: calc(2px + var(--i) * .5px);
          border-radius: 50%;
          background: rgba(255,255,255,.85);
          left: calc(var(--i) * 5.3% + 2%);
          top: calc(var(--i) * 4% + 2%);
          animation: twinkle calc(2s + var(--i) * .2s) ease-in-out infinite;
          animation-delay: calc(var(--i) * -.4s);
        }
        @keyframes twinkle {
          0%, 100% { opacity: .2; transform: scale(.8); }
          50%       { opacity: 1; transform: scale(1); }
        }
        .mood-icon {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          font-size: 1.8rem;
          background: rgba(255,255,255,.12);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,.15);
        }
        .mood-content {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem;
          gap: 1.5rem;
          max-width: 400px;
          width: 100%;
          animation: fade-up .5s ease both;
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mood-header {
          align-self: flex-start;
        }
        .mood-greeting {
          font-size: 2.2rem;
          font-weight: 800;
          color: #fff;
          margin: 0;
          letter-spacing: -.02em;
        }
        .mood-tagline {
          font-size: .95rem;
          color: rgba(199,210,254,.7);
          margin: .3rem 0 0;
          font-style: italic;
        }
        .mood-plant-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mood-plant-glow {
          position: absolute;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(129,140,248,.3) 0%, transparent 70%);
          animation: pulse-glow 3s ease-in-out infinite;
        }
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.25); opacity: .7; }
        }
        .mood-plant {
          font-size: 7rem;
          line-height: 1;
          filter: drop-shadow(0 0 20px rgba(129, 140, 248, .5));
          animation: sleepy 4s ease-in-out infinite;
          position: relative;
          z-index: 1;
        }
        @keyframes sleepy {
          0%, 100% { transform: rotate(-4deg) scale(1); }
          50%       { transform: rotate(4deg) scale(1.04); }
        }
        .mood-question h2 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #e0e7ff;
          margin: 0;
          text-align: center;
        }
        .mood-emojis {
          display: flex;
          gap: 1rem;
          align-items: center;
          width: 100%;
          justify-content: center;
        }
        .mood-emoji-btn {
          background: rgba(255,255,255,.12);
          border: 2px solid transparent;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform .2s, border-color .2s, background .2s;
          backdrop-filter: blur(8px);
        }
        .mood-emoji-btn:hover { transform: scale(1.15); background: rgba(255,255,255,.2); }
        .mood-emoji-btn.selected {
          border-color: #818cf8;
          background: rgba(129,140,248,.25);
          transform: scale(1.2);
          animation: pop .3s cubic-bezier(.34,1.56,.64,1);
        }
        @keyframes pop {
          0%, 100% { transform: scale(1.2); }
          50%       { transform: scale(1.35); }
        }
        .mood-face {
          font-size: 1.8rem;
          line-height: 1;
        }
        .mood-hint {
          font-size: .82rem;
          color: rgba(199,210,254,.5);
          margin: 0;
          position: absolute;
          bottom: 1.5rem;
          text-align: center;
        }
      `}</style>
    </div>
  );
}

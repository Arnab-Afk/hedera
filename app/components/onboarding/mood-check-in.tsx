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
    <div className="flex-1 flex flex-col bg-[#f4f7fa] relative overflow-hidden">
      {/* Sky gradient */}
      <div className="absolute top-0 left-0 w-full h-40 bg-linear-to-b from-[#e0e8f5] to-transparent z-0" />
      <div className="absolute top-6 left-6 w-14 h-5 bg-white rounded-full opacity-60 blur-[1px]" />
      <div className="absolute top-12 right-8 w-20 h-6 bg-white rounded-full opacity-50 blur-[1px]" />

      {/* Greeting time badge */}
      <div className="absolute top-6 right-5 z-10 bg-white/80 backdrop-blur-sm border border-slate-200 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-500 shadow-sm">
        ☀️ {greet()}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-5 relative z-10">
        {/* Plant */}
        <div className="mood-plant-wrap relative flex items-center justify-center">
          <div className="mood-plant-glow" />
          <span className="mood-plant">🌿</span>
        </div>

        {/* Heading */}
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-[#3b415a] tracking-tight">How are you feeling today?</h2>
          <p className="text-xs text-slate-400 font-medium italic">Every day is a new opportunity</p>
        </div>

        {/* Emoji picker */}
        <div className="flex gap-3 items-center justify-center">
          {moods.map((m, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              aria-label={m.label}
              className={`mood-emoji-btn ${selected === i ? "selected" : ""}`}
            >
              <span className="mood-face">{m.emoji}</span>
            </button>
          ))}
        </div>

        <p className="text-xs text-slate-400 font-medium">Tap an emoji to continue</p>
      </div>

      <style>{`
        .mood-plant-wrap { }
        .mood-plant-glow { position: absolute; width: 100px; height: 100px; border-radius: 50%; background: radial-gradient(circle, rgba(52,211,153,.2) 0%, transparent 70%); animation: pulse-glow 3s ease-in-out infinite; }
        @keyframes pulse-glow { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.25); } }
        .mood-plant { font-size: 6rem; line-height: 1; filter: drop-shadow(0 0 16px rgba(52,211,153,.4)); animation: sleepy 4s ease-in-out infinite; position: relative; z-index: 1; }
        @keyframes sleepy { 0%, 100% { transform: rotate(-4deg) scale(1); } 50% { transform: rotate(4deg) scale(1.04); } }
        .mood-emoji-btn { background: white; border: 2px solid transparent; border-radius: 50%; width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform .2s, border-color .2s, box-shadow .2s; box-shadow: 0 2px 10px rgba(0,0,0,0.07); }
        .mood-emoji-btn:hover { transform: scale(1.12); box-shadow: 0 4px 16px rgba(0,0,0,0.12); }
        .mood-emoji-btn.selected { border-color: #059669; box-shadow: 0 0 0 3px rgba(52,211,153,.25); transform: scale(1.18); animation: pop .3s cubic-bezier(.34,1.56,.64,1); }
        @keyframes pop { 0%, 100% { transform: scale(1.18); } 50% { transform: scale(1.3); } }
        .mood-face { font-size: 1.7rem; line-height: 1; }
      `}</style>
    </div>
  );
}

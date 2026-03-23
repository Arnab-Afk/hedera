"use client";

import { useState } from "react";
import ThreeDPlant from "@/components/three-d-plant";

const moods = [
  { label: "Rough",  color: "#f87171", bg: "#fff1f2", border: "#fecaca" },
  { label: "Down",   color: "#fb923c", bg: "#fff7ed", border: "#fed7aa" },
  { label: "Okay",   color: "#facc15", bg: "#fefce8", border: "#fef08a" },
  { label: "Good",   color: "#34d399", bg: "#ecfdf5", border: "#a7f3d0" },
  { label: "Great",  color: "#6ee7b7", bg: "#d1fae5", border: "#6ee7b7" },
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
    setTimeout(onDone, 700);
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-[#f4f7fa]">
      {/* Sky gradient */}
      <div
        className="absolute inset-0 z-0"
        style={{ background: "linear-gradient(to bottom, #d1fae5 0%, #e0e8f5 45%, #f4f7fa 65%)" }}
      />
      <div className="absolute top-10 left-6 w-14 h-5 bg-white rounded-full opacity-70 blur-[2px] z-0" />
      <div className="absolute top-18 right-8 w-20 h-6 bg-white rounded-full opacity-50 blur-[2px] z-0" />

      {/* Time badge */}
      <div className="absolute top-5 right-5 z-20 bg-white/90 backdrop-blur-sm border border-slate-200 px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-500 shadow-sm">
        {greet()}
      </div>

      {/* Plant */}
      <div className="relative z-10 -mt-4">
        <ThreeDPlant />
      </div>

      {/* Bottom sheet */}
      <div className="flex-1 z-20 -mt-16 relative flex flex-col px-6 pt-5 pb-8 gap-5">
        {/* Drag handle */}
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto" />

        {/* Heading */}
        <div className="text-center" style={{ animation: "fade-up 0.6s ease 0.2s both" }}>
          <h2 className="text-xl font-black text-[#3b415a] tracking-tight">How are you feeling?</h2>
          <p className="text-xs text-slate-400 font-medium mt-1">Every day is a new opportunity to grow</p>
        </div>

        {/* Mood buttons */}
        <div className="flex gap-2" style={{ animation: "fade-up 0.6s ease 0.3s both" }}>
          {moods.map((m, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className="flex-1 flex flex-col items-center py-3.5 rounded-2xl border-2 transition-all font-bold text-[11px] gap-1.5"
              style={{
                background: selected === i ? m.bg : "white",
                borderColor: selected === i ? m.color : "#e2e8f0",
                color: selected === i ? m.color : "#94a3b8",
                transform: selected === i ? "scale(1.06)" : "scale(1)",
                boxShadow: selected === i ? `0 4px 16px ${m.color}40` : "0 2px 8px rgba(0,0,0,0.04)",
                transition: "all 0.2s",
              }}
            >
              <div
                className="w-5 h-5 rounded-full"
                style={{ background: m.color, opacity: selected === i ? 1 : 0.35 }}
              />
              {m.label}
            </button>
          ))}
        </div>

        <p
          className="text-center text-[11px] text-slate-400 font-medium"
          style={{ animation: "fade-up 0.6s ease 0.4s both" }}
        >
          Select a mood to continue
        </p>

        <div className="flex-1" />
      </div>

      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

"use client";

import { useState } from "react";
import ThreeDPlant from "@/components/three-d-plant";

const moods = [
  { label: "Rough",  value: 1, color: "#f87171", bg: "#fff1f2", border: "#fecaca" },
  { label: "Down",   value: 2, color: "#fb923c", bg: "#fff7ed", border: "#fed7aa" },
  { label: "Okay",   value: 3, color: "#facc15", bg: "#fefce8", border: "#fef08a" },
  { label: "Good",   value: 4, color: "#34d399", bg: "#ecfdf5", border: "#a7f3d0" },
  { label: "Great",  value: 5, color: "#6ee7b7", bg: "#d1fae5", border: "#6ee7b7" },
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
    <div className="flex-1 flex flex-col bg-[#f4f7fa] relative overflow-hidden">
      {/* Sky gradient */}
      <div
        className="absolute top-0 left-0 w-full h-[45%] z-0"
        style={{ background: "linear-gradient(to bottom, #d1fae5, #e0e8f5, #f4f7fa)" }}
      >
        <div className="absolute top-8 left-6 w-14 h-5 bg-white rounded-full opacity-60 blur-[1px]" />
        <div className="absolute top-14 right-8 w-20 h-6 bg-white rounded-full opacity-50 blur-[1px]" />
      </div>

      {/* Time greeting badge */}
      <div className="absolute top-6 right-5 z-20 bg-white/90 border border-slate-200 px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-500 shadow-sm">
        {greet()}
      </div>

      {/* Plant */}
      <div className="relative z-10 mt-2">
        <ThreeDPlant />
      </div>

      {/* Content */}
      <div className="relative z-20 -mt-10 flex flex-col items-center px-5 gap-5">
        <div className="text-center">
          <h2 className="text-xl font-black text-[#3b415a] tracking-tight">How are you feeling?</h2>
          <p className="text-xs text-slate-400 font-medium mt-1">Every day is a new opportunity to grow</p>
        </div>

        {/* Mood selector */}
        <div className="w-full flex gap-2">
          {moods.map((m, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className="flex-1 flex flex-col items-center py-3 rounded-2xl border-2 transition-all font-bold text-[11px] gap-1"
              style={{
                background: selected === i ? m.bg : "white",
                borderColor: selected === i ? m.color : "#e2e8f0",
                color: selected === i ? m.color : "#94a3b8",
                transform: selected === i ? "scale(1.06)" : "scale(1)",
                boxShadow: selected === i ? `0 4px 16px ${m.color}40` : "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              {/* Color dot */}
              <div
                className="w-4 h-4 rounded-full"
                style={{ background: m.color, opacity: selected === i ? 1 : 0.4 }}
              />
              {m.label}
            </button>
          ))}
        </div>

        <p className="text-[11px] text-slate-400 font-medium">Select a mood to continue</p>
      </div>
    </div>
  );
}

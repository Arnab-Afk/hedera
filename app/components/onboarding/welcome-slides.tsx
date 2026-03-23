"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

interface WelcomeSlidesProps {
  onDone: () => void;
}

const slides = [
  {
    emoji: "\U0001f333",
    accent: "#6ee7b7",
    accentLight: "#d1fae5",
    accentBorder: "#a7f3d0",
    title: "Track Your Green Actions",
    body: "Connect transit, energy, and grocery data. Wisp logs every eco-action automatically — no manual entry needed.",
  },
  {
    emoji: "\U0001f6e1\ufe0f",
    accent: "#818cf8",
    accentLight: "#ede9fe",
    accentBorder: "#c4b5fd",
    title: "Privacy by Design",
    body: "Zero-knowledge proofs verify your actions without exposing personal data. Your habits stay yours.",
  },
  {
    emoji: "\u2728",
    accent: "#fbbf24",
    accentLight: "#fef3c7",
    accentBorder: "#fde68a",
    title: "Earn Real $WISP Tokens",
    body: "Every verified eco-action earns you $WISP — Hedera tokens redeemable at partner businesses. Real rewards for real habits.",
  },
];

export default function WelcomeSlides({ onDone }: WelcomeSlidesProps) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const isLast = index === slides.length - 1;

  const next = () => {
    if (isLast) {
      onDone();
    } else {
      setIndex((i) => i + 1);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f4f7fa] overflow-hidden">
      {/* Sky gradient */}
      <div
        className="absolute top-0 left-0 w-full h-[35%] z-0"
        style={{ background: "linear-gradient(to bottom, #e0e8f5, #f4f7fa)" }}
      />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-10 pb-4">
        {/* Orb */}
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center mb-7 shadow-lg border-4"
          style={{
            background: slide.accentLight,
            borderColor: slide.accentBorder,
          }}
        >
          <span style={{ fontSize: 52, lineHeight: 1 }}>{slide.emoji}</span>
        </div>

        <h2
          className="text-2xl font-black text-[#3b415a] text-center mb-3 leading-tight"
          style={{ animation: "fade-in 0.5s ease both" }}
        >
          {slide.title}
        </h2>
        <p
          className="text-sm text-slate-400 font-medium text-center leading-relaxed max-w-xs"
          style={{ animation: "fade-in 0.5s ease 0.1s both" }}
        >
          {slide.body}
        </p>
      </div>

      {/* Dots + Button */}
      <div className="relative z-10 px-6 pb-8 flex flex-col items-center gap-5">
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === index ? 20 : 8,
                height: 8,
                background: i === index ? slide.accent : "#cbd5e1",
              }}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-bold text-sm shadow-lg transition-opacity hover:opacity-90 active:scale-95"
          style={{ background: slide.accent }}
        >
          {isLast ? "Get Started" : "Next"}
          <ChevronRight className="w-4 h-4" />
        </button>

        {!isLast && (
          <button
            onClick={onDone}
            className="text-xs text-slate-400 font-semibold hover:text-slate-600 transition-colors"
          >
            Skip intro
          </button>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

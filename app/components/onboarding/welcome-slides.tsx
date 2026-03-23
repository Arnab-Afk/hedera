"use client";

import { useState } from "react";
import { ChevronRight, Leaf, ShieldCheck, Sparkles } from "lucide-react";

interface WelcomeSlidesProps {
  onDone: () => void;
}

const slides = [
  {
    Icon: Leaf,
    iconBg: "#d1fae5",
    iconBorder: "#6ee7b7",
    iconColor: "#059669",
    accent: "#059669",
    title: "Track Your Green Actions",
    body: "Connect transit, energy, and grocery data. Wisp logs every eco-action automatically — no manual entry needed.",
  },
  {
    Icon: ShieldCheck,
    iconBg: "#ede9fe",
    iconBorder: "#c4b5fd",
    iconColor: "#7c3aed",
    accent: "#7c3aed",
    title: "Privacy by Design",
    body: "Zero-knowledge proofs verify your actions without exposing personal data. Your habits stay yours.",
  },
  {
    Icon: Sparkles,
    iconBg: "#fef3c7",
    iconBorder: "#fde68a",
    iconColor: "#d97706",
    accent: "#d97706",
    title: "Earn Real $WISP Tokens",
    body: "Every verified eco-action earns you $WISP — Hedera tokens redeemable at partner businesses.",
  },
];

export default function WelcomeSlides({ onDone }: WelcomeSlidesProps) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const { Icon } = slide;
  const isLast = index === slides.length - 1;

  const next = () => {
    if (isLast) onDone();
    else setIndex((i) => i + 1);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f4f7fa] overflow-hidden relative">
      {/* Sky gradient */}
      <div
        className="absolute top-0 left-0 w-full h-[40%] z-0"
        style={{ background: "linear-gradient(to bottom, #e0e8f5, #f4f7fa)" }}
      >
        <div className="absolute top-8 left-6 w-14 h-5 bg-white rounded-full opacity-60 blur-[1px]" />
        <div className="absolute top-14 right-8 w-20 h-6 bg-white rounded-full opacity-50 blur-[1px]" />
      </div>

      {/* Slide counter */}
      <div className="relative z-10 px-6 pt-10 flex justify-end">
        <span className="text-[11px] font-bold text-slate-400 bg-white/70 px-2.5 py-1 rounded-full">
          {index + 1} / {slides.length}
        </span>
      </div>

      {/* Icon + text — centered in flex-1 */}
      <div className="flex-1 relative z-10 flex flex-col items-center justify-center px-6 gap-6">
        <div
          key={`icon-${index}`}
          className="w-28 h-28 rounded-3xl flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.08)] border-2"
          style={{
            background: slide.iconBg,
            borderColor: slide.iconBorder,
            animation: "pop-in 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
          }}
        >
          <Icon style={{ width: 52, height: 52, color: slide.iconColor, strokeWidth: 1.5 }} />
        </div>

        <div key={`text-${index}`} className="text-center" style={{ animation: "fade-up 0.4s ease 0.1s both" }}>
          <h2 className="text-2xl font-black text-[#3b415a] leading-snug mb-2">{slide.title}</h2>
          <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">{slide.body}</p>
        </div>
      </div>

      {/* Dots + CTA */}
      <div className="relative z-10 px-6 pb-8 flex flex-col items-center gap-4">
        <div className="flex gap-2 items-center">
          {slides.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === index ? 22 : 8,
                height: 8,
                background: i === index ? slide.accent : "#cbd5e1",
              }}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-bold text-sm shadow-lg transition-all hover:opacity-90 active:scale-[0.97]"
          style={{ background: slide.accent }}
        >
          {isLast ? "Get Started" : "Next"}
          <ChevronRight className="w-4 h-4" />
        </button>
        {!isLast && (
          <button onClick={onDone} className="text-xs text-slate-400 font-semibold hover:text-[#3b415a] transition-colors">
            Skip intro
          </button>
        )}
      </div>

      <style>{`
        @keyframes pop-in {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

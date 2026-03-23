"use client";

import { useEffect, useState } from "react";
import ThreeDPlant from "@/components/three-d-plant";

interface SplashScreenProps {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: SplashScreenProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="flex-1 flex flex-col relative overflow-hidden bg-[#f4f7fa]"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s ease" }}
    >
      {/* Sky gradient */}
      <div
        className="absolute top-0 left-0 w-full h-[45%] z-0"
        style={{ background: "linear-gradient(to bottom, #d1fae5, #e0e8f5, #f4f7fa)" }}
      >
        <div className="absolute top-10 left-6 w-14 h-5 bg-white rounded-full opacity-70 blur-[2px]" />
        <div className="absolute top-18 right-8 w-22 h-6 bg-white rounded-full opacity-55 blur-[2px]" />
        <div className="absolute top-7 right-20 w-10 h-4 bg-white rounded-full opacity-40 blur-[2px]" />
      </div>

      {/* 3D Plant */}
      <div className="relative z-10 mt-2">
        <ThreeDPlant />
      </div>

      {/* Title */}
      <div
        className="relative z-20 -mt-14 flex flex-col items-center px-6 gap-2"
        style={{ animation: "fade-in 0.8s ease 0.4s both" }}
      >
        <h1 className="text-5xl font-black tracking-tight text-[#3b415a] leading-none">
          Wisp
        </h1>
        <p className="text-sm font-semibold text-slate-400 text-center tracking-wide">
          The Privacy-First Eco-Companion
        </p>
      </div>

      {/* Pill badges */}
      <div
        className="relative z-20 mt-6 flex gap-2 justify-center flex-wrap px-6"
        style={{ animation: "fade-in 0.8s ease 0.6s both" }}
      >
        {["Zero-Knowledge Proofs", "Hedera Network", "Earn $WISP"].map((label) => (
          <span
            key={label}
            className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full"
          >
            {label}
          </span>
        ))}
      </div>

      {/* Loading indicator */}
      <div
        className="absolute bottom-10 left-0 right-0 flex justify-center gap-2"
        style={{ animation: "fade-in 0.8s ease 0.8s both" }}
      >
        {[0, 0.18, 0.36].map((delay, idx) => (
          <div
            key={idx}
            className="w-2 h-2 rounded-full bg-emerald-400"
            style={{ animation: `dot-pulse 1.2s ease-in-out ${delay}s infinite` }}
          />
        ))}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dot-pulse {
          0%, 100% { transform: scale(0.8); opacity: 0.4; }
          50%       { transform: scale(1.4); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

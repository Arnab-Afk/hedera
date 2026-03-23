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
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.6s ease" }}
    >
      {/* Sky gradient */}
      <div
        className="absolute inset-0 z-0"
        style={{ background: "linear-gradient(to bottom, #d1fae5 0%, #e0e8f5 45%, #f4f7fa 70%)" }}
      />
      <div className="absolute top-10 left-6 w-14 h-5 bg-white rounded-full opacity-70 blur-[2px] z-0" />
      <div className="absolute top-18 right-8 w-20 h-6 bg-white rounded-full opacity-55 blur-[2px] z-0" />
      <div className="absolute top-6 right-24 w-10 h-4 bg-white rounded-full opacity-40 blur-[2px] z-0" />

      {/* Plant */}
      <div className="relative z-10 -mt-4">
        <ThreeDPlant />
      </div>

      {/* Bottom sheet */}
      <div className="flex-1 z-20 -mt-16 relative flex flex-col px-6 pt-5 pb-8">
        {/* Drag handle */}
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6" />

        {/* Center block */}
        <div
          className="flex-1 flex flex-col items-center justify-center gap-3"
          style={{ animation: "fade-up 0.7s ease 0.3s both" }}
        >
          <h1 className="text-5xl font-black tracking-tight text-[#3b415a] leading-none">
            Wisp
          </h1>
          <p className="text-sm font-medium text-slate-400 text-center tracking-wide">
            The Privacy-First Eco-Companion
          </p>
          <div className="flex gap-2 flex-wrap justify-center mt-1">
            {["Zero-Knowledge Proofs", "Hedera Network", "Earn $WISP"].map((label) => (
              <span
                key={label}
                className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Loading dots */}
        <div
          className="flex justify-center gap-2"
          style={{ animation: "fade-up 0.7s ease 0.6s both" }}
        >
          {[0, 0.18, 0.36].map((delay, idx) => (
            <div
              key={idx}
              className="w-2 h-2 rounded-full bg-emerald-400"
              style={{ animation: `dot-pulse 1.2s ease-in-out ${delay}s infinite` }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
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

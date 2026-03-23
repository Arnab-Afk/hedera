"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onDone: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function NameYourSpirit({ value, onChange, onDone }: Props) {
  const [shake, setShake] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { token } = useAuth();

  const handleContinue = async () => {
    if (!value.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/game/spirit/rename`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: value }),
      });

      if (response.ok) {
        onDone();
      } else {
        console.error("Failed to rename spirit");
      }
    } catch (error) {
      console.error("Error renaming spirit:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f4f7fa] relative overflow-hidden">
      {/* Sky gradient */}
      <div className="absolute top-0 left-0 w-full h-36 bg-linear-to-b from-[#e0e8f5] to-transparent z-0" />
      <div className="absolute top-6 left-6 w-14 h-5 bg-white rounded-full opacity-60 blur-[1px]" />
      <div className="absolute top-12 right-8 w-18 h-5 bg-white rounded-full opacity-50 blur-[1px]" />

      {/* Floating leaves */}
      {[...Array(6)].map((_, i) => (
        <span key={i} className="leaf" style={{ "--i": i } as React.CSSProperties}>🍃</span>
      ))}

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-5 relative z-10">
        {/* Plant */}
        <div className="name-plant relative flex items-center justify-center">
          <div className="name-glow" />
          <span className="name-plant-emoji">🌱</span>
        </div>

        {/* Text */}
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl font-bold text-[#3b415a] tracking-tight">Name Your Spirit</h2>
          <p className="text-sm text-slate-500 leading-relaxed max-w-65 mx-auto">
            Your Wisp Spirit is a living plant NFT that evolves with your eco journey. Give it a name — it&#39;s yours forever.
          </p>
        </div>

        {/* Input */}
        <div className={`w-full relative ${shake ? "shake" : ""}`}>
          <input
            className="w-full bg-white border-2 border-emerald-200 focus:border-emerald-400 rounded-2xl px-4 py-3.5 pr-12 text-[#3b415a] text-sm font-medium placeholder:text-slate-400 outline-none transition shadow-[0_2px_12px_rgba(0,0,0,0.05)]"
            type="text"
            maxLength={20}
            placeholder="e.g. Fernsby, Gaia, Sprout…"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            autoFocus
            disabled={isSaving}
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
            {value.length}/20
          </span>
        </div>

        {/* CTA */}
        <button
          onClick={handleContinue}
          disabled={isSaving}
          className="w-full py-3.5 rounded-2xl font-bold text-sm bg-emerald-500 text-white hover:bg-emerald-600 transition disabled:opacity-50 shadow-[0_4px_20px_rgba(52,211,153,.35)]"
        >
          {isSaving ? "Saving…" : "Continue →"}
        </button>
      </div>

      <style>{`
        .leaf { position: absolute; font-size: 1.2rem; animation: drift calc(6s + var(--i) * 1.2s) ease-in-out infinite; animation-delay: calc(var(--i) * -1.5s); left: calc(var(--i) * 18%); top: -2rem; opacity: 0; pointer-events: none; user-select: none; }
        @keyframes drift { 0% { transform: translateY(-20px) rotate(0deg); opacity: 0; } 15% { opacity: .6; } 100% { transform: translateY(110%) rotate(200deg); opacity: 0; } }
        .name-plant { }
        .name-plant-emoji { font-size: 5rem; line-height: 1; filter: drop-shadow(0 0 18px rgba(52,211,153,.5)); animation: grow 3s ease-in-out infinite; position: relative; z-index: 1; }
        @keyframes grow { 0%, 100% { transform: scale(1) rotate(-3deg); } 50% { transform: scale(1.07) rotate(3deg); } }
        .name-glow { position: absolute; width: 120px; height: 120px; border-radius: 50%; background: radial-gradient(circle, rgba(52,211,153,.2) 0%, transparent 70%); animation: pulse-glow 2.5s ease-in-out infinite; }
        @keyframes pulse-glow { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
        .shake { animation: shake .45s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake { 10%, 90% { transform: translateX(-2px); } 20%, 80% { transform: translateX(4px); } 30%, 50%, 70% { transform: translateX(-6px); } 40%, 60% { transform: translateX(6px); } }
      `}</style>
    </div>
  );
}

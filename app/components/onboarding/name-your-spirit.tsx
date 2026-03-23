"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { ArrowRight, Loader2 } from "lucide-react";
import ThreeDPlant from "@/components/three-d-plant";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onDone: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const SUGGESTIONS = ["Fernsby", "Gaia", "Sprout", "Moss"];

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
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: value }),
      });
      if (response.ok) onDone();
      else console.error("Failed to rename spirit");
    } catch (error) {
      console.error("Error renaming spirit:", error);
    } finally {
      setIsSaving(false);
    }
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
          <h2 className="text-2xl font-black text-[#3b415a] tracking-tight">Name Your Spirit</h2>
          <p className="text-xs text-slate-400 font-medium mt-1.5 leading-relaxed max-w-64 mx-auto">
            Your Wisp Spirit is a living plant NFT that evolves with your journey. Give it a name.
          </p>
        </div>

        {/* Input */}
        <div
          className={`relative ${shake ? "shake" : ""}`}
          style={{ animation: "fade-up 0.6s ease 0.3s both" }}
        >
          <input
            className="w-full bg-white border-2 border-emerald-200 focus:border-emerald-400 rounded-2xl px-4 py-3.5 pr-14 text-[#3b415a] text-sm font-semibold placeholder:text-slate-300 outline-none transition shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
            type="text"
            maxLength={20}
            placeholder="e.g. Fernsby, Gaia, Sprout"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            autoFocus
            disabled={isSaving}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 font-bold tabular-nums">
            {value.length}/20
          </span>
        </div>

        {/* Suggestions */}
        <div className="flex gap-2 flex-wrap" style={{ animation: "fade-up 0.6s ease 0.4s both" }}>
          <span className="text-[11px] text-slate-400 font-semibold self-center">Try:</span>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onChange(s)}
              className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* CTA */}
        <button
          onClick={handleContinue}
          disabled={isSaving}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm bg-emerald-500 text-white hover:bg-emerald-600 transition disabled:opacity-50 shadow-[0_6px_20px_rgba(52,211,153,0.35)]"
          style={{ animation: "fade-up 0.6s ease 0.5s both" }}
        >
          {isSaving ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
          ) : (
            <>Continue <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </div>

      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .shake { animation: shake 0.45s cubic-bezier(0.36,0.07,0.19,0.97) both; }
        @keyframes shake {
          10%, 90% { transform: translateX(-2px); }
          20%, 80% { transform: translateX(4px); }
          30%, 50%, 70% { transform: translateX(-6px); }
          40%, 60% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}

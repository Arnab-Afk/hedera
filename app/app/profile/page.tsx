"use client";

import Link from "next/link";
import {
  Home,
  Play,
  User,
  Flame,
  Wallet,
  Zap,
  Train,
  ShoppingBag,
  ShieldCheck,
  TrendingUp,
  Copy,
  CheckCheck,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import ThreeDPlant from "@/components/three-d-plant";
import { useState } from "react";

const STREAK_DATA = [
  true, true, false, true, true, true, false,
  true, true, true, true, false, true, true,
  true, false, true, true, true, true, true,
  false, false, true, true, true, true, true,
];

const connectedSources = [
  { id: 1, name: "Transit MCP", icon: Train, color: "bg-violet-500", active: true },
  { id: 2, name: "Energy MCP", icon: Zap, color: "bg-amber-500", active: true },
  { id: 3, name: "Receipt MCP", icon: ShoppingBag, color: "bg-emerald-500", active: false },
];

const achievements = [
  { id: 1, emoji: "🌱", label: "First Step", earned: true },
  { id: 2, emoji: "🔥", label: "7-Day Streak", earned: true },
  { id: 3, emoji: "⚡", label: "Energy Saver", earned: true },
  { id: 4, emoji: "🌍", label: "30-Day Streak", earned: false },
  { id: 5, emoji: "💎", label: "100 Actions", earned: false },
  { id: 6, emoji: "🏆", label: "Top 10%", earned: false },
];

export default function ProfilePage() {
  const [copied, setCopied] = useState(false);
  const walletAddress = "0.0.429847";

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const daysActive = STREAK_DATA.filter(Boolean).length;
  const currentStreak = 14;
  const wispBalance = 42;
  const totalXp = 310;

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#060d0a] font-sans p-4 sm:p-8">
      {/* Phone shell */}
      <div
        className="relative w-full max-w-100 h-212.5 rounded-[3rem] shadow-[0_0_80px_rgba(52,211,153,0.10)] overflow-hidden border border-white/10 flex flex-col"
        style={{ background: "linear-gradient(160deg, #0a1f14 0%, #061510 50%, #0a1428 100%)" }}
      >
        {/* Ambient glows */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute -top-24 left-0 w-80 h-80 rounded-full bg-emerald-500/8 blur-3xl" />
          <div className="absolute top-1/2 -right-20 w-60 h-60 rounded-full bg-blue-500/6 blur-3xl" />
        </div>

        {/* Sky section for plant */}
        <div
          className="absolute top-0 left-0 w-full h-[38%] z-0"
          style={{ background: "linear-gradient(180deg, rgba(10,31,20,0.0) 0%, rgba(6,21,16,0.95) 100%)" }}
        />

        {/* Header */}
        <div className="relative z-20 w-full px-6 pt-10 flex justify-between items-center">
          <div>
            <p className="text-[10px] text-emerald-400/60 font-bold uppercase tracking-[0.2em]">Your</p>
            <h1 className="text-white font-bold text-2xl tracking-tight mt-0.5">Profile</h1>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 bg-white/8 border border-white/12 px-3 py-2 rounded-xl hover:bg-white/12 transition"
          >
            <Wallet className="w-4 h-4 text-white/50" />
            <span className="text-xs font-bold text-white/70 font-mono">{walletAddress}</span>
            {copied
              ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
              : <Copy className="w-3.5 h-3.5 text-white/30" />}
          </button>
        </div>

        {/* 3D Plant (dark bg shows through) */}
        <div className="relative z-10 -mt-4">
          <ThreeDPlant />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto hide-scrollbar px-5 z-20 -mt-16 relative pb-24 space-y-3">

          {/* Spirit card */}
          <div className="bg-white/8 border border-white/12 rounded-[1.75rem] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[10px] text-emerald-400/70 font-bold uppercase tracking-widest mb-1">Wisp Spirit</p>
                <h2 className="text-base font-bold text-white">Sprout — Day 14</h2>
                <p className="text-[11px] text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Leaves blooming — evolving soon!
                </p>
              </div>
              <div className="bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-full">
                Level 2
              </div>
            </div>
            {/* XP bar */}
            <div className="bg-white/5 border border-white/8 rounded-xl p-3">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] font-bold text-white/70">Total XP</span>
                <span className="text-[11px] font-bold text-white/40">{totalXp} / 500</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full transition-all duration-1000"
                  style={{
                    width: `${(totalXp / 500) * 100}%`,
                    background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
                  }}
                />
              </div>
              <p className="text-[10px] text-white/30 mt-1.5 font-medium">190 XP to Level 3 · NFT evolution unlocks</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { icon: <Flame className="w-4 h-4 text-red-400" />, bg: "bg-red-500/10", value: currentStreak, label: "Streak" },
              { icon: <span className="text-xs font-black text-amber-400">$W</span>, bg: "bg-amber-500/10", value: wispBalance, label: "$WISP" },
              { icon: <TrendingUp className="w-4 h-4 text-emerald-400" />, bg: "bg-emerald-500/10", value: daysActive, label: "Active" },
            ].map((s, i) => (
              <div key={i} className="bg-white/6 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-1.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${s.bg}`}>{s.icon}</div>
                <p className="text-xl font-bold text-white">{s.value}</p>
                <p className="text-[10px] text-white/35 font-semibold">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Activity calendar */}
          <div className="bg-white/6 border border-white/10 rounded-[1.5rem] p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-white">Activity</h3>
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">28 days</span>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {STREAK_DATA.map((active, i) => (
                <div
                  key={i}
                  className={`h-6 rounded-md transition-all ${
                    active ? "shadow-[0_0_8px_rgba(52,211,153,0.4)]" : "bg-white/8"
                  }`}
                  style={active ? { background: "linear-gradient(135deg, #34d399, #059669)" } : {}}
                />
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                <span className="text-[10px] text-white/35 font-medium">Active</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-white/10" />
                <span className="text-[10px] text-white/35 font-medium">Rest</span>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white/6 border border-white/10 rounded-[1.5rem] p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-white">Achievements</h3>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                {achievements.filter((a) => a.earned).length}/{achievements.length}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                    ach.earned
                      ? "border-emerald-500/25 bg-emerald-500/10"
                      : "border-white/8 bg-white/4 opacity-40"
                  }`}
                >
                  <span className="text-lg">{ach.emoji}</span>
                  <p className="text-[10px] font-bold text-white/70 text-center leading-tight">{ach.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Data sources */}
          <div className="bg-white/6 border border-white/10 rounded-[1.5rem] p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-white">Data Sources</h3>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg">Fully Private</span>
            </div>
            <div className="space-y-3">
              {connectedSources.map((src) => {
                const Icon = src.icon;
                return (
                  <div key={src.id} className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${src.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white/80">{src.name}</p>
                      <p className="text-[10px] text-white/35 font-medium">
                        {src.active ? "Syncing locally · no PII shared" : "Not connected"}
                      </p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${src.active ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" : "bg-white/20"}`} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Privacy guarantee */}
          <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-white/80">Privacy Guarantee</p>
              <p className="text-[11px] text-white/40 font-medium mt-0.5 leading-relaxed">
                Raw data never leaves your device. Only anonymous proofs reach the Hedera network.
              </p>
            </div>
          </div>

          {/* Redeem CTA */}
          <button className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #34d399, #059669)", color: "#022c22" }}>
            Redeem {wispBalance} $WISP at Local Merchants
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Nav */}
        <div
          className="absolute bottom-0 w-full h-20 flex justify-around items-center px-6 pb-2 rounded-b-[3rem] z-30 border-t border-white/8"
          style={{ background: "rgba(6,13,10,0.85)", backdropFilter: "blur(20px)" }}
        >
          <Link href="/home" className="flex flex-col items-center gap-1 text-white/30 hover:text-white/70 transition-colors">
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-bold">Home</span>
          </Link>
          <Link href="/adventures" className="flex flex-col items-center gap-1 text-white/30 hover:text-white/70 transition-colors">
            <Play className="w-6 h-6" />
            <span className="text-[10px] font-bold">Adventures</span>
          </Link>
          <div className="flex flex-col items-center gap-1 text-emerald-400">
            <User className="w-6 h-6" />
            <span className="text-[10px] font-bold">Profile</span>
            <div className="w-1 h-1 rounded-full bg-emerald-400 -mt-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
}

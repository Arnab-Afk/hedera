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
  { id: 1, emoji: "\U0001f331", label: "First Step", earned: true },
  { id: 2, emoji: "\U0001f525", label: "7-Day Streak", earned: true },
  { id: 3, emoji: "\u26a1", label: "Energy Saver", earned: true },
  { id: 4, emoji: "\U0001f30d", label: "30-Day Streak", earned: false },
  { id: 5, emoji: "\U0001f48e", label: "100 Actions", earned: false },
  { id: 6, emoji: "\U0001f3c6", label: "Top 10%", earned: false },
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
    <div className="flex items-center justify-center min-h-screen bg-slate-900 font-sans p-4 sm:p-8">
      {/* Mobile Device Mockup */}
      <div className="relative w-full max-w-100 h-212.5 bg-[#f4f7fa] rounded-[3rem] shadow-2xl overflow-hidden border-8 border-slate-800 flex flex-col">

        {/* Sky gradient */}
        <div className="absolute top-0 left-0 w-full h-[40%] bg-linear-to-b from-[#e0e8f5] to-[#f4f7fa] z-0 overflow-hidden">
          <div className="absolute top-12 left-6 w-16 h-6 bg-white rounded-full opacity-60 blur-[1px]" />
          <div className="absolute top-20 right-10 w-20 h-8 bg-white rounded-full opacity-50 blur-[1px]" />
          <div className="absolute top-8 right-24 w-12 h-4 bg-white rounded-full opacity-40 blur-[1px]" />
        </div>

        {/* Header */}
        <div className="relative z-20 w-full px-6 pt-10 flex justify-between items-center">
          <div>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-[0.15em]">Your</p>
            <h1 className="text-[#3b415a] font-bold text-xl tracking-tight mt-0.5">Profile</h1>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-50 transition shadow-sm"
          >
            <Wallet className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-[#3b415a] font-mono">{walletAddress}</span>
            {copied
              ? <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
              : <Copy className="w-3.5 h-3.5 text-slate-300" />}
          </button>
        </div>

        {/* 3D Plant */}
        <div className="relative z-10 -mt-4">
          <ThreeDPlant />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto hide-scrollbar px-5 z-20 -mt-16 relative pb-24 space-y-3">

          {/* Spirit card */}
          <div className="bg-white rounded-[1.75rem] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mb-1">Wisp Spirit</p>
                <h2 className="text-base font-bold text-[#3b415a]">Sprout \u2014 Day 14</h2>
                <p className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Leaves blooming \u2014 evolving soon!
                </p>
              </div>
              <div className="bg-emerald-100 border border-emerald-200 text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-full">
                Level 2
              </div>
            </div>
            {/* XP bar */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] font-bold text-[#3b415a]">Total XP</span>
                <span className="text-[11px] font-bold text-slate-400">{totalXp} / 500</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full transition-all duration-1000 bg-linear-to-r from-violet-400 to-violet-600"
                  style={{ width: `${(totalXp / 500) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 font-medium">190 XP to Level 3 \u00b7 NFT evolution unlocks</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { icon: <Flame className="w-4 h-4 text-red-500" />, bg: "bg-red-50", value: currentStreak, label: "Streak" },
              { icon: <span className="text-xs font-black text-amber-600">$W</span>, bg: "bg-amber-50", value: wispBalance, label: "$WISP" },
              { icon: <TrendingUp className="w-4 h-4 text-emerald-600" />, bg: "bg-emerald-50", value: daysActive, label: "Active" },
            ].map((s, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col items-center gap-1.5 shadow-[0_5px_15px_rgba(0,0,0,0.04)]">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${s.bg}`}>{s.icon}</div>
                <p className="text-xl font-bold text-[#3b415a]">{s.value}</p>
                <p className="text-[10px] text-slate-400 font-semibold">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Activity calendar */}
          <div className="bg-white rounded-[1.5rem] p-5 shadow-[0_5px_15px_rgba(0,0,0,0.04)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-[#3b415a]">Activity</h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">28 days</span>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {STREAK_DATA.map((active, i) => (
                <div
                  key={i}
                  className={`h-6 rounded-md transition-all ${active ? "bg-emerald-500" : "bg-slate-100"}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                <span className="text-[10px] text-slate-400 font-medium">Active</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-slate-100" />
                <span className="text-[10px] text-slate-400 font-medium">Rest</span>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-[1.5rem] p-5 shadow-[0_5px_15px_rgba(0,0,0,0.04)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-[#3b415a]">Achievements</h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                {achievements.filter((a) => a.earned).length}/{achievements.length}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                    ach.earned
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-slate-100 bg-slate-50 opacity-40"
                  }`}
                >
                  <span className="text-lg">{ach.emoji}</span>
                  <p className="text-[10px] font-bold text-[#3b415a] text-center leading-tight">{ach.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Data sources */}
          <div className="bg-white rounded-[1.5rem] p-5 shadow-[0_5px_15px_rgba(0,0,0,0.04)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-[#3b415a]">Data Sources</h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-1 rounded-lg">Fully Private</span>
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
                      <p className="text-sm font-bold text-[#3b415a]">{src.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {src.active ? "Syncing locally \u00b7 no PII shared" : "Not connected"}
                      </p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${src.active ? "bg-emerald-500" : "bg-slate-200"}`} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Privacy guarantee */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-[#3b415a]">Privacy Guarantee</p>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5 leading-relaxed">
                Raw data never leaves your device. Only anonymous proofs reach the Hedera network.
              </p>
            </div>
          </div>

          {/* Redeem CTA */}
          <button className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white transition shadow-[0_8px_20px_rgba(16,185,129,0.3)]">
            Redeem {wispBalance} $WISP at Local Merchants
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 w-full h-20 bg-white border-t border-slate-100 flex justify-around items-center px-6 pb-2 rounded-b-[2.5rem] shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-30">
          <Link href="/home" className="flex flex-col items-center gap-1 text-slate-300 hover:text-[#3b415a] transition-colors">
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-bold">Home</span>
          </Link>
          <Link href="/adventures" className="flex flex-col items-center gap-1 text-slate-300 hover:text-[#3b415a] transition-colors">
            <Play className="w-6 h-6" />
            <span className="text-[10px] font-bold">Adventures</span>
          </Link>
          <div className="flex flex-col items-center gap-1 text-[#3b415a]">
            <User className="w-6 h-6" />
            <span className="text-[10px] font-bold">Profile</span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Train, Zap, ShoppingBag, Leaf, Home, Play, User,
  ChevronRight, CheckCircle2, Lock, Wifi, RotateCcw, Star, Sparkles,
} from "lucide-react";

type QuestStatus = "completed" | "available" | "locked";

interface Quest {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  xp: number;
  category: string;
  status: QuestStatus;
  mcpSource: string;
  streak?: number;
}

const initialQuests: Quest[] = [
  {
    id: 1,
    title: "Ride the Rails",
    description: "Take public transit instead of driving. Any bus, metro, or rail trip counts.",
    icon: Train,
    iconColor: "bg-violet-500",
    xp: 15,
    category: "Transport",
    status: "available",
    mcpSource: "transit-mcp",
    streak: 3,
  },
  {
    id: 2,
    title: "Low Power Day",
    description: "Keep your energy usage below your 30-day baseline for a full day.",
    icon: Zap,
    iconColor: "bg-amber-500",
    xp: 20,
    category: "Energy",
    status: "completed",
    mcpSource: "energy-mcp",
    streak: 5,
  },
  {
    id: 3,
    title: "Eco Market Run",
    description: "Purchase from a partner eco-business — zero-waste cafes, thrift stores, organic grocers.",
    icon: ShoppingBag,
    iconColor: "bg-emerald-500",
    xp: 25,
    category: "Purchases",
    status: "available",
    mcpSource: "receipt-mcp",
  },
  {
    id: 4,
    title: "Plant-Based Meal",
    description: "Buy a plant-based or sustainably sourced item via your grocery loyalty card.",
    icon: Leaf,
    iconColor: "bg-green-500",
    xp: 15,
    category: "Food",
    status: "locked",
    mcpSource: "receipt-mcp",
  },
  {
    id: 5,
    title: "Carbon Offset",
    description: "Purchase a verified carbon offset certificate and earn a bonus streak reward.",
    icon: Star,
    iconColor: "bg-blue-500",
    xp: 50,
    category: "Offset",
    status: "locked",
    mcpSource: "offset-mcp",
  },
];

const categoryBadge: Record<string, string> = {
  Transport: "bg-violet-100 border-violet-200 text-violet-700",
  Energy:    "bg-amber-100  border-amber-200  text-amber-700",
  Purchases: "bg-emerald-100 border-emerald-200 text-emerald-700",
  Food:      "bg-green-100  border-green-200  text-green-700",
  Offset:    "bg-blue-100   border-blue-200   text-blue-700",
};

export default function AdventuresPage() {
  const [quests, setQuests] = useState(initialQuests);
  const [syncing, setSyncing] = useState<number | null>(null);

  const handleSync = (id: number) => {
    setSyncing(id);
    setTimeout(() => {
      setQuests((prev) =>
        prev.map((q) =>
          q.id === id && q.status === "available"
            ? { ...q, status: "completed" as QuestStatus }
            : q
        )
      );
      setSyncing(null);
    }, 1800);
  };

  const completed = quests.filter((q) => q.status === "completed").length;
  const total = quests.length;

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 font-sans p-4 sm:p-8">
      {/* Mobile Device Mockup */}
      <div className="relative w-full max-w-100 h-212.5 bg-[#f4f7fa] rounded-[3rem] shadow-2xl overflow-hidden border-8 border-slate-800 flex flex-col">

        {/* Sky gradient */}
        <div className="absolute top-0 left-0 w-full h-[28%] bg-linear-to-b from-[#e0e8f5] to-[#f4f7fa] z-0 overflow-hidden">
          <div className="absolute top-10 left-6 w-14 h-5 bg-white rounded-full opacity-60 blur-[1px]" />
          <div className="absolute top-16 right-8 w-20 h-6 bg-white rounded-full opacity-50 blur-[1px]" />
          <div className="absolute top-8 right-20 w-10 h-4 bg-white rounded-full opacity-40 blur-[1px]" />
        </div>

        {/* Header */}
        <div className="relative z-20 w-full px-6 pt-10 pb-2 flex justify-between items-center">
          <div>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-[0.15em]">Daily</p>
            <h1 className="text-[#3b415a] font-bold text-xl tracking-tight mt-0.5">Adventures</h1>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-700">{completed}/{total} done</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative z-20 px-6 mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] text-slate-400 font-semibold">Daily progress</span>
            <span className="text-[10px] text-emerald-600 font-bold">
              {completed === total ? "All complete! 🎉" : `${total - completed} remaining`}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-700"
              style={{ width: `${(completed / total) * 100}%` }}
            />
          </div>
        </div>

        {/* Quest list */}
        <div className="flex-1 overflow-y-auto hide-scrollbar px-5 pb-24 space-y-3 z-20">
          {quests.map((quest) => {
            const Icon = quest.icon;
            const isLocked = quest.status === "locked";
            const isDone   = quest.status === "completed";
            const isSyncingThis = syncing === quest.id;
            return (
              <div
                key={quest.id}
                className={`bg-white rounded-2xl p-4 transition-all ${isDone || isLocked ? "opacity-60" : "shadow-[0_5px_15px_rgba(0,0,0,0.05)]"}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-white ${isLocked ? "bg-slate-200" : quest.iconColor}`}>
                    {isLocked ? <Lock className="w-4 h-4 text-slate-400" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <h4 className={`text-sm font-bold ${isDone ? "text-slate-400 line-through" : "text-[#3b415a]"}`}>{quest.title}</h4>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${categoryBadge[quest.category] ?? "bg-slate-100 border-slate-200 text-slate-500"}`}>
                        {quest.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{quest.description}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex items-center gap-1">
                        <Wifi className="w-3 h-3 text-slate-300" />
                        <span className="text-[10px] text-slate-400 font-mono">{quest.mcpSource}</span>
                      </div>
                      {quest.streak && <span className="text-[10px] text-orange-500 font-bold">🔥 {quest.streak}d streak</span>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">+{quest.xp} XP</span>
                    {isDone && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                    {quest.status === "available" && (
                      <button
                        onClick={() => handleSync(quest.id)}
                        disabled={isSyncingThis}
                        className="flex items-center gap-1 bg-[#3b415a] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full hover:bg-[#2d3348] disabled:opacity-50 transition"
                      >
                        {isSyncingThis ? (
                          <><RotateCcw className="w-3 h-3 animate-spin" /> Syncing</>
                        ) : (
                          <>Verify <ChevronRight className="w-3 h-3" /></>
                        )}
                      </button>
                    )}
                    {isLocked && <span className="text-[10px] text-slate-400 font-semibold">Locked</span>}
                  </div>
                </div>
              </div>
            );
          })}
          <button className="w-full p-4 border-2 border-dashed border-[#d1d9e6] rounded-2xl flex items-center justify-center gap-2 text-slate-400 font-bold hover:bg-slate-50 hover:text-slate-600 transition">
            + Connect New Data Source
          </button>
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 w-full h-20 bg-white border-t border-slate-100 flex justify-around items-center px-6 pb-2 rounded-b-[2.5rem] shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-30">
          <Link href="/home" className="flex flex-col items-center gap-1 text-slate-300 hover:text-[#3b415a] transition-colors">
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-bold">Home</span>
          </Link>
          <div className="flex flex-col items-center gap-1 text-[#3b415a]">
            <Play className="w-6 h-6" />
            <span className="text-[10px] font-bold">Adventures</span>
          </div>
          <Link href="/profile" className="flex flex-col items-center gap-1 text-slate-300 hover:text-[#3b415a] transition-colors">
            <User className="w-6 h-6" />
            <span className="text-[10px] font-bold">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

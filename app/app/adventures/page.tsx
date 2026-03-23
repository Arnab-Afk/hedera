"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Train, Zap, ShoppingBag, Leaf, Home, Play, User,
  CheckCircle2, Lock, RotateCcw, Star, ChevronRight,
} from "lucide-react";

type QuestStatus = "completed" | "available" | "locked";

interface Quest {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  xp: number;
  category: string;
  status: QuestStatus;
  streak?: number;
}

const initialQuests: Quest[] = [
  {
    id: 1,
    title: "Ride the Rails",
    description: "Take public transit instead of driving. Any bus, metro, or rail counts.",
    icon: Train,
    gradient: "from-violet-500 to-purple-600",
    xp: 15,
    category: "Transport",
    status: "available",
    streak: 3,
  },
  {
    id: 2,
    title: "Low Power Day",
    description: "Keep energy usage below your 30-day average for a full day.",
    icon: Zap,
    gradient: "from-amber-400 to-orange-500",
    xp: 20,
    category: "Energy",
    status: "completed",
    streak: 5,
  },
  {
    id: 3,
    title: "Eco Market Run",
    description: "Shop at a partner eco-business — zero-waste cafe, thrift store, or organic grocer.",
    icon: ShoppingBag,
    gradient: "from-emerald-400 to-teal-500",
    xp: 25,
    category: "Purchases",
    status: "available",
  },
  {
    id: 4,
    title: "Plant-Based Meal",
    description: "Buy a plant-based item via your grocery loyalty card.",
    icon: Leaf,
    gradient: "from-green-400 to-emerald-600",
    xp: 15,
    category: "Food",
    status: "locked",
  },
  {
    id: 5,
    title: "Carbon Offset",
    description: "Purchase a verified carbon offset certificate for a bonus reward.",
    icon: Star,
    gradient: "from-sky-400 to-blue-600",
    xp: 50,
    category: "Offset",
    status: "locked",
  },
];

const CATEGORIES = ["All", "Transport", "Energy", "Purchases", "Food", "Offset"];

const categoryAccent: Record<string, string> = {
  Transport: "text-violet-600 bg-violet-50 border-violet-200",
  Energy:    "text-amber-600 bg-amber-50 border-amber-200",
  Purchases: "text-emerald-600 bg-emerald-50 border-emerald-200",
  Food:      "text-green-600 bg-green-50 border-green-200",
  Offset:    "text-sky-600 bg-sky-50 border-sky-200",
};

export default function AdventuresPage() {
  const [quests, setQuests] = useState(initialQuests);
  const [syncing, setSyncing] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

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
  const xpEarned = quests
    .filter((q) => q.status === "completed")
    .reduce((sum, q) => sum + q.xp, 0);
  const totalXp = quests.reduce((sum, q) => sum + q.xp, 0);

  const filtered =
    activeCategory === "All"
      ? quests
      : quests.filter((q) => q.category === activeCategory);

  // SVG ring math
  const radius = 26;
  const circ = 2 * Math.PI * radius;
  const progress = circ - (completed / total) * circ;

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 font-sans p-4 sm:p-8">
      <div className="relative w-full max-w-100 h-212.5 bg-[#f4f7fa] rounded-[3rem] shadow-2xl overflow-hidden border-8 border-slate-800 flex flex-col">

        {/* Hero gradient */}
        <div className="absolute top-0 left-0 w-full h-[38%] z-0 overflow-hidden"
          style={{ background: "linear-gradient(160deg, #d1fae5 0%, #e0e8f5 60%, #f4f7fa 100%)" }}>
          <div className="absolute top-8 left-4 w-16 h-6 bg-white rounded-full opacity-50 blur-[2px]" />
          <div className="absolute top-14 right-6 w-24 h-7 bg-white rounded-full opacity-40 blur-[2px]" />
          <div className="absolute top-5 right-24 w-10 h-4 bg-white rounded-full opacity-30 blur-[2px]" />
        </div>

        {/* Header */}
        <div className="relative z-20 w-full px-6 pt-10 pb-1 flex justify-between items-start">
          <div>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-[0.18em]">Daily</p>
            <h1 className="text-[#3b415a] font-black text-2xl tracking-tight leading-none mt-0.5">Adventures</h1>
          </div>

          {/* XP ring */}
          <div className="flex flex-col items-center">
            <svg width="68" height="68" className="-rotate-90">
              <circle cx="34" cy="34" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="5" />
              <circle
                cx="34" cy="34" r={radius} fill="none"
                stroke="url(#xpGrad)" strokeWidth="5"
                strokeDasharray={circ}
                strokeDashoffset={progress}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.7s ease" }}
              />
              <defs>
                <linearGradient id="xpGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </svg>
            {/* Center label inside ring — positioned via negative margin trick */}
            <div className="relative -mt-13 flex flex-col items-center justify-center w-17 h-8.5">
              <span className="text-[13px] font-black text-[#3b415a] leading-none">{xpEarned}</span>
              <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-wider">XP</span>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative z-20 mx-5 mb-3 bg-white rounded-2xl px-4 py-3 flex items-center justify-between shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
          <div className="text-center">
            <p className="text-base font-black text-[#3b415a]">{completed}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Done</p>
          </div>
          <div className="w-px h-6 bg-slate-100" />
          <div className="text-center">
            <p className="text-base font-black text-[#3b415a]">{total - completed}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Left</p>
          </div>
          <div className="w-px h-6 bg-slate-100" />
          <div className="text-center">
            <p className="text-base font-black text-emerald-600">{totalXp - xpEarned}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">XP to earn</p>
          </div>
          <div className="w-px h-6 bg-slate-100" />
          {/* mini progress bar */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${(completed / total) * 100}%` }}
              />
            </div>
            <p className="text-[9px] font-bold text-slate-400">{Math.round((completed / total) * 100)}% complete</p>
          </div>
        </div>

        {/* Category filter */}
        <div className="relative z-20 px-5 mb-3">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all ${
                  activeCategory === cat
                    ? "bg-[#3b415a] text-white border-[#3b415a] shadow-sm"
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Quest list */}
        <div className="flex-1 overflow-y-auto hide-scrollbar px-5 pb-24 space-y-2.5 z-20">
          {filtered.map((quest) => {
            const Icon = quest.icon;
            const isLocked = quest.status === "locked";
            const isDone = quest.status === "completed";
            const isSyncing = syncing === quest.id;

            return (
              <div
                key={quest.id}
                className={`bg-white rounded-2xl overflow-hidden transition-all ${
                  isLocked ? "opacity-50" : isDone ? "opacity-70" : "shadow-[0_6px_18px_rgba(0,0,0,0.07)]"
                }`}
              >
                {/* Colored top stripe */}
                <div className={`h-1 w-full bg-linear-to-r ${quest.gradient} ${isLocked ? "opacity-30" : ""}`} />

                <div className="p-4 flex items-start gap-3">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white bg-linear-to-br ${isLocked ? "bg-none bg-slate-200" : quest.gradient}`}>
                    {isLocked ? <Lock className="w-4 h-4 text-slate-400" /> : <Icon className="w-5 h-5" />}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                      <h4 className={`text-sm font-bold ${isDone ? "text-slate-400 line-through" : "text-[#3b415a]"}`}>
                        {quest.title}
                      </h4>
                      {quest.streak && !isDone && !isLocked && (
                        <span className="text-[9px] font-black text-orange-500 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded-full">
                          \U0001f525{quest.streak}d
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{quest.description}</p>

                    {/* Footer row */}
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${categoryAccent[quest.category] ?? "text-slate-500 bg-slate-50 border-slate-200"}`}>
                        {quest.category}
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          +{quest.xp} XP
                        </span>

                        {isDone && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                        )}
                        {quest.status === "available" && (
                          <button
                            onClick={() => handleSync(quest.id)}
                            disabled={isSyncing}
                            className={`flex items-center gap-1 text-white text-[10px] font-black px-3 py-1.5 rounded-full transition-all disabled:opacity-60 bg-linear-to-r ${quest.gradient}`}
                          >
                            {isSyncing ? (
                              <><RotateCcw className="w-3 h-3 animate-spin" />Syncing</>
                            ) : (
                              <>Verify<ChevronRight className="w-3 h-3" /></>
                            )}
                          </button>
                        )}
                        {isLocked && (
                          <span className="text-[10px] text-slate-400 font-bold">Locked</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add source CTA */}
          <button className="w-full py-3.5 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-400 text-xs font-bold hover:bg-white hover:border-slate-300 hover:text-slate-600 transition">
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

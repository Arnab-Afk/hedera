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
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

interface GameProfile {
  level: number;
  experience: number;
  gold: number;
  spirit_name: string;
  xp_to_next_level: number;
  streak?: {
    current_streak?: number;
    longest_streak?: number;
    total_actions?: number;
  };
}

interface ActionItem {
  id: string;
  category: string;
  submitted_at: string;
  xp_earned?: number;
  wisp_earned?: number;
  chain_tx_hash?: string | null;
}

interface QuestItem {
  id: string;
  completed?: boolean;
  claimed?: boolean;
}

const connectedSourcesBase = [
  { id: 1, name: "Transit Verifier", icon: Train, color: "bg-violet-500", key: "public_transit" },
  { id: 2, name: "Energy Verifier", icon: Zap, color: "bg-amber-500", key: "energy_reduction" },
  { id: 3, name: "Meal Verifier", icon: ShoppingBag, color: "bg-emerald-500", key: "plant_based_food" },
  { id: 4, name: "Recycling Verifier", icon: ShoppingBag, color: "bg-teal-500", key: "recycling" },
];

export default function ProfilePage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const hederaNetwork = (process.env.NEXT_PUBLIC_HEDERA_NETWORK || "testnet").toLowerCase();
  const router = useRouter();
  const { token, user, isLoading: isAuthLoading } = useAuth();

  const [copied, setCopied] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  const [newSpiritName, setNewSpiritName] = useState("");
  const [profile, setProfile] = useState<GameProfile | null>(null);
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [quests, setQuests] = useState<QuestItem[]>([]);

  const walletAddress = user?.wallet_address || "Not Connected";

  useEffect(() => {
    if (!isAuthLoading && !token) {
      router.replace("/onboarding");
    }
  }, [isAuthLoading, router, token]);

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;

    const loadProfileData = async () => {
      try {
        setIsProfileLoading(true);
        setStatusMessage("");

        const [profileRes, actionsRes, questsRes] = await Promise.all([
          fetch(`${API_URL}/api/game/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/actions?limit=100`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/quests`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!profileRes.ok) {
          throw new Error("Could not load profile data");
        }

        const profilePayload = await profileRes.json();
        const actionsPayload = actionsRes.ok ? await actionsRes.json() : { actions: [] };
        const questsPayload = questsRes.ok ? await questsRes.json() : { quests: [] };

        if (cancelled) {
          return;
        }

        const nextProfile: GameProfile = {
          level: Number(profilePayload?.level || 1),
          experience: Number(profilePayload?.experience || 0),
          gold: Number(profilePayload?.gold || 0),
          spirit_name: String(profilePayload?.spirit_name || "Sprout"),
          xp_to_next_level: Number(profilePayload?.xp_to_next_level || 100),
          streak: profilePayload?.streak,
        };

        setProfile(nextProfile);
        setNewSpiritName(nextProfile.spirit_name);
        setActions(Array.isArray(actionsPayload?.actions) ? actionsPayload.actions : []);
        setQuests(Array.isArray(questsPayload?.quests) ? questsPayload.quests : []);
      } catch {
        if (!cancelled) {
          setStatusMessage("Could not load profile. Try refreshing.");
        }
      } finally {
        if (!cancelled) {
          setIsProfileLoading(false);
        }
      }
    };

    loadProfileData();

    return () => {
      cancelled = true;
    };
  }, [API_URL, token]);

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRenameSpirit = async () => {
    const trimmed = newSpiritName.trim();
    if (!token || !trimmed || trimmed.length > 32) {
      setStatusMessage("Spirit name must be between 1 and 32 characters.");
      return;
    }

    try {
      setIsRenaming(true);
      setStatusMessage("Updating spirit name...");

      const res = await fetch(`${API_URL}/api/game/spirit/rename`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: trimmed }),
      });

      const payload = await res.json();
      if (!res.ok) {
        setStatusMessage(payload?.error || "Could not rename spirit.");
        return;
      }

      setProfile((prev) => (prev ? { ...prev, spirit_name: String(payload?.spirit_name || trimmed) } : prev));
      setStatusMessage("Spirit name updated.");
    } catch {
      setStatusMessage("Could not rename spirit right now.");
    } finally {
      setIsRenaming(false);
    }
  };

  const streakData = useMemo(() => {
    const byDay = new Set(
      actions
        .map((a) => {
          const date = new Date(a.submitted_at);
          if (Number.isNaN(date.getTime())) return null;
          return date.toISOString().slice(0, 10);
        })
        .filter((d): d is string => Boolean(d)),
    );

    return Array.from({ length: 28 }).map((_, idx) => {
      const d = new Date();
      d.setDate(d.getDate() - (27 - idx));
      const key = d.toISOString().slice(0, 10);
      return byDay.has(key);
    });
  }, [actions]);

  const recentActions = useMemo(() => actions.slice(0, 5), [actions]);

  const currentStreak = Number(profile?.streak?.current_streak || 0);
  const wispBalance = Number(profile?.gold || 0);
  const totalXp = Number(profile?.experience || 0);
  const level = Number(profile?.level || 1);
  const totalActions = Number(profile?.streak?.total_actions || actions.length || 0);
  const daysActive = streakData.filter(Boolean).length;

  const levelStartXp = 100 * Math.pow(Math.max(0, level - 1), 2);
  const currentLevelProgressXp = Math.max(0, totalXp - levelStartXp);
  const xpToNext = Number(profile?.xp_to_next_level || 100);
  const levelBand = Math.max(1, currentLevelProgressXp + xpToNext);
  const levelProgressPct = Math.min(100, Math.max(0, (currentLevelProgressXp / levelBand) * 100));

  const completedQuestCount = quests.filter((q) => q.completed).length;

  const actionCategories = new Set(actions.map((a) => a.category));
  const connectedSources = connectedSourcesBase.map((s) => ({
    ...s,
    active: actionCategories.has(s.key),
  }));

  const achievements = [
    { id: 1, emoji: "\u{1F331}", label: "First Step", earned: totalActions >= 1 },
    { id: 2, emoji: "\u{1F525}", label: "7-Day Streak", earned: currentStreak >= 7 },
    { id: 3, emoji: "\u26A1", label: "Energy Saver", earned: actionCategories.has("energy_reduction") },
    { id: 4, emoji: "\u{1F30D}", label: "30-Day Streak", earned: currentStreak >= 30 },
    { id: 5, emoji: "\u{1F48E}", label: "100 Actions", earned: totalActions >= 100 },
    { id: 6, emoji: "\u{1F3C6}", label: "Quest Claimer", earned: completedQuestCount >= 3 },
  ];

  const earnedAchievementCount = achievements.filter((a) => a.earned).length;

  if (!token) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 font-sans p-4 sm:p-8 overflow-y-auto">
      <div className="relative w-full max-w-100 h-[calc(100dvh-2rem)] sm:h-212.5 bg-[#f4f7fa] rounded-[3rem] shadow-2xl overflow-hidden border-8 border-slate-800 flex flex-col min-h-0">

        <div className="absolute top-0 left-0 w-full h-[40%] bg-linear-to-b from-[#e0e8f5] to-[#f4f7fa] z-0 overflow-hidden">
          <div className="absolute top-12 left-6 w-16 h-6 bg-white rounded-full opacity-60 blur-[1px]" />
          <div className="absolute top-20 right-10 w-20 h-8 bg-white rounded-full opacity-50 blur-[1px]" />
          <div className="absolute top-8 right-24 w-12 h-4 bg-white rounded-full opacity-40 blur-[1px]" />
        </div>

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
            <span className="text-xs font-bold text-[#3b415a] font-mono max-w-30 truncate">{walletAddress}</span>
            {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
          </button>
        </div>

        <div className="relative z-10 -mt-4">
          <ThreeDPlant />
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar px-5 z-20 -mt-16 relative pb-24 space-y-3 min-h-0">

          <div className="bg-white rounded-[1.75rem] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mb-1">Wisp Spirit</p>
                <h2 className="text-base font-bold text-[#3b415a]">{profile?.spirit_name || "Sprout"} - Day {Math.max(1, currentStreak)}</h2>
                <p className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Leaves blooming - evolving soon!
                </p>
              </div>
              <div className="bg-emerald-100 border border-emerald-200 text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-full">
                Level {level}
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <input
                value={newSpiritName}
                onChange={(e) => setNewSpiritName(e.target.value)}
                maxLength={32}
                className="flex-1 h-10 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-[#3b415a]"
                placeholder="Rename your spirit"
              />
              <button
                onClick={handleRenameSpirit}
                disabled={isRenaming}
                className="px-3 rounded-xl bg-emerald-500 text-white text-xs font-bold disabled:opacity-60"
              >
                {isRenaming ? "Saving" : "Rename"}
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] font-bold text-[#3b415a]">Total XP</span>
                <span className="text-[11px] font-bold text-slate-400">{currentLevelProgressXp} / {levelBand}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full transition-all duration-1000 bg-linear-to-r from-violet-400 to-violet-600"
                  style={{ width: `${levelProgressPct}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 font-medium">{xpToNext} XP to Level {level + 1} - NFT evolution unlocks</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {[
              { icon: <Flame className="w-4 h-4 text-red-500" />, bg: "bg-red-50", value: currentStreak, label: "Streak" },
              { icon: <span className="text-xs font-black text-amber-600">$W</span>, bg: "bg-amber-50", value: wispBalance.toFixed(2), label: "$WISP" },
              { icon: <TrendingUp className="w-4 h-4 text-emerald-600" />, bg: "bg-emerald-50", value: daysActive, label: "Active" },
            ].map((s, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col items-center gap-1.5 shadow-[0_5px_15px_rgba(0,0,0,0.04)]">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${s.bg}`}>{s.icon}</div>
                <p className="text-xl font-bold text-[#3b415a]">{s.value}</p>
                <p className="text-[10px] text-slate-400 font-semibold">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-[1.5rem] p-5 shadow-[0_5px_15px_rgba(0,0,0,0.04)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-[#3b415a]">Activity</h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">28 days</span>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {streakData.map((active, i) => (
                <div key={i} className={`h-6 rounded-md transition-all ${active ? "bg-emerald-500" : "bg-slate-100"}`} />
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

          <div className="bg-white rounded-[1.5rem] p-5 shadow-[0_5px_15px_rgba(0,0,0,0.04)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-[#3b415a]">Achievements</h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                {earnedAchievementCount}/{achievements.length}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                    ach.earned ? "border-emerald-200 bg-emerald-50" : "border-slate-100 bg-slate-50 opacity-40"
                  }`}
                >
                  <span className="text-lg">{ach.emoji}</span>
                  <p className="text-[10px] font-bold text-[#3b415a] text-center leading-tight">{ach.label}</p>
                </div>
              ))}
            </div>
          </div>

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
                      <p className="text-[10px] text-slate-400 font-medium">{src.active ? "Active via recent proof" : "Not connected"}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${src.active ? "bg-emerald-500" : "bg-slate-200"}`} />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-[1.5rem] p-5 shadow-[0_5px_15px_rgba(0,0,0,0.04)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-[#3b415a]">Recent Verifications</h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Latest 5</span>
            </div>
            <div className="space-y-2">
              {recentActions.length === 0 ? (
                <p className="text-[11px] text-slate-400 font-medium">No verified actions yet.</p>
              ) : (
                recentActions.map((a) => (
                  <div key={a.id} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2">
                    <div>
                      <p className="text-xs font-bold text-[#3b415a]">{formatCategory(a.category)}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{formatDate(a.submitted_at)}</p>
                      {a.chain_tx_hash ? (
                        <a
                          href={`https://hashscan.io/${hederaNetwork}/transaction/${a.chain_tx_hash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 underline mt-0.5"
                        >
                          View on HashScan
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      ) : null}
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-emerald-700">+{Number(a.wisp_earned || 0).toFixed(3)} WISP</p>
                      <p className="text-[10px] font-bold text-violet-600">+{Number(a.xp_earned || 0)} XP</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-[#3b415a]">Privacy Guarantee</p>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5 leading-relaxed">
                Raw data never leaves your device. Only anonymous proofs reach the Hedera network.
              </p>
            </div>
          </div>

          <button className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white transition shadow-[0_8px_20px_rgba(16,185,129,0.3)]">
            Redeem {wispBalance.toFixed(2)} $WISP at Local Merchants
            <ArrowUpRight className="w-4 h-4" />
          </button>

          {statusMessage ? <p className="text-[11px] text-slate-500 font-semibold">{statusMessage}</p> : null}
          {isProfileLoading ? <p className="text-[11px] text-slate-400 font-semibold">Syncing profile...</p> : null}
        </div>

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

function formatCategory(category: string) {
  return category
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDate(input: string) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

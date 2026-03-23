"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Leaf,
  Zap,
  Train,
  Recycle,
  ShieldCheck,
  Home,
  User,
  Wallet,
  Flame,
  Calendar,
  Play,
  Upload,
  Loader2,
} from "lucide-react";
import ThreeDPlant from "@/components/three-d-plant";
import { useAuth } from "@/context/auth-context";

type TaskStatus = "pending" | "actionable" | "completed";

interface Task {
  id: number;
  category: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  status: TaskStatus;
  xp: number;
  color: string;
}

export default function HomePage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const { token, user } = useAuth();
  const [xp, setXp] = useState(10);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [ownerName, setOwnerName] = useState("Local User");
  const [spiritName, setSpiritName] = useState("Sprout");
  const [isSyncingHome, setIsSyncingHome] = useState(false);
  const [ticketPreview, setTicketPreview] = useState<string | null>(null);
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [isTicketSectionOpen, setIsTicketSectionOpen] = useState(false);
  const [billPreview, setBillPreview] = useState<string | null>(null);
  const [isSubmittingBill, setIsSubmittingBill] = useState(false);
  const [isBillSectionOpen, setIsBillSectionOpen] = useState(false);
  const [billStatus, setBillStatus] = useState<string>("");
  const [screenPreview, setScreenPreview] = useState<string | null>(null);
  const [isSubmittingScreen, setIsSubmittingScreen] = useState(false);
  const [isScreenSectionOpen, setIsScreenSectionOpen] = useState(false);
  const [screenStatus, setScreenStatus] = useState<string>("");
  const [mealPreview, setMealPreview] = useState<string | null>(null);
  const [isSubmittingMeal, setIsSubmittingMeal] = useState(false);
  const [isMealSectionOpen, setIsMealSectionOpen] = useState(false);
  const [mealStatus, setMealStatus] = useState<string>("");
  const [recyclePreview, setRecyclePreview] = useState<string | null>(null);
  const [isSubmittingRecycle, setIsSubmittingRecycle] = useState(false);
  const [isRecycleSectionOpen, setIsRecycleSectionOpen] = useState(false);
  const [recycleStatus, setRecycleStatus] = useState<string>("");
  const [verifyingCategory, setVerifyingCategory] = useState<string | null>(null);
  const [ticketStatus, setTicketStatus] = useState<string>("");
  const [wispBalance, setWispBalance] = useState(0);
  const [wispBalanceDelta, setWispBalanceDelta] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      category: "public_transit",
      title: "Take Public Transit",
      subtitle: "Syncing via MCP...",
      icon: Train,
      status: "pending",
      xp: 15,
      color: "bg-violet-500",
    },
    {
      id: 2,
      category: "energy_reduction",
      title: "Low Energy Usage",
      subtitle: "Ready for check-in",
      icon: Zap,
      status: "actionable",
      xp: 20,
      color: "bg-emerald-500",
    },
    {
      id: 3,
      category: "plant_based_food",
      title: "Plant Based Meal",
      subtitle: "Upload meal photo to verify",
      icon: Leaf,
      status: "actionable",
      xp: 12,
      color: "bg-lime-500",
    },
    {
      id: 4,
      category: "screen_time_reduction",
      title: "Low Screen Time Day",
      subtitle: "Upload screenshot to verify",
      icon: Play,
      status: "actionable",
      xp: 18,
      color: "bg-blue-500",
    },
    {
      id: 5,
      category: "recycling",
      title: "Recycling Proof",
      subtitle: "Upload recycling photo",
      icon: Recycle,
      status: "actionable",
      xp: 10,
      color: "bg-teal-500",
    },
  ]);

  const effectiveWispBalance = useMemo(() => wispBalance + wispBalanceDelta, [wispBalance, wispBalanceDelta]);

  useEffect(() => {
    if (!user?.wallet_address) {
      return;
    }
    setOwnerName(user.wallet_address);
  }, [user?.wallet_address]);

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;

    const loadHomeData = async () => {
      try {
        setIsSyncingHome(true);

        const [profileRes, actionsRes] = await Promise.all([
          fetch(`${API_URL}/api/game/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/actions?limit=50`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!profileRes.ok) {
          throw new Error("Could not load profile");
        }

        const profile = await profileRes.json();
        const actionsPayload = actionsRes.ok ? await actionsRes.json() : { actions: [] };
        const actions = Array.isArray(actionsPayload?.actions) ? actionsPayload.actions : [];

        if (cancelled) {
          return;
        }

        const exp = Number(profile?.experience || 0);
        const currentLevel = Number(profile?.level || 1);
        const streakValue = Number(profile?.streak?.current_streak || 0);
        const goldBalance = Number(profile?.gold || 0);
        const profileSpiritName = String(profile?.spirit_name || "Sprout");

        setLevel(currentLevel);
        setXp(exp % 50);
        setStreak(streakValue);
        setWispBalance(goldBalance);
        setSpiritName(profileSpiritName);

        if (!user?.wallet_address) {
          setOwnerName(profileSpiritName);
        }

        const completedCategories = new Set(actions.map((a: { category?: string }) => a.category));
        setTasks((prev) =>
          prev.map((task) => {
            if (completedCategories.has(task.category)) {
              return {
                ...task,
                status: "completed" as TaskStatus,
                subtitle: "Verified via backend",
              };
            }

            if (task.category === "screen_time_reduction") {
              return {
                ...task,
                status: "actionable" as TaskStatus,
                subtitle: "Upload screenshot to verify",
              };
            }

            if (task.category === "plant_based_food") {
              return {
                ...task,
                status: "actionable" as TaskStatus,
                subtitle: "Upload meal photo to verify",
              };
            }

            if (task.category === "recycling") {
              return {
                ...task,
                status: "actionable" as TaskStatus,
                subtitle: "Upload recycling photo",
              };
            }

            return {
              ...task,
              status: task.category === "public_transit" ? ("pending" as TaskStatus) : ("actionable" as TaskStatus),
              subtitle: task.category === "public_transit" ? "Upload ticket to verify" : "Ready for check-in",
            };
          }),
        );
      } catch {
        if (!cancelled) {
          setTicketStatus("Could not sync home data. Pull to retry by refreshing.");
        }
      } finally {
        if (!cancelled) {
          setIsSyncingHome(false);
        }
      }
    };

    loadHomeData();

    return () => {
      cancelled = true;
    };
  }, [API_URL, token, user?.wallet_address]);

  const onTicketSelected = async (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setTicketStatus("Please upload an image file.");
      return;
    }

    const dataUrl = await toDataUrl(file);
    setTicketPreview(dataUrl);
    setIsTicketSectionOpen(true);
    setTicketStatus("");
  };

  const submitTicket = async () => {
    if (!ticketPreview) {
      setTicketStatus("Upload a ticket image first.");
      return;
    }

    if (!token) {
      setTicketStatus("Please complete login first.");
      return;
    }

    try {
      setIsSubmittingTicket(true);
      setTicketStatus("Verifying ticket with AI...");

      const res = await fetch(`${API_URL}/api/actions/ticket-photo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageDataUrl: ticketPreview }),
      });

      const payload = await res.json();
      if (!res.ok) {
        const message = payload?.error || "Ticket verification failed.";
        setTicketStatus(message);
        return;
      }

      const xpEarned = Number(payload?.reward?.xpEarned || 0);
      const wispEarned = Number(payload?.reward?.wispEarned || 0);
      setXp((prev) => Math.min(prev + xpEarned, 50));
      setWispBalanceDelta((prev) => prev + wispEarned);
      setTasks((prev) =>
        prev.map((task) =>
          task.category === "public_transit"
            ? { ...task, status: "completed" as TaskStatus, subtitle: "Verified via ticket upload" }
            : task,
        ),
      );
      setTicketStatus(`Verified! +${xpEarned} XP and +${wispEarned.toFixed(4)} WISP credited.`);
      setTicketPreview(null);
      setIsTicketSectionOpen(false);
    } catch {
      setTicketStatus("Could not submit ticket right now. Please try again.");
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  const submitManualAction = async (category: string) => {
    if (!token) {
      setTicketStatus("Please complete login first.");
      return;
    }

    try {
      setVerifyingCategory(category);
      setTicketStatus("Submitting action verification...");

      const res = await fetch(`${API_URL}/api/actions/manual`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ category }),
      });

      const payload = await res.json();
      if (!res.ok) {
        setTicketStatus(payload?.error || "Could not verify this action.");
        return;
      }

      const xpEarned = Number(payload?.reward?.xpEarned || 0);
      const wispEarned = Number(payload?.reward?.wispEarned || 0);
      setXp((prev) => Math.min(prev + xpEarned, 50));
      setWispBalanceDelta((prev) => prev + wispEarned);
      setTasks((prev) =>
        prev.map((task) =>
          task.category === category
            ? { ...task, status: "completed" as TaskStatus, subtitle: "Verified via app check-in" }
            : task,
        ),
      );
      setTicketStatus(`Action verified! +${xpEarned} XP and +${wispEarned.toFixed(4)} WISP credited.`);
    } catch {
      setTicketStatus("Could not submit action right now. Please try again.");
    } finally {
      setVerifyingCategory(null);
    }
  };

  const onBillSelected = async (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setBillStatus("Please upload an image file.");
      return;
    }

    const dataUrl = await toDataUrl(file);
    setBillPreview(dataUrl);
    setIsBillSectionOpen(true);
    setBillStatus("");
  };

  const submitElectricityBill = async () => {
    if (!billPreview) {
      setBillStatus("Upload your monthly bill image first.");
      return;
    }

    if (!token) {
      setBillStatus("Please complete login first.");
      return;
    }

    try {
      setIsSubmittingBill(true);
      setBillStatus("Reading units consumed from bill...");

      const res = await fetch(`${API_URL}/api/actions/electricity-bill`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageDataUrl: billPreview }),
      });

      const payload = await res.json();
      if (!res.ok) {
        setBillStatus(payload?.error || "Could not verify electricity bill.");
        return;
      }

      const xpEarned = Number(payload?.reward?.xpEarned || 0);
      const wispEarned = Number(payload?.reward?.wispEarned || 0);
      const unitsConsumed = Number(payload?.bill?.unitsConsumed || 0);
      const score = Number(payload?.bill?.score || 0);

      setXp((prev) => Math.min(prev + xpEarned, 50));
      setWispBalanceDelta((prev) => prev + wispEarned);
      setTasks((prev) =>
        prev.map((task) =>
          task.category === "energy_reduction"
            ? {
                ...task,
                status: "completed" as TaskStatus,
                subtitle: `Bill verified: ${unitsConsumed} units (score ${score})`,
              }
            : task,
        ),
      );
      setBillStatus(`Bill verified: ${unitsConsumed} units (score ${score}). +${wispEarned.toFixed(4)} WISP credited.`);
      setBillPreview(null);
      setIsBillSectionOpen(false);
    } catch {
      setBillStatus("Could not submit bill right now. Please try again.");
    } finally {
      setIsSubmittingBill(false);
    }
  };

  const onScreenSelected = async (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setScreenStatus("Please upload an image file.");
      return;
    }

    const dataUrl = await toDataUrl(file);
    setScreenPreview(dataUrl);
    setIsScreenSectionOpen(true);
    setScreenStatus("");
  };

  const submitScreenTime = async () => {
    if (!screenPreview) {
      setScreenStatus("Upload a daily screen-time screenshot first.");
      return;
    }

    if (!token) {
      setScreenStatus("Please complete login first.");
      return;
    }

    try {
      setIsSubmittingScreen(true);
      setScreenStatus("Analyzing screen-time screenshot...");

      const res = await fetch(`${API_URL}/api/actions/screen-time`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageDataUrl: screenPreview }),
      });

      const payload = await res.json();
      if (!res.ok) {
        setScreenStatus(payload?.error || "Could not verify screen-time screenshot.");
        return;
      }

      const xpEarned = Number(payload?.reward?.xpEarned || 0);
      const wispEarned = Number(payload?.reward?.wispEarned || 0);
      const totalMinutes = Number(payload?.screen?.totalMinutes || 0);
      const score = Number(payload?.screen?.score || 0);

      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      setXp((prev) => Math.min(prev + xpEarned, 50));
      setWispBalanceDelta((prev) => prev + wispEarned);
      setTasks((prev) =>
        prev.map((task) =>
          task.category === "screen_time_reduction"
            ? {
                ...task,
                status: "completed" as TaskStatus,
                subtitle: `Screen time ${hours}h ${minutes}m (score ${score})`,
              }
            : task,
        ),
      );
      setScreenStatus(`Verified: ${hours}h ${minutes}m (score ${score}). +${wispEarned.toFixed(4)} WISP credited.`);
      setScreenPreview(null);
      setIsScreenSectionOpen(false);
    } catch {
      setScreenStatus("Could not submit screenshot right now. Please try again.");
    } finally {
      setIsSubmittingScreen(false);
    }
  };

  const onMealSelected = async (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMealStatus("Please upload an image file.");
      return;
    }

    const dataUrl = await toDataUrl(file);
    setMealPreview(dataUrl);
    setIsMealSectionOpen(true);
    setMealStatus("");
  };

  const submitMealPhoto = async () => {
    if (!mealPreview) {
      setMealStatus("Upload a meal photo first.");
      return;
    }

    if (!token) {
      setMealStatus("Please complete login first.");
      return;
    }

    try {
      setIsSubmittingMeal(true);
      setMealStatus("Analyzing meal photo...");

      const res = await fetch(`${API_URL}/api/actions/meal-photo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageDataUrl: mealPreview }),
      });

      const payload = await res.json();
      if (!res.ok) {
        setMealStatus(payload?.error || "Could not verify meal photo.");
        return;
      }

      const xpEarned = Number(payload?.reward?.xpEarned || 0);
      const wispEarned = Number(payload?.reward?.wispEarned || 0);
      const dishName = String(payload?.meal?.dishName || "Plant meal");

      setXp((prev) => Math.min(prev + xpEarned, 50));
      setWispBalanceDelta((prev) => prev + wispEarned);
      setTasks((prev) =>
        prev.map((task) =>
          task.category === "plant_based_food"
            ? {
                ...task,
                status: "completed" as TaskStatus,
                subtitle: `Verified meal: ${dishName}`,
              }
            : task,
        ),
      );
      setMealStatus(`Meal verified. +${xpEarned} XP and +${wispEarned.toFixed(4)} WISP credited.`);
      setMealPreview(null);
      setIsMealSectionOpen(false);
    } catch {
      setMealStatus("Could not submit meal right now. Please try again.");
    } finally {
      setIsSubmittingMeal(false);
    }
  };

  const onRecycleSelected = async (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setRecycleStatus("Please upload an image file.");
      return;
    }

    const dataUrl = await toDataUrl(file);
    setRecyclePreview(dataUrl);
    setIsRecycleSectionOpen(true);
    setRecycleStatus("");
  };

  const submitRecyclingPhoto = async () => {
    if (!recyclePreview) {
      setRecycleStatus("Upload a recycling photo first.");
      return;
    }

    if (!token) {
      setRecycleStatus("Please complete login first.");
      return;
    }

    try {
      setIsSubmittingRecycle(true);
      setRecycleStatus("Analyzing recycling photo...");

      const res = await fetch(`${API_URL}/api/actions/recycling-photo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageDataUrl: recyclePreview }),
      });

      const payload = await res.json();
      if (!res.ok) {
        setRecycleStatus(payload?.error || "Could not verify recycling photo.");
        return;
      }

      const xpEarned = Number(payload?.reward?.xpEarned || 0);
      const wispEarned = Number(payload?.reward?.wispEarned || 0);
      const itemCount = Number(payload?.recycling?.recyclableItemCount || 0);

      setXp((prev) => Math.min(prev + xpEarned, 50));
      setWispBalanceDelta((prev) => prev + wispEarned);
      setTasks((prev) =>
        prev.map((task) =>
          task.category === "recycling"
            ? {
                ...task,
                status: "completed" as TaskStatus,
                subtitle: `Verified recycling: ${itemCount} items`,
              }
            : task,
        ),
      );
      setRecycleStatus(`Recycling verified. +${xpEarned} XP and +${wispEarned.toFixed(4)} WISP credited.`);
      setRecyclePreview(null);
      setIsRecycleSectionOpen(false);
    } catch {
      setRecycleStatus("Could not submit recycling proof right now. Please try again.");
    } finally {
      setIsSubmittingRecycle(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 font-sans p-4 sm:p-8 overflow-y-auto">
      {/* Mobile Device Mockup */}
      <div className="relative w-full max-w-100 h-[calc(100dvh-2rem)] sm:h-212.5 bg-[#f4f7fa] rounded-[3rem] shadow-2xl overflow-hidden border-8 border-slate-800 flex flex-col min-h-0">

        {/* Sky gradient background */}
        <div className="absolute top-0 left-0 w-full h-[40%] bg-linear-to-b from-[#e0e8f5] to-[#f4f7fa] z-0 overflow-hidden">
          <div className="absolute top-12 left-6 w-16 h-6 bg-white rounded-full opacity-60 blur-[1px]" />
          <div className="absolute top-20 right-10 w-20 h-8 bg-white rounded-full opacity-50 blur-[1px]" />
          <div className="absolute top-8 right-24 w-12 h-4 bg-white rounded-full opacity-40 blur-[1px]" />
        </div>

        {/* Header */}
        <div className="w-full px-6 pt-10 flex justify-between items-center z-20">
          <div className="bg-white/50 backdrop-blur-md p-2 rounded-xl shadow-sm cursor-pointer hover:bg-white transition">
            <Leaf className="w-5 h-5 text-emerald-600" />
          </div>
          <h1 className="text-[#3b415a] font-bold text-lg tracking-wide">My Buddy {spiritName}</h1>
          <div className="bg-white/50 backdrop-blur-md p-2 rounded-xl shadow-sm cursor-pointer hover:bg-white transition flex items-center gap-1">
            <Wallet className="w-4 h-4 text-slate-600" />
            <span className="text-xs font-bold text-slate-700">{effectiveWispBalance.toFixed(2)} WISP</span>
          </div>
        </div>

        {/* 3D Plant */}
        <div className="relative z-10 -mt-4">
          <ThreeDPlant />
        </div>

        {/* Main Content Panel */}
        <div className="flex-1 bg-[#f4f7fa] px-5 z-20 -mt-16 relative overflow-y-auto pb-24 min-h-0 hide-scrollbar">

          {/* Stats Card */}
          <div className="bg-white rounded-[2rem] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)] w-full mb-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-slate-200 rounded-full" />

            {/* Owner / Age row */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f0f4f8] rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Wallet</p>
                  <p className="text-sm font-bold text-[#3b415a] truncate max-w-30">{ownerName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f0f4f8] rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Age</p>
                  <p className="text-sm font-bold text-[#3b415a]">{Math.max(1, streak)} Days</p>
                </div>
              </div>
            </div>

            {/* Level & XP Bar */}
            <div className="bg-[#f8faff] rounded-2xl p-4 border border-[#eef2f6] mb-3">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                    {level}
                  </div>
                  <span className="font-bold text-[#3b415a] text-sm">Level {level}</span>
                </div>
                <span className="text-xs font-bold text-slate-400">XP: {xp}/50</span>
              </div>
              <div className="w-full bg-[#e2e8f0] rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(xp / 50) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-[#f1f7ff] rounded-2xl p-4 border border-[#dbeafe] mb-3 flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Spirit Name</p>
                <p className="text-sm font-bold text-[#3b415a]">{spiritName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Account Balance</p>
                <p className="text-sm font-bold text-emerald-700">{effectiveWispBalance.toFixed(4)} WISP</p>
              </div>
            </div>

            {/* Streak */}
            <div className="bg-[#fff5f5] rounded-2xl p-4 border border-[#ffe3e3] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Flame className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="font-bold text-[#3b415a] text-sm">Streak</p>
                  <p className="text-xs text-slate-500 font-medium">{streak} days in a row</p>
                </div>
              </div>
              <ShieldCheck className="w-5 h-5 text-red-300" />
            </div>
          </div>

          {/* Goals Header */}
          <div className="flex justify-between items-end mb-4 px-1">
            <h3 className="text-lg font-bold text-[#3b415a]">Today&apos;s Goals</h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md">
              {isSyncingHome ? "Syncing" : "Fully Private"}
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 mb-4 shadow-[0_6px_18px_rgba(0,0,0,0.04)] border border-slate-100">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div>
                <h4 className="text-sm font-bold text-[#3b415a]">Verify Transit Ticket</h4>
                <p className="text-[11px] text-slate-500 font-medium">Upload photo, AI verifies, reward is credited</p>
              </div>
              <button
                onClick={() => setIsTicketSectionOpen((prev) => !prev)}
                className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md"
              >
                {isTicketSectionOpen ? "Close" : "Open"}
              </button>
            </div>

            {isTicketSectionOpen && (
              <>
                {ticketPreview ? (
                  <img
                    src={ticketPreview}
                    alt="Ticket preview"
                    className="w-full h-32 object-cover rounded-xl border border-slate-200 mb-3"
                  />
                ) : (
                  <label className="w-full h-24 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-slate-50 transition mb-3">
                    <Upload className="w-5 h-5 text-slate-500" />
                    <span className="text-xs font-semibold text-slate-600">Tap to upload ticket photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onTicketSelected(e.target.files?.[0] || null)}
                    />
                  </label>
                )}

                <button
                  onClick={submitTicket}
                  disabled={isSubmittingTicket}
                  className="w-full rounded-xl bg-emerald-600 text-white py-2.5 text-sm font-bold disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isSubmittingTicket ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify and Credit"
                  )}
                </button>
              </>
            )}

            {ticketStatus ? <p className="mt-2 text-[11px] font-semibold text-slate-500">{ticketStatus}</p> : null}
          </div>

          <div className="bg-white rounded-2xl p-4 mb-4 shadow-[0_6px_18px_rgba(0,0,0,0.04)] border border-slate-100">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div>
                <h4 className="text-sm font-bold text-[#3b415a]">Monthly Electricity Bill</h4>
                <p className="text-[11px] text-slate-500 font-medium">AI extracts units consumed and rewards by score</p>
              </div>
              <button
                onClick={() => setIsBillSectionOpen((prev) => !prev)}
                className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md"
              >
                {isBillSectionOpen ? "Close" : "Open"}
              </button>
            </div>

            {isBillSectionOpen && (
              <>
                {billPreview ? (
                  <img
                    src={billPreview}
                    alt="Electricity bill preview"
                    className="w-full h-32 object-cover rounded-xl border border-slate-200 mb-3"
                  />
                ) : (
                  <label className="w-full h-24 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-slate-50 transition mb-3">
                    <Upload className="w-5 h-5 text-slate-500" />
                    <span className="text-xs font-semibold text-slate-600">Tap to upload electricity bill</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onBillSelected(e.target.files?.[0] || null)}
                    />
                  </label>
                )}

                <button
                  onClick={submitElectricityBill}
                  disabled={isSubmittingBill}
                  className="w-full rounded-xl bg-blue-600 text-white py-2.5 text-sm font-bold disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isSubmittingBill ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Extracting Units...
                    </>
                  ) : (
                    "Analyze Bill and Credit"
                  )}
                </button>
              </>
            )}

            {billStatus ? <p className="mt-2 text-[11px] font-semibold text-slate-500">{billStatus}</p> : null}
          </div>

          <div className="bg-white rounded-2xl p-4 mb-4 shadow-[0_6px_18px_rgba(0,0,0,0.04)] border border-slate-100">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div>
                <h4 className="text-sm font-bold text-[#3b415a]">Daily Screen Time</h4>
                <p className="text-[11px] text-slate-500 font-medium">Upload screen-time screenshot, estimate energy, earn rewards</p>
              </div>
              <button
                onClick={() => setIsScreenSectionOpen((prev) => !prev)}
                className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md"
              >
                {isScreenSectionOpen ? "Close" : "Open"}
              </button>
            </div>

            {isScreenSectionOpen && (
              <>
                {screenPreview ? (
                  <img
                    src={screenPreview}
                    alt="Screen-time screenshot preview"
                    className="w-full h-32 object-cover rounded-xl border border-slate-200 mb-3"
                  />
                ) : (
                  <label className="w-full h-24 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-slate-50 transition mb-3">
                    <Upload className="w-5 h-5 text-slate-500" />
                    <span className="text-xs font-semibold text-slate-600">Tap to upload screen-time screenshot</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onScreenSelected(e.target.files?.[0] || null)}
                    />
                  </label>
                )}

                <button
                  onClick={submitScreenTime}
                  disabled={isSubmittingScreen}
                  className="w-full rounded-xl bg-indigo-600 text-white py-2.5 text-sm font-bold disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isSubmittingScreen ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Screen Time"
                  )}
                </button>
              </>
            )}

            {screenStatus ? <p className="mt-2 text-[11px] font-semibold text-slate-500">{screenStatus}</p> : null}
          </div>

          <div className="bg-white rounded-2xl p-4 mb-4 shadow-[0_6px_18px_rgba(0,0,0,0.04)] border border-slate-100">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div>
                <h4 className="text-sm font-bold text-[#3b415a]">Plant-Based Meal Photo</h4>
                <p className="text-[11px] text-slate-500 font-medium">AI verifies plant-based meal and credits reward</p>
              </div>
              <button
                onClick={() => setIsMealSectionOpen((prev) => !prev)}
                className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md"
              >
                {isMealSectionOpen ? "Close" : "Open"}
              </button>
            </div>

            {isMealSectionOpen && (
              <>
                {mealPreview ? (
                  <img
                    src={mealPreview}
                    alt="Meal photo preview"
                    className="w-full h-32 object-cover rounded-xl border border-slate-200 mb-3"
                  />
                ) : (
                  <label className="w-full h-24 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-slate-50 transition mb-3">
                    <Upload className="w-5 h-5 text-slate-500" />
                    <span className="text-xs font-semibold text-slate-600">Tap to upload meal photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onMealSelected(e.target.files?.[0] || null)}
                    />
                  </label>
                )}

                <button
                  onClick={submitMealPhoto}
                  disabled={isSubmittingMeal}
                  className="w-full rounded-xl bg-lime-600 text-white py-2.5 text-sm font-bold disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isSubmittingMeal ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Meal"
                  )}
                </button>
              </>
            )}

            {mealStatus ? <p className="mt-2 text-[11px] font-semibold text-slate-500">{mealStatus}</p> : null}
          </div>

          <div className="bg-white rounded-2xl p-4 mb-4 shadow-[0_6px_18px_rgba(0,0,0,0.04)] border border-slate-100">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div>
                <h4 className="text-sm font-bold text-[#3b415a]">Recycling Photo Proof</h4>
                <p className="text-[11px] text-slate-500 font-medium">AI verifies recyclables and rewards recycling habit</p>
              </div>
              <button
                onClick={() => setIsRecycleSectionOpen((prev) => !prev)}
                className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md"
              >
                {isRecycleSectionOpen ? "Close" : "Open"}
              </button>
            </div>

            {isRecycleSectionOpen && (
              <>
                {recyclePreview ? (
                  <img
                    src={recyclePreview}
                    alt="Recycling photo preview"
                    className="w-full h-32 object-cover rounded-xl border border-slate-200 mb-3"
                  />
                ) : (
                  <label className="w-full h-24 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-slate-50 transition mb-3">
                    <Upload className="w-5 h-5 text-slate-500" />
                    <span className="text-xs font-semibold text-slate-600">Tap to upload recycling photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onRecycleSelected(e.target.files?.[0] || null)}
                    />
                  </label>
                )}

                <button
                  onClick={submitRecyclingPhoto}
                  disabled={isSubmittingRecycle}
                  className="w-full rounded-xl bg-teal-600 text-white py-2.5 text-sm font-bold disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isSubmittingRecycle ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Recycling"
                  )}
                </button>
              </>
            )}

            {recycleStatus ? <p className="mt-2 text-[11px] font-semibold text-slate-500">{recycleStatus}</p> : null}
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer ${
                  task.status === "completed"
                    ? "bg-white opacity-60"
                    : "bg-white shadow-[0_5px_15px_rgba(0,0,0,0.04)]"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-[1rem] flex items-center justify-center text-white shadow-inner ${task.color}`}
                >
                  <task.icon className="w-6 h-6" />
                </div>

                <div className="flex-1">
                  <h4
                    className={`text-sm font-bold ${
                      task.status === "completed" ? "text-slate-400 line-through" : "text-[#3b415a]"
                    }`}
                  >
                    {task.title}
                  </h4>
                  <p className="text-[11px] font-semibold text-slate-400 mt-0.5 flex items-center gap-1">
                    {task.status === "pending" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                    )}
                    {task.subtitle}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className="bg-[#f0f4f8] text-[#3b415a] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    +{task.xp} XP
                  </div>
                  {task.status === "actionable" && !["public_transit", "screen_time_reduction", "plant_based_food", "recycling"].includes(task.category) && (
                    <button
                      onClick={() => submitManualAction(task.category)}
                      disabled={verifyingCategory === task.category}
                      className="mt-1 text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-500 text-white disabled:opacity-60"
                    >
                      {verifyingCategory === task.category ? "Verifying..." : "Verify"}
                    </button>
                  )}
                  {task.status === "completed" && (
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mt-1">
                      <Leaf className="w-3 h-3 text-emerald-600" />
                    </div>
                  )}
                </div>
              </div>
            ))}

            <button className="w-full p-4 border-2 border-dashed border-[#d1d9e6] rounded-2xl flex items-center justify-center gap-2 text-slate-400 font-bold hover:bg-slate-50 transition hover:text-slate-600">
              + Connect New Data Source
            </button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 w-full h-20 bg-white border-t border-slate-100 flex justify-around items-center px-6 pb-2 rounded-b-[2.5rem] shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-30">
          <Link href="/home" className="flex flex-col items-center gap-1 text-[#3b415a]">
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-bold">Home</span>
          </Link>
          <Link href="/adventures" className="flex flex-col items-center gap-1 text-slate-300 hover:text-[#3b415a] transition-colors">
            <Play className="w-6 h-6" />
            <span className="text-[10px] font-bold">Adventures</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 text-slate-300 hover:text-[#3b415a] transition-colors">
            <User className="w-6 h-6" />
            <span className="text-[10px] font-bold">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function toDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

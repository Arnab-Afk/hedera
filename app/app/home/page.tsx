"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Leaf,
  Zap,
  Train,
  ShieldCheck,
  Home,
  User,
  Wallet,
  Flame,
  Calendar,
  Play,
} from "lucide-react";
import ThreeDPlant from "@/components/three-d-plant";

type TaskStatus = "pending" | "actionable" | "completed";

interface Task {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  status: TaskStatus;
  xp: number;
  color: string;
}

export default function HomePage() {
  const [xp, setXp] = useState(10);
  const [streak] = useState(1);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Take Public Transit",
      subtitle: "Syncing via MCP...",
      icon: Train,
      status: "pending",
      xp: 15,
      color: "bg-violet-500",
    },
    {
      id: 2,
      title: "Low Energy Usage",
      subtitle: "Verified locally",
      icon: Zap,
      status: "completed",
      xp: 20,
      color: "bg-emerald-500",
    },
  ]);

  const completeTask = (id: number) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === id && t.status === "actionable") {
          setXp((prev) => Math.min(prev + t.xp, 50));
          return { ...t, status: "completed" as TaskStatus, subtitle: "Verified locally" };
        }
        return t;
      }),
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 font-sans p-4 sm:p-8">
      {/* Mobile Device Mockup */}
      <div className="relative w-full max-w-100 h-212.5 bg-[#f4f7fa] rounded-[3rem] shadow-2xl overflow-hidden border-8 border-slate-800 flex flex-col">

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
          <h1 className="text-[#3b415a] font-bold text-lg tracking-wide">My Buddy Sprout</h1>
          <div className="bg-white/50 backdrop-blur-md p-2 rounded-xl shadow-sm cursor-pointer hover:bg-white transition flex items-center gap-1">
            <Wallet className="w-4 h-4 text-slate-600" />
            <span className="text-xs font-bold text-slate-700">Connect</span>
          </div>
        </div>

        {/* 3D Plant */}
        <div className="relative z-10 -mt-4">
          <ThreeDPlant />
        </div>

        {/* Main Content Panel */}
        <div className="flex-1 bg-[#f4f7fa] px-5 z-20 -mt-16 relative">

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
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Owner</p>
                  <p className="text-sm font-bold text-[#3b415a]">Local User</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f0f4f8] rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Age</p>
                  <p className="text-sm font-bold text-[#3b415a]">14 Days</p>
                </div>
              </div>
            </div>

            {/* Level & XP Bar */}
            <div className="bg-[#f8faff] rounded-2xl p-4 border border-[#eef2f6] mb-3">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                    1
                  </div>
                  <span className="font-bold text-[#3b415a] text-sm">Level 1</span>
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
              Fully Private
            </span>
          </div>

          {/* Task List */}
          <div className="space-y-3 pb-24 overflow-y-auto hide-scrollbar max-h-50">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => completeTask(task.id)}
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
          <div className="flex flex-col items-center gap-1 text-[#3b415a]">
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-bold">Home</span>
          </div>
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

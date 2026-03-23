"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Home, ClipboardList, Leaf, ShoppingBag, User, Loader2 } from "lucide-react";
import Link from "next/link";

const navItems = [
  { icon: Home, label: "Home", href: "/home" },
  { icon: ClipboardList, label: "Tasks", href: "/home" },
  { icon: Leaf, label: "Wisp", href: "/home" },
  { icon: ShoppingBag, label: "Shop", href: "/home" },
  { icon: User, label: "Profile", href: "/home" },
];

interface GameProfile {
  level: number;
  experience: number;
  energy: number;
  gold: string;
  spirit_name: string;
  xp_to_next_level: number;
  streak: {
    current_streak: number;
    longest_streak: number;
    total_actions: number;
  };
}

interface Quest {
  id: string;
  title: string;
  description: string;
  category: string;
  requirement_count: number;
  current_count: number;
  xp_reward: number;
  wisp_reward: string;
  completed: boolean;
  claimed: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function HomePage() {
  const { token, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<GameProfile | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const [profileRes, questsRes] = await Promise.all([
        fetch(`${API_URL}/api/game/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/quests`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const profileData = await profileRes.json();
      const questsData = await questsRes.json();

      setProfile(profileData);
      setQuests(questsData.quests);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimQuest = async (questId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/quests/${questId}/claim`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error("Error claiming quest:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="home-root items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-white" />
      </div>
    );
  }

  const xpProgress = profile 
    ? (profile.experience / (profile.experience + profile.xp_to_next_level)) * 100 
    : 0;

  return (
    <div className="home-root">
      <div className="home-bg" />

      {/* Header */}
      <header className="home-header">
        <div className="home-header-left">
          <span className="home-logo">🌿</span>
          <div>
            <p className="home-welcome">Level {profile?.level || 1}</p>
            <h1 className="home-name">{profile?.spirit_name || "Sprout"}</h1>
          </div>
        </div>
        <div className="home-header-right">
          <div className="wisp-balance">
            <span className="wisp-coin">💰</span>
            <span className="wisp-amount">{parseFloat(profile?.gold || "0").toFixed(0)} $WISP</span>
          </div>
        </div>
      </header>

      {/* Spirit card */}
      <div className="spirit-card">
        <div className="spirit-glow" />
        <div className="spirit-top">
          <span className="spirit-tag">⚡ Day {profile?.streak.current_streak || 1} — {profile?.level && profile.level > 5 ? "Grown" : "Seedling"}</span>
        </div>
        <div className="spirit-plant-wrap">
          <span className="spirit-plant">{profile?.level && profile.level > 5 ? "🌳" : "🌱"}</span>
        </div>
        <div className="spirit-bar-wrap">
          <div className="spirit-bar-label">
            <span>{profile?.experience} / {profile ? profile.experience + profile.xp_to_next_level : 100} XP</span>
          </div>
          <div className="spirit-bar-track">
            <div className="spirit-bar-fill" style={{ width: `${xpProgress}%` }} />
          </div>
        </div>
      </div>

      {/* Tasks section */}
      <div className="tasks-section">
        <div className="tasks-header">
          <span className="tasks-icon">📋</span>
          <span className="tasks-title">{quests.filter(q => !q.completed).length} goals left for today!</span>
        </div>

        {quests.map((quest) => (
          <div 
            key={quest.id} 
            className={`task-card ${quest.completed ? "done" : ""}`}
            onClick={() => quest.completed && !quest.claimed && handleClaimQuest(quest.id)}
          >
            <span className="task-icon">{quest.category === 'public_transit' ? '🚌' : '🌿'}</span>
            <div className="task-body">
              <p className="task-name">{quest.title}</p>
              <div className="task-meta">
                <span className="task-tag">{quest.current_count}/{quest.requirement_count}</span>
                <span className="task-xp">+{quest.xp_reward} XP</span>
                <span className="task-token">+{parseFloat(quest.wisp_reward).toFixed(0)} $WISP</span>
              </div>
            </div>
            <div className={`task-check ${quest.completed ? "checked" : ""}`}>
              {quest.claimed ? "✓" : (quest.completed ? "🎁" : <span className="task-plus">+</span>)}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom nav */}
      <nav className="app-nav">
        {navItems.map((n, i) => {
          const Icon = n.icon;
          return (
            <Link key={i} href={n.href} className={`nav-item ${i === 0 ? "active" : ""}`}>
              <Icon size={22} />
              <span>{n.label}</span>
            </Link>
          );
        })}
      </nav>

      <style>{`
        * { box-sizing: border-box; }
        .home-root {
          min-height: 100dvh;
          background: linear-gradient(170deg, #10b981 0%, #059669 60%, #064e3b 100%);
          display: flex;
          flex-direction: column;
          padding-bottom: 80px;
          font-family: inherit;
          color: white;
        }
        .home-bg {
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 40% at 20% 15%, rgba(255,255,255,.12) 0%, transparent 60%);
          pointer-events: none;
          z-index: 0;
        }
        .home-header {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 3rem 1.25rem 1rem;
        }
        .home-header-left { display: flex; align-items: center; gap: .75rem; }
        .home-logo { font-size: 2rem; }
        .home-welcome { margin: 0; font-size: .8rem; color: rgba(255,255,255,.7); }
        .home-name { margin: 0; font-size: 1.25rem; font-weight: 800; color: #ffffff; }
        .wisp-balance {
          background: rgba(255,255,255,.15);
          padding: .45rem .9rem;
          border-radius: 999px;
          display: flex;
          align-items: center;
          gap: .4rem;
          font-size: .85rem;
          font-weight: 700;
          color: #ffffff;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,.2);
        }
        .spirit-card {
          position: relative;
          z-index: 1;
          margin: 0 1.25rem;
          background: rgba(255,255,255,.12);
          border-radius: 28px;
          padding: 1.25rem;
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,.25);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          overflow: hidden;
        }
        .spirit-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 70% 60% at 50% 0%, rgba(255,255,255,.2) 0%, transparent 70%);
          pointer-events: none;
        }
        .spirit-tag {
          background: linear-gradient(90deg, #10b981, #34d399);
          color: #fff;
          font-size: .8rem;
          font-weight: 700;
          padding: .3rem .75rem;
          border-radius: 999px;
        }
        .spirit-plant {
          font-size: 7rem;
          line-height: 1;
          filter: drop-shadow(0 4px 24px rgba(0,0,0,.15));
          animation: spirit-bob 3s ease-in-out infinite;
          display: block;
        }
        @keyframes spirit-bob {
          0%, 100% { transform: translateY(0) scale(1); }
          50%       { transform: translateY(-10px) scale(1.04); }
        }
        .spirit-bar-track {
          width: 100%;
          height: 12px;
          background: rgba(255,255,255,.2);
          border-radius: 999px;
          overflow: hidden;
        }
        .spirit-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #34d399, #6ee7b7);
          border-radius: 999px;
          transition: width 1s ease;
        }
        .tasks-section {
          position: relative;
          z-index: 1;
          padding: 1.25rem 1.25rem 0;
          display: flex;
          flex-direction: column;
          gap: .75rem;
        }
        .task-card {
          background: rgba(0,0,0,.2);
          border-radius: 18px;
          padding: 1rem 1.1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: transform .15s;
          cursor: pointer;
        }
        .task-card:active { transform: scale(.98); }
        .task-name { margin: 0; font-size: .95rem; font-weight: 600; color: #ffffff; }
        .task-tag {
          background: rgba(255,255,255,.1);
          color: rgba(255,255,255,.6);
          font-size: .7rem;
          padding: .15rem .5rem;
          border-radius: 999px;
        }
        .task-xp {
          background: rgba(52,211,153,.15);
          color: #34d399;
          font-size: .7rem;
          padding: .15rem .5rem;
          border-radius: 999px;
          font-weight: 700;
        }
        .task-token {
          background: rgba(251,191,36,.15);
          color: #fbbf24;
          font-size: .7rem;
          padding: .15rem .5rem;
          border-radius: 999px;
          font-weight: 700;
        }
        .task-check {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 1rem;
          font-weight: 700;
          flex-shrink: 0;
        }
        .task-card.done .task-check { background: #10b981; }
        .app-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 50;
          background: rgba(0,0,0,.8);
          backdrop-filter: blur(16px);
          border-top: 1px solid rgba(255,255,255,.08);
          display: flex;
          justify-content: space-around;
          align-items: center;
          height: 72px;
          padding: 0 .5rem;
        }
        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          color: rgba(255,255,255,.4);
          text-decoration: none;
          font-size: .65rem;
          font-weight: 600;
          transition: color .2s;
        }
        .nav-item.active { color: #34d399; }
      `}</style>
    </div>
  );
}

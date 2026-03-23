"use client";
import { Home, ClipboardList, Leaf, ShoppingBag, User } from "lucide-react";
import Link from "next/link";

const navItems = [
  { icon: Home, label: "Home", href: "/home" },
  { icon: ClipboardList, label: "Tasks", href: "/home" },
  { icon: Leaf, label: "Wisp", href: "/home" },
  { icon: ShoppingBag, label: "Shop", href: "/home" },
  { icon: User, label: "Profile", href: "/home" },
];

export default function HomePage() {
  return (
    <div className="home-root">
      <div className="home-bg" />

      {/* Header */}
      <header className="home-header">
        <div className="home-header-left">
          <span className="home-logo">🌿</span>
          <div>
            <p className="home-welcome">Welcome back</p>
            <h1 className="home-name">Sprout</h1>
          </div>
        </div>
        <div className="home-header-right">
          <div className="wisp-balance">
            <span className="wisp-coin">💰</span>
            <span className="wisp-amount">0 $WISP</span>
          </div>
        </div>
      </header>

      {/* Spirit card */}
      <div className="spirit-card">
        <div className="spirit-glow" />
        <div className="spirit-top">
          <span className="spirit-tag">⚡ Day 1 — Seedling</span>
        </div>
        <div className="spirit-plant-wrap">
          <span className="spirit-plant">🌱</span>
        </div>
        <div className="spirit-bar-wrap">
          <div className="spirit-bar-label">
            <span>0 / 20 XP</span>
          </div>
          <div className="spirit-bar-track">
            <div className="spirit-bar-fill" style={{ width: "0%" }} />
          </div>
        </div>
      </div>

      {/* Tasks section */}
      <div className="tasks-section">
        <div className="tasks-header">
          <span className="tasks-icon">📋</span>
          <span className="tasks-title">8 goals left for today!</span>
          <span className="tasks-flag">🏳️</span>
        </div>

        {[
          { icon: "🌬️", label: "Take 3 deep breaths", done: true },
          { icon: "🌿", label: "Choose a plant-based meal", done: true },
          { icon: "🚌", label: "Use public transport", done: false },
        ].map((t, i) => (
          <div key={i} className={`task-card ${t.done ? "done" : ""}`}>
            <span className="task-icon">{t.icon}</span>
            <div className="task-body">
              <p className="task-name">{t.label}</p>
              <div className="task-meta">
                <span className="task-tag">daily</span>
                <span className="task-xp">+5 XP</span>
                <span className="task-token">+1 $WISP</span>
              </div>
            </div>
            <div className={`task-check ${t.done ? "checked" : ""}`}>
              {t.done ? "✓" : <span className="task-plus">+</span>}
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
          background: linear-gradient(170deg, #f5a623 0%, #f0b429 60%, #e89d1b 100%);
          display: flex;
          flex-direction: column;
          padding-bottom: 80px;
          font-family: inherit;
        }
        .home-bg {
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 40% at 20% 15%, rgba(255,255,255,.18) 0%, transparent 60%);
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
        .home-welcome { margin: 0; font-size: .8rem; color: rgba(92,46,0,.7); }
        .home-name { margin: 0; font-size: 1.25rem; font-weight: 800; color: #3b1e00; }
        .wisp-balance {
          background: rgba(255,255,255,.25);
          padding: .45rem .9rem;
          border-radius: 999px;
          display: flex;
          align-items: center;
          gap: .4rem;
          font-size: .85rem;
          font-weight: 700;
          color: #3b1e00;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,.4);
        }
        /* Spirit card */
        .spirit-card {
          position: relative;
          z-index: 1;
          margin: 0 1.25rem;
          background: rgba(255,255,255,.18);
          border-radius: 28px;
          padding: 1.25rem;
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,.35);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          overflow: hidden;
        }
        .spirit-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 70% 60% at 50% 0%, rgba(255,255,255,.25) 0%, transparent 70%);
          pointer-events: none;
        }
        .spirit-top {
          align-self: flex-start;
          position: relative;
          z-index: 1;
        }
        .spirit-tag {
          background: linear-gradient(90deg, #f97316, #fb923c);
          color: #fff;
          font-size: .8rem;
          font-weight: 700;
          padding: .3rem .75rem;
          border-radius: 999px;
        }
        .spirit-plant-wrap {
          position: relative;
          z-index: 1;
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
        .spirit-bar-wrap {
          width: 100%;
          position: relative;
          z-index: 1;
        }
        .spirit-bar-label {
          display: flex;
          justify-content: center;
          font-size: .8rem;
          color: #3b1e00;
          margin-bottom: .4rem;
          font-weight: 600;
        }
        .spirit-bar-track {
          width: 100%;
          height: 12px;
          background: rgba(255,255,255,.45);
          border-radius: 999px;
          overflow: hidden;
        }
        .spirit-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #f97316, #fbbf24);
          border-radius: 999px;
          transition: width 1s ease;
        }
        /* Tasks */
        .tasks-section {
          position: relative;
          z-index: 1;
          padding: 1.25rem 1.25rem 0;
          display: flex;
          flex-direction: column;
          gap: .75rem;
        }
        .tasks-header {
          display: flex;
          align-items: center;
          gap: .5rem;
          font-size: 1rem;
          font-weight: 700;
          color: #3b1e00;
        }
        .tasks-title { flex: 1; }
        .task-card {
          background: #2c2c3e;
          border-radius: 18px;
          padding: 1rem 1.1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: transform .15s;
        }
        .task-card:active { transform: scale(.98); }
        .task-icon { font-size: 1.6rem; }
        .task-body { flex: 1; }
        .task-name { margin: 0; font-size: .95rem; font-weight: 600; color: #f1f5f9; }
        .task-meta { display: flex; gap: .4rem; margin-top: .3rem; }
        .task-tag {
          background: rgba(255,255,255,.08);
          color: rgba(255,255,255,.55);
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
          background: #22c55e;
          display: none;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 1rem;
          font-weight: 700;
          flex-shrink: 0;
        }
        .task-card.done .task-check { display: flex; }
        .task-plus {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #22c55e;
          color: #fff;
          font-size: 1.4rem;
          font-weight: 300;
          flex-shrink: 0;
        }
        .task-card:not(.done) .task-check {
          display: flex;
          background: #22c55e;
        }
        /* Bottom Nav */
        .app-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 50;
          background: rgba(20,20,30,.95);
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
          color: rgba(255,255,255,.45);
          text-decoration: none;
          font-size: .65rem;
          font-weight: 600;
          padding: .4rem .5rem;
          border-radius: 12px;
          transition: color .2s;
          min-width: 48px;
        }
        .nav-item.active { color: #f5a623; }
        .nav-item:hover { color: rgba(255,255,255,.8); }
      `}</style>
    </div>
  );
}

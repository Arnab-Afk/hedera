"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onDone: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: value }),
      });

      if (response.ok) {
        onDone();
      } else {
        console.error("Failed to rename spirit");
      }
    } catch (error) {
      console.error("Error renaming spirit:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="name-root">
      <div className="name-bg" />

      {/* Floating leaves */}
      {[...Array(8)].map((_, i) => (
        <span
          key={i}
          className="leaf"
          style={{ "--i": i } as React.CSSProperties}
        >
          🍃
        </span>
      ))}

      <div className="name-content">
        <div className="name-plant">
          <span className="name-plant-emoji">🌱</span>
          <div className="name-glow" />
        </div>

        <div className="name-text">
          <h2 className="name-title">Name Your Spirit</h2>
          <p className="name-desc">
            Your Wisp Spirit is a living plant NFT that evolves with your eco journey. Give it a name — it's yours forever.
          </p>
        </div>

        <div className={`name-input-wrap ${shake ? "shake" : ""}`}>
          <input
            className="name-input"
            type="text"
            maxLength={20}
            placeholder="e.g. Fernsby, Gaia, Sprout…"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            autoFocus
            disabled={isSaving}
          />
          <span className="name-char">{value.length}/20</span>
        </div>

        <button 
          className="name-btn" 
          onClick={handleContinue}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Continue →"}
        </button>
      </div>

      <style>{`
        .name-root {
          position: fixed;
          inset: 0;
          background: linear-gradient(160deg, #071a0f 0%, #081c16 55%, #0a1a2e 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .name-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 40% at 50% 0%, rgba(52,211,153,.14) 0%, transparent 65%),
            radial-gradient(ellipse 40% 30% at 80% 90%, rgba(16,185,129,.1) 0%, transparent 60%);
          pointer-events: none;
        }
        .leaf {
          position: absolute;
          font-size: 1.4rem;
          animation: drift calc(6s + var(--i) * 1.2s) ease-in-out infinite;
          animation-delay: calc(var(--i) * -1.5s);
          left: calc(var(--i) * 13%);
          top: -2rem;
          opacity: 0;
          user-select: none;
          pointer-events: none;
        }
        @keyframes drift {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 0; }
          15%  { opacity: .7; }
          100% { transform: translateY(110vh) rotate(200deg); opacity: 0; }
        }
        .name-content {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.75rem;
          padding: 2rem;
          max-width: 400px;
          width: 100%;
          animation: fade-up .5s ease both;
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .name-plant {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .name-plant-emoji {
          font-size: 6rem;
          line-height: 1;
          filter: drop-shadow(0 0 24px rgba(52,211,153,.6));
          animation: grow 3s ease-in-out infinite;
          position: relative;
          z-index: 1;
        }
        @keyframes grow {
          0%, 100% { transform: scale(1) rotate(-3deg); }
          50%       { transform: scale(1.08) rotate(3deg); }
        }
        .name-glow {
          position: absolute;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(52,211,153,.25) 0%, transparent 70%);
          animation: pulse-glow 2.5s ease-in-out infinite;
        }
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); opacity: .7; }
          50%       { transform: scale(1.2); opacity: 1; }
        }
        .name-text {
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: .6rem;
        }
        .name-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: #ecfdf5;
          margin: 0;
          letter-spacing: -.02em;
        }
        .name-desc {
          font-size: .9rem;
          color: rgba(167,243,208,.7);
          margin: 0;
          line-height: 1.6;
        }
        .name-input-wrap {
          width: 100%;
          position: relative;
        }
        .name-input {
          width: 100%;
          background: rgba(255,255,255,.07);
          border: 1.5px solid rgba(52,211,153,.3);
          border-radius: 16px;
          padding: 1rem 3rem 1rem 1.25rem;
          color: #ecfdf5;
          font-size: 1.05rem;
          outline: none;
          transition: border-color .2s;
          box-sizing: border-box;
          font-family: inherit;
        }
        .name-input::placeholder { color: rgba(167,243,208,.4); }
        .name-input:focus { border-color: #34d399; box-shadow: 0 0 0 3px rgba(52,211,153,.15); }
        .name-char {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: .75rem;
          color: rgba(167,243,208,.45);
        }
        .shake {
          animation: shake .45s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
          10%, 90% { transform: translateX(-2px); }
          20%, 80% { transform: translateX(4px); }
          30%, 50%, 70% { transform: translateX(-6px); }
          40%, 60% { transform: translateX(6px); }
        }
        .name-btn {
          width: 100%;
          padding: .95rem;
          border: none;
          border-radius: 999px;
          background: linear-gradient(135deg, #34d399, #059669);
          color: #022c22;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 24px rgba(52,211,153,.4);
          transition: transform .15s, box-shadow .15s;
        }
        .name-btn:active { transform: scale(.97); }
        .name-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </div>
  );
}

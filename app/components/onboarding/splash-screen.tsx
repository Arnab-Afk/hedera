"use client";

import { useEffect } from "react";

interface Props {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: Props) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="splash-root">
      <div className="splash-bg" />

      {/* Floating particles */}
      {[...Array(14)].map((_, i) => (
        <span key={i} className="particle" style={{ "--i": i } as React.CSSProperties} />
      ))}

      <div className="splash-content">
        <div className="splash-orb">
          <span className="splash-plant">🌿</span>
        </div>
        <h1 className="splash-title">Wisp</h1>
        <p className="splash-sub">The Privacy-First Eco-Companion</p>
        <div className="splash-dots">
          <span /><span /><span />
        </div>
      </div>

      <style>{`
        .splash-root {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(160deg, #0d1f14 0%, #0a2e1a 40%, #0d1b2a 100%);
          overflow: hidden;
          z-index: 100;
        }
        .splash-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 50% at 30% 20%, rgba(52,211,153,.18) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 75% 80%, rgba(16,185,129,.12) 0%, transparent 70%);
        }
        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(52, 211, 153, 0.55);
          animation: float-up 4s ease-in infinite;
          animation-delay: calc(var(--i) * 0.3s);
          left: calc(var(--i) * 7%);
          bottom: -20px;
        }
        @keyframes float-up {
          0%   { transform: translateY(0) scale(1);   opacity: 0; }
          20%  { opacity: 0.8; }
          100% { transform: translateY(-110vh) scale(0.3); opacity: 0; }
        }
        .splash-content {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
          animation: fade-in .8s ease both;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .splash-orb {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: radial-gradient(circle at 40% 35%, #34d399, #059669);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 60px 12px rgba(52,211,153,.4);
          animation: pulse-orb 2.4s ease-in-out infinite;
        }
        @keyframes pulse-orb {
          0%, 100% { box-shadow: 0 0 60px 12px rgba(52,211,153,.4); }
          50%       { box-shadow: 0 0 80px 20px rgba(52,211,153,.6); }
        }
        .splash-plant {
          font-size: 3.5rem;
          animation: sway 3s ease-in-out infinite;
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-6deg); }
          50%       { transform: rotate(6deg); }
        }
        .splash-title {
          font-size: 3rem;
          font-weight: 800;
          color: #ecfdf5;
          letter-spacing: -0.02em;
          margin: 0;
        }
        .splash-sub {
          font-size: 1rem;
          color: rgba(167,243,208,.75);
          margin: 0;
          text-align: center;
          max-width: 240px;
        }
        .splash-dots {
          display: flex;
          gap: 8px;
          margin-top: 1rem;
        }
        .splash-dots span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #34d399;
          animation: blink 1.4s ease-in-out infinite;
        }
        .splash-dots span:nth-child(2) { animation-delay: .2s; }
        .splash-dots span:nth-child(3) { animation-delay: .4s; }
        @keyframes blink {
          0%, 100% { opacity: .3; transform: scale(.8); }
          50%       { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

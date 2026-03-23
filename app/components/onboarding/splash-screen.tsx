"use client";

import { useEffect, useState } from "react";

interface SplashScreenProps {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: SplashScreenProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);

  const particles = Array.from({ length: 10 }, (_, i) => i);

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #e0e8f5, #f4f7fa)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}
    >
      {/* Clouds */}
      <div className="absolute top-10 left-6 w-14 h-5 bg-white rounded-full opacity-60 blur-[1px]" />
      <div className="absolute top-16 right-8 w-20 h-6 bg-white rounded-full opacity-50 blur-[1px]" />
      <div className="absolute top-8 right-20 w-10 h-4 bg-white rounded-full opacity-40 blur-[1px]" />

      {/* Emerald orb */}
      <div
        className="absolute top-1/4 w-36 h-36 rounded-full"
        style={{
          background: "radial-gradient(circle at 40% 40%, #6ee7b7, #059669)",
          filter: "blur(24px)",
          opacity: 0.35,
        }}
      />

      {/* Floating particles */}
      {particles.map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "rgba(52,211,153,0.5)",
            bottom: -10,
            left: `${i * 9 + 2}%`,
            animation: `float-up 4s ease-in infinite`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}

      {/* Logo */}
      <div
        className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-xl"
        style={{
          background: "linear-gradient(135deg, #6ee7b7, #059669)",
          animation: "fade-in 0.8s ease both",
        }}
      >
        <span style={{ fontSize: 48, lineHeight: 1 }}>🌿</span>
      </div>

      <h1
        className="text-4xl font-black tracking-tight text-[#3b415a] mb-2"
        style={{ animation: "fade-in 0.8s ease 0.2s both" }}
      >
        Wisp
      </h1>
      <p
        className="text-sm font-medium text-slate-400 text-center px-8"
        style={{ animation: "fade-in 0.8s ease 0.4s both" }}
      >
        The Privacy-First Eco-Companion
      </p>

      {/* Loading dots */}
      <div
        className="absolute bottom-12 flex gap-2"
        style={{ animation: "fade-in 0.8s ease 0.6s both" }}
      >
        {[0, 0.2, 0.4].map((delay, idx) => (
          <div
            key={idx}
            className="w-2 h-2 rounded-full bg-emerald-400"
            style={{ animation: `pulse 1.2s ease-in-out ${delay}s infinite` }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float-up {
          0%   { transform: translateY(0) scale(1); opacity: 0; }
          20%  { opacity: 0.8; }
          100% { transform: translateY(-300px) scale(0.5); opacity: 0; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50%       { transform: scale(1.4); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

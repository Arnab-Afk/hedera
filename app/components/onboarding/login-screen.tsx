"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Chrome, Wallet, Loader2 } from "lucide-react";
import ThreeDPlant from "@/components/three-d-plant";

interface LoginScreenProps {
  onDone: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function LoginScreen({ onDone }: LoginScreenProps) {
  const [loading, setLoading] = useState<"google" | "wallet" | null>(null);
  const { login, web3auth, hashconnect, hcData } = useAuth();

  const handleGoogleLogin = async () => {
    if (!web3auth) return;
    setLoading("google");
    try {
      const provider = await web3auth.connect();
      const user = await web3auth.getUserInfo();
      console.log("Web3Auth User Info:", user);
      const response = await fetch(`${API_URL}/api/auth/social-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          socialId: user.userId || user.email,
          walletAddress: `0.0.social_${(user.userId || user.email || "anon").replace(/[^a-zA-Z0-9]/g, "").slice(0, 8)}`,
          authType: "google"
        }),
      });
      const data = await response.json();
      if (data.token) {
        login(data.user, data.token);
        onDone();
      }
    } catch (error) {
      console.error("Google login failed", error);
    } finally {
      setLoading(null);
    }
  };

  const handleWalletLogin = async () => {
    if (!hashconnect || !hcData) return;
    setLoading("wallet");
    try {
      await hashconnect.connectToLocalWallet();
      hashconnect.pairingEvent.once(async (pairingData) => {
        const walletAddress = pairingData.accountIds[0];
        const challengeRes = await fetch(`${API_URL}/api/auth/challenge?walletAddress=${walletAddress}`);
        const { nonce } = await challengeRes.json();
        const provider = hashconnect.getProvider("testnet", pairingData.topic, walletAddress);
        const signer = hashconnect.getSigner(provider);
        const message = `Sign this nonce to authenticate with Wisp: ${nonce}`;
        const signature = await signer.sign([new TextEncoder().encode(message)]);
        const loginRes = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            walletAddress,
            signature: Buffer.from(signature[0]).toString("hex")
          }),
        });
        const data = await loginRes.json();
        if (data.token) {
          login(data.user, data.token);
          onDone();
        }
      });
    } catch (error) {
      console.error("Wallet login failed", error);
      setLoading(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f4f7fa] relative overflow-hidden">
      {/* Sky gradient */}
      <div
        className="absolute top-0 left-0 w-full h-[45%] z-0"
        style={{ background: "linear-gradient(to bottom, #d1fae5, #e0e8f5, #f4f7fa)" }}
      >
        <div className="absolute top-8 left-6 w-14 h-5 bg-white rounded-full opacity-60 blur-[1px]" />
        <div className="absolute top-14 right-8 w-20 h-6 bg-white rounded-full opacity-50 blur-[1px]" />
      </div>

      {/* Plant */}
      <div className="relative z-10 mt-2">
        <ThreeDPlant />
      </div>

      {/* Content card */}
      <div className="relative z-20 -mt-10 flex flex-col items-center px-5 gap-4">
        <div className="text-center">
          <h1 className="text-2xl font-black text-[#3b415a] tracking-tight">
            Welcome to <span className="text-emerald-600">Wisp</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Connect your account to begin your eco journey
          </p>
        </div>

        <div className="w-full space-y-3">
          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading !== null}
            className="w-full flex items-center gap-3 bg-white border border-slate-200 px-4 py-3.5 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_18px_rgba(0,0,0,0.1)] transition-all disabled:opacity-50"
          >
            {loading === "google" ? (
              <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
            ) : (
              <Chrome className="w-5 h-5 text-slate-500" />
            )}
            <span className="font-bold text-sm text-[#3b415a]">
              {loading === "google" ? "Connecting..." : "Continue with Google"}
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Wallet */}
          <button
            onClick={handleWalletLogin}
            disabled={loading !== null}
            className="w-full flex items-center gap-3 bg-[#3b415a] px-4 py-3.5 rounded-2xl shadow-[0_4px_20px_rgba(59,65,90,0.3)] hover:bg-[#2d3348] transition-all disabled:opacity-50"
          >
            {loading === "wallet" ? (
              <Loader2 className="w-5 h-5 text-white/60 animate-spin" />
            ) : (
              <Wallet className="w-5 h-5 text-white/60" />
            )}
            <span className="font-bold text-sm text-white">
              {loading === "wallet" ? "Connecting wallet..." : "Connect Hedera Wallet"}
            </span>
          </button>
        </div>

        <p className="text-center text-[10px] text-slate-400 font-medium leading-relaxed px-2">
          Your data never leaves your device. Only anonymous proofs are shared.
        </p>
      </div>
    </div>
  );
}

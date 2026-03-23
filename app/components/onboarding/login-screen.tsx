"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Chrome, Wallet, Loader2, Leaf } from "lucide-react";

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
      
      // In a real Hedera-Web3Auth integration, you'd derive the Hedera address 
      // from the private key provided by the 'provider'. 
      // For this implementation, we send the social info to the backend.
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
      // 1. Connect to HashPack/Blade
      await hashconnect.connectToLocalWallet();
      
      // We listen for the 'foundExtension' or 'pairingEvent'
      // For this UI flow, we'll assume the user selects an account in the popup
      
      hashconnect.pairingEvent.once(async (pairingData) => {
        const walletAddress = pairingData.accountIds[0];
        
        // 2. Get Challenge from Backend
        const challengeRes = await fetch(`${API_URL}/api/auth/challenge?walletAddress=${walletAddress}`);
        const { nonce } = await challengeRes.json();

        // 3. Sign with Wallet
        const provider = hashconnect.getProvider("testnet", pairingData.topic, walletAddress);
        const signer = hashconnect.getSigner(provider);
        
        const message = `Sign this nonce to authenticate with Wisp: ${nonce}`;
        const signature = await signer.sign([new TextEncoder().encode(message)]);

        // 4. Verify on Backend
        const loginRes = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            walletAddress, 
            signature: Buffer.from(signature[0]).toString('hex') 
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
      <div className="absolute top-0 left-0 w-full h-36 bg-linear-to-b from-[#e0e8f5] to-transparent z-0" />
      <div className="absolute top-8 left-8 w-14 h-5 bg-white rounded-full opacity-60 blur-[1px]" />
      <div className="absolute top-14 right-8 w-20 h-6 bg-white rounded-full opacity-50 blur-[1px]" />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-6 relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center shadow-md">
            <Leaf className="w-8 h-8 text-emerald-600" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#3b415a] tracking-tight">
              Welcome to <span className="text-emerald-600">Wisp</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">Connect to start your eco journey</p>
          </div>
        </div>

        {/* Auth buttons */}
        <div className="w-full space-y-3">
          <button
            onClick={handleGoogleLogin}
            disabled={!!loading || !web3auth}
            className="w-full py-3.5 bg-white border border-slate-200 text-[#3b415a] text-sm font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-slate-300 transition disabled:opacity-50 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
          >
            {loading === "google" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <><Chrome className="w-5 h-5" /> Continue with Google</>
            )}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">or connect directly</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <button
            onClick={handleWalletLogin}
            disabled={!!loading || !hashconnect}
            className="w-full py-3.5 bg-[#3b415a] text-white text-sm font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-[#2d3348] transition disabled:opacity-50"
          >
            {loading === "wallet" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <><Wallet className="w-5 h-5" /> Connect Hedera Wallet</>
            )}
          </button>
        </div>

        <p className="text-[11px] text-slate-400 text-center leading-relaxed px-2">
          Your green actions are verified privately on-chain. Raw data never leaves your device.
        </p>
      </div>
    </div>
  );
}

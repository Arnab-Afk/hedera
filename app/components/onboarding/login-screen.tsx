"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Chrome, Wallet, Loader2 } from "lucide-react";

interface LoginScreenProps {
  onDone: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function LoginScreen({ onDone }: LoginScreenProps) {
  const [loading, setLoading] = useState<"google" | "wallet" | null>(null);
  const { login } = useAuth();

  const handleGoogleLogin = async () => {
    setLoading("google");
    try {
      const response = await fetch(`${API_URL}/api/auth/social-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "player@example.com",
          socialId: "google_12345",
          walletAddress: "0.0.mock_generated_address",
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
    setLoading("wallet");
    try {
      const walletAddress = "0.0.existing_user_address";
      const challengeRes = await fetch(`${API_URL}/api/auth/challenge?walletAddress=${walletAddress}`);
      const { nonce } = await challengeRes.json();

      const signature = "mock_signature_from_wallet";

      const loginRes = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress, signature }),
      });

      const data = await loginRes.json();
      if (data.token) {
        login(data.user, data.token);
        onDone();
      }
    } catch (error) {
      console.error("Wallet login failed", error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#0d1f14] text-white">
      <div className="w-full max-w-md space-y-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            Welcome to <span className="text-[#4ade80]">Wisp</span>
          </h1>
          <p className="text-zinc-400 text-lg">
            Connect to start growing your spirit and earning rewards.
          </p>
        </div>

        <div className="space-y-4 pt-8">
          <Button 
            onClick={handleGoogleLogin}
            disabled={!!loading}
            className="w-full h-14 text-lg bg-white text-black hover:bg-zinc-200 transition-all rounded-2xl flex items-center justify-center gap-3"
          >
            {loading === "google" ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Chrome className="w-6 h-6" />
                Continue with Google
              </>
            )}
          </Button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0d1f14] px-2 text-zinc-500 font-medium">
                Or connect directly
              </span>
            </div>
          </div>

          <Button 
            variant="outline"
            onClick={handleWalletLogin}
            disabled={!!loading}
            className="w-full h-14 text-lg border-zinc-700 hover:bg-white/5 transition-all rounded-2xl flex items-center justify-center gap-3 text-white"
          >
            {loading === "wallet" ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Wallet className="w-6 h-6" />
                Connect Hedera Wallet
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-zinc-500 pt-8 px-4">
          By connecting, you agree to our Terms of Service and Privacy Policy. 
          Your green actions are verified privately on-chain.
        </p>
      </div>
    </div>
  );
}

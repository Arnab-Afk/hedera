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
            disabled={!!loading || !web3auth}
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
            disabled={!!loading || !hashconnect}
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

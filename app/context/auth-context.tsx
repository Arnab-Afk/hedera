"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
// Import types only to avoid SSR errors
import type { Web3Auth } from "@web3auth/modal";
import type { HashConnect, HashConnectTypes } from "hashconnect";

interface User {
  id: string;
  wallet_address: string;
  email?: string;
  level: number;
  experience: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  web3auth: Web3Auth | null;
  hashconnect: HashConnect | null;
  hcData: any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "BPi5ee6X89hXG_6Y7_nS1Ypx_58593_593_593_593_593_593_593_593_593"; 
const web3AuthNetwork = (process.env.NEXT_PUBLIC_WEB3AUTH_NETWORK as any) || "sapphire_mainnet";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [hashconnect, setHashconnect] = useState<HashConnect | null>(null);
  const [hcData, setHcData] = useState<any | null>(null);

  useEffect(() => {
    const init = async () => {
      if (typeof window === "undefined") return;

      try {
        // 1. Dynamic Imports to avoid SSR "require" errors
        const { Web3Auth } = await import("@web3auth/modal");
        const { CHAIN_NAMESPACES } = await import("@web3auth/base");
        const { HashConnect } = await import("hashconnect");

        console.log("Initializing Web3Auth...");
        const w3a = new Web3Auth({
          clientId,
          web3AuthNetwork,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x128", 
            rpcTarget: "https://testnet.hashio.io/v1",
          },
        });
        
        if (typeof w3a.initModal === "function") {
          await w3a.initModal();
        } else if (typeof (w3a as any).init === "function") {
          await (w3a as any).init();
        }
        setWeb3auth(w3a);

        console.log("Initializing HashConnect...");
        const hc = new HashConnect(true);
        const appMetadata = {
          name: "Wisp",
          description: "Privacy-First Eco-Companion",
          icon: "https://wisp.arnabbhowmik.in/icon.png",
        };
        const data = await hc.init(appMetadata, "testnet", false);
        setHashconnect(hc as any);
        setHcData(data);

        const savedToken = localStorage.getItem("wisp_token");
        const savedUser = localStorage.getItem("wisp_user");
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Initialization Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const login = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("wisp_token", authToken);
    localStorage.setItem("wisp_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("wisp_token");
    localStorage.removeItem("wisp_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        isLoading,
        web3auth,
        hashconnect: hashconnect as any,
        hcData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

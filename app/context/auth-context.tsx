"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
// Import types only to avoid SSR errors

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
  web3auth: any | null;
  hashconnect: any | null;
  hcData: any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "BPi5ee6X89hXG_6Y7_nS1Ypx_58593_593_593_593_593_593_593_593_593"; 
const web3AuthNetwork = (process.env.NEXT_PUBLIC_WEB3AUTH_NETWORK as any) || "sapphire_mainnet";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [web3auth, setWeb3auth] = useState<any | null>(null);
  const [hashconnect, setHashconnect] = useState<any | null>(null);
  const [hcData, setHcData] = useState<any | null>(null);

  useEffect(() => {
    const init = async () => {
      if (typeof window === "undefined") return;

      // Always restore persisted auth state first so UI can hydrate even if wallet SDKs fail.
      try {
        const savedToken = localStorage.getItem("wisp_token");
        const savedUser = localStorage.getItem("wisp_user");
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (restoreErr) {
        console.error("Session restore error:", restoreErr);
      }

      try {
        // 1. Dynamic Imports to avoid SSR "require" errors
        const { Web3Auth } = await import("@web3auth/modal");
        const { CHAIN_NAMESPACES } = await import("@web3auth/base");
        const Web3AuthCtor: any = Web3Auth;

        console.log("Initializing Web3Auth...");
        const w3a = new Web3AuthCtor({
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
      } catch (error) {
        console.error("Web3Auth Initialization Error:", error);
      }

      try {
        const { HashConnect } = await import("hashconnect");
        console.log("Initializing HashConnect...");
        const HashConnectCtor: any = HashConnect;
        const hc = new HashConnectCtor(true);
        const iconUrl = "https://wisp.arnabbhowmik.in/icon.png";
        const metadataCandidates: Array<Record<string, unknown>> = [
          {
            name: "Wisp",
            description: "Privacy-First Eco-Companion",
            icon: iconUrl,
          },
          {
            name: "Wisp",
            description: "Privacy-First Eco-Companion",
            icons: [iconUrl],
          },
        ];

        let data: unknown = null;
        let lastInitError: unknown = null;
        for (const appMetadata of metadataCandidates) {
          try {
            data = await hc.init(appMetadata as never, "testnet", false);
            lastInitError = null;
            break;
          } catch (candidateErr) {
            lastInitError = candidateErr;
          }
        }

        if (lastInitError) {
          throw lastInitError;
        }

        setHashconnect(hc);
        setHcData(data);
      } catch (error) {
        console.error("HashConnect Initialization Error:", error);
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

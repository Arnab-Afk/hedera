import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Wisp — The Privacy-First Eco-Companion",
  description: "Grow your Wisp Spirit and earn $WISP tokens by building daily eco-habits.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0d1f14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <body>
        {children}
      </body>
    </html>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SplashScreen from "./splash-screen";
import WelcomeSlides from "./welcome-slides";
import LoginScreen from "./login-screen";
import NameYourSpirit from "./name-your-spirit";
import MoodCheckIn from "./mood-check-in";

export type OnboardingStep = "splash" | "slides" | "login" | "name" | "mood";

export default function OnboardingFlow() {
  const [step, setStep] = useState<OnboardingStep>("splash");
  const [spiritName, setSpiritName] = useState("");
  const router = useRouter();

  const goTo = (s: OnboardingStep) => setStep(s);
  const finish = () => router.push("/home");

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 font-sans p-4 sm:p-8">
      {/* Mobile Device Mockup — same shell as home/adventures/profile */}
      <div className="relative w-full max-w-100 h-212.5 bg-[#f4f7fa] rounded-[3rem] shadow-2xl overflow-hidden border-8 border-slate-800 flex flex-col">
        {step === "splash" && <SplashScreen onDone={() => goTo("slides")} />}
        {step === "slides" && <WelcomeSlides onDone={() => goTo("login")} />}
        {step === "login"  && <LoginScreen  onDone={() => goTo("name")}   />}
        {step === "name"   && (
          <NameYourSpirit
            value={spiritName}
            onChange={setSpiritName}
            onDone={() => goTo("mood")}
          />
        )}
        {step === "mood" && <MoodCheckIn onDone={finish} />}
      </div>
    </div>
  );
}

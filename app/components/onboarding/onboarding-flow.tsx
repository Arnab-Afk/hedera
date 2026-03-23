"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SplashScreen from "./splash-screen";
import WelcomeSlides from "./welcome-slides";
import NameYourSpirit from "./name-your-spirit";
import MoodCheckIn from "./mood-check-in";

export type OnboardingStep = "splash" | "slides" | "name" | "mood";

export default function OnboardingFlow() {
  const [step, setStep] = useState<OnboardingStep>("splash");
  const [spiritName, setSpiritName] = useState("");
  const router = useRouter();

  const goTo = (s: OnboardingStep) => setStep(s);

  const finish = () => {
    router.push("/home");
  };

  if (step === "splash") return <SplashScreen onDone={() => goTo("slides")} />;
  if (step === "slides") return <WelcomeSlides onDone={() => goTo("name")} />;
  if (step === "name")
    return (
      <NameYourSpirit
        value={spiritName}
        onChange={setSpiritName}
        onDone={() => goTo("mood")}
      />
    );
  if (step === "mood") return <MoodCheckIn onDone={finish} />;

  return null;
}

"use client";

import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import BottomNav from "./BottomNav";
import WelcomeScreen from "./screens/WelcomeScreen";
import InputsScreen from "./screens/InputsScreen";
import ProcessingScreen from "./screens/ProcessingScreen";
import VerdictScreen from "./screens/VerdictScreen";
import ComingSoonScreen from "./screens/ComingSoonScreen";
import { computeRishtaResult } from "@/lib/roastEngine";
import { DEFAULT_FORM_DATA, RishtaFormData, RishtaResult } from "@/lib/types";

export type Screen = "welcome" | "inputs" | "processing" | "verdict" | "aunties" | "profile";

export default function RishtaRateApp() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [formData, setFormData] = useState<RishtaFormData>(DEFAULT_FORM_DATA);
  const [result, setResult] = useState<RishtaResult | null>(null);

  const handleNavigate = (target: Screen) => {
    if (target === "verdict" && !result) {
      setScreen("welcome");
      return;
    }
    setScreen(target);
  };

  const handleProcessingComplete = () => {
    setResult(computeRishtaResult(formData));
    setScreen("verdict");
  };

  if (screen === "processing") {
    return <ProcessingScreen onComplete={handleProcessingComplete} />;
  }

  const activeNav: "match" | "rating" | "aunties" | "profile" =
    screen === "verdict"
      ? "rating"
      : screen === "aunties"
      ? "aunties"
      : screen === "profile"
      ? "profile"
      : "match";

  const footerTagline =
    screen === "welcome"
      ? "Satire only."
      : screen === "verdict"
      ? "Just for laughs — dowry is illegal & we don't endorse it 🙏"
      : undefined;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow flex flex-col">
        {screen === "welcome" && <WelcomeScreen onStart={() => setScreen("inputs")} />}
        {screen === "inputs" && (
          <InputsScreen
            data={formData}
            onChange={setFormData}
            onSubmit={() => setScreen("processing")}
          />
        )}
        {screen === "verdict" && result && (
          <VerdictScreen result={result} onTryAgain={() => setScreen("inputs")} />
        )}
        {screen === "aunties" && (
          <ComingSoonScreen
            icon="group"
            title="The Aunties Are Busy"
            body="Every aunty in the network is currently discussing someone else's biodata. Check back soon."
          />
        )}
        {screen === "profile" && (
          <ComingSoonScreen
            icon="person"
            title="Your Profile"
            body="Coming soon: manage your bio-data, past rates, and Auntie feedback history."
          />
        )}
      </div>
      <Footer tagline={footerTagline} />
      <BottomNav active={activeNav} onNavigate={handleNavigate} hasResult={!!result} />
    </div>
  );
}

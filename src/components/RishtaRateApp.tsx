"use client";

import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import BottomNav from "./BottomNav";
import WelcomeScreen from "./screens/WelcomeScreen";
import InputsScreen from "./screens/InputsScreen";
import ProcessingScreen from "./screens/ProcessingScreen";
import VerdictScreen from "./screens/VerdictScreen";
import AuntiesScreen from "./screens/AuntiesScreen";
import ComingSoonScreen from "./screens/ComingSoonScreen";
import { computeRishtaResult } from "@/lib/roastEngine";
import { getDeviceId } from "@/lib/deviceId";
import { saveSubmission } from "@/lib/submissions";
import { DEFAULT_FORM_DATA, RishtaFormData, RishtaResult } from "@/lib/types";

export type Screen = "welcome" | "inputs" | "processing" | "verdict" | "aunties" | "profile";

export default function RishtaRateApp() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [formData, setFormData] = useState<RishtaFormData>(DEFAULT_FORM_DATA);
  const [result, setResult] = useState<RishtaResult | null>(null);
  const [deviceId, setDeviceId] = useState("");
  const [refreshSignal, setRefreshSignal] = useState(0);

  useEffect(() => {
    setDeviceId(getDeviceId());
  }, []);

  const handleNavigate = (target: Screen) => {
    if (target === "verdict" && !result) {
      setScreen("welcome");
      return;
    }
    setScreen(target);
  };

  const handleProcessingComplete = async () => {
    let computed: RishtaResult;

    try {
      const res = await fetch("/api/generate-rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        signal: AbortSignal.timeout(10000),
      });
      if (res.ok) {
        const { result } = await res.json();
        computed = result;
      } else {
        throw new Error("generate-rate request failed");
      }
    } catch {
      // Belt-and-suspenders fallback if even the request itself failed
      // (network down, etc.) — the API route already has its own
      // internal fallback for when Gemini specifically fails.
      computed = { ...computeRishtaResult(formData), source: "rules" };
    }

    setResult(computed);
    setScreen("verdict");

    // Auto-post to the public leaderboard + this device's history.
    // Fire-and-forget: never block the verdict on network.
    const id = deviceId || getDeviceId();
    saveSubmission(id, formData.nickname, computed).then(() =>
      setRefreshSignal((s) => s + 1)
    );

    // Clear the form so the next visit to Inputs starts fresh.
    setFormData(DEFAULT_FORM_DATA);
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
          <AuntiesScreen deviceId={deviceId} refreshSignal={refreshSignal} />
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

"use client";

import Icon from "./Icon";
import type { Screen } from "./RishtaRateApp";

interface BottomNavProps {
  active: "match" | "rating" | "aunties" | "profile";
  onNavigate: (screen: Screen) => void;
  hasResult: boolean;
}

const NAV_ITEMS: {
  key: BottomNavProps["active"];
  label: string;
  icon: string;
  target: Screen;
}[] = [
  { key: "match", label: "Match", icon: "favorite", target: "welcome" },
  { key: "rating", label: "My Rating", icon: "star", target: "verdict" },
  { key: "aunties", label: "Aunties", icon: "group", target: "aunties" },
  { key: "profile", label: "Profile", icon: "person", target: "profile" },
];

export default function BottomNav({ active, onNavigate, hasResult }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 pb-[calc(env(safe-area-inset-bottom)+8px)] bg-surface shadow-[0px_-4px_20px_rgba(0,0,0,0.05)] rounded-t-xl">
      {NAV_ITEMS.map((item) => {
        const isActive = item.key === active;
        const disabled = item.key === "rating" && !hasResult;
        return (
          <button
            key={item.key}
            type="button"
            disabled={disabled}
            onClick={() => onNavigate(item.target)}
            className={`flex flex-col items-center justify-center transition-all duration-300 ease-in-out ${
              disabled ? "opacity-30 cursor-not-allowed" : ""
            } ${
              isActive
                ? "bg-secondary-container text-on-secondary-container rounded-full px-4 py-1"
                : "text-on-surface-variant hover:text-primary px-4 py-1"
            }`}
          >
            <Icon name={item.icon} filled={isActive} />
            <span className="font-label-bold">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

"use client";

import { useEffect, useState } from "react";
import Icon from "../Icon";
import { formatRupees } from "@/lib/roastEngine";
import { fetchHistory, fetchLeaderboard } from "@/lib/submissions";
import type { Submission } from "@/lib/types";

interface AuntiesScreenProps {
  deviceId: string;
  /** Bump this after a new submission is saved to force a refetch. */
  refreshSignal: number;
}

type Tab = "leaderboard" | "history";

const MEDALS: Record<number, string> = {
  0: "🥇",
  1: "🥈",
  2: "🥉",
};

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function AuntiesScreen({ deviceId, refreshSignal }: AuntiesScreenProps) {
  const [tab, setTab] = useState<Tab>("leaderboard");
  const [leaderboard, setLeaderboard] = useState<Submission[] | null>(null);
  const [history, setHistory] = useState<Submission[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setError(false);

    if (tab === "leaderboard") {
      fetchLeaderboard()
        .then((rows) => !cancelled && setLeaderboard(rows))
        .catch(() => !cancelled && setError(true));
    } else if (deviceId) {
      fetchHistory(deviceId)
        .then((rows) => !cancelled && setHistory(rows))
        .catch(() => !cancelled && setError(true));
    }

    return () => {
      cancelled = true;
    };
  }, [tab, deviceId, refreshSignal]);

  const rows = tab === "leaderboard" ? leaderboard : history;
  const loading = rows === null && !error;

  return (
    <main className="pt-[112px] pb-32 px-[20px] min-h-screen max-w-lg mx-auto w-full">
      <div className="text-center py-4 mb-2">
        <h2 className="font-headline-lg-mobile text-primary">The Aunties&apos; Corner</h2>
        <p className="font-body-md text-on-surface-variant mt-2">
          Where every rate gets discussed, ranked, and remembered.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-surface-container-low rounded-full p-1 mb-6">
        {(
          [
            { key: "leaderboard", label: "Leaderboard", icon: "emoji_events" },
            { key: "history", label: "My History", icon: "history" },
          ] as { key: Tab; label: string; icon: string }[]
        ).map((t) => {
          const isActive = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full transition-all ${
                isActive
                  ? "coral-gradient text-white shadow-sm"
                  : "text-on-surface-variant"
              }`}
            >
              <Icon name={t.icon} filled={isActive} className="text-lg" />
              <span className="font-label-bold">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {error && (
        <div className="text-center py-12">
          <Icon name="wifi_off" className="text-on-surface-variant mb-2 block" style={{ fontSize: 32 }} />
          <p className="font-body-md text-on-surface-variant">
            The Aunties&apos; network is down. Try again in a bit.
          </p>
        </div>
      )}

      {!error && loading && (
        <div className="text-center py-12">
          <p className="font-body-md text-on-surface-variant animate-pulse">
            Consulting the gossip network...
          </p>
        </div>
      )}

      {!error && rows && rows.length === 0 && (
        <div className="text-center py-12">
          <Icon
            name={tab === "leaderboard" ? "emoji_events" : "history"}
            className="text-on-surface-variant mb-2 block"
            style={{ fontSize: 32 }}
          />
          <p className="font-body-md text-on-surface-variant">
            {tab === "leaderboard"
              ? "No rates yet. Be the first Rishta on the board!"
              : "You haven't gotten a rate yet — go get roasted."}
          </p>
        </div>
      )}

      {!error && rows && rows.length > 0 && (
        <div className="space-y-3">
          {rows.map((row, i) => (
            <div
              key={row.id}
              className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant/10 flex items-center gap-3"
            >
              {tab === "leaderboard" ? (
                <div className="w-9 h-9 shrink-0 rounded-full bg-secondary-container/20 flex items-center justify-center font-label-bold text-secondary">
                  {MEDALS[i] ?? `#${i + 1}`}
                </div>
              ) : (
                <div className="w-9 h-9 shrink-0 rounded-full bg-primary-container/10 flex items-center justify-center">
                  <Icon name="star" className="text-primary" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-label-bold text-on-surface truncate">
                    {tab === "leaderboard" ? row.nickname : "You"}
                  </p>
                  <span className="font-headline-sm text-primary shrink-0">
                    {formatRupees(row.total_amount)}
                  </span>
                </div>
                <p className="font-body-sm text-on-surface-variant truncate">{row.headline}</p>
                {tab === "history" && (
                  <p className="font-body-sm text-on-surface-variant opacity-60 mt-0.5">
                    {timeAgo(row.created_at)} · {row.red_flag_label}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

import { supabase } from "./supabaseClient";
import type { RishtaResult, Submission } from "./types";

/**
 * Auto-saves a completed rating so it shows up on the public leaderboard
 * and in this device's history. Fire-and-forget: a failed save should never
 * block the user from seeing their verdict.
 */
export async function saveSubmission(
  deviceId: string,
  nickname: string,
  result: RishtaResult
): Promise<void> {
  const { error } = await supabase.from("submissions").insert({
    device_id: deviceId,
    nickname: nickname.trim() || "Anonymous Rishta",
    total_amount: Math.round(result.totalAmount),
    headline: result.headline,
    red_flag_label: result.redFlagLabel,
  });

  if (error) {
    console.error("Failed to save submission:", error.message);
  }
}

export async function fetchLeaderboard(limit = 20): Promise<Submission[]> {
  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .order("total_amount", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch leaderboard:", error.message);
    return [];
  }
  return data ?? [];
}

export async function fetchHistory(deviceId: string): Promise<Submission[]> {
  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .eq("device_id", deviceId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch history:", error.message);
    return [];
  }
  return data ?? [];
}

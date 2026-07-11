export type VibeCheck = "SIMPLE" | "NRI VIBES";

export type MoustacheGame = "NONE" | "TRIMMED" | "SARDAR";

export interface RishtaFormData {
  nickname: string; // what shows up on the public leaderboard
  job: string; // free text, e.g. "SDE-1 at FAANG"
  ctcLakhs: number;
  degree: string;
  heightCm: number;
  built: number; // 0-100, Skinny -> Buff
  vibeCheck: VibeCheck;
  ownHouse: boolean;
  ownCar: boolean;
  mummyApproval: number; // 0-100
  moustache: MoustacheGame;
  singsBollywood: boolean;
}

export interface BreakdownChip {
  label: string;
  amount: number; // signed, in rupees
}

export interface RishtaResult {
  totalAmount: number;
  headline: string;
  chips: BreakdownChip[];
  compatibility: number; // 0-100
  redFlagLabel: string;
  redFlagDetail: string;
}

export interface Submission {
  id: string;
  device_id: string;
  nickname: string;
  total_amount: number;
  headline: string;
  red_flag_label: string;
  created_at: string;
}

export const DEFAULT_FORM_DATA: RishtaFormData = {
  nickname: "",
  job: "SDE-1 at FAANG (The Gold Standard)",
  ctcLakhs: 25,
  degree: "",
  heightCm: 175,
  built: 50,
  vibeCheck: "SIMPLE",
  ownHouse: true,
  ownCar: true,
  mummyApproval: 90,
  moustache: "TRIMMED",
  singsBollywood: true,
};

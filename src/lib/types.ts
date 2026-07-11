export type VibeCheck = "SIMPLE" | "NRI VIBES";

export type MoustacheGame = "NONE" | "TRIMMED" | "SARDAR";

export interface RishtaFormData {
  nickname: string; // what shows up on the public leaderboard
  job: string; // free text, e.g. "SDE-1 at FAANG"
  ctcLakhs: number; // in lakhs, up to 1000 (₹10Cr)
  degree: string;
  heightCm: number;
  built: number; // 0-100, Skinny -> Buff
  vibeCheck: VibeCheck;
  numProperties: number; // 0-5+
  numCars: number; // 0-5+
  mummyApproval: number; // 0-100
  moustache: MoustacheGame;
  singsBollywood: boolean;
  dancesBollywood: boolean;
  chaiSkills: number; // 0-100
  weddingBudgetLakhs: number; // in lakhs, up to 1000 (₹10Cr)
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
  source?: "ai" | "rules";
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
  numProperties: 1,
  numCars: 1,
  mummyApproval: 90,
  moustache: "TRIMMED",
  singsBollywood: true,
  dancesBollywood: true,
  chaiSkills: 70,
  weddingBudgetLakhs: 30,
};

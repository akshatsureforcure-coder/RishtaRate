import { BreakdownChip, RishtaFormData, RishtaResult } from "./types";

/** Pick a random element from an array. */
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Format a rupee amount in Indian lakh/crore grouping, e.g. 5000000 -> ₹50,00,000 */
export function formatRupees(amount: number): string {
  const negative = amount < 0;
  const n = Math.round(Math.abs(amount));
  const s = n.toString();
  let formatted: string;
  if (s.length <= 3) {
    formatted = s;
  } else {
    const last3 = s.slice(-3);
    const rest = s.slice(0, -3);
    const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    formatted = `${grouped},${last3}`;
  }
  return `${negative ? "-" : ""}₹${formatted}`;
}

/** Format a signed delta in compact lakh/crore notation, e.g. 500000 -> +₹5L, -50000 -> -₹50k */
function formatDelta(amount: number): string {
  const sign = amount >= 0 ? "+" : "-";
  const abs = Math.abs(amount);
  if (abs >= 1_00_00_000) {
    const crores = abs / 1_00_00_000;
    const str = Number.isInteger(crores) ? crores.toFixed(0) : crores.toFixed(2);
    return `${sign}₹${str}Cr`;
  }
  if (abs >= 100000) {
    const lakhs = abs / 100000;
    const str = Number.isInteger(lakhs) ? lakhs.toFixed(0) : lakhs.toFixed(1);
    return `${sign}₹${str}L`;
  }
  const thousands = abs / 1000;
  const str = Number.isInteger(thousands) ? thousands.toFixed(0) : thousands.toFixed(1);
  return `${sign}₹${str}k`;
}

/** Format a raw lakh value (as used by the CTC / wedding budget sliders) as
 * ₹XL below 100L, or ₹X.XCr from 100L (1 crore) upward. */
export function formatLakhsInput(lakhs: number): string {
  if (lakhs >= 100) {
    const crores = lakhs / 100;
    const str = Number.isInteger(crores) ? crores.toFixed(0) : crores.toFixed(2);
    return `₹${str}Cr`;
  }
  return `₹${lakhs}L`;
}

/** Convert cm to a "5'9"" style display string. */
export function cmToFeetInches(cm: number): string {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}"`;
}

/* ------------------------------------------------------------------ */
/* Job scoring — free text, keyword-matched                            */
/* ------------------------------------------------------------------ */

interface JobRule {
  keywords: string[];
  amount: number;
  labels: string[];
}

const JOB_RULES: JobRule[] = [
  {
    keywords: ["faang", "google", "amazon", "meta", "microsoft", "apple", "netflix"],
    amount: 2_000_000,
    labels: ["FAANG gold standard tag", "big tech badge flex"],
  },
  {
    keywords: ["founder", "startup", "entrepreneur"],
    amount: -800_000,
    labels: ["burning investor cash", "'pre-revenue' status"],
  },
  {
    keywords: ["crypto", "web3", "nft", "trader"],
    amount: -500_000,
    labels: ["volatile career choice", "'it's not gambling' energy"],
  },
  {
    keywords: ["upsc", "aspirant", "preparing"],
    amount: -300_000,
    labels: ["'still preparing' since forever", "coaching-centre loyalty points"],
  },
  {
    keywords: ["consultant", "mckinsey", "bcg", "deloitte", "kpmg", "ey", "pwc"],
    amount: 500_000,
    labels: ["professional PPT-making skills", "framework-for-everything bonus"],
  },
  {
    keywords: ["artist", "freelance", "musician", "painter", "hobby"],
    amount: -700_000,
    labels: ["'it's just a hobby' status", "unpredictable income aura"],
  },
  {
    keywords: ["doctor", "physician", "surgeon", "mbbs", "md"],
    amount: 1_500_000,
    labels: ["stethoscope prestige bonus", "'beta is a doctor' bragging rights"],
  },
  {
    keywords: ["engineer", "sde", "developer", "software"],
    amount: 900_000,
    labels: ["'good with computers' premium", "software engineer stereotype tax"],
  },
  {
    keywords: ["government", "sarkari", "psu", "bank"],
    amount: 700_000,
    labels: ["job security jackpot", "pension-plan peace of mind"],
  },
  {
    keywords: ["ias", "ips", "civil service", "officer"],
    amount: 2_500_000,
    labels: ["entire district respects you now", "red-beacon energy (metaphorically)"],
  },
];

const GENERIC_JOB_LABELS = [
  "mysterious job title bonus",
  "'and what do you actually do?' surcharge",
  "vague LinkedIn headline tax",
  "'something in corporate' premium",
];

function getJobModifier(jobText: string): { amount: number; label: string } {
  const text = jobText.trim().toLowerCase();
  if (!text) {
    return { amount: -200_000, label: "left the job field blank" };
  }
  for (const rule of JOB_RULES) {
    if (rule.keywords.some((kw) => text.includes(kw))) {
      return { amount: rule.amount, label: pick(rule.labels) };
    }
  }
  // No keyword matched — small generic bonus just for having an answer
  return { amount: 150_000, label: pick(GENERIC_JOB_LABELS) };
}

/* ------------------------------------------------------------------ */
/* Height & Built scoring                                              */
/* ------------------------------------------------------------------ */

const HEIGHT_HIGH_LABELS = [
  "towering height flex",
  "stands tall in every family photo",
  "doesn't need the height boost in photos",
];
const HEIGHT_LOW_LABELS = [
  "'will manage in heels' remarks",
  "vertically modest, personality tall",
  "auntie recommends platform shoes",
];

function getHeightModifier(heightCm: number): { amount: number; label: string } {
  if (heightCm >= 185) return { amount: 300_000, label: pick(HEIGHT_HIGH_LABELS) };
  if (heightCm >= 175) return { amount: 150_000, label: pick(HEIGHT_HIGH_LABELS) };
  if (heightCm >= 165) return { amount: 0, label: "perfectly average height" };
  if (heightCm >= 155) return { amount: -80_000, label: pick(HEIGHT_LOW_LABELS) };
  return { amount: -150_000, label: pick(HEIGHT_LOW_LABELS) };
}

const BUILT_BUFF_LABELS = [
  "gym-selfie collection bonus",
  "bicep flex in family photos",
  "'beta hits the gym' bragging rights",
];
const BUILT_FIT_LABELS = ["decent gym membership usage", "occasional-cardio credibility"];
const BUILT_SLIM_LABELS = [
  "'will fill out after marriage' promise",
  "two-extra-rotis diet plan pending",
];
const BUILT_SKINNY_LABELS = [
  "Mummy's 'eat more beta' campaign target",
  "skips the mithai a little too often",
];

function getBuiltModifier(built: number): { amount: number; label: string } {
  if (built >= 80) return { amount: 250_000, label: pick(BUILT_BUFF_LABELS) };
  if (built >= 60) return { amount: 120_000, label: pick(BUILT_FIT_LABELS) };
  if (built >= 40) return { amount: 20_000, label: "balanced betaji energy" };
  if (built >= 20) return { amount: -100_000, label: pick(BUILT_SLIM_LABELS) };
  return { amount: -180_000, label: pick(BUILT_SKINNY_LABELS) };
}

/* ------------------------------------------------------------------ */
/* Verdict copy pools                                                   */
/* ------------------------------------------------------------------ */

const HIGH_TIER_HEADLINES = [
  "Solid catch, but Mummy still wants a Fortuner 🚗",
  "Premium rishta unlocked. Biodata PDF now has a watermark.",
  "Certified 'Beta Settled' — every aunty in the colony is now interested.",
  "Top-shelf material. Even the pandit is impressed.",
];

const MID_TIER_HEADLINES = [
  "Decent package, but the mustache game needs more commitment.",
  "Solidly 'available'. Not bragging-rights material, but respectable.",
  "Middle-of-the-biodata-pile, but a top-tier chai-serving smile.",
  "The neighbourhood aunties are cautiously optimistic.",
];

const LOW_TIER_HEADLINES = [
  "Rate's a bit humble, but the personality tax more than makes up for it.",
  "Mummy says 'give it time', which is Mummy for 'try harder, beta'.",
  "The bio-data needs a font upgrade before it needs a rate upgrade.",
  "Auntieji has 'concerns', but nothing a government job can't fix.",
];

const RED_FLAG_LOW = [
  { label: "Low: Just a tiny ego", detail: "Mostly harmless. Occasionally hums in public." },
  { label: "Low: Slightly opinionated about chai", detail: "Will critique your tea, gently." },
  { label: "Low: Mild main-character energy", detail: "Nothing therapy-adjacent, just vibes." },
];

const RED_FLAG_MEDIUM = [
  { label: "Medium: Mama's boy tendencies", detail: "Calls home every 2 hours, non-negotiable." },
  { label: "Medium: Suspicious LinkedIn activity", detail: "Posts 'humbled and grateful' unprompted." },
  { label: "Medium: Overinvested in cricket opinions", detail: "Will explain DRS whether you asked or not." },
];

const RED_FLAG_HIGH = [
  { label: "High: Burning cash and ego", detail: "Pitch deck ready at all times, including weddings." },
  { label: "High: Crypto in every conversation", detail: "'It's not gambling, it's Web3.'" },
  { label: "High: Chronic 'still finding myself' energy", detail: "Since roughly 2018." },
];

export function computeRishtaResult(data: RishtaFormData): RishtaResult {
  const chips: BreakdownChip[] = [];
  let total = 500_000; // base valuation

  // CTC contribution (scaled so even ₹10Cr CTC stays in a sane range)
  total += data.ctcLakhs * 40_000;

  // Wedding budget contribution — a bigger budget signals more confidence/status
  total += data.weddingBudgetLakhs * 20_000;

  // Job modifier (free text, keyword matched)
  const job = getJobModifier(data.job);
  total += job.amount;
  chips.push({ label: job.label, amount: job.amount });

  // Degree / pedigree bonus
  const degreeLower = data.degree.trim().toLowerCase();
  if (degreeLower.includes("iit") || degreeLower.includes("iim")) {
    const amt = 500_000;
    total += amt;
    chips.push({ label: "IIT/IIM bonus", amount: amt });
  } else if (degreeLower.length > 0) {
    const amt = 100_000;
    total += amt;
    chips.push({ label: "pedigree points", amount: amt });
  } else {
    const amt = -100_000;
    total += amt;
    chips.push({ label: "empty pedigree field", amount: amt });
  }

  // Height
  const heightMod = getHeightModifier(data.heightCm);
  if (heightMod.amount !== 0) {
    total += heightMod.amount;
    chips.push({ label: heightMod.label, amount: heightMod.amount });
  }

  // Built / physique
  const builtMod = getBuiltModifier(data.built);
  total += builtMod.amount;
  chips.push({ label: builtMod.label, amount: builtMod.amount });

  // Vibe check
  if (data.vibeCheck === "NRI VIBES") {
    const amt = 1_000_000;
    total += amt;
    chips.push({ label: "NRI dollar premium", amount: amt });
  }

  // Properties owned
  const numProps = Math.min(data.numProperties, 5);
  if (numProps === 0) {
    const amt = -200_000;
    total += amt;
    chips.push({ label: "renting in this economy", amount: amt });
  } else {
    const amt = 400_000 + (numProps - 1) * 150_000;
    total += amt;
    chips.push({
      label:
        numProps === 1
          ? "one solid property to their name"
          : numProps >= 4
          ? "real estate mogul energy"
          : `${numProps} properties, mini portfolio flex`,
      amount: amt,
    });
  }

  // Cars owned
  const numCars = Math.min(data.numCars, 5);
  if (numCars === 0) {
    const amt = -50_000;
    total += amt;
    chips.push({ label: "no car, takes the metro like a legend", amount: amt });
  } else {
    const amt = 100_000 + (numCars - 1) * 50_000;
    total += amt;
    chips.push({
      label: numCars === 1 ? "even-a-Nano personality pts" : `${numCars}-car garage flex`,
      amount: amt,
    });
  }

  // Mummy approval (0-300000 range)
  const mummyAmt = Math.round((data.mummyApproval / 100) * 300_000);
  total += mummyAmt;
  chips.push({ label: "Mummy's approval level", amount: mummyAmt });

  // Moustache game
  const moustacheAmt =
    data.moustache === "SARDAR" ? 400_000 : data.moustache === "TRIMMED" ? 200_000 : -50_000;
  total += moustacheAmt;
  chips.push({
    label:
      data.moustache === "SARDAR"
        ? "sardar swag"
        : data.moustache === "TRIMMED"
        ? "moustache game"
        : "no moustache commitment",
    amount: moustacheAmt,
  });

  // Bollywood singing
  const singAmt = data.singsBollywood ? 150_000 : -50_000;
  total += singAmt;
  chips.push({
    label: data.singsBollywood ? "Bollywood vocals at sangeet" : "zero sangeet entertainment value",
    amount: singAmt,
  });

  // Bollywood dancing
  const danceAmt = data.dancesBollywood ? 150_000 : -50_000;
  total += danceAmt;
  chips.push({
    label: data.dancesBollywood ? "steals the dance floor at sangeet" : "two-left-feet at the sangeet",
    amount: danceAmt,
  });

  // Chai making skills (0-100 -> -₹1.5L to +₹1.5L)
  const chaiAmt = Math.round(((data.chaiSkills - 50) / 50) * 150_000);
  total += chaiAmt;
  chips.push({
    label:
      data.chaiSkills >= 80
        ? "MIL-approved chai skills"
        : data.chaiSkills >= 40
        ? "decent chai game"
        : "chai needs serious practice",
    amount: chaiAmt,
  });

  // Never let it go below a floor, for comedic dignity — or above a sane ceiling
  total = Math.max(total, 150_000);
  total = Math.min(total, 50_000_000);
  // Round to nearest 10,000
  total = Math.round(total / 10_000) * 10_000;

  // Pick top 3 chips by absolute magnitude for display
  const topChips = [...chips]
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
    .slice(0, 3);

  // Headline based on tier
  let headline: string;
  if (total >= 6_000_000) {
    headline = pick(HIGH_TIER_HEADLINES);
  } else if (total >= 2_000_000) {
    headline = pick(MID_TIER_HEADLINES);
  } else {
    headline = pick(LOW_TIER_HEADLINES);
  }

  // Compatibility score
  let compatibility =
    50 +
    data.mummyApproval * 0.3 +
    (data.numProperties > 0 ? 10 : 0) +
    (data.singsBollywood ? 3 : 0) +
    (data.dancesBollywood ? 3 : 0) +
    (data.vibeCheck === "NRI VIBES" ? 5 : 0);
  compatibility = Math.min(99, Math.max(40, Math.round(compatibility)));

  // Red flag meter
  const jobLower = data.job.trim().toLowerCase();
  const highRiskJob =
    jobLower.includes("founder") ||
    jobLower.includes("crypto") ||
    jobLower.includes("upsc") ||
    jobLower.includes("startup");
  const redFlag = highRiskJob
    ? pick(RED_FLAG_HIGH)
    : data.mummyApproval > 80
    ? pick(RED_FLAG_MEDIUM)
    : pick(RED_FLAG_LOW);

  return {
    totalAmount: total,
    headline,
    chips: topChips,
    compatibility,
    redFlagLabel: redFlag.label,
    redFlagDetail: redFlag.detail,
  };
}

export { formatDelta };

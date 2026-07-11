import { NextResponse } from "next/server";
import { computeRishtaResult } from "@/lib/roastEngine";
import type { RishtaFormData, RishtaResult } from "@/lib/types";

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    totalAmount: { type: "NUMBER", description: "The final Rishta Rate in raw rupees, e.g. 5200000" },
    headline: { type: "STRING", description: "One witty Hinglish one-liner verdict, under 90 characters" },
    chips: {
      type: "ARRAY",
      description: "3 to 5 short breakdown reasons with signed rupee amounts",
      items: {
        type: "OBJECT",
        properties: {
          label: { type: "STRING", description: "Short witty reason, under 55 characters, lowercase start" },
          amount: { type: "NUMBER", description: "Signed rupee delta this reason contributes, e.g. 500000 or -200000" },
        },
        required: ["label", "amount"],
      },
    },
    compatibility: { type: "NUMBER", description: "Auntie compatibility score, integer 40-99" },
    redFlagLabel: { type: "STRING", description: "e.g. 'Low: some minor thing' / 'Medium: ...' / 'High: ...'" },
    redFlagDetail: { type: "STRING", description: "One short witty clause expanding on the red flag, under 70 characters" },
  },
  required: ["totalAmount", "headline", "chips", "compatibility", "redFlagLabel", "redFlagDetail"],
};

const SYSTEM_PROMPT = `You are "Auntie-AI", the scoring engine behind Rishta Rate — a satirical Indian matrimonial
"market value" calculator. Satire only: nobody's real worth is being judged, this is comedy for a bootcamp
project. Given one candidate's profile, invent a funny, warm-hearted, PG-13 Hinglish-flavoured verdict.

Style guide (match this tone, don't copy these lines verbatim):
- Chip examples: "+₹5L for IIT bonus", "-₹50k for picky chai taste", "+₹10L for NRI dollar premium"
- Headline examples: "Solid catch, but Mummy still wants a Fortuner 🚗", "Certified 'Beta Settled' — every aunty in the colony is now interested."
- Red flag examples: "Low: Just a tiny ego", "Medium: Overinvested in cricket opinions", "High: Crypto in every conversation"

Rules:
- totalAmount should usually land between ₹1,50,000 and ₹1,00,00,000, scaling up with CTC, degree pedigree,
  wedding budget, and other flattering inputs, and down for red flags or blank/weak inputs. Never go below ₹1,50,000.
- Give exactly 3-5 chips, each a short punchy reason with a signed rupee amount.
- Keep everything affectionate teasing, never genuinely insulting, never about real people, never hateful.
- Output must be valid JSON matching the schema. No markdown, no commentary outside the JSON.`;

function buildUserPrompt(data: RishtaFormData): string {
  return `Candidate profile:
- Job / role: ${data.job || "(left blank)"}
- CTC: ₹${data.ctcLakhs}L per year
- Degree / pedigree: ${data.degree || "(left blank)"}
- Height: ${data.heightCm} cm
- Built (0=skinny, 100=buff): ${data.built}
- Vibe check: ${data.vibeCheck}
- Owns a house: ${data.ownHouse ? "yes" : "no"}
- Owns a car: ${data.ownCar ? "yes" : "no"}
- Mummy's approval (0-100): ${data.mummyApproval}
- Moustache game: ${data.moustache}
- Sings Bollywood songs: ${data.singsBollywood ? "yes" : "no"}
- Wedding budget: ₹${data.weddingBudgetLakhs}L

Generate the JSON verdict now.`;
}

function clampNumber(n: unknown, min: number, max: number, fallback: number): number {
  const num = typeof n === "number" && Number.isFinite(n) ? n : fallback;
  return Math.max(min, Math.min(max, num));
}

function truncate(s: unknown, maxLen: number, fallback: string): string {
  const str = typeof s === "string" && s.trim() ? s.trim() : fallback;
  return str.length > maxLen ? str.slice(0, maxLen - 1).trimEnd() + "…" : str;
}

/** Validates and normalizes Gemini's parsed JSON into a safe RishtaResult. Returns null if unusable. */
function validateAiResult(raw: unknown): RishtaResult | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  if (!Array.isArray(r.chips) || r.chips.length === 0) return null;

  const chips = r.chips
    .slice(0, 5)
    .map((c) => {
      if (!c || typeof c !== "object") return null;
      const chip = c as Record<string, unknown>;
      if (typeof chip.label !== "string" || !chip.label.trim()) return null;
      return {
        label: truncate(chip.label, 55, "mystery factor"),
        amount: clampNumber(chip.amount, -10_000_000, 10_000_000, 0),
      };
    })
    .filter((c): c is { label: string; amount: number } => c !== null);

  if (chips.length === 0) return null;

  return {
    totalAmount: clampNumber(r.totalAmount, 150_000, 50_000_000, 500_000),
    headline: truncate(r.headline, 90, "The Aunties are still deliberating."),
    chips,
    compatibility: Math.round(clampNumber(r.compatibility, 40, 99, 60)),
    redFlagLabel: truncate(r.redFlagLabel, 60, "Low: Nothing major"),
    redFlagDetail: truncate(r.redFlagDetail, 80, "Seems fine, honestly."),
    source: "ai",
  };
}

async function generateWithGemini(data: RishtaFormData): Promise<RishtaResult | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set");
    return null;
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { role: "system", parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: buildUserPrompt(data) }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: RESPONSE_SCHEMA,
            temperature: 1.1,
          },
        }),
        signal: AbortSignal.timeout(9000),
      }
    );

    if (!res.ok) {
      console.error("Gemini generate-rate error:", res.status, await res.text());
      return null;
    }

    const data_ = await res.json();
    const text: string | undefined = data_?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;

    const parsed = JSON.parse(text);
    return validateAiResult(parsed);
  } catch (err) {
    console.error("Failed to generate AI rate:", err);
    return null;
  }
}

export async function POST(request: Request) {
  const formData = (await request.json()) as RishtaFormData;

  const aiResult = await generateWithGemini(formData);
  if (aiResult) {
    return NextResponse.json({ result: aiResult });
  }

  // Gemini failed, was unreachable, or returned something unusable —
  // fall back to the deterministic rule-based engine so the verdict
  // screen never breaks.
  const fallback = computeRishtaResult(formData);
  return NextResponse.json({ result: { ...fallback, source: "rules" as const } });
}

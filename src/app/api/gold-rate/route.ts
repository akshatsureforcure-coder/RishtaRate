import { NextResponse } from "next/server";

// Fixed fallback used if Gemini is unreachable, rate-limited, or returns
// something we can't parse. Keeps the app working even when the live
// lookup fails. Roughly matches the real 24K INR/10g rate as a sane default.
const FALLBACK_RATE = 143000;

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

let cache: { rate: number; source: "live" | "fallback"; fetchedAt: number } | null = null;

async function fetchLiveGoldRate(): Promise<{ rate: number; source: "live" | "fallback" }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set");
    return { rate: FALLBACK_RATE, source: "fallback" };
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text:
                    "What is today's 24 karat gold price per 10 grams in India, in INR? " +
                    "Reply with ONLY the plain number (no currency symbol, no commas, no words), " +
                    "for example: 143250",
                },
              ],
            },
          ],
          tools: [{ google_search: {} }],
        }),
        // Keep this snappy — the verdict screen is waiting on it.
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!res.ok) {
      console.error("Gemini API error:", res.status, await res.text());
      return { rate: FALLBACK_RATE, source: "fallback" };
    }

    const data = await res.json();
    const text: string | undefined = data?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text ?? "")
      .join(" ");

    const match = text?.match(/[\d,]+(\.\d+)?/);
    const parsed = match ? parseFloat(match[0].replace(/,/g, "")) : NaN;

    if (!Number.isFinite(parsed) || parsed < 10000 || parsed > 500000) {
      console.error("Could not parse a sane gold rate from Gemini response:", text);
      return { rate: FALLBACK_RATE, source: "fallback" };
    }

    return { rate: parsed, source: "live" };
  } catch (err) {
    console.error("Failed to fetch live gold rate:", err);
    return { rate: FALLBACK_RATE, source: "fallback" };
  }
}

export async function GET() {
  const now = Date.now();

  if (cache && now - cache.fetchedAt < CACHE_TTL_MS) {
    return NextResponse.json(cache);
  }

  const { rate, source } = await fetchLiveGoldRate();
  cache = { rate, source, fetchedAt: now };

  return NextResponse.json(cache);
}

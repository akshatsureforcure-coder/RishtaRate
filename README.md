# Rishta Rate 🌸

A satirical "matchmaking market value" web app — built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

> Satire only. Dowry is illegal — this app pokes fun at bio-data culture, not the law.

## The flow

1. **Welcome** — hero pitch, "Calculate My Rate" CTA
2. **The Roast Inputs** — a playful bio-data form (job, CTC, degree, family vibe, assets, mummy's approval, moustache game, Bollywood singing)
3. **Processing** — animated "Consulting the Panditji..." loading state with a rotating garland progress bar
4. **The Verdict** — a confetti-popping reveal card with your ₹ "Rishta Rate", a witty headline, a breakdown of bonuses/penalties, a compatibility score, and a "red flag meter"

All four screens are wired together as one working client-side flow (`src/components/RishtaRateApp.tsx`).

## The roast engine

The verdict is **not** AI-generated — it's a deterministic, rule-based scorer (`src/lib/roastEngine.ts`) that combines your inputs with **randomized pools of pre-written witty lines** (headlines, red-flag comments, breakdown labels). That means:

- Zero API cost, zero latency
- Same inputs can still produce varied flavour text between runs (feels fresh, not robotic)
- Fully offline — no network calls, no API keys needed

Want it AI-generated instead? Swap the `computeRishtaResult` call in `RishtaRateApp.tsx`'s `handleProcessingComplete` for a call to your model of choice — the `RishtaResult` shape in `src/lib/types.ts` is the contract to fill.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
npm start
```

### Deploy

This is a standard Next.js app — deploys to Vercel with zero config (`vercel deploy`), or any Node hosting that supports Next.js.

## Project structure

```
src/
  app/
    layout.tsx        Root layout, fonts (Quicksand + Inter + Material Symbols via <link>)
    globals.css        Full design system: colors, typography scale, shared component styles
    page.tsx            Entry point, renders <RishtaRateApp />
  components/
    RishtaRateApp.tsx   Flow controller (screen state, form state, result state)
    Header.tsx           Shared top app bar
    Footer.tsx            Shared disclaimer footer
    BottomNav.tsx        Shared bottom navigation (Match / My Rating / Aunties / Profile)
    Icon.tsx                Material Symbols icon helper
    screens/
      WelcomeScreen.tsx
      InputsScreen.tsx
      ProcessingScreen.tsx
      VerdictScreen.tsx
      ComingSoonScreen.tsx   Placeholder for Aunties / Profile nav tabs
  lib/
    types.ts             Shared TypeScript types
    roastEngine.ts     Scoring logic + randomized witty template pools
```

## Design system

Ported 1:1 from the original Stitch mockup (`satirical_matrimonial_critique/DESIGN.md`):

- **Colors:** Coral primary (`#a43c12` / `#ff7f50` container), Marigold secondary (`#815500` / `#fdb747`), Teal tertiary, cream surface (`#fcf9f8`)
- **Type:** Quicksand for headlines, Inter for body/labels
- **Shape:** rounded cards (`24px`), pill buttons/chips, soft ambient shadows
- All tokens live in `src/app/globals.css` as CSS custom properties + Tailwind's `@theme`, so retheming is a find-and-replace of hex values in one file.

## Customizing the roast logic

Open `src/lib/roastEngine.ts`:

- `JOB_MODIFIERS` — ₹ value per job option
- `HIGH_TIER_HEADLINES` / `MID_TIER_HEADLINES` / `LOW_TIER_HEADLINES` — add more witty lines any time, they're picked at random
- `RED_FLAG_LOW` / `MEDIUM` / `HIGH` — same idea for the red-flag meter
- `computeRishtaResult()` — the actual scoring formula (base amount, CTC multiplier, bonuses/penalties)

No build step needed to tweak copy — just edit the arrays.

"use client";

import Icon from "../Icon";
import type { MoustacheGame, RishtaFormData, VibeCheck } from "@/lib/types";
import { cmToFeetInches } from "@/lib/roastEngine";

interface InputsScreenProps {
  data: RishtaFormData;
  onChange: (data: RishtaFormData) => void;
  onSubmit: () => void;
}

const MUMMY_LABELS = ["Black Sheep", "Strictly OK", "Good Lad", "Raja Beta", "Beta is King"];
const BUILT_LABELS = ["Skinny", "Slim", "Average", "Fit", "Buff"];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer shrink-0">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only toggle-checkbox"
      />
      <div className="w-11 h-6 bg-outline-variant rounded-full toggle-label transition-colors duration-200">
        <div className="toggle-dot absolute top-[2px] left-[2px] bg-white w-5 h-5 rounded-full transition-transform duration-200" />
      </div>
    </label>
  );
}

export default function InputsScreen({ data, onChange, onSubmit }: InputsScreenProps) {
  const set = <K extends keyof RishtaFormData>(key: K, value: RishtaFormData[K]) =>
    onChange({ ...data, [key]: value });

  const mummyIndex = Math.min(Math.floor(data.mummyApproval / 25), 4);
  const builtIndex = Math.min(Math.floor(data.built / 25), 4);

  return (
    <>
      {/* Progress bar */}
      <div className="fixed top-[64px] left-0 w-full z-40 bg-surface/80 backdrop-blur-md px-[20px] py-2">
        <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
          <div className="h-full coral-gradient transition-all duration-300 w-2/3" />
        </div>
        <div className="flex justify-between mt-1">
          <span className="font-label-bold text-primary">Profile Health</span>
          <span className="font-label-bold text-on-surface-variant">Still Single? 😜</span>
        </div>
      </div>

      <main className="mt-[112px] px-[20px] space-y-[16px] max-w-lg mx-auto w-full">
        <div className="text-center py-4">
          <h2 className="font-headline-lg-mobile text-primary">Bio-Data is so 2005.</h2>
          <p className="font-body-md text-on-surface-variant mt-2">
            Let our Auntie-AI judge your market value before your relatives do.
          </p>
        </div>

        {/* Section 1: The Basics */}
        <section className="bg-surface-container-lowest p-[24px] rounded-[24px] card-shadow space-y-[24px]">
          <div className="flex items-center gap-2">
            <Icon name="work" className="text-secondary" />
            <h3 className="font-headline-sm">The Basics</h3>
          </div>

          <div className="space-y-2">
            <label className="font-label-bold text-on-surface-variant px-1 block">
              WHAT SHOULD THE AUNTIES CALL YOU?
            </label>
            <input
              type="text"
              value={data.nickname}
              onChange={(e) => set("nickname", e.target.value)}
              placeholder="e.g. Delhi ka Dilbar, or just your name"
              maxLength={30}
              className="w-full bg-surface-container-low border-none rounded-xl py-4 px-4 text-base focus:ring-2 focus:ring-primary/20"
            />
            <p className="text-center font-body-sm italic text-on-surface-variant opacity-70">
              This is what shows up on the public Leaderboard.
            </p>
          </div>

          <div className="space-y-2">
            <label className="font-label-bold text-on-surface-variant px-1 block">
              WHAT DO YOU DO? (OR PRETEND TO)
            </label>
            <input
              type="text"
              value={data.job}
              onChange={(e) => set("job", e.target.value)}
              placeholder="e.g. SDE-1 at FAANG, or 'professional overthinking'"
              className="w-full bg-surface-container-low border-none rounded-xl py-4 px-4 text-base focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="font-label-bold text-on-surface-variant px-1">CTC (IN LAKHS)</label>
              <span className="font-headline-md text-primary">₹{data.ctcLakhs}L</span>
            </div>
            <input
              type="range"
              min={3}
              max={150}
              value={data.ctcLakhs}
              onChange={(e) => set("ctcLakhs", Number(e.target.value))}
              className="mt-2"
            />
            <p className="text-center font-body-sm italic text-on-surface-variant opacity-70">
              Auntie Tip: Round up if you have ESOPs.
            </p>
          </div>

          <div className="space-y-2">
            <label className="font-label-bold text-on-surface-variant px-1 block">PEDIGREE (DEGREE)</label>
            <input
              type="text"
              value={data.degree}
              onChange={(e) => set("degree", e.target.value)}
              placeholder="e.g. B.Tech from a tier-3 college"
              className="w-full bg-surface-container-low border-none rounded-xl py-4 px-4 text-base focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </section>

        {/* Section 2: Physical Stats */}
        <section className="bg-surface-container-lowest p-[24px] rounded-[24px] card-shadow space-y-[24px]">
          <div className="flex items-center gap-2">
            <Icon name="straighten" className="text-secondary" />
            <h3 className="font-headline-sm">Physical Stats</h3>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="font-label-bold text-on-surface-variant px-1">HEIGHT</label>
              <span className="font-headline-md text-primary">
                {data.heightCm} cm{" "}
                <span className="font-body-sm text-on-surface-variant">
                  (≈ {cmToFeetInches(data.heightCm)})
                </span>
              </span>
            </div>
            <input
              type="range"
              min={140}
              max={210}
              value={data.heightCm}
              onChange={(e) => set("heightCm", Number(e.target.value))}
              className="mt-2"
            />
            <p className="text-center font-body-sm italic text-on-surface-variant opacity-70">
              Auntie Tip: Biodata height is always +2cm, we know.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="font-label-bold text-on-surface-variant px-1">BUILT</label>
              <span className="font-label-bold text-primary">{BUILT_LABELS[builtIndex]}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={data.built}
              onChange={(e) => set("built", Number(e.target.value))}
              className="mt-2"
            />
            <div className="flex justify-between text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">
              <span>Skinny</span>
              <span>Buff</span>
            </div>
          </div>
        </section>

        {/* Section 3: Family Matters */}
        <section className="bg-surface-container-lowest p-[24px] rounded-[24px] card-shadow space-y-[24px]">
          <div className="flex items-center gap-2">
            <Icon name="family_restroom" className="text-secondary" />
            <h3 className="font-headline-sm">Family Matters</h3>
          </div>

          <div className="space-y-2">
            <label className="font-label-bold text-on-surface-variant px-1 block">VIBE CHECK</label>
            <div className="flex gap-2">
              {(["SIMPLE", "NRI VIBES"] as VibeCheck[]).map((vibe) => {
                const isActive = data.vibeCheck === vibe;
                return (
                  <button
                    key={vibe}
                    type="button"
                    onClick={() => set("vibeCheck", vibe)}
                    className={`flex-1 p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                      isActive
                        ? "border-2 border-primary/30 bg-primary/5"
                        : "border border-outline-variant/30 bg-surface-container-low opacity-60"
                    }`}
                  >
                    <Icon
                      name={vibe === "SIMPLE" ? "diversity_3" : "flight_takeoff"}
                      className={isActive ? "text-primary" : "text-on-surface-variant"}
                    />
                    <span className="font-label-bold">{vibe}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
              <div className="flex items-center gap-3">
                <Icon name="home" className="text-secondary" />
                <div>
                  <p className="font-label-bold">Own House?</p>
                  <p className="text-xs text-on-surface-variant">South Delhi adds +50 pts</p>
                </div>
              </div>
              <Toggle checked={data.ownHouse} onChange={(v) => set("ownHouse", v)} />
            </div>

            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
              <div className="flex items-center gap-3">
                <Icon name="directions_car" className="text-secondary" />
                <div>
                  <p className="font-label-bold">Own a Car?</p>
                  <p className="text-xs text-on-surface-variant">Even a Nano adds +10 personality pts</p>
                </div>
              </div>
              <Toggle checked={data.ownCar} onChange={(v) => set("ownCar", v)} />
            </div>
          </div>
        </section>

        {/* Section 4: The Extras */}
        <section className="bg-surface-container-lowest p-[24px] rounded-[24px] card-shadow space-y-[24px]">
          <div className="flex items-center gap-2">
            <Icon name="auto_awesome" className="text-secondary" />
            <h3 className="font-headline-sm">The Extras</h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="font-label-bold text-on-surface-variant px-1">MUMMY&apos;S APPROVAL LEVEL</label>
              <span className="font-label-bold text-primary">{MUMMY_LABELS[mummyIndex]}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={data.mummyApproval}
              onChange={(e) => set("mummyApproval", Number(e.target.value))}
              className="mt-2"
            />
            <div className="flex justify-between text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">
              <span>Black Sheep</span>
              <span>Raja Beta</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-label-bold text-on-surface-variant px-1 block">MOUSTACHE GAME</label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { key: "NONE", emoji: "🚫" },
                  { key: "TRIMMED", emoji: "✂️" },
                  { key: "SARDAR", emoji: "⚔️" },
                ] as { key: MoustacheGame; emoji: string }[]
              ).map((opt) => {
                const isActive = data.moustache === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => set("moustache", opt.key)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                      isActive
                        ? "border-2 border-primary bg-primary/10"
                        : "border border-outline-variant/30 bg-surface-container-low"
                    }`}
                  >
                    <span className="text-xl">{opt.emoji}</span>
                    <span className="text-[10px] font-bold">{opt.key}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-secondary-container/5 border border-secondary-container/20 rounded-xl">
            <div className="flex items-center gap-3">
              <Icon name="mic" className="text-secondary" />
              <div>
                <p className="font-label-bold">Sings Bollywood Songs?</p>
                <p className="text-xs text-on-surface-variant">Warning: Might cause high cringe</p>
              </div>
            </div>
            <Toggle checked={data.singsBollywood} onChange={(v) => set("singsBollywood", v)} />
          </div>
        </section>

        <div className="pt-6 pb-8 space-y-3">
          <button
            type="button"
            disabled={!data.nickname.trim()}
            onClick={onSubmit}
            className="w-full py-5 rounded-2xl coral-gradient text-white font-headline-sm shadow-lg shadow-primary/30 transition-all duration-300 active:scale-95 hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            Reveal My Rate
          </button>
          <p className="text-center font-body-sm text-on-surface-variant px-[20px]">
            {data.nickname.trim()
              ? "By clicking, you admit your chai-making skills are 6/10 at best."
              : "Give the Aunties a name to call you, first."}
          </p>
        </div>
      </main>
    </>
  );
}

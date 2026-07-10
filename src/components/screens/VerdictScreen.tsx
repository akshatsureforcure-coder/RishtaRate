"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "../Icon";
import { formatDelta, formatRupees } from "@/lib/roastEngine";
import type { RishtaResult } from "@/lib/types";

interface VerdictScreenProps {
  result: RishtaResult;
  onTryAgain: () => void;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  angle: number;
}

const COLORS = ["#a43c12", "#fdb747", "#ff7f50", "#815500"];

export default function VerdictScreen({ result, onTryAgain }: VerdictScreenProps) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!revealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles: Particle[] = [];
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 8 + 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        speed: Math.random() * 3 + 2,
        angle: Math.random() * 6,
      });
    }

    let raf: number;
    let frames = 0;
    const maxFrames = 260; // stop after a few seconds

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y += p.speed;
        p.x += Math.sin(p.angle) * 2;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        if (p.y > canvas.height) p.y = -20;
      });
      frames += 1;
      if (frames < maxFrames) {
        raf = requestAnimationFrame(draw);
      }
    }
    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(raf);
      particles = [];
      window.removeEventListener("resize", handleResize);
    };
  }, [revealed]);

  const handleShare = async () => {
    const text = `My Official Rishta Rate™ is ${formatRupees(
      result.totalAmount
    )}. ${result.headline} (satire only, via Rishta Rate)`;
    try {
      if (navigator.share) {
        await navigator.share({ text });
        return;
      }
    } catch {
      // fall through to clipboard
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // no-op: clipboard unavailable
    }
  };

  return (
    <>
      <main className="pt-[96px] pb-32 px-[20px] flex flex-col items-center min-h-screen max-w-lg mx-auto w-full">
        <div className="w-full relative">
          <div
            className={`reveal-card relative bg-surface-container-lowest rounded-[24px] overflow-hidden shadow-lg border border-outline-variant/20 flex flex-col items-center text-center p-[24px] ${
              revealed ? "is-revealed" : ""
            }`}
          >
            <div className="w-24 h-24 bg-secondary-container rounded-full flex items-center justify-center mb-4 trophy-glow">
              <Icon name="emoji_events" className="text-on-secondary-container" style={{ fontSize: 48 }} />
            </div>
            <p className="font-label-bold text-secondary uppercase tracking-widest mb-1">The Verdict is in</p>
            <h1 className="font-headline-lg-mobile text-on-surface mb-6">Your Official Rishta Rate™</h1>

            <div className="bg-primary-container/10 border-2 border-primary-container rounded-2xl p-8 mb-6 w-full">
              <span className="font-headline-lg text-primary block leading-none">
                {formatRupees(result.totalAmount)}*
              </span>
              <span className="font-body-sm text-on-surface-variant opacity-70 mt-2 block">
                *Non-refundable emotional damage included
              </span>
            </div>

            <div className="space-y-2 mb-6">
              <p className="font-headline-sm text-on-surface">{result.headline}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {result.chips.map((chip) => (
                <div
                  key={chip.label}
                  className={`px-3 py-1 rounded-full font-label-bold border ${
                    chip.amount >= 0
                      ? "bg-secondary-container/10 text-on-secondary-container border-secondary-container/30"
                      : "bg-error-container/10 text-on-error-container border-error-container/30"
                  }`}
                >
                  {formatDelta(chip.amount)} for {chip.label}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button
                type="button"
                onClick={handleShare}
                className="w-full bg-gradient-to-br from-primary to-secondary text-white py-4 rounded-xl font-headline-sm shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <Icon name="share" />
                {copied ? "Copied to clipboard!" : "Share This Roast"}
              </button>
              <button
                type="button"
                onClick={onTryAgain}
                className="w-full bg-transparent border-2 border-outline-variant text-on-surface-variant py-4 rounded-xl font-headline-sm transition-all hover:bg-surface-variant/20 active:scale-95 flex items-center justify-center gap-2"
              >
                <Icon name="refresh" />
                Try Again
              </button>
            </div>
          </div>
        </div>

        <div className="w-full grid grid-cols-2 gap-[16px] mt-6">
          <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant/10">
            <Icon name="analytics" className="text-primary mb-2 block" />
            <p className="font-label-bold text-on-surface">Compatibility</p>
            <p className="font-body-sm text-on-surface-variant">
              Matches {result.compatibility}% of Auntie criteria
            </p>
          </div>
          <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant/10">
            <Icon name="psychology" className="text-tertiary mb-2 block" />
            <p className="font-label-bold text-on-surface">Red Flag Meter</p>
            <p className="font-body-sm text-on-surface-variant">{result.redFlagLabel}</p>
          </div>
        </div>
      </main>

      <canvas ref={canvasRef} className="confetti-canvas" />
    </>
  );
}

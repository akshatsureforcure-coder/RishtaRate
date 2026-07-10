"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "../Icon";

interface ProcessingScreenProps {
  onComplete: () => void;
}

const STATUS_PHRASES = [
  "Consulting the Panditji...",
  "Negotiating with Mummy...",
  "Checking Chachaji's opinion...",
  "Calculating biodata embellishments...",
  "Verifying 'Fair & Handsome' claims...",
  "Measuring tea-serving skills...",
  "Auditing annual gifts...",
  "Analyzing 'Homely' tags...",
  "Evaluating salary-to-ego ratio...",
];

export default function ProcessingScreen({ onComplete }: ProcessingScreenProps) {
  const [progress, setProgress] = useState(10);
  const [statusIdx, setStatusIdx] = useState(0);
  const [statusHidden, setStatusHidden] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    const statusInterval = setInterval(() => {
      setStatusHidden(true);
      setTimeout(() => {
        setStatusIdx((i) => (i + 1) % STATUS_PHRASES.length);
        setStatusHidden(false);
      }, 400);
    }, 2200);

    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100;
        return Math.min(100, p + Math.floor(Math.random() * 6) + 3);
      });
    }, 350);

    return () => {
      clearInterval(statusInterval);
      clearInterval(progressInterval);
    };
  }, []);

  useEffect(() => {
    if (progress >= 100 && !completedRef.current) {
      completedRef.current = true;
      const t = setTimeout(onComplete, 500);
      return () => clearTimeout(t);
    }
  }, [progress, onComplete]);

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen px-[20px] text-center">
      <div className="relative z-10 mb-8">
        <div className="relative w-48 h-48 md:w-64 md:h-64 animate-rotate-slow">
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon name="local_florist" className="text-secondary/30" style={{ fontSize: 140 }} />
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float-y">
            <Icon name="brightness_7" filled className="text-secondary text-4xl" />
          </div>
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 animate-float-y"
            style={{ animationDelay: "-1.5s" }}
          >
            <Icon name="brightness_7" filled className="text-secondary text-4xl" />
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-surface-container-lowest/80 backdrop-blur-md rounded-full w-24 h-24 md:w-32 md:h-32 flex items-center justify-center shadow-lg">
            <Icon name="local_florist" className="text-primary text-5xl animate-pulse" />
          </div>
        </div>
      </div>

      <div className="z-10 h-12 mb-6">
        <h2 className={`font-headline-md text-on-surface status-text ${statusHidden ? "status-hidden" : ""}`}>
          {STATUS_PHRASES[statusIdx]}
        </h2>
      </div>

      <div className="z-10 w-full max-w-sm px-8">
        <div className="relative h-8 bg-surface-container-high rounded-full overflow-hidden flex items-center px-2">
          <div className="absolute inset-0 border-b-2 border-dotted border-outline-variant/30 -translate-y-[2px]" />
          <div
            className="absolute left-0 h-full flex items-center transition-all duration-300 ease-linear overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="flex gap-1 px-1">
              {Array.from({ length: 9 }).map((_, i) => (
                <Icon
                  key={i}
                  name="circle"
                  filled
                  className={`text-xl ${i % 2 === 0 ? "text-primary" : "text-secondary"}`}
                />
              ))}
            </div>
          </div>
        </div>
        <p className="mt-2 font-label-bold text-on-surface-variant uppercase tracking-widest">
          Matchmaking Intensity: <span>{progress}</span>%
        </p>
      </div>

      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 w-full">
        <div className="flex justify-center gap-4 opacity-30">
          <Icon name="star_half" className="text-secondary" />
          <Icon name="favorite" className="text-secondary" />
          <Icon name="star_half" className="text-secondary" />
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 w-full z-20 flex flex-col items-center text-center px-[20px] py-6 border-t border-outline-variant/10">
        <p className="font-body-sm text-on-surface-variant opacity-80">
          Dowry is illegal, but your attitude? That&apos;s tax-free. © 2024 Rishta Rate
        </p>
      </footer>
    </main>
  );
}

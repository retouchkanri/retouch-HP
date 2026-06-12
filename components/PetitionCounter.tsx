"use client";

import { useEffect, useRef, useState } from "react";

const CURRENT = 57_614;
const GOAL = 60_000;
const DURATION_MS = 2800;

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - 2 ** (-10 * t);
}

function formatCount(value: number) {
  return Math.round(value).toLocaleString("ja-JP");
}

export default function PetitionCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setCount(CURRENT);
      setProgress((CURRENT / GOAL) * 100);
      setFinished(true);
      return;
    }

    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / DURATION_MS, 1);
      const eased = easeOutExpo(t);

      setCount(CURRENT * eased);
      setProgress((CURRENT / GOAL) * 100 * eased);

      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setCount(CURRENT);
        setProgress((CURRENT / GOAL) * 100);
        setFinished(true);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started]);

  return (
    <div
      ref={ref}
      className={`mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-brand-900/5 transition-shadow duration-500 ${
        finished ? "shadow-md ring-gold/20" : ""
      }`}
    >
      <div className="flex items-end justify-between">
        <span className="text-sm font-semibold text-brand-800">署名数</span>
        <span
          className={`text-2xl font-bold tabular-nums text-brand-700 transition-transform duration-300 ${
            finished ? "sm:scale-105" : ""
          }`}
        >
          {formatCount(count)}
          <span className="text-sm">人</span>
        </span>
      </div>

      <div className="relative mt-3 h-3 w-full overflow-hidden rounded-full bg-brand-100">
        <div
          className={`petition-progress-fill relative h-full rounded-full bg-gradient-to-r from-gold via-[#c99a4a] to-gold transition-[width] duration-100 ease-out ${
            started ? "petition-progress-active" : ""
          }`}
          style={{ width: `${progress}%` }}
        >
          <span
            className={`absolute inset-y-0 right-0 w-8 bg-gradient-to-r from-transparent to-white/40 ${
              started && !finished ? "animate-pulse" : ""
            }`}
            aria-hidden
          />
        </div>
      </div>

      <p className="mt-2 text-xs text-ink/50">
        目標 {GOAL.toLocaleString("ja-JP")}人に向けて、ご署名をお願いします。
      </p>
    </div>
  );
}

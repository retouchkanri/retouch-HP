"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type VisionCard = {
  image: string;
  label: string;
};

type FutureVisionCarouselProps = {
  items: VisionCard[];
  intervalMs?: number;
};

function getOffset(index: number, active: number, total: number) {
  let offset = index - active;
  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;
  return offset;
}

function getCardStyle(offset: number) {
  const distance = Math.abs(offset);
  if (distance === 0) {
    return { scale: 1, opacity: 1, blur: 0, zIndex: 30 };
  }
  if (distance === 1) {
    return { scale: 0.82, opacity: 0.62, blur: 1.5, zIndex: 20 };
  }
  if (distance === 2) {
    return { scale: 0.7, opacity: 0.38, blur: 3, zIndex: 10 };
  }
  return { scale: 0.6, opacity: 0.15, blur: 5, zIndex: 0 };
}

export default function FutureVisionCarousel({
  items,
  intervalMs = 3000,
}: FutureVisionCarouselProps) {
  const [active, setActive] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [spacing, setSpacing] = useState(220);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateSpacing = () => setSpacing(window.innerWidth < 640 ? 120 : 220);

    const onMotionChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);

    setReduceMotion(motion.matches);
    updateSpacing();

    motion.addEventListener("change", onMotionChange);
    window.addEventListener("resize", updateSpacing);

    return () => {
      motion.removeEventListener("change", onMotionChange);
      window.removeEventListener("resize", updateSpacing);
    };
  }, []);

  useEffect(() => {
    if (reduceMotion || items.length <= 1) return;

    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % items.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [intervalMs, items.length, reduceMotion]);

  return (
    <div className="future-vision-carousel relative mx-auto mt-6 w-full max-w-5xl overflow-hidden">
      <div className="relative h-[360px] sm:h-[420px]">
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          {items.map((item, index) => {
            const offset = getOffset(index, active, items.length);
            const style = getCardStyle(offset);

            return (
              <article
                key={item.label}
                aria-hidden={offset !== 0}
                className="future-vision-card absolute left-1/2 top-1/2 w-[min(88vw,300px)] -translate-x-1/2 -translate-y-1/2"
                style={{
                  transform: `translate(calc(-50% + ${offset * spacing}px), -50%) scale(${style.scale})`,
                  opacity: style.opacity,
                  filter: `blur(${style.blur}px)`,
                  zIndex: style.zIndex,
                  transition: reduceMotion
                    ? "none"
                    : "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.7s ease, filter 0.7s ease",
                  pointerEvents: offset === 0 ? "auto" : "none",
                }}
              >
                <div
                  className={`overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-brand-900/5 ${
                    offset === 0 ? "shadow-lg ring-gold/30" : ""
                  }`}
                >
                  <div className="relative aspect-[4/5] w-full bg-blush">
                    <Image
                      src={item.image}
                      alt={item.label}
                      fill
                      sizes="(max-width: 640px) 88vw, 300px"
                      className="object-contain"
                      priority={index === 0}
                    />
                  </div>
                  <div className="flex items-center gap-2.5 p-3 sm:gap-3 sm:p-5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold text-xs font-bold text-white sm:h-9 sm:w-9 sm:text-sm">
                      {index + 1}
                    </span>
                    <p className="text-xs font-medium leading-snug text-brand-900 sm:text-sm">{item.label}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-2" aria-hidden>
        {items.map((item, index) => (
          <span
            key={`dot-${item.label}`}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === active ? "w-6 bg-gold" : "w-1.5 bg-brand-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

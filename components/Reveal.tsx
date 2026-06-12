"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

export default function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    setReduceMotion(motion.matches);
    motion.addEventListener("change", onMotionChange);
    return () => motion.removeEventListener("change", onMotionChange);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hidden =
    direction === "left"
      ? "-translate-x-4 sm:-translate-x-7"
      : direction === "right"
        ? "translate-x-4 sm:translate-x-7"
        : direction === "scale"
          ? "scale-[0.96]"
          : "translate-y-6 sm:translate-y-8";

  const isVisible = visible || reduceMotion;

  return (
    <div
      ref={ref}
      className={`overflow-hidden transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-x-0 translate-y-0 scale-100" : `opacity-0 ${hidden}`
      } ${className}`}
      style={{ transitionDelay: reduceMotion ? "0ms" : `${delay}ms` }}
    >
      {children}
    </div>
  );
}

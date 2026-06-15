"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { MediaItem } from "@/lib/data";

const SCATTER = [
  { x: -155, y: -50, rotate: -14 },
  { x: 115, y: -65, rotate: 11 },
  { x: -85, y: 55, rotate: -7 },
  { x: 140, y: 30, rotate: 16 },
  { x: -125, y: 85, rotate: -20 },
  { x: 45, y: -20, rotate: 5 },
];

type Props = {
  items: MediaItem[];
  className?: string;
};

export default function MediaCardStack({ items, className = "" }: Props) {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [items.length]);

  const getZIndex = (index: number) => {
    if (index === featuredIndex) return 100;
    const offset = (index - featuredIndex + items.length) % items.length;
    return 20 + (items.length - offset);
  };

  return (
    <div
      className={`relative mx-auto w-full ${className}`}
      style={{ height: "min(580px, 82vw)" }}
      aria-label="メディア掲載カード"
    >
      {items.map((item, index) => {
        const scatter = SCATTER[index % SCATTER.length];
        const isFeatured = index === featuredIndex;
        const isHovered = index === hoveredIndex;
        const transform = isFeatured
          ? "translate(-50%, -50%) translate(0px, 0px) rotate(0deg) scale(1.18)"
          : `translate(-50%, -50%) translate(${scatter.x}px, ${scatter.y}px) rotate(${scatter.rotate}deg) scale(1)`;

        const card = (
          <div
            className={`relative w-[min(280px,64vw)] overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-brand-900/10 transition-[transform,box-shadow,ring-color] duration-700 ease-out group-hover:shadow-2xl group-hover:ring-gold/35 group-focus-visible:ring-gold/50 motion-reduce:transition-none ${
              isFeatured ? "shadow-2xl ring-gold/40" : ""
            }`}
          >
            <div className="relative aspect-[2/3] w-full bg-neutral-100">
              <Image
                src={item.img}
                alt={item.imgAlt ?? item.title}
                fill
                sizes="(max-width: 640px) 64vw, 280px"
                className="object-contain object-center"
                priority={index < 2}
              />
            </div>

            <div
              className={`absolute inset-0 flex flex-col justify-end bg-black/60 p-5 text-left transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <p className="text-xs font-semibold tracking-wide text-white sm:text-sm">
                {item.date}
                {item.mediaType ? ` ｜ ${item.mediaType}` : ""}
              </p>
              <p className="mt-1.5 text-sm font-semibold text-white sm:text-base">{item.outlet}</p>
              <p className="mt-2 text-sm leading-relaxed text-white sm:text-base">{item.title}</p>
              {item.url && (
                <span className="mt-4 inline-block text-sm font-semibold text-white">記事を見る →</span>
              )}
            </div>
          </div>
        );

        if (item.url) {
          return (
            <button
              key={`${item.date}-${item.title}`}
              type="button"
              className="group absolute left-1/2 top-1/2 block cursor-pointer rounded-xl border-0 bg-transparent p-0 shadow-none transition-[transform,filter] duration-700 ease-out hover:brightness-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold motion-reduce:transition-none"
              style={{ transform, zIndex: getZIndex(index), transition: "transform 700ms ease-out, z-index 0ms" }}
              onClick={() => {
                if (isFeatured) {
                  window.open(item.url, "_blank", "noopener,noreferrer");
                  return;
                }
                setFeaturedIndex(index);
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              aria-label={`${item.outlet}：${item.title}`}
            >
              {card}
            </button>
          );
        }

        return (
          <button
            key={`${item.date}-${item.title}`}
            type="button"
            className="group absolute left-1/2 top-1/2 block cursor-pointer rounded-xl border-0 bg-transparent p-0 shadow-none transition-[transform,filter] duration-700 ease-out hover:brightness-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold motion-reduce:transition-none"
            style={{ transform, zIndex: getZIndex(index), transition: "transform 700ms ease-out, z-index 0ms" }}
            onClick={() => setFeaturedIndex(index)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            aria-label={`${item.outlet}：${item.title}`}
          >
            {card}
          </button>
        );
      })}
    </div>
  );
}

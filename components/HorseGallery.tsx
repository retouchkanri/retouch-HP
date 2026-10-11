"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

// 馬の個別ページの写真ギャラリー（最大10枚）。
// メイン写真＋サムネイル。メイン写真をクリックすると全体を拡大表示する。
export default function HorseGallery({ photos, name }: { photos: string[]; name: string }) {
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const count = photos.length;
  const current = photos[Math.min(index, count - 1)];

  const step = useCallback(
    (delta: number) => setIndex((i) => (i + delta + count) % count),
    [count]
  );

  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomed(false);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [zoomed, step]);

  const arrow =
    "absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-lg text-white transition hover:bg-black/65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold";

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-brand-50">
        <button
          type="button"
          onClick={() => setZoomed(true)}
          aria-label="写真を拡大表示"
          className="absolute inset-0 cursor-zoom-in"
        >
          <Image
            key={current}
            src={current}
            alt={count > 1 ? `${name}の写真（${index + 1}／${count}）` : `${name}の写真`}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </button>
        {count > 1 && (
          <>
            <button type="button" onClick={() => step(-1)} aria-label="前の写真" className={`${arrow} left-3`}>
              ‹
            </button>
            <button type="button" onClick={() => step(1)} aria-label="次の写真" className={`${arrow} right-3`}>
              ›
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-3 py-1 text-xs text-white">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {count > 1 && (
        <ul className="mt-3 grid grid-cols-5 gap-2">
          {photos.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`写真${i + 1}を表示`}
                aria-current={i === index}
                className={`relative block aspect-square w-full overflow-hidden rounded-lg transition ${
                  i === index ? "ring-2 ring-gold ring-offset-2" : "opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={src} alt="" fill sizes="(max-width: 1024px) 20vw, 10vw" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {zoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${name}の写真`}
          onClick={() => setZoomed(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-10"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current}
            alt={`${name}の写真`}
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full rounded-lg object-contain"
          />
          <button
            type="button"
            onClick={() => setZoomed(false)}
            aria-label="閉じる"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-xl text-white hover:bg-white/25"
          >
            ✕
          </button>
          {count > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                aria-label="前の写真"
                className={`${arrow} left-3 sm:left-6`}
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                aria-label="次の写真"
                className={`${arrow} right-3 sm:right-6`}
              >
                ›
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

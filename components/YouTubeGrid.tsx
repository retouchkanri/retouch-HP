"use client";

// ============================================================================
// YouTube動画グリッド / Click-to-play YouTube thumbnails
// サムネイル画像をクリックすると、その場で該当動画を再生します（別タブ遷移なし）。
// ============================================================================

import { useState } from "react";

export type YouTubeVideo = {
  id: string;
  title: string;
  thumb: string;
};

export default function YouTubeGrid({ videos }: { videos: YouTubeVideo[] }) {
  const [playing, setPlaying] = useState<string | null>(null);

  return (
    <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((v) => (
        <div key={v.id} className="group block">
          <div className="relative aspect-video overflow-hidden rounded-xl bg-ink/5">
            {playing === v.id ? (
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube.com/embed/${v.id}?autoplay=1&rel=0`}
                title={v.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(v.id)}
                aria-label={`${v.title} を再生`}
                className="absolute inset-0 h-full w-full cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={v.thumb}
                  alt={v.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </button>
            )}
          </div>
          <p className="mt-2 text-sm leading-snug text-ink/80 group-hover:text-brand-700">
            {v.title}
          </p>
        </div>
      ))}
    </div>
  );
}

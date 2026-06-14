import Image from "next/image";
import Link from "next/link";
import Placeholder from "@/components/Placeholder";
import type { MediaItem } from "@/lib/data";

function isImagePath(src: string) {
  return src.startsWith("/");
}

export default function MediaCard({ item }: { item: MediaItem }) {
  const inner = (
    <>
      {isImagePath(item.img) ? (
        <Image
          src={item.img}
          alt={item.imgAlt ?? item.title}
          width={640}
          height={360}
          className="h-40 w-full object-cover object-top"
        />
      ) : (
        <Placeholder label={item.img} className="h-40 w-full" />
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2 text-xs text-ink/50">
          <span className="font-semibold text-brand-600">{item.outlet}</span>
          <span className="shrink-0">{item.date}</span>
        </div>
        <p className="mt-2 flex-1 text-sm leading-snug text-ink/85">{item.title}</p>
        {item.url && (
          <span className="mt-4 text-xs font-semibold text-gold">記事を見る →</span>
        )}
      </div>
    </>
  );

  if (item.url) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="card group flex flex-col transition-transform hover:-translate-y-0.5"
      >
        {inner}
      </a>
    );
  }

  return <article className="card flex flex-col">{inner}</article>;
}

import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import SiteLink from "@/components/SiteLink";
import { type HorseProfile } from "@/lib/horses";
import Placeholder from "@/components/Placeholder";
import SupportStatusBadge from "@/components/SupportStatusBadge";

function isImagePath(src: string) {
  return src.startsWith("/");
}

// 統計カードグリッド
export function StatGrid({
  stats,
  dark = false,
}: {
  stats: { value: string; unit: string; label: string; sub?: string }[];
  dark?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`rounded-2xl p-6 text-center ring-1 ${
            dark
              ? "bg-white/5 ring-white/10 text-white"
              : "bg-white ring-brand-900/5 shadow-sm"
          }`}
        >
          <div className="flex items-end justify-center gap-1">
            <span
              className={`text-4xl sm:text-5xl font-bold ${
                dark ? "text-gold" : "text-brand-700"
              }`}
            >
              {s.value}
            </span>
            <span className={`mb-1 text-sm ${dark ? "text-brand-200" : "text-brand-600"}`}>
              {s.unit}
            </span>
          </div>
          <p className={`mt-2 text-sm font-semibold ${dark ? "text-white" : "text-black"}`}>
            {s.label}
          </p>
          {s.sub && (
            <p className={`mt-1 text-xs ${dark ? "text-brand-300" : "text-ink/50"}`}>{s.sub}</p>
          )}
        </div>
      ))}
    </div>
  );
}

// 取り組みカード（番号 + 画像 + 説明）
export function FeatureCard({
  no,
  title,
  body,
  image,
  href,
}: {
  no: string;
  title: string;
  body: string;
  image: string;
  href?: string;
}) {
  const inner = (
    <div className="card group h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <Placeholder label={image} className="h-full w-full" />
        <span className="absolute top-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-gold text-sm font-bold text-white">
          {no}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold text-black">{title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-black/80">{body}</p>
        {href && <span className="mt-4 text-sm font-semibold text-gold">詳しく →</span>}
      </div>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

// 馬カード
export function HorseCard({ horse }: { horse: HorseProfile }) {
  const badgeColor =
    horse.status === "protected"
      ? "bg-brand-600"
      : horse.status === "graduated"
      ? "bg-gold"
      : "bg-ink";
  const meta =
    horse.sex && horse.age
      ? `${horse.sex}・${horse.age}`
      : horse.order
      ? `肥育場から${horse.order}番目`
      : horse.sex
      ? horse.sex
      : "";

  return (
    <Link href={`/horses/${horse.slug}`} className="card group flex flex-col">
      <div className="relative aspect-square overflow-hidden">
        {horse.photo ? (
          <Image
            src={horse.photo}
            alt={`${horse.name}（${horse.statusLabel}）`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <Placeholder label={`${horse.name}（${horse.statusLabel}）の写真`} className="h-full w-full" />
        )}
        <span
          className={`absolute top-3 left-3 rounded-full ${badgeColor} px-3 py-1 text-[10px] font-semibold tracking-wider text-white`}
        >
          {horse.statusLabel}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-lg font-semibold text-black group-hover:text-brand-700">{horse.name}</h3>
          {meta && <span className="shrink-0 text-xs text-ink/50">{meta}</span>}
        </div>
        {horse.isSupportable !== undefined && (
          <div className="mt-2">
            <SupportStatusBadge isSupportable={horse.isSupportable} />
          </div>
        )}
        {horse.personality && (
          <p className="mt-2 text-xs font-semibold text-brand-600">性格：{horse.personality}</p>
        )}
        {horse.story && (
          <p className="mt-2 flex-1 text-sm leading-relaxed text-black/80 line-clamp-3">{horse.story}</p>
        )}
        <span className="mt-4 text-sm font-semibold text-gold">詳しく →</span>
      </div>
    </Link>
  );
}

// 想い・テキスト2カラム（画像 + 本文）
export function SplitBlock({
  image,
  imageAlt = "",
  reverse = false,
  children,
}: {
  image: string;
  imageAlt?: string;
  reverse?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`grid items-center gap-8 lg:gap-14 lg:grid-cols-2 ${
        reverse ? "lg:[&>div:first-child]:order-2" : ""
      }`}
    >
      <div>
        {isImagePath(image) ? (
          <Image
            src={image}
            alt={imageAlt}
            width={1200}
            height={800}
            className="w-full h-auto"
          />
        ) : (
          <Placeholder label={image} className="aspect-[4/3] w-full" />
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}

// セクション内CTA
export function CTA({
  title,
  body,
  primary,
  secondary,
  backgroundImage,
}: {
  title: string;
  body?: ReactNode;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  backgroundImage?: string;
}) {
  const content = (
    <>
      <h3 className="section-title !text-white">{title}</h3>
      {body && (
        <p
          className={`section-lead mt-4 mx-auto max-w-2xl text-pretty ${
            backgroundImage ? "!text-white/90" : "!text-brand-100"
          }`}
        >
          {body}
        </p>
      )}
      <div className="mt-7 flex flex-wrap justify-center gap-4">
        <SiteLink href={primary.href} className="btn-gold">{primary.label}</SiteLink>
        {secondary && (
          <SiteLink
            href={secondary.href}
            className={backgroundImage ? "btn-white-on-image" : "btn-white"}
          >
            {secondary.label}
          </SiteLink>
        )}
      </div>
    </>
  );

  if (backgroundImage) {
    return (
      <div className="relative overflow-hidden rounded-3xl px-5 py-10 text-center font-serif text-white sm:px-8 sm:py-12">
        <Image
          src={backgroundImage}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1200px"
        />
        <div className="absolute inset-0 bg-black/45" aria-hidden />
        <div className="relative z-10">{content}</div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-brand-700 px-5 py-10 text-center font-serif text-white sm:px-8 sm:py-12">
      {content}
    </div>
  );
}

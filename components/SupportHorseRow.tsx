import Link from "next/link";
import Placeholder from "@/components/Placeholder";
import SiteLink from "@/components/SiteLink";
import { SITE } from "@/lib/site";
import { formatHorseMeta, supportRate, type HorseProfile } from "@/lib/horses";

type Tone = "urgent" | "top" | "neutral";

const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;

export default function SupportHorseRow({
  horse,
  rank,
  tone = "neutral",
  showRank = true,
}: {
  horse: HorseProfile;
  rank?: number;
  tone?: Tone;
  showRank?: boolean;
}) {
  const rate = supportRate(horse);
  const hasSupport = horse.goal > 0;
  const barColor =
    tone === "urgent" ? "bg-rose-500" : tone === "top" ? "bg-gold" : "bg-brand-600";
  const rankColor =
    tone === "urgent" ? "bg-rose-500 text-white" : tone === "top" ? "bg-gold text-white" : "bg-brand-600 text-white";

  return (
    <li className="flex flex-col gap-3 rounded-2xl bg-white p-4 ring-1 ring-brand-900/5 shadow-sm sm:flex-row sm:items-center sm:gap-4">
      {showRank && rank !== undefined && (
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${rankColor}`}
        >
          {rank}
        </span>
      )}

      <Link href={`/horses/${horse.slug}`} className="hidden shrink-0 sm:block">
        {horse.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={horse.photo}
            alt={horse.name}
            className="h-16 w-16 rounded-xl object-cover"
          />
        ) : (
          <Placeholder label={`${horse.name}の写真`} className="h-16 w-16 rounded-xl" />
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <Link href={`/horses/${horse.slug}`} className="text-base font-semibold text-black hover:text-brand-700">
            {horse.name}
          </Link>
          <span className="text-xs text-ink/50">{formatHorseMeta(horse)}</span>
          <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold text-brand-700">
            {horse.statusLabel}
          </span>
        </div>

        {(horse.note || horse.story) && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink/70">
            {horse.note ?? horse.story}
          </p>
        )}

        {hasSupport ? (
          <div className="mt-2.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-ink/70">
                {yen(horse.raised)}{" "}
                <span className="font-normal text-ink/40">/ {yen(horse.goal)}（月）</span>
              </span>
              <span
                className={`font-bold ${tone === "urgent" ? "text-rose-600" : tone === "top" ? "text-gold" : "text-brand-700"}`}
              >
                達成率 {rate}%
              </span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-brand-100">
              <div className={`h-full rounded-full ${barColor}`} style={{ width: `${rate}%` }} />
            </div>
            <p className="mt-1 text-[11px] text-ink/40">支援者 {horse.supporters}名</p>
          </div>
        ) : (
          <p className="mt-2 text-[11px] text-ink/45">支援状況データ準備中</p>
        )}
      </div>

      <div className="flex shrink-0 flex-col gap-2 sm:w-auto">
        <Link
          href={`/horses/${horse.slug}`}
          className="w-full rounded-full border border-brand-600/30 px-4 py-2.5 text-center text-xs font-semibold text-brand-800 transition-colors hover:bg-brand-50 sm:w-auto sm:py-2"
        >
          詳細を見る
        </Link>
        {hasSupport && (
          <SiteLink
            href={SITE.donateUrl}
            className={`w-full rounded-full px-4 py-2.5 text-center text-xs font-semibold transition-colors sm:w-auto sm:py-2 ${
              tone === "urgent"
                ? "bg-rose-500 text-white hover:bg-rose-600"
                : "bg-brand-700 text-white hover:bg-brand-800"
            }`}
          >
            この子を支援
          </SiteLink>
        )}
      </div>
    </li>
  );
}

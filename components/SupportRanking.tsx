import SiteLink from "@/components/SiteLink";
import Placeholder from "@/components/Placeholder";
import { SITE } from "@/lib/site";
import { SUPPORT_NEEDED, SUPPORT_TOP, supportRate, type SupportHorse } from "@/lib/data";

// ============================================================================
// 馬ごとの支援状況ランキング / Per-horse support ranking
// retouch.salon の支援状況と連動。「支援が必要な子」と「応援が集まっている子」を表示。
// ============================================================================

type Tone = "urgent" | "top";

const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;

function RankRow({
  horse,
  rank,
  tone,
}: {
  horse: SupportHorse;
  rank: number;
  tone: Tone;
}) {
  const rate = supportRate(horse);
  const barColor = tone === "urgent" ? "bg-rose-500" : "bg-gold";
  const rankColor =
    tone === "urgent"
      ? "bg-rose-500 text-white"
      : "bg-gold text-white";

  return (
    <li className="flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-brand-900/5 shadow-sm">
      {/* 順位 */}
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${rankColor}`}
      >
        {rank}
      </span>

      {/* サムネイル */}
      <Placeholder
        label={`${horse.name}の写真`}
        className="hidden h-16 w-16 shrink-0 rounded-xl sm:flex"
      />

      {/* 馬情報＋進捗 */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <h4 className="text-base font-semibold text-black">{horse.name}</h4>
          <span className="text-xs text-ink/50">
            {horse.sex}・{horse.age}
          </span>
          <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold text-brand-700">
            {horse.statusLabel}
          </span>
        </div>

        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink/70">{horse.note}</p>

        {/* 進捗バー */}
        <div className="mt-2.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-ink/70">
              {yen(horse.raised)}{" "}
              <span className="font-normal text-ink/40">/ {yen(horse.goal)}（月）</span>
            </span>
            <span
              className={`font-bold ${tone === "urgent" ? "text-rose-600" : "text-gold"}`}
            >
              達成率 {rate}%
            </span>
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-brand-100">
            <div
              className={`h-full rounded-full ${barColor}`}
              style={{ width: `${rate}%` }}
            />
          </div>
          <p className="mt-1 text-[11px] text-ink/40">支援者 {horse.supporters}名</p>
        </div>
      </div>

      {/* 支援ボタン */}
      <SiteLink
        href={SITE.membersUrl}
        className={`hidden shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors sm:inline-block ${
          tone === "urgent"
            ? "bg-rose-500 text-white hover:bg-rose-600"
            : "bg-brand-700 text-white hover:bg-brand-800"
        }`}
      >
        この子を支援
      </SiteLink>
    </li>
  );
}

export default function SupportRanking() {
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-8">
      {/* 支援が必要な子ランキング（ワースト6頭） */}
      <div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-rose-500 px-3 py-1 text-[11px] font-bold tracking-wider text-white">
            支援募集中
          </span>
          <h3 className="text-lg font-semibold text-black">支援が必要な子ランキング</h3>
        </div>
        <p className="mt-2 text-sm text-ink/60">
          月間支援の達成率が低い、いま応援を必要としている6頭です。
        </p>
        <ol className="mt-5 space-y-3">
          {SUPPORT_NEEDED.map((h, i) => (
            <RankRow key={h.name} horse={h} rank={i + 1} tone="urgent" />
          ))}
        </ol>
      </div>

      {/* 応援が集まっている子ランキング（上位6頭） */}
      <div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-gold px-3 py-1 text-[11px] font-bold tracking-wider text-white">
            応援TOP
          </span>
          <h3 className="text-lg font-semibold text-black">応援が集まっている子ランキング</h3>
        </div>
        <p className="mt-2 text-sm text-ink/60">
          たくさんの支援が届いている上位6頭。あなたの応援が、次の一頭へつながります。
        </p>
        <ol className="mt-5 space-y-3">
          {SUPPORT_TOP.map((h, i) => (
            <RankRow key={h.name} horse={h} rank={i + 1} tone="top" />
          ))}
        </ol>
      </div>
    </div>
  );
}

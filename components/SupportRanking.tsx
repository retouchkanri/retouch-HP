import { getHorses } from "@/lib/content";
import { canAcceptSupport, monthlyOf, supportersOf } from "@/lib/horses";
import SupportMinUnitsAppeal from "@/components/SupportMinUnitsAppeal";
import SupportHorseRow from "@/components/SupportHorseRow";
import { MIN_SUPPORT_UNITS } from "@/lib/horses";

export default async function SupportRanking() {
  const allHorses = await getHorses();
  // 支援募集中の馬のうち、支援がまだ少ない順（最初のサポーターを募りたい子）
  const supportNeeded = allHorses
    .filter((h) => canAcceptSupport(h))
    .sort((a, b) => monthlyOf(a) - monthlyOf(b) || supportersOf(a) - supportersOf(b))
    .slice(0, 6);
  // 実際に支援が集まっている順（月額支援が多い子）
  const supportTop = allHorses
    .filter((h) => supportersOf(h) > 0)
    .sort((a, b) => monthlyOf(b) - monthlyOf(a) || supportersOf(b) - supportersOf(a))
    .slice(0, 6);

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-8">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="shrink-0 rounded-full bg-rose-500 px-3 py-1 text-[11px] font-bold tracking-wider text-white">
            支援募集中
          </span>
          <h3 className="min-w-0 text-base font-semibold text-black sm:text-lg">支援が必要な子ランキング</h3>
        </div>
        <p className="mt-2 text-sm text-ink/60">
          支援募集中で、まだ支援が少ない6頭です。維持管理には最低{MIN_SUPPORT_UNITS}口の支援が必要です。あなたの応援を待っています。
        </p>
        <ol className="mt-5 space-y-3">
          {supportNeeded.map((h, i) => (
            <SupportHorseRow key={h.slug} horse={h} rank={i + 1} tone="urgent" />
          ))}
        </ol>
        <SupportMinUnitsAppeal variant="inline" className="mt-5" />
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="shrink-0 rounded-full bg-gold px-3 py-1 text-[11px] font-bold tracking-wider text-white">
            応援TOP
          </span>
          <h3 className="min-w-0 text-base font-semibold text-black sm:text-lg">応援が集まっている子ランキング</h3>
        </div>
        <p className="mt-2 text-sm text-ink/60">
          たくさんの支援が届いている上位6頭。あなたの応援が、次の一頭へつながります。
        </p>
        <ol className="mt-5 space-y-3">
          {supportTop.map((h, i) => (
            <SupportHorseRow key={h.slug} horse={h} rank={i + 1} tone="top" />
          ))}
        </ol>
      </div>
    </div>
  );
}

import { SUPPORT_NEEDED, SUPPORT_TOP } from "@/lib/horses";
import SupportHorseRow from "@/components/SupportHorseRow";

// ============================================================================
// 馬ごとの支援状況ランキング / Per-horse support ranking
// データは lib/data.ts → lib/horses.ts 経由。順位は達成率から自動計算。
// ============================================================================

export default function SupportRanking() {
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-8">
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
            <SupportHorseRow key={h.slug} horse={h} rank={i + 1} tone="urgent" />
          ))}
        </ol>
      </div>

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
            <SupportHorseRow key={h.slug} horse={h} rank={i + 1} tone="top" />
          ))}
        </ol>
      </div>
    </div>
  );
}

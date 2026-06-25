import { supportRate } from "./data";
import { ROSTER } from "./roster";

// ============================================================================
// 馬マスター / Unified horse profiles
// 名前・写真・保護順は画像ファイル名から lib/roster.ts に自動生成されます
// （scripts/sync-horses.mjs）。支援口数や物語は同スクリプト内の定義で管理。
// 本番表示はDB（horses テーブル）優先・lib/content.getHorses()、DB不通時に
// この静的データへフォールバックします。
// ============================================================================

/** 累計保護頭数（サイト表示用の対外数値）。実ロスター件数とは独立。 */
export const TOTAL_PROTECTED_HORSES = 53;

export type HorseProfile = {
  slug: string;
  name: string;
  sex: "牡" | "牝" | "騙";
  age: string;
  status: "protected" | "graduated" | "owner";
  statusLabel: string;
  order?: number;
  personality?: string;
  story?: string;
  before?: string;
  photo?: string;
  note?: string;
  goal: number;
  raised: number;
  supporters: number;
  /** 詳細情報が未登録の馬（名前・性別のみ先行登録可） */
  pendingDetails?: boolean;
  /**
   * retouch.salon 共有DB由来の支援ステータス（保護順で結合）。
   * true=支援募集中 / false=新規受付停止 / undefined=salon未連携・対象外。
   */
  isSupportable?: boolean;
  /** retouch.salon の実支援者数（active な support_subscriptions 件数）。 */
  supporterCount?: number;
  /** retouch.salon の月額支援合計（円）。 */
  monthlySupport?: number;
  /** retouch.salon の支援口数合計（0.5=半口）。 */
  supportUnits?: number;
};

export { supportRate };

// ── 実支援データ（retouch.salon 由来）のアクセサ ──────────────────────────
/** 実際の月額支援合計（円）。 */
export const monthlyOf = (h: Pick<HorseProfile, "monthlySupport">) => h.monthlySupport ?? 0;
/** 実際の支援者数。 */
export const supportersOf = (h: Pick<HorseProfile, "supporterCount">) => h.supporterCount ?? 0;
/** 実際に1人以上の支援者がいるか。 */
export const hasSupport = (h: Pick<HorseProfile, "supporterCount">) => (h.supporterCount ?? 0) > 0;
/** 支援募集中か（salon未連携=undefinedはfalse扱い）。 */
export const isOpenForSupport = (h: Pick<HorseProfile, "isSupportable">) => h.isSupportable === true;
/** 口数の表示（整数はそのまま、半口は小数1桁）。 */
export const formatUnits = (n: number) => (n % 1 === 0 ? `${n}` : n.toFixed(1));

export function formatHorseMeta(horse: Pick<HorseProfile, "sex" | "age" | "order">) {
  const parts: string[] = [];
  if (horse.sex) parts.push(horse.sex);
  parts.push(horse.age || "不明");
  if (horse.order) parts.push(`肥育場${horse.order}番目`);
  return parts.join("・");
}

const SLUG_MAP: Record<string, string> = {
  "ハル号": "haru",
  "ソラ号": "sora",
  "ナギサ号": "nagisa",
  "リク号": "riku",
  "アオ号": "ao",
  "ホシ号": "hoshi",
  "テラ号": "tera",
  "アキラ号": "akira",
  "ジュライ号": "july",
  "サニー号": "sunny",
  "ブライト号": "bright",
  "カリン号": "karin",
  "ニコ号": "nico",
  "アイ号": "ai",
  "ミナト号": "minato",
  "ユキ号": "yuki",
  "サクラ号": "sakura",
  "カイト号": "kaito",
  "テンマ号": "tenma",
  "コハク号": "kohaku",
};

export function slugFromName(name: string): string {
  return SLUG_MAP[name] ?? name.replace(/号$/, "").toLowerCase();
}

export const ALL_HORSES: HorseProfile[] = ROSTER.map((r) => ({
  slug: r.slug,
  name: r.name,
  sex: r.sex ?? "牡",
  age: r.age ?? "不明",
  status: r.status,
  statusLabel: r.statusLabel,
  order: r.order,
  personality: r.personality,
  story: r.story,
  before: r.before,
  photo: r.photo,
  note: r.note,
  goal: r.goal,
  raised: r.raised,
  supporters: r.supporters,
  pendingDetails: false,
}));

export const HORSES_WITH_SUPPORT = ALL_HORSES.filter((h) => h.goal > 0);

export const SUPPORT_NEEDED = [...HORSES_WITH_SUPPORT]
  .sort((a, b) => supportRate(a) - supportRate(b))
  .slice(0, 6);

export const SUPPORT_TOP = [...HORSES_WITH_SUPPORT]
  .sort((a, b) => supportRate(b) - supportRate(a))
  .slice(0, 6);

export function getHorseBySlug(slug: string): HorseProfile | undefined {
  return ALL_HORSES.find((h) => h.slug === slug);
}

export function getHorseSlugs(): string[] {
  return ALL_HORSES.map((h) => h.slug);
}

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
};

export { supportRate };

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

import { HORSES, SUPPORT_HORSES, supportRate, type Horse, type SupportHorse } from "./data";

// ============================================================================
// 馬マスター / Unified horse profiles
// 累計53頭。名前・性別・写真・コメントは lib/data.ts で管理。
// 支援口数（goal / raised / supporters）も同ファイルで更新（retouch.salon 実績を反映）。
// ランキング順位はデータ更新時に自動計算されます。
// ============================================================================

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

function mergeHorse(intro: Horse | undefined, support: SupportHorse | undefined): HorseProfile | null {
  if (!intro && !support) return null;
  const name = intro?.name ?? support!.name;
  return {
    slug: slugFromName(name),
    name,
    sex: intro?.sex ?? support?.sex ?? "牡",
    age: intro?.age ?? support?.age ?? "不明",
    status: intro?.status ?? support?.status ?? "graduated",
    statusLabel: intro?.statusLabel ?? support?.statusLabel ?? "累計保護馬",
    order: intro?.order,
    personality: intro?.personality,
    story: intro?.story,
    before: intro?.before,
    photo: intro?.photo,
    note: support?.note,
    goal: support?.goal ?? 0,
    raised: support?.raised ?? 0,
    supporters: support?.supporters ?? 0,
  };
}

function buildKnownHorses(): HorseProfile[] {
  const supportByName = new Map(SUPPORT_HORSES.map((h) => [h.name, h]));
  const introByName = new Map(HORSES.map((h) => [h.name, h]));
  const names = new Set([...supportByName.keys(), ...introByName.keys()]);

  return [...names]
    .map((name) => mergeHorse(introByName.get(name), supportByName.get(name)))
    .filter((h): h is HorseProfile => h !== null);
}

function buildPlaceholders(count: number, startIndex: number): HorseProfile[] {
  return Array.from({ length: count }, (_, i) => {
    const n = startIndex + i;
    return {
      slug: `horse-${String(n).padStart(2, "0")}`,
      name: `第${n}頭（登録待ち）`,
      sex: "牡" as const,
      age: "不明",
      status: "graduated" as const,
      statusLabel: "累計保護馬",
      note: "馬名・性別・写真・コメントは lib/data.ts に追記してください。",
      goal: 0,
      raised: 0,
      supporters: 0,
      pendingDetails: true,
    };
  });
}

export const ALL_HORSES: HorseProfile[] = (() => {
  const known = buildKnownHorses();
  const remaining = Math.max(0, TOTAL_PROTECTED_HORSES - known.length);
  const placeholders = buildPlaceholders(remaining, known.length + 1);
  return [...known, ...placeholders].sort((a, b) => {
    if (a.order && b.order) return a.order - b.order;
    if (a.order) return -1;
    if (b.order) return 1;
    if (a.pendingDetails && !b.pendingDetails) return 1;
    if (!a.pendingDetails && b.pendingDetails) return -1;
    return a.name.localeCompare(b.name, "ja");
  });
})();

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

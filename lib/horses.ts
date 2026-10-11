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

/** 1頭あたりに掲載できる写真の上限。 */
export const MAX_HORSE_PHOTOS = 10;

// ── ステータス ──────────────────────────────────────────────────────────────
// DB の horses.status に入る値。表示ラベルは常にここから引く（status_label は
// 互換のために同じ文言を書き込むだけで、表示には使わない）。
export const HORSE_STATUSES = [
  { value: "protected", label: "リタッチ在籍馬" },
  { value: "owner", label: "オーナー決定馬" },
  { value: "other", label: "その他・退厩等" },
] as const;

export type HorseStatus = (typeof HORSE_STATUSES)[number]["value"];

/** 旧データの値（graduated=卒業馬 など）を現行の3区分に寄せる。 */
export function normalizeHorseStatus(raw: string | null | undefined): HorseStatus {
  if (raw === "owner" || raw === "graduated") return "owner";
  if (raw === "other") return "other";
  return "protected";
}

export function horseStatusLabel(status: HorseStatus): string {
  return HORSE_STATUSES.find((s) => s.value === status)?.label ?? HORSE_STATUSES[0].label;
}

export type HorseProfile = {
  slug: string;
  name: string;
  sex: "牡" | "牝" | "騙";
  age: string;
  status: HorseStatus;
  statusLabel: string;
  order?: number;
  personality?: string;
  story?: string;
  before?: string;
  /** メイン写真（photos の先頭）。 */
  photo?: string;
  /** 掲載写真（最大 MAX_HORSE_PHOTOS 枚、先頭がメイン）。 */
  photos: string[];
  /** 馬ごとの YouTube プレイリストURL。 */
  youtubeUrl?: string;
  /** 肥育場からの保護年月（"YYYY-MM" または "YYYY"）。 */
  rescuedAt?: string;
  /** 事務局からのメッセージ。 */
  officeMessage?: string;
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
  /** retouch.salon horses.id（馬ごとの支援リンク用）。 */
  salonHorseId?: string;
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
/** オーナー決定馬か。 */
export const isOwnerHorse = (h: Pick<HorseProfile, "status">) => h.status === "owner";
/** その他・退厩等の馬か。 */
export const isOtherHorse = (h: Pick<HorseProfile, "status">) => h.status === "other";
/** 新規支援を受け付けられるか（リタッチ在籍馬のみ）。 */
export const canAcceptSupport = (h: Pick<HorseProfile, "status" | "isSupportable">) =>
  h.status === "protected" && h.isSupportable === true;
/** 口数の表示（整数はそのまま、半口は小数1桁）。 */
export const formatUnits = (n: number) => (n % 1 === 0 ? `${n}` : n.toFixed(1));

/** 1頭を継続維持管理するために必要な最低支援口数。 */
export const MIN_SUPPORT_UNITS = 8;

/** 馬ごとの月額支援合計の表示ラベル（個人の毎月負担ではない）。 */
export const TOTAL_SUPPORT_AMOUNT_LABEL = "現在の総支援金額";

/** 実際の支援口数。 */
export const supportUnitsOf = (h: Pick<HorseProfile, "supportUnits">) => h.supportUnits ?? 0;

/** 最低口数に満たない支援募集中の馬か。 */
export const isBelowMinSupportUnits = (
  h: Pick<HorseProfile, "status" | "isSupportable" | "supportUnits">,
) => canAcceptSupport(h) && supportUnitsOf(h) < MIN_SUPPORT_UNITS;

/** 最低口数まであと何口か。 */
export const minSupportUnitsRemaining = (units: number) =>
  Math.max(0, MIN_SUPPORT_UNITS - units);

export function formatHorseName(horse: Pick<HorseProfile, "name" | "order">) {
  if (horse.order != null) {
    return `${String(horse.order).padStart(2, "0")}：${horse.name}`;
  }
  return horse.name;
}

/** 保護年月（"YYYY-MM" / "YYYY"）を「2024年5月」形式に。 */
export function formatRescuedAt(value: string | null | undefined): string {
  const m = (value ?? "").match(/^(\d{4})(?:-(\d{1,2}))?$/);
  if (!m) return "";
  return m[2] ? `${m[1]}年${Number(m[2])}月` : `${m[1]}年`;
}

/**
 * 保護年月の入力ゆれを "YYYY-MM"（月が不明なら "YYYY"）に揃える。
 * CSV を Excel で編集すると「2024/5/1」「May-24」等に書き換わるため広めに受ける。
 * 空文字は空文字、解釈できない値は null を返す。
 */
export function normalizeRescuedAt(raw: string | null | undefined): string | null {
  const v = (raw ?? "")
    .trim()
    .replace(/[０-９]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0xfee0));
  if (!v) return "";
  const pad = (month: number) => String(month).padStart(2, "0");

  const ym = v.match(/^(\d{4})\s*[-/.年]\s*(\d{1,2})(?:\D.*)?$/);
  if (ym) {
    const month = Number(ym[2]);
    return month >= 1 && month <= 12 ? `${ym[1]}-${pad(month)}` : null;
  }

  const y = v.match(/^(\d{4})\s*年?$/);
  if (y) return y[1];

  const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const en = v.match(/^([A-Za-z]{3})[a-z]*[-\s/.](\d{2}|\d{4})$/);
  if (en) {
    const month = MONTHS.indexOf(en[1].toLowerCase()) + 1;
    if (!month) return null;
    return `${en[2].length === 2 ? `20${en[2]}` : en[2]}-${pad(month)}`;
  }
  return null;
}

/** YouTube の URL（プレイリスト・動画・チャンネル）か。 */
export function isYouTubeUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return false;
    const host = url.hostname.toLowerCase();
    return host === "youtu.be" || host === "youtube.com" || host.endsWith(".youtube.com");
  } catch {
    return false;
  }
}

export function formatHorseMeta(horse: Pick<HorseProfile, "sex" | "age" | "order">) {
  const parts: string[] = [];
  if (horse.sex) parts.push(horse.sex);
  parts.push(horse.age || "不明");
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
  status: normalizeHorseStatus(r.status),
  statusLabel: horseStatusLabel(normalizeHorseStatus(r.status)),
  order: r.order,
  personality: r.personality,
  story: r.story,
  before: r.before,
  photo: r.photo,
  photos: r.photo ? [r.photo] : [],
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

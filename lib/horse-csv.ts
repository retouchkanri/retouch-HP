import {
  HORSE_STATUSES,
  horseStatusLabel,
  formatRescuedAt,
  isYouTubeUrl,
  normalizeRescuedAt,
  type HorseStatus,
} from "@/lib/horses";

// ============================================================================
// 馬情報の CSV 入出力（画像以外のテキスト項目）
// 管理画面の「CSVダウンロード／CSV取り込み」と、取り込み用サーバーアクションの
// 両方から使う。列は見出し（1行目）の文言で判定するので、順番の入れ替えや
// 不要な列の削除は自由。CSV に無い列は取り込み時に変更されない。
// ============================================================================

export type HorseCsvField =
  | "slug"
  | "name"
  | "sex"
  | "age"
  | "status"
  | "orderNum"
  | "rescuedAt"
  | "personality"
  | "story"
  | "beforeStory"
  | "note"
  | "officeMessage"
  | "youtubeUrl"
  | "sortOrder";

export const HORSE_CSV_COLUMNS: { field: HorseCsvField; header: string }[] = [
  { field: "slug", header: "スラッグ" },
  { field: "name", header: "馬名" },
  { field: "sex", header: "性別" },
  { field: "age", header: "年齢" },
  { field: "status", header: "ステータス" },
  { field: "orderNum", header: "肥育場番号" },
  { field: "rescuedAt", header: "肥育場からの保護年月" },
  { field: "personality", header: "性格・特徴" },
  { field: "story", header: "現在の様子" },
  { field: "beforeStory", header: "保護前の様子" },
  { field: "note", header: "支援が必要な理由" },
  { field: "officeMessage", header: "事務局からのメッセージ" },
  { field: "youtubeUrl", header: "YouTubeプレイリストURL" },
  { field: "sortOrder", header: "表示順" },
];

/** 1回の取り込みで扱う行数の上限。 */
export const HORSE_CSV_MAX_ROWS = 500;

export type HorseCsvValues = Partial<Record<HorseCsvField, string>>;
export type HorseCsvRow = { line: number; values: HorseCsvValues };

/** CSV から読み取った1行を、DBへ書き込める形に検証・正規化したもの。 */
export type HorseCsvPatch = {
  slug?: string;
  name?: string;
  sex?: "牡" | "牝" | "騙" | null;
  age?: string | null;
  status?: HorseStatus;
  orderNum?: number | null;
  rescuedAt?: string | null;
  personality?: string;
  story?: string;
  beforeStory?: string | null;
  note?: string | null;
  officeMessage?: string | null;
  youtubeUrl?: string | null;
  sortOrder?: number;
};

/** CSV に書き出す馬（DbHorse のうち CSV で扱う項目）。 */
export type HorseCsvSource = {
  slug: string;
  name: string;
  sex?: string;
  age?: string;
  status: HorseStatus;
  orderNum?: number;
  rescuedAt?: string;
  personality?: string;
  story?: string;
  before?: string;
  note?: string;
  officeMessage?: string;
  youtubeUrl?: string;
  sortOrder: number;
};

// ── CSV の読み書き ──────────────────────────────────────────────────────────

/** RFC 4180 相当のパーサ（引用符・セル内改行・CRLF 対応）。区切りはカンマかタブ。 */
export function parseCsv(input: string): string[][] {
  const text = input.replace(/^﻿/, "");
  const firstLine = text.split(/\r?\n/, 1)[0] ?? "";
  const delimiter = !firstLine.includes(",") && firstLine.includes("\t") ? "\t" : ",";

  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          quoted = false;
        }
      } else {
        cell += ch;
      }
      continue;
    }
    if (ch === '"' && cell === "") {
      quoted = true;
    } else if (ch === delimiter) {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += ch;
    }
  }
  if (cell !== "" || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

const isBlankRow = (cells: string[]) => cells.every((c) => c.trim() === "");

function csvCell(value: string): string {
  return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/** 現在の馬データを CSV 文字列に（Excel で文字化けしないよう BOM 付き UTF-8）。 */
export function horsesToCsv(horses: HorseCsvSource[]): string {
  const lines = [HORSE_CSV_COLUMNS.map((c) => csvCell(c.header)).join(",")];
  for (const h of horses) {
    const values: Record<HorseCsvField, string> = {
      slug: h.slug,
      name: h.name,
      sex: h.sex ?? "",
      age: h.age ?? "",
      status: horseStatusLabel(h.status),
      orderNum: h.orderNum == null ? "" : String(h.orderNum),
      rescuedAt: formatRescuedAt(h.rescuedAt),
      personality: h.personality ?? "",
      story: h.story ?? "",
      beforeStory: h.before ?? "",
      note: h.note ?? "",
      officeMessage: h.officeMessage ?? "",
      youtubeUrl: h.youtubeUrl ?? "",
      sortOrder: String(h.sortOrder),
    };
    lines.push(HORSE_CSV_COLUMNS.map((c) => csvCell(values[c.field])).join(","));
  }
  return `﻿${lines.join("\r\n")}\r\n`;
}

export type ParsedHorseCsv = {
  rows: HorseCsvRow[];
  /** CSV に含まれていた（＝取り込み対象の）列 */
  fields: HorseCsvField[];
  /** 見出しが一致せず無視した列 */
  ignoredHeaders: string[];
  error?: string;
};

const normalizeHeader = (h: string) => h.replace(/[\s　]+/g, "").replace(/（任意）|\(任意\)/g, "");

/** CSV 文字列 → 行データ。見出し行から列を特定する。 */
export function parseHorseCsv(text: string): ParsedHorseCsv {
  const table = parseCsv(text);
  // line は Excel で開いたときの行番号（1行目=見出し）。空行は飛ばすが番号は詰めない。
  const dataRows = table
    .slice(1)
    .map((cells, i) => ({ cells, line: i + 2 }))
    .filter((r) => !isBlankRow(r.cells));
  if (!table.length || isBlankRow(table[0]) || !dataRows.length) {
    return { rows: [], fields: [], ignoredHeaders: [], error: "データ行がありません。1行目に見出し、2行目以降に馬の情報を入力してください。" };
  }

  const byHeader = new Map(HORSE_CSV_COLUMNS.map((c) => [normalizeHeader(c.header), c.field]));
  const columns: (HorseCsvField | null)[] = [];
  const ignoredHeaders: string[] = [];
  for (const raw of table[0]) {
    const field = byHeader.get(normalizeHeader(raw)) ?? null;
    if (field && columns.includes(field)) {
      return { rows: [], fields: [], ignoredHeaders: [], error: `見出し「${raw.trim()}」が重複しています。` };
    }
    columns.push(field);
    if (!field && raw.trim()) ignoredHeaders.push(raw.trim());
  }

  const fields = columns.filter((c): c is HorseCsvField => c !== null);
  if (!fields.includes("slug") && !fields.includes("name")) {
    return {
      rows: [],
      fields: [],
      ignoredHeaders,
      error: "見出しに「スラッグ」または「馬名」の列が必要です。ダウンロードしたCSVの1行目を変更せずにお使いください。",
    };
  }

  if (dataRows.length > HORSE_CSV_MAX_ROWS) {
    return { rows: [], fields, ignoredHeaders, error: `一度に取り込めるのは${HORSE_CSV_MAX_ROWS}行までです。` };
  }

  const rows = dataRows.map(({ cells, line }) => {
    const values: HorseCsvValues = {};
    columns.forEach((field, col) => {
      if (field) values[field] = (cells[col] ?? "").trim();
    });
    return { line, values };
  });
  return { rows, fields, ignoredHeaders };
}

// ── 値の検証 ────────────────────────────────────────────────────────────────

const STATUS_ALIASES: Record<string, HorseStatus> = {
  ...Object.fromEntries(HORSE_STATUSES.flatMap((s) => [[s.label, s.value], [s.value, s.value]])),
  在籍馬: "protected",
  現在の保護馬: "protected",
  保護馬: "protected",
  救済ポニー: "protected",
  卒業馬: "owner",
  graduated: "owner",
  オーナー決定: "owner",
  その他: "other",
  退厩: "other",
  "その他・退厩": "other",
};

const SEX_ALIASES: Record<string, "牡" | "牝" | "騙"> = {
  牡: "牡",
  牝: "牝",
  騙: "騙",
  騸: "騙",
  セン: "騙",
  せん: "騙",
  セン馬: "騙",
  せん馬: "騙",
  オス: "牡",
  メス: "牝",
};

/** セル内改行を LF に統一（フォーム保存分は CRLF、Excel は LF のため比較前に揃える）。 */
export const normalizeNewlines = (v: string) => v.replace(/\r\n?/g, "\n");

const toHalfWidthDigits = (v: string) =>
  v.replace(/[０-９]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0xfee0));

function parseInteger(raw: string): number | null {
  const v = toHalfWidthDigits(raw).replace(/,/g, "");
  return /^\d+$/.test(v) ? Number(v) : null;
}

export const HORSE_SLUG_PATTERN = /^[a-z0-9][a-z0-9-]*$/;

/**
 * CSV 1行分の文字列を検証して HorseCsvPatch に変換する。
 * 値が渡された（＝CSVに列がある）項目だけが patch に入る。空欄のセルは
 * 「その項目を空にする」扱い。ただし馬名・ステータス・表示順は空欄なら変更しない。
 */
export function toHorsePatch(values: HorseCsvValues): { patch: HorseCsvPatch; errors: string[] } {
  const patch: HorseCsvPatch = {};
  const errors: string[] = [];
  const has = (f: HorseCsvField) => values[f] !== undefined;
  const text = (f: HorseCsvField) => normalizeNewlines(values[f] ?? "").trim();

  if (text("slug")) patch.slug = text("slug");
  if (text("name")) patch.name = text("name");

  if (has("sex")) {
    const v = text("sex");
    if (!v || v === "不明") patch.sex = null;
    else if (SEX_ALIASES[v]) patch.sex = SEX_ALIASES[v];
    else errors.push(`性別「${v}」は 牡・牝・騙 のいずれかで入力してください。`);
  }

  if (has("age")) patch.age = text("age") || null;

  if (text("status")) {
    const status = STATUS_ALIASES[text("status").replace(/[\s　]+/g, "")];
    if (status) patch.status = status;
    else errors.push(`ステータス「${text("status")}」は ${HORSE_STATUSES.map((s) => s.label).join("／")} のいずれかで入力してください。`);
  }

  if (has("orderNum")) {
    const v = text("orderNum");
    if (!v) patch.orderNum = null;
    else {
      const n = parseInteger(v);
      if (n === null) errors.push(`肥育場番号「${v}」は数字で入力してください。`);
      else patch.orderNum = n;
    }
  }

  if (has("rescuedAt")) {
    const normalized = normalizeRescuedAt(text("rescuedAt"));
    if (normalized === null) errors.push(`保護年月「${text("rescuedAt")}」は「2024年5月」または「2024-05」の形式で入力してください。`);
    else patch.rescuedAt = normalized || null;
  }

  if (has("personality")) patch.personality = text("personality");
  if (has("story")) patch.story = text("story");
  if (has("beforeStory")) patch.beforeStory = text("beforeStory") || null;
  if (has("note")) patch.note = text("note") || null;
  if (has("officeMessage")) patch.officeMessage = text("officeMessage") || null;

  if (has("youtubeUrl")) {
    const v = text("youtubeUrl");
    if (!v) patch.youtubeUrl = null;
    else if (isYouTubeUrl(v)) patch.youtubeUrl = v;
    else errors.push(`YouTubeプレイリストURL「${v}」は https://www.youtube.com/ で始まるURLを入力してください。`);
  }

  if (text("sortOrder")) {
    const n = parseInteger(text("sortOrder"));
    if (n === null) errors.push(`表示順「${text("sortOrder")}」は数字で入力してください。`);
    else patch.sortOrder = n;
  }

  return { patch, errors };
}

export type HorseCsvTarget = { slug: string; name: string };

/**
 * CSV の行がどの既存馬に対応するか。スラッグ優先、無ければ馬名の完全一致
 * （同名が複数いる場合は特定できないので新規扱いにせずエラー）。
 */
export function matchHorseCsvRow<T extends HorseCsvTarget>(
  patch: HorseCsvPatch,
  existing: T[]
): { match?: T; error?: string } {
  if (patch.slug) {
    return { match: existing.find((h) => h.slug === patch.slug) };
  }
  if (!patch.name) return { error: "スラッグか馬名のどちらかを入力してください。" };
  const sameName = existing.filter((h) => h.name === patch.name);
  if (sameName.length > 1) {
    return { error: `馬名「${patch.name}」が複数登録されています。スラッグ列で対象を指定してください。` };
  }
  return { match: sameName[0] };
}

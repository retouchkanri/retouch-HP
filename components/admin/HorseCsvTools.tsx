"use client";

import { useRef, useState, useTransition } from "react";
import type { DbHorse } from "@/lib/content";
import { importHorsesCsv } from "@/app/admin/actions";
import {
  HORSE_CSV_COLUMNS,
  horsesToCsv,
  matchHorseCsvRow,
  normalizeNewlines,
  parseHorseCsv,
  toHorsePatch,
  type HorseCsvField,
  type HorseCsvPatch,
  type HorseCsvRow,
} from "@/lib/horse-csv";

type PreviewRow = HorseCsvRow & {
  name: string;
  kind: "update" | "create" | "same";
  /** 変更がある項目の見出し */
  changed: string[];
};

type Preview = {
  fileName: string;
  rows: PreviewRow[];
  errors: string[];
  ignoredHeaders: string[];
};

const HEADER_OF = Object.fromEntries(HORSE_CSV_COLUMNS.map((c) => [c.field, c.header])) as Record<
  HorseCsvField,
  string
>;

/** Excel の「CSV（コンマ区切り）」は Shift_JIS、「CSV UTF-8」は UTF-8 で保存される。 */
async function readCsvFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  } catch {
    return new TextDecoder("shift_jis").decode(buffer);
  }
}

/** CSV の値と現在の登録内容を比べ、実際に変わる項目だけを返す。 */
function changedFields(patch: HorseCsvPatch, horse: DbHorse): HorseCsvField[] {
  const current: Record<Exclude<HorseCsvField, "slug">, string | number | null> = {
    name: horse.name,
    sex: horse.sex ?? null,
    age: horse.age ?? null,
    status: horse.status,
    orderNum: horse.orderNum ?? null,
    rescuedAt: horse.rescuedAt ?? null,
    personality: horse.personality ?? "",
    story: horse.story ?? "",
    beforeStory: horse.before ?? null,
    note: horse.note ?? null,
    officeMessage: horse.officeMessage ?? null,
    youtubeUrl: horse.youtubeUrl ?? null,
    sortOrder: horse.sortOrder,
  };
  const same = (a: string | number | null, b: string | number | null) =>
    typeof a === "string" && typeof b === "string"
      ? normalizeNewlines(a).trim() === normalizeNewlines(b).trim()
      : (a ?? "") === (b ?? "");

  return (Object.keys(current) as Exclude<HorseCsvField, "slug">[]).filter((field) => {
    const next = patch[field];
    return next !== undefined && !same(next, current[field]);
  });
}

function buildPreview(fileName: string, text: string, horses: DbHorse[]): Preview {
  const parsed = parseHorseCsv(text);
  if (parsed.error) {
    return { fileName, rows: [], errors: [parsed.error], ignoredHeaders: parsed.ignoredHeaders };
  }

  const errors: string[] = [];
  const rows: PreviewRow[] = [];
  const seen = new Set<string>();

  for (const row of parsed.rows) {
    const fail = (message: string) => errors.push(`${row.line}行目：${message}`);
    const { patch, errors: valueErrors } = toHorsePatch(row.values);
    valueErrors.forEach(fail);

    const { match, error } = matchHorseCsvRow(patch, horses);
    if (error) {
      fail(error);
      continue;
    }
    if (!match) {
      if (!patch.name) {
        fail(`スラッグ「${patch.slug}」の馬が見つかりません。新規登録する場合は馬名を入力してください。`);
        continue;
      }
      rows.push({ ...row, name: patch.name, kind: "create", changed: [] });
      continue;
    }
    if (seen.has(match.id)) {
      fail(`「${match.name}」が複数の行に入力されています。`);
      continue;
    }
    seen.add(match.id);
    // 空欄にした項目は内容が消えるので、プレビューで分かるように印を付ける
    const isCleared = (f: HorseCsvField) => patch[f] === null || patch[f] === "";
    const changed = changedFields(patch, match).map((f) => `${HEADER_OF[f]}${isCleared(f) ? "（消去）" : ""}`);
    rows.push({ ...row, name: patch.name ?? match.name, kind: changed.length ? "update" : "same", changed });
  }

  return { fileName, rows, errors, ignoredHeaders: parsed.ignoredHeaders };
}

export default function HorseCsvTools({
  items,
  onMessage,
}: {
  items: DbHorse[];
  onMessage: (msg: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [pending, startTransition] = useTransition();

  const download = () => {
    const blob = new Blob([horsesToCsv(items)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `retouch-horses-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const pick = async (file: File | undefined) => {
    if (!file) return;
    onMessage(null);
    try {
      setPreview(buildPreview(file.name, await readCsvFile(file), items));
    } catch {
      setPreview({ fileName: file.name, rows: [], errors: ["CSVファイルを読み込めませんでした。"], ignoredHeaders: [] });
    }
  };

  const pendingRows = preview?.rows.filter((r) => r.kind !== "same") ?? [];
  const updates = pendingRows.filter((r) => r.kind === "update").length;
  const creates = pendingRows.filter((r) => r.kind === "create").length;
  const unchanged = (preview?.rows.length ?? 0) - pendingRows.length;

  const apply = () => {
    startTransition(async () => {
      const result = await importHorsesCsv(pendingRows.map(({ line, values }) => ({ line, values })));
      if (result.rowErrors) {
        setPreview((p) => (p ? { ...p, errors: result.rowErrors } : p));
        return;
      }
      if (result.error) {
        onMessage(`エラー: ${result.error}`);
      } else {
        onMessage(`CSVを取り込みました（更新 ${result.updated}頭・新規登録 ${result.created}頭）。`);
      }
      setPreview(null);
    });
  };

  return (
    <div className="mb-4 rounded-xl border border-white/10 bg-brand-950/40 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className="mr-auto text-sm font-semibold text-white">CSVで一括編集</p>
        <button
          type="button"
          onClick={download}
          disabled={!items.length}
          className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/15 disabled:opacity-40"
        >
          CSVダウンロード
        </button>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={pending}
          className="rounded-lg bg-gold px-3 py-1.5 text-xs font-semibold text-white hover:brightness-110 disabled:opacity-40"
        >
          CSVを取り込む
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => {
            pick(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>
      <p className="mt-2 text-xs leading-relaxed text-brand-300">
        写真以外の項目（馬名・ステータス・保護年月・紹介文など）をExcelでまとめて編集できます。
        ダウンロードしたCSVを編集して取り込んでください。1行目の見出しは変更しないでください。
        スラッグが空欄の行は新しい馬として登録されます。セルを空欄にすると、その項目の内容は消去されます。
      </p>

      {preview && (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-brand-200">{preview.fileName}</p>

          {preview.errors.length > 0 ? (
            <>
              <p className="mt-2 text-sm font-semibold text-red-200">
                {preview.errors.length}件の問題があるため取り込めません。CSVを修正して、もう一度選択してください。
              </p>
              <ul className="mt-2 max-h-48 space-y-1 overflow-y-auto text-xs text-red-100">
                {preview.errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <p className="mt-2 text-sm text-white">
                更新 <span className="font-bold text-gold">{updates}</span>頭 ／ 新規登録{" "}
                <span className="font-bold text-gold">{creates}</span>頭
                <span className="ml-2 text-xs text-brand-300">（変更なし {unchanged}頭）</span>
              </p>
              {pendingRows.length > 0 && (
                <ul className="mt-3 max-h-56 space-y-1.5 overflow-y-auto text-xs text-brand-100">
                  {pendingRows.map((r) => (
                    <li key={r.line} className="flex gap-2">
                      <span
                        className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                          r.kind === "create" ? "bg-gold text-white" : "bg-white/15 text-white"
                        }`}
                      >
                        {r.kind === "create" ? "新規" : "更新"}
                      </span>
                      <span className="min-w-0">
                        <span className="font-semibold text-white">{r.name}</span>
                        {r.changed.length > 0 && (
                          <span className="ml-2 text-brand-300">{r.changed.join("、")}</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {preview.ignoredHeaders.length > 0 && (
            <p className="mt-3 text-xs text-amber-200">
              次の列は見出しが一致しないため取り込まれません：{preview.ignoredHeaders.join("、")}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {preview.errors.length === 0 && pendingRows.length > 0 && (
              <button
                type="button"
                onClick={apply}
                disabled={pending}
                className="rounded-lg bg-gold px-4 py-2 text-xs font-semibold text-white hover:brightness-110 disabled:opacity-60"
              >
                {pending ? "取り込み中…" : "この内容で取り込む"}
              </button>
            )}
            <button
              type="button"
              onClick={() => setPreview(null)}
              disabled={pending}
              className="rounded-lg bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/15 disabled:opacity-60"
            >
              {preview.errors.length === 0 && pendingRows.length > 0 ? "キャンセル" : "閉じる"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

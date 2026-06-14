"use client";

import { useMemo, useState } from "react";
import { ALL_HORSES, HORSES_WITH_SUPPORT, supportRate, type HorseProfile } from "@/lib/horses";
import SupportHorseRow from "@/components/SupportHorseRow";

const CATEGORIES = [
  { value: "all", label: "すべて" },
  { value: "protected", label: "現在の保護馬" },
  { value: "graduated", label: "卒業馬" },
  { value: "owner", label: "オーナー決定馬" },
];

const SORTS = [
  { value: "urgent", label: "支援が必要な順" },
  { value: "top", label: "応援が集まっている順" },
  { value: "name", label: "名前順" },
  { value: "order", label: "保護順" },
];

const select =
  "w-full rounded-xl border border-brand-900/15 bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200";

export default function SupportStatusExplorer({
  horses = ALL_HORSES,
  onlyWithSupport = false,
}: {
  horses?: HorseProfile[];
  onlyWithSupport?: boolean;
}) {
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("urgent");
  const source = onlyWithSupport ? HORSES_WITH_SUPPORT : horses;

  const filtered = useMemo(() => {
    let list = source.filter((h) => {
      if (category !== "all" && h.status !== category) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sort === "urgent") {
        if (a.goal === 0 && b.goal === 0) return a.name.localeCompare(b.name, "ja");
        if (a.goal === 0) return 1;
        if (b.goal === 0) return -1;
        return supportRate(a) - supportRate(b);
      }
      if (sort === "top") {
        if (a.goal === 0 && b.goal === 0) return a.name.localeCompare(b.name, "ja");
        if (a.goal === 0) return 1;
        if (b.goal === 0) return -1;
        return supportRate(b) - supportRate(a);
      }
      if (sort === "order") {
        return (a.order ?? 999) - (b.order ?? 999);
      }
      return a.name.localeCompare(b.name, "ja");
    });

    return list;
  }, [source, category, sort]);

  return (
    <div>
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-brand-900/5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-semibold text-brand-800">カテゴリー</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={`mt-1.5 ${select}`}>
              {CATEGORIES.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-brand-800">並び替え</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className={`mt-1.5 ${select}`}>
              {SORTS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
        </div>
        <p className="mt-4 text-sm text-ink/60">
          該当する馬：<span className="font-bold text-brand-700">{filtered.length}</span> 頭
        </p>
      </div>

      <ol className="mt-8 space-y-3">
        {filtered.map((horse, i) => (
          <SupportHorseRow
            key={horse.slug}
            horse={horse}
            rank={i + 1}
            tone={sort === "top" ? "top" : sort === "urgent" ? "urgent" : "neutral"}
            showRank={sort === "urgent" || sort === "top"}
          />
        ))}
      </ol>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { Horse } from "@/lib/data";
import { HorseCard } from "@/components/Blocks";

const CATEGORIES = [
  { value: "all", label: "すべて" },
  { value: "protected", label: "現在の保護馬" },
  { value: "graduated", label: "卒業馬" },
  { value: "owner", label: "オーナー決定馬" },
];
const SEXES = [
  { value: "all", label: "すべて" },
  { value: "牡", label: "牡" },
  { value: "牝", label: "牝" },
  { value: "騙", label: "騙" },
];
const AGES = [
  { value: "all", label: "すべて" },
  { value: "young", label: "若馬（〜6歳）" },
  { value: "mid", label: "中堅（7〜9歳）" },
  { value: "senior", label: "ベテラン（10歳〜）" },
];

const select =
  "w-full rounded-xl border border-brand-900/15 bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200";

export default function HorseExplorer({ horses }: { horses: Horse[] }) {
  const [category, setCategory] = useState("all");
  const [sex, setSex] = useState("all");
  const [age, setAge] = useState("all");

  const filtered = useMemo(
    () =>
      horses.filter((h) => {
        if (category !== "all" && h.status !== category) return false;
        if (sex !== "all" && h.sex !== sex) return false;
        if (age === "young" && h.ageYears > 6) return false;
        if (age === "mid" && (h.ageYears < 7 || h.ageYears > 9)) return false;
        if (age === "senior" && h.ageYears < 10) return false;
        return true;
      }),
    [horses, category, sex, age]
  );

  return (
    <div>
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-brand-900/5">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="text-xs font-semibold text-brand-800">カテゴリー</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={`mt-1.5 ${select}`}>
              {CATEGORIES.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-brand-800">性別</span>
            <select value={sex} onChange={(e) => setSex(e.target.value)} className={`mt-1.5 ${select}`}>
              {SEXES.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-brand-800">年齢</span>
            <select value={age} onChange={(e) => setAge(e.target.value)} className={`mt-1.5 ${select}`}>
              {AGES.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
        </div>
        <p className="mt-4 text-sm text-ink/60">
          該当する馬：<span className="font-bold text-brand-700">{filtered.length}</span> 頭
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((h) => (
            <HorseCard key={h.name} horse={h} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-center text-sm text-ink/60">
          条件に合う馬が見つかりませんでした。条件を変更してお試しください。
        </p>
      )}
    </div>
  );
}

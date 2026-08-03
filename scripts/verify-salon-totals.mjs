/**
 * retouch.salon 共有DBの支援実績を状態別に集計し、サイト（/support/status）が
 * 表示する数値と一致しているかを検証します。
 *
 *   npm run verify:salon
 *
 * 出力は retouch.salon 管理画面の集計表と同じ形式（状態／件数／口座数／月間合計／頭数）。
 * ここに出る "active" の行が、そのままサイトの3つの数値になります。
 */
import { createClient } from "@supabase/supabase-js";

const PAGE_SIZE = 1000;

const url = process.env.SALON_SUPABASE_URL;
const key =
  process.env.SALON_SUPABASE_SERVICE_ROLE_KEY ?? process.env.SALON_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error(
    "FAILED: SALON_SUPABASE_URL と SALON_SUPABASE_SERVICE_ROLE_KEY（または ANON_KEY）を .env.local に設定してください。",
  );
  process.exit(1);
}
if (/[<>]/.test(url) || /[<>]/.test(key) || url.includes("[SENSITIVE]")) {
  console.error(
    "FAILED: SALON_SUPABASE_* がプレースホルダのままです。Supabase ダッシュボードの実値を .env.local に設定してください。",
  );
  process.exit(1);
}

const salon = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/** support_subscriptions を全件取得（PostgREST の1000行上限を超えても取りこぼさない）。 */
async function fetchAll() {
  const all = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await salon
      .from("support_subscriptions")
      .select("horse_id, units, monthly_amount, status")
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(`support_subscriptions: ${error.message}`);
    const rows = data ?? [];
    all.push(...rows);
    if (rows.length < PAGE_SIZE) break;
  }
  return all;
}

const yen = (n) => `${n.toLocaleString("ja-JP")}円`;
const units = (n) => (n % 1 === 0 ? `${n}口` : `${n.toFixed(1)}口`);

const rows = await fetchAll();

const byStatus = new Map();
for (const r of rows) {
  const status = r.status ?? "(null)";
  let g = byStatus.get(status);
  if (!g) {
    g = { count: 0, unitTotal: 0, monthlyTotal: 0, horses: new Set() };
    byStatus.set(status, g);
  }
  g.count += 1;
  g.unitTotal += Number(r.units) || 0;
  g.monthlyTotal += Number(r.monthly_amount) || 0;
  if (r.horse_id) g.horses.add(r.horse_id);
}

const order = ["active", "canceled", "incomplete"];
const sorted = [...byStatus.keys()].sort(
  (a, b) => (order.indexOf(a) + 1 || 99) - (order.indexOf(b) + 1 || 99),
);

console.log("\n状態\t件数\t口座数\t月間合計\t頭数");
const total = { count: 0, unitTotal: 0, monthlyTotal: 0, horses: new Set() };
for (const status of sorted) {
  const g = byStatus.get(status);
  console.log(
    `${status}\t${g.count}件\t${units(g.unitTotal)}\t${yen(g.monthlyTotal)}\t${g.horses.size}頭`,
  );
  total.count += g.count;
  total.unitTotal += g.unitTotal;
  total.monthlyTotal += g.monthlyTotal;
  for (const id of g.horses) total.horses.add(id);
}
console.log(
  `合計\t${total.count}件\t${units(total.unitTotal)}\t${yen(total.monthlyTotal)}\t${total.horses.size}頭`,
);

const active = byStatus.get("active") ?? {
  count: 0,
  monthlyTotal: 0,
  horses: new Set(),
};
console.log("\n── /support/status に表示される数値（active のみ）──────────────");
console.log(`  支援を受けている馬        ${active.horses.size}頭`);
console.log(`  支援件数（のべ）          ${active.count}件`);
console.log(`  現在の総支援金額          ${yen(active.monthlyTotal)}`);
console.log("");

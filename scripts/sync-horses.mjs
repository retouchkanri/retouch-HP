/**
 * Sync the real horse roster (photos in ./images/horses) into:
 *   1. Supabase Storage  -> bucket "horse-images"  (key = <slug>.<ext>)
 *   2. Supabase DB        -> table "horses" (photo column holds the public URL)
 *   3. Static fallback    -> lib/roster.ts (used when the DB is unreachable)
 *
 * The horse NAME shown on the site is parsed directly from each image filename
 * so the picture and the name always match. Image order number = 肥育場から◯番目.
 *
 * Idempotent: storage uploads upsert, DB rows upsert on `slug`, and stale rows
 * (slugs not in the current roster) are removed. A timestamped backup of the
 * existing horses table is written before any change.
 *
 *   node --env-file=.env.local scripts/sync-horses.mjs            (full sync)
 *   node --env-file=.env.local scripts/sync-horses.mjs --dry      (roster.ts only, no network)
 */
import { createClient } from "@supabase/supabase-js";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const IMAGES_DIR = path.join(ROOT, "images", "horses");
const ROSTER_TS = path.join(ROOT, "lib", "roster.ts");
const BUCKET = "horse-images";
const DRY = process.argv.includes("--dry");

// ── Special (non-numbered) .webp horses: filename base -> {slug, name, status} ──
const WEBP_MAP = {
  "サクラエース": { slug: "sakura-ace", name: "サクラエース", status: "graduated" },
  "ハヤテボーイ": { slug: "hayate-boy", name: "ハヤテボーイ", status: "graduated" },
  "ミドリノカゼ": { slug: "midori-no-kaze", name: "ミドリノカゼ", status: "graduated" },
};

// ── Detail text + support stats for known horses, keyed by slug (horse-NN) ──
// Carried over from the original hand-written profiles so the support ranking,
// status page and story sections stay populated. Everything else is optional.
const DETAILS = {
  "horse-02": { personality: "穏やか・人なつっこい", story: "肥育場から救い出された一頭。見学会では子どもたちの人気者。リトレーニングを経て乗馬への道を歩んでいます。" },
  "horse-07": { personality: "すごく優しいお父さんのような存在", before: "肥育場の厩舎ではドロドロになりながらも一生懸命生きている感じが伝わってきた。", story: "おとなしい性格で、だれからも可愛がられている存在。オーナーが決まり長野県へ。" },
  "horse-10": { personality: "元気な妹！ニコがお兄ちゃん的存在", before: "ニコ号がお兄ちゃん、アイ号が妹。ニコとアイはとても仲良しでした。", story: "アイとニコ同時に譲渡決定。熊本の個人オーナーさんのもと元気に過ごしています。" },
  "horse-11": { personality: "まさにお兄ちゃん的存在。優しい～", before: "肥育場でのお部屋にニコとアイが一緒に支え合ってる感じ。二人とも同時に受入れ。", story: "アイとニコ同時に譲渡決定。熊本の個人オーナーさんのもと元気に過ごしています。" },
  "horse-12": { personality: "顔のつくりがとても美しい美人さん", before: "顔がとてもきれいな整ったつくりで特徴的でした。すぐに目に留まり引取りを決定。", story: "この子の素晴らしさを理解して頂いたオーナー様にすぐ面会して頂き決定。九州へ。" },
  "horse-16": { personality: "とても穏やかで癒し系の人気者", before: "緊張下にある肥育場の厩舎でも、優しく人懐っこい性格でお利口さんな感じがした。", story: "常に冷静で安心感。約1年のオーナー預託を経て北海道のプライベート乗馬施設へ。" },
  "horse-20": { personality: "まだ若い元気な男の子", before: "肥育場の中でもまだ若さと幼さが垣間見える。せっかく生まれた命を大切にしたい。", story: "肥育場から引き取り後、運命的な出会いを感じて頂いた個人オーナー様に譲渡決定。" },
  "horse-21": { personality: "顔は鋭いけどすごく優しいギャップ", before: "お顔はキリッと強そうなイメージ。しかし、本当に人にも馬にも優しい子の予感が。", story: "とても大人しく扱いも騎乗もとても安心できる子で個人のオーナー様への譲渡決定。" },
};

const SUPPORT = {
  "horse-00": { goal: 200000, raised: 36000, supporters: 12, note: "繊細で再調教に時間が必要。月々の飼養費が大きく不足しています。" },
  "horse-01": { goal: 180000, raised: 41000, supporters: 15, note: "肥育場から保護されたばかり。健康管理と治療の支援を募集中です。" },
  "horse-02": { goal: 200000, raised: 58000, supporters: 22, note: "人なつっこい人気者ですが、継続支援が目標に届いていません。" },
  "horse-03": { goal: 180000, raised: 64000, supporters: 19, note: "若く伸びしろのある一頭。蹄の治療費の支援が必要です。" },
  "horse-04": { goal: 190000, raised: 78000, supporters: 28, note: "リトレーニング中。あと一歩で月間目標に届きます。" },
  "horse-05": { goal: 210000, raised: 99000, supporters: 31, note: "高齢でケア費用がかさむため、長期の支援者を探しています。" },
  "horse-07": { goal: 180000, raised: 138000, supporters: 69, note: "指導馬として活躍中。応援の輪が広がっています。" },
  "horse-10": { goal: 160000, raised: 132000, supporters: 74, note: "オーナー決定後も多くのサポーターに見守られています。" },
  "horse-12": { goal: 190000, raised: 165000, supporters: 88, note: "クラウドファンディング発の人気馬。応援が集まっています。" },
  "horse-16": { goal: 170000, raised: 156000, supporters: 96, note: "乗用馬デビューを果たし、たくさんの応援が集まりました。" },
  "horse-20": { goal: 200000, raised: 192000, supporters: 128, note: "馬術競技馬を目指して調教中。目標達成まであと一歩です。" },
  "horse-21": { goal: 180000, raised: 178000, supporters: 142, note: "ほぼ満額を達成。多くのサポーターに支えられています。" },
};

const STATUS_LABEL = {
  protected: "現在の保護馬",
  graduated: "卒業馬",
  owner: "オーナー決定馬",
};

function contentTypeFor(ext) {
  switch (ext) {
    case "jpg":
    case "jpeg": return "image/jpeg";
    case "png": return "image/png";
    case "webp": return "image/webp";
    default: return "application/octet-stream";
  }
}

/** Parse one filename into a roster entry (without photo URL). */
function parseFile(file) {
  const ext = path.extname(file).slice(1).toLowerCase();
  const base = file.slice(0, file.length - path.extname(file).length).trim();

  // Non-numbered .webp specials.
  if (ext === "webp") {
    if (base.includes("ポニー")) {
      return { file, ext, slug: "pony-rescue", name: "救済ポニー", status: "protected", order: null,
        note: "目を負傷したポニーの救済支援。番外編として保護しました。" };
    }
    const m = WEBP_MAP[base];
    if (m) return { file, ext, slug: m.slug, name: m.name, status: m.status, order: null };
    // Fallback: keep raw name, derive slug from base.
    return { file, ext, slug: base.replace(/[^\w]+/g, "-").toLowerCase() || "horse-x", name: base, status: "graduated", order: null };
  }

  // Numbered: "07：ブライト（オーナー決定）" / "27チャコ" / "00：マッシュ"
  const m = base.match(/^(\d+)\s*[:：]?\s*(.+)$/);
  if (!m) throw new Error(`Unparseable filename: ${file}`);
  const order = parseInt(m[1], 10);
  let name = m[2].trim();
  const isOwner = /[（(]\s*オーナー決定\s*[）)]/.test(name);
  name = name.replace(/[（(][^）)]*[）)]/g, "").trim();
  const slug = `horse-${String(order).padStart(2, "0")}`;
  return { file, ext, slug, name, status: isOwner ? "owner" : "protected", order };
}

function buildRoster(files, publicBase) {
  return files.map(parseFile).map((e) => {
    const d = DETAILS[e.slug] ?? {};
    const s = SUPPORT[e.slug] ?? {};
    return {
      slug: e.slug,
      name: e.name,
      status: e.status,
      statusLabel: STATUS_LABEL[e.status],
      order: e.order ?? undefined,
      personality: d.personality,
      story: d.story,
      before: d.before,
      photo: `${publicBase}/${e.slug}.${e.ext}`,
      note: e.note ?? s.note,
      goal: s.goal ?? 0,
      raised: s.raised ?? 0,
      supporters: s.supporters ?? 0,
      _ext: e.ext,
      _file: e.file,
    };
  }).sort((a, b) => {
    if (a.order != null && b.order != null) return a.order - b.order;
    if (a.order != null) return -1;
    if (b.order != null) return 1;
    return a.name.localeCompare(b.name, "ja");
  });
}

function toRosterTs(roster) {
  const entries = roster.map((r) => {
    const o = {
      slug: r.slug, name: r.name, sex: undefined, age: "不明",
      status: r.status, statusLabel: r.statusLabel, order: r.order,
      personality: r.personality, story: r.story, before: r.before,
      photo: r.photo, note: r.note,
      goal: r.goal, raised: r.raised, supporters: r.supporters,
    };
    // drop undefined keys for a clean file
    const clean = Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));
    return "  " + JSON.stringify(clean) + ",";
  }).join("\n");

  return `// ============================================================================
// 馬マスター（自動生成）/ Horse roster — generated by scripts/sync-horses.mjs
// 画像ファイル名（images/horses/）から馬名・保護順を抽出し、Supabase Storage の
// 公開URLを photo に設定しています。手動で編集せず、画像を追加/差し替えたら
//   node --env-file=.env.local scripts/sync-horses.mjs
// を再実行してください。管理画面(/admin)からの個別編集はDB側に反映されます。
// ============================================================================

export type RosterEntry = {
  slug: string;
  name: string;
  sex?: "牡" | "牝" | "騙";
  age?: string;
  status: "protected" | "graduated" | "owner";
  statusLabel: string;
  order?: number;
  personality?: string;
  story?: string;
  before?: string;
  photo: string;
  note?: string;
  goal: number;
  raised: number;
  supporters: number;
};

export const ROSTER: RosterEntry[] = [
${entries}
];
`;
}

async function main() {
  const files = (await fs.readdir(IMAGES_DIR))
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
  if (!files.length) throw new Error(`No images found in ${IMAGES_DIR}`);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  const publicBase = `${url}/storage/v1/object/public/${BUCKET}`;

  const roster = buildRoster(files, publicBase);

  // 1. Always (re)generate the static fallback.
  await fs.writeFile(ROSTER_TS, toRosterTs(roster), "utf8");
  console.log(`✓ wrote lib/roster.ts (${roster.length} horses)`);

  // Check for duplicate slugs (would corrupt the unique constraint).
  const seen = new Map();
  for (const r of roster) {
    if (seen.has(r.slug)) throw new Error(`Duplicate slug ${r.slug} (${r.name} vs ${seen.get(r.slug)})`);
    seen.set(r.slug, r.name);
  }

  if (DRY) { console.log("--dry: skipping uploads + DB."); return; }

  const sb = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

  // Ensure bucket exists.
  const { error: bErr } = await sb.storage.createBucket(BUCKET, { public: true });
  if (bErr && !/already exists/i.test(bErr.message)) throw new Error(`bucket: ${bErr.message}`);

  // 2. Upload every image (key = <slug>.<ext>).
  let uploaded = 0;
  for (const r of roster) {
    const body = await fs.readFile(path.join(IMAGES_DIR, r._file));
    const key = `${r.slug}.${r._ext}`;
    const { error } = await sb.storage.from(BUCKET).upload(key, body, {
      contentType: contentTypeFor(r._ext), upsert: true,
    });
    if (error) { console.log(`  ✗ ${key}: ${error.message}`); continue; }
    uploaded++;
    console.log(`  ✓ [${uploaded}/${roster.length}] ${BUCKET}/${key}`);
  }

  // 3. Back up the current horses table.
  const { data: existing, error: exErr } = await sb.from("horses").select("*");
  if (exErr) throw new Error(`read horses: ${exErr.message}`);
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(__dirname, `horses-backup-${stamp}.json`);
  await fs.writeFile(backupPath, JSON.stringify(existing, null, 2), "utf8");
  console.log(`✓ backed up ${existing.length} existing rows -> ${path.relative(ROOT, backupPath)}`);

  // 4. Upsert the roster by slug.
  const rows = roster.map((r, i) => ({
    name: r.name,
    slug: r.slug,
    sex: null,
    age: r.age ?? "不明",
    status: r.status,
    status_label: r.statusLabel,
    order_num: r.order ?? null,
    personality: r.personality ?? "",
    story: r.story ?? "",
    before_story: r.before ?? null,
    photo: r.photo,
    owner_story: null,
    sort_order: i,
    goal: r.goal,
    raised: r.raised,
    supporters: r.supporters,
    note: r.note ?? null,
  }));
  const { error: upErr } = await sb.from("horses").upsert(rows, { onConflict: "slug" });
  if (upErr) throw new Error(`upsert: ${upErr.message}`);
  console.log(`✓ upserted ${rows.length} horses`);

  // 5. Delete stale rows (slugs no longer in the roster).
  const keepSlugs = new Set(roster.map((r) => r.slug));
  const staleIds = (existing ?? []).filter((row) => !keepSlugs.has(row.slug)).map((row) => row.id);
  if (staleIds.length) {
    const { error: delErr } = await sb.from("horses").delete().in("id", staleIds);
    if (delErr) throw new Error(`delete stale: ${delErr.message}`);
    console.log(`✓ removed ${staleIds.length} stale placeholder rows`);
  }

  // 6. Verify.
  const { count, error: cErr } = await sb.from("horses").select("*", { count: "exact", head: true });
  const { count: withPhoto } = await sb.from("horses").select("*", { count: "exact", head: true }).not("photo", "is", null);
  if (cErr) throw new Error(cErr.message);
  console.log(`\nDone. horses: ${count} rows, ${withPhoto} with photo, ${uploaded} images uploaded.`);
}

main().catch((e) => { console.error("FAILED:", e.message); process.exit(1); });

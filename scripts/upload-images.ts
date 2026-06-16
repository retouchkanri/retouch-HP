/**
 * Bulk-upload every image under `public/` into the Supabase storage buckets,
 * write a manifest of local-path -> public-URL, and backfill `media_items`
 * rows that still reference local paths so they point at storage URLs.
 *
 * Idempotent: uploads use upsert, and the DB backfill skips rows that already
 * hold a storage URL. Safe to re-run.
 *
 *   npm run upload:images        (== npx tsx --env-file=.env.local scripts/upload-images.ts)
 *
 * Bucket routing for the *static* migration:
 *   - public/media/**  and  画像*.{jpg,JPG}   -> media-image (the real coverage images)
 *   - every other public image                -> media-image (general asset bucket)
 *   - horse-images / news-images              -> populated by per-item admin uploads
 *                                                (no static asset reliably maps to a
 *                                                 specific horse or news article).
 */
import { createClient } from "@supabase/supabase-js";
import { promises as fs } from "fs";
import path from "path";

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]);

const BUCKETS = ["media-image", "news-images", "horse-images"] as const;
type Bucket = (typeof BUCKETS)[number];

const PUBLIC_DIR = path.resolve(__dirname, "..", "public");
const MANIFEST_PATH = path.resolve(__dirname, "image-manifest.json");

/** Decide which bucket a given public-relative path (posix, no leading slash) lands in. */
function categorize(_relPath: string): Bucket {
  // Only the media-image bucket receives static assets; see header comment.
  return "media-image";
}

/** Transliterate a single path segment to an ASCII-safe, storage-friendly key segment. */
function sanitizeSegment(segment: string): string {
  const ext = path.extname(segment);
  const base = segment.slice(0, segment.length - ext.length);

  // Known Japanese asset names -> stable slugs.
  const gazou = base.match(/^画像([０-９0-9]+)$/);
  if (gazou) {
    const n = gazou[1].replace(/[０-９]/g, (d) => String("０１２３４５６７８９".indexOf(d)));
    return `gazou-${n}${ext}`;
  }

  // Generic fallback: keep ASCII word chars, dot and dash; collapse the rest.
  const ascii = base.replace(/[^\x20-\x7E]/g, "").replace(/[^\w.-]+/g, "-").replace(/^-+|-+$/g, "");
  return `${ascii || "asset"}${ext}`;
}

function sanitizeKey(relPath: string): string {
  return relPath.split("/").map(sanitizeSegment).join("/");
}

function contentTypeFor(ext: string): string {
  switch (ext.toLowerCase()) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}

async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(full);
      return IMAGE_EXT.has(path.extname(entry.name).toLowerCase()) ? [full] : [];
    })
  );
  return files.flat();
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // 1. Ensure all buckets exist.
  for (const bucket of BUCKETS) {
    const { error } = await supabase.storage.createBucket(bucket, { public: true });
    if (error && !error.message.includes("already exists")) {
      console.error(`Failed to create bucket ${bucket}:`, error.message);
      process.exit(1);
    }
  }

  // 2. Upload every public image (concurrently — network latency dominates).
  const CONCURRENCY = 8;
  const localFiles = await walk(PUBLIC_DIR);
  const manifest: Record<string, string> = {};
  const perBucket: Record<Bucket, number> = { "media-image": 0, "news-images": 0, "horse-images": 0 };
  let uploaded = 0;
  let done = 0;
  const failures: string[] = [];

  async function uploadOne(fullPath: string) {
    const relPath = path.relative(PUBLIC_DIR, fullPath).split(path.sep).join("/");
    const bucket = categorize(relPath);
    const key = sanitizeKey(relPath);
    const body = await fs.readFile(fullPath);

    const { error } = await supabase.storage.from(bucket).upload(key, body, {
      contentType: contentTypeFor(path.extname(relPath)),
      upsert: true,
    });

    done += 1;
    if (error) {
      failures.push(`${relPath} -> ${bucket}/${key}: ${error.message}`);
      console.log(`  ✗ [${done}/${localFiles.length}] ${relPath}: ${error.message}`);
      return;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(key);
    manifest[`/${relPath}`] = data.publicUrl;
    perBucket[bucket] += 1;
    uploaded += 1;
    console.log(`  ✓ [${done}/${localFiles.length}] ${bucket}/${key}`);
  }

  // Simple fixed-size worker pool.
  let cursor = 0;
  async function worker() {
    while (cursor < localFiles.length) {
      const i = cursor++;
      await uploadOne(localFiles[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, localFiles.length) }, worker));

  // 3. Write the manifest.
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8");

  // 4. Backfill media_items rows that still reference local paths.
  let backfilled = 0;
  const { data: mediaRows, error: mediaErr } = await supabase
    .from("media_items")
    .select("id, img");

  if (mediaErr) {
    console.warn("Skipping media backfill (query failed):", mediaErr.message);
  } else {
    for (const row of mediaRows ?? []) {
      const img: string | null = row.img;
      if (!img || /^https?:\/\//.test(img)) continue; // already a remote/storage URL
      const target = manifest[img] ?? manifest[`/${img.replace(/^\//, "")}`];
      if (!target) continue;
      const { error } = await supabase.from("media_items").update({ img: target }).eq("id", row.id);
      if (error) console.warn(`  backfill failed for ${row.id}: ${error.message}`);
      else backfilled += 1;
    }
  }

  // 5. Summary.
  console.log("\nImage upload complete.");
  console.log(`  uploaded:   ${uploaded} file(s)`);
  for (const bucket of BUCKETS) console.log(`    ${bucket}: ${perBucket[bucket]}`);
  console.log(`  manifest:   ${MANIFEST_PATH} (${Object.keys(manifest).length} entries)`);
  console.log(`  media rows backfilled to storage URLs: ${backfilled}`);
  if (failures.length) {
    console.log(`  ${failures.length} failure(s):`);
    failures.forEach((f) => console.log(`    - ${f}`));
  }
  console.log(
    "\nNote: horse-images and news-images receive their images from per-item admin uploads."
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

/**
 * Copy images from images/Retouchon into images/horses, preserving existing
 * filename conventions (horse names, owner labels) so sync-horses.mjs can parse them.
 */
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const RETOUCHON = path.join(ROOT, "images", "Retouchon");
const HORSES = path.join(ROOT, "images", "horses");

function orderFromFilename(file) {
  const m = file.match(/^(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

function isPlainNumberedJpg(file) {
  return /^\d+\.jpe?g$/i.test(file);
}

async function main() {
  const existing = (await fs.readdir(HORSES)).filter((f) => /\.jpe?g$/i.test(f));
  const orderToDest = new Map();
  for (const f of existing) {
    const order = orderFromFilename(f);
    if (order != null) orderToDest.set(order, f);
  }

  const sources = await fs.readdir(RETOUCHON);
  const orderToSource = new Map();
  for (const f of sources) {
    if (!/\.jpe?g$/i.test(f)) continue;
    const order = orderFromFilename(f);
    if (order == null) continue;
    const current = orderToSource.get(order);
    if (!current || isPlainNumberedJpg(f)) orderToSource.set(order, f);
  }

  let replaced = 0;
  for (const [order, sourceFile] of [...orderToSource.entries()].sort((a, b) => a[0] - b[0])) {
    const pad = String(order).padStart(2, "0");
    const destName = orderToDest.get(order) ?? `${pad}：登録待ち.jpg`;
    const src = path.join(RETOUCHON, sourceFile);
    const dest = path.join(HORSES, destName);
    await fs.copyFile(src, dest);
    replaced++;
    console.log(`  ✓ ${destName} <- ${sourceFile}`);
  }

  console.log(`\nReplaced ${replaced} horse photos in images/horses/`);
}

main().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});

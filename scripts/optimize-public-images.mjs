/**
 * public/ 直下の大きな写真・背景画像（PNG/JPEG、1枚 2〜4MB）を WebP に変換する。
 *
 * サイトは next.config.mjs で `images.unoptimized: true` にしており、Vercel の
 * 画像最適化（/_next/image）を通さず public/ のファイルをそのまま配信する。
 * そのため、コードから参照する画像はあらかじめ軽量化した .webp を置いておく。
 *
 *   node scripts/optimize-public-images.mjs
 *
 * - 対象：ページ用の連番画像（1_1.jpg, 6_h.png …）と背景・代表写真
 * - 出力：同じ場所に <元の名前>.webp（長辺 1920px まで、元ファイルは残す）
 * - 画像を追加・差し替えたら再実行し、参照（lib/images.ts など）は .webp を指定する
 */
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const PUBLIC_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "public");
const MAX_WIDTH = 1920;
const QUALITY = 85;

// 連番のページ画像（"1_1.jpg" "2c_3.png" "10_h.png" など）と、名前付きの背景・人物写真
const TARGETS = [/^\d+c?_[\w]+\.(png|jpe?g)$/i, /^(bg|bg-m|contact|contact2)\.png$/i, /^画像２\.jpg$/];

const files = (await fs.readdir(PUBLIC_DIR)).filter((f) => TARGETS.some((re) => re.test(f))).sort();

let before = 0;
let after = 0;
for (const file of files) {
  const src = path.join(PUBLIC_DIR, file);
  const dest = path.join(PUBLIC_DIR, `${path.parse(file).name}.webp`);
  const info = await sharp(src)
    .rotate() // EXIF の向きを反映
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 5 })
    .toFile(dest);
  const { size } = await fs.stat(src);
  before += size;
  after += info.size;
  console.log(
    `${file.padEnd(14)} ${String(Math.round(size / 1024)).padStart(5)}KB -> ${String(Math.round(info.size / 1024)).padStart(4)}KB  ${info.width}x${info.height}`
  );
}
console.log(`\n${files.length} files: ${(before / 1048576).toFixed(1)}MB -> ${(after / 1048576).toFixed(1)}MB`);

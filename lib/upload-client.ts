import { createImageUpload } from "@/app/admin/actions";
import {
  UPLOAD_IMAGE_TYPES,
  UPLOAD_JPEG_QUALITY,
  UPLOAD_MAX_BYTES,
  UPLOAD_MAX_EDGE,
  type UploadBucket,
} from "@/lib/uploads";

// ============================================================================
// 管理画面の画像アップロード（ブラウザ側）
//   1. 大きな写真はブラウザ上で縮小・JPEG 化（スマホ写真は数MB〜10MB超のため）
//   2. サーバーで署名付きアップロードURLを発行（管理者のみ）
//   3. ブラウザからそのURLへ直接アップロード（Vercel を経由しない）
//   4. 公開URLで実際に表示できることを確認してから URL を返す
// ============================================================================

/** これ以下で長辺も収まっている画像は、再圧縮せずそのまま送る。 */
const KEEP_ORIGINAL_BYTES = 600 * 1024;

type Prepared = { blob: Blob; contentType: string };

async function decodeImage(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      // 一部ブラウザ・形式では失敗するため <img> でのデコードにフォールバック
    }
  }
  const url = URL.createObjectURL(file);
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("decode failed"));
      img.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function prepareImage(file: File): Promise<Prepared | { error: string }> {
  const isAllowed = file.type in UPLOAD_IMAGE_TYPES;
  const original: Prepared = { blob: file, contentType: file.type };

  if (/hei[cf]/i.test(file.type) || /\.hei[cf]$/i.test(file.name)) {
    return { error: "HEIC形式の画像は表示できません。JPEGまたはPNGに変換してからアップロードしてください。" };
  }
  // GIF はアニメーションを保つためそのまま送る
  if (file.type === "image/gif") return original;

  // ブラウザが開けないファイル（破損・非対応形式）はサイトでも表示できないので送らない
  let source: ImageBitmap | HTMLImageElement;
  try {
    source = await decodeImage(file);
  } catch {
    return { error: "この画像は読み込めませんでした。JPEG・PNG・WebP の画像を選択してください。" };
  }

  const width = "naturalWidth" in source ? source.naturalWidth : source.width;
  const height = "naturalHeight" in source ? source.naturalHeight : source.height;
  const scale = Math.min(1, UPLOAD_MAX_EDGE / Math.max(width, height));

  if (scale === 1 && isAllowed && file.size <= KEEP_ORIGINAL_BYTES) return original;

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) return isAllowed ? original : { error: "画像を処理できませんでした。" };

  // JPEG は透過を持てないので、透過部分は白で埋める
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  if ("close" in source) source.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", UPLOAD_JPEG_QUALITY)
  );
  if (!blob) return isAllowed ? original : { error: "画像を処理できませんでした。" };

  // 縮小していないのに元より大きくなった場合は元のファイルを使う
  if (scale === 1 && isAllowed && blob.size >= file.size) return original;
  return { blob, contentType: "image/jpeg" };
}

/** 公開URLの画像が実際に読み込めるか（バケットが非公開だとここで失敗する）。 */
function canDisplay(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    // 回線が遅いだけの場合に誤って失敗扱いにしないよう、タイムアウトは成功とみなす
    const timer = window.setTimeout(() => resolve(true), 15000);
    img.onload = () => {
      window.clearTimeout(timer);
      resolve(true);
    };
    img.onerror = () => {
      window.clearTimeout(timer);
      resolve(false);
    };
    img.src = url;
  });
}

/** 画像を Supabase Storage にアップロードし、公開URLを返す。 */
export async function uploadImage(
  file: File,
  bucket: UploadBucket
): Promise<{ url?: string; error?: string }> {
  try {
    const prepared = await prepareImage(file);
    if ("error" in prepared) return prepared;
    if (prepared.blob.size > UPLOAD_MAX_BYTES) {
      return { error: `画像サイズが大きすぎます（${Math.round(UPLOAD_MAX_BYTES / 1024 / 1024)}MBまで）。` };
    }

    const ticket = await createImageUpload({ bucket, contentType: prepared.contentType });
    if (!ticket.signedUrl) return { error: ticket.error ?? "アップロードを開始できませんでした。" };

    // 署名付きURLはそれ自体が認可を含むので、Supabase の API キーをブラウザに
    // 持たせずに送れる（supabase-js の uploadToSignedUrl と同じリクエスト形式）。
    const body = new FormData();
    // ファイル名は毎回ユニークなので長期キャッシュで問題ない
    body.append("cacheControl", "31536000");
    body.append("", prepared.blob);
    const res = await fetch(ticket.signedUrl, { method: "PUT", headers: { "x-upsert": "false" }, body });
    if (!res.ok) {
      const detail = await res
        .json()
        .then((j: { message?: string; error?: string }) => j.message ?? j.error)
        .catch(() => null);
      return { error: `Supabase への保存に失敗しました（${detail ?? `HTTP ${res.status}`}）` };
    }

    if (!(await canDisplay(ticket.publicUrl))) {
      return {
        error:
          "アップロードは完了しましたが、画像を表示できませんでした。Supabase Storage のバケットが「Public」になっているか確認してください。",
      };
    }
    return { url: ticket.publicUrl };
  } catch (e) {
    return {
      error: `アップロードに失敗しました（${e instanceof Error ? e.message : "通信エラー"}）。時間をおいて再度お試しください。`,
    };
  }
}

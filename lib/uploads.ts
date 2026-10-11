// 管理画面の画像アップロード設定（クライアント・サーバー共通）。
// 画像はブラウザから Supabase Storage の公開バケットへ直接アップロードする。

export const UPLOAD_BUCKETS = ["news-images", "horse-images", "media-image"] as const;
export type UploadBucket = (typeof UPLOAD_BUCKETS)[number];

/** 受け付ける画像形式 → 保存時の拡張子。 */
export const UPLOAD_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

/** アップロード前に縮小する際の長辺（px）。サイト上の最大表示幅の約2倍。 */
export const UPLOAD_MAX_EDGE = 1600;
export const UPLOAD_JPEG_QUALITY = 0.85;

/** 縮小後でもこれを超えるファイルは受け付けない。 */
export const UPLOAD_MAX_BYTES = 8 * 1024 * 1024;

"use client";

import { useRef, useState } from "react";
import { uploadImage } from "@/lib/upload-client";
import type { UploadBucket } from "@/lib/uploads";

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";
const inputClass =
  "w-full rounded-xl border border-white/10 bg-brand-950/50 px-4 py-3 text-sm text-white outline-none ring-gold focus:ring-2";

type CommonProps = {
  bucket: UploadBucket;
  disabled?: boolean;
  /** アップロード中は保存ボタンを止めるために親へ通知する */
  onBusyChange?: (busy: boolean) => void;
  onMessage: (msg: string | null) => void;
};

/** クリック／ドラッグ＆ドロップで画像を受け取る枠。 */
function DropZone({
  multiple = false,
  disabled = false,
  busyLabel,
  hint,
  onFiles,
}: {
  multiple?: boolean;
  disabled?: boolean;
  busyLabel?: string | null;
  hint: string;
  onFiles: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  // 画像以外が混ざっていても、ここでは弾かずアップロード処理側でエラー文言を出す
  const take = (list: FileList | null) => {
    const files = Array.from(list ?? []);
    if (files.length) onFiles(multiple ? files : files.slice(0, 1));
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (!disabled) take(e.dataTransfer.files);
      }}
      className={`rounded-xl border border-dashed px-4 py-5 text-center transition ${
        dragging ? "border-gold bg-gold/10" : "border-white/20 bg-brand-950/40"
      } ${disabled ? "opacity-50" : ""}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          take(e.target.files);
          // 同じファイルを選び直せるようにリセット
          e.target.value = "";
        }}
      />
      {busyLabel ? (
        <p className="text-sm text-brand-100">{busyLabel}</p>
      ) : (
        <>
          <button
            type="button"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            className="rounded-lg bg-gold px-4 py-2 text-xs font-semibold text-white hover:brightness-110 disabled:cursor-not-allowed"
          >
            画像を選択
          </button>
          <p className="mt-2 text-xs text-brand-300">{hint}</p>
        </>
      )}
    </div>
  );
}

/** 画像1枚の入力欄（お知らせ・メディア掲載）。 */
export function ImageField({
  label = "画像",
  value,
  onChange,
  bucket,
  disabled = false,
  onBusyChange,
  onMessage,
  urlPlaceholder = "https://...",
}: CommonProps & {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  urlPlaceholder?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [showUrl, setShowUrl] = useState(false);

  const upload = async ([file]: File[]) => {
    setBusy(true);
    onBusyChange?.(true);
    const result = await uploadImage(file, bucket);
    setBusy(false);
    onBusyChange?.(false);
    if (result.url) {
      onChange(result.url);
      onMessage(null);
    } else {
      onMessage(`画像アップロードエラー: ${result.error}`);
    }
  };

  return (
    <div>
      <p className="mb-1.5 text-sm text-brand-100">{label}</p>
      {value && (
        <div className="relative mb-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="プレビュー" className="h-36 w-full rounded-xl object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            disabled={disabled || busy}
            className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white hover:bg-black/80"
          >
            ✕ 削除
          </button>
        </div>
      )}
      <DropZone
        disabled={disabled || busy}
        busyLabel={busy ? "アップロード中…" : null}
        hint="またはここに画像をドラッグ＆ドロップ（JPEG・PNG・WebP）"
        onFiles={upload}
      />
      <button
        type="button"
        onClick={() => setShowUrl((v) => !v)}
        className="mt-2 text-xs text-brand-300 underline-offset-2 hover:text-brand-100 hover:underline"
      >
        {showUrl ? "URL入力を閉じる" : "画像URLを直接指定する"}
      </button>
      {showUrl && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={urlPlaceholder}
          className={`mt-1.5 ${inputClass}`}
        />
      )}
    </div>
  );
}

/** 複数枚の写真入力欄（馬の写真）。先頭の1枚がメイン写真になる。 */
export function PhotoListField({
  label = "写真",
  value,
  onChange,
  max,
  bucket,
  disabled = false,
  onBusyChange,
  onMessage,
}: CommonProps & {
  label?: string;
  value: string[];
  onChange: (photos: string[]) => void;
  max: number;
}) {
  const [progress, setProgress] = useState<string | null>(null);
  const [showUrl, setShowUrl] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");
  const busy = progress !== null;
  const remaining = max - value.length;

  const upload = async (files: File[]) => {
    const batch = files.slice(0, remaining);
    const skipped = files.length - batch.length;
    let photos = value;
    const errors: string[] = [];

    onBusyChange?.(true);
    for (let i = 0; i < batch.length; i++) {
      setProgress(`アップロード中… ${i + 1} / ${batch.length}枚`);
      const result = await uploadImage(batch[i], bucket);
      if (result.url) {
        photos = [...photos, result.url];
        onChange(photos);
      } else {
        errors.push(`${batch[i].name}: ${result.error}`);
      }
    }
    setProgress(null);
    onBusyChange?.(false);

    if (skipped > 0) errors.push(`写真は${max}枚までのため、${skipped}枚は追加されませんでした。`);
    onMessage(errors.length ? `画像アップロードエラー: ${errors.join(" ／ ")}` : null);
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    next.splice(to, 0, next.splice(from, 1)[0]);
    onChange(next);
  };

  const addUrl = () => {
    const url = urlDraft.trim();
    if (!url || remaining <= 0) return;
    if (!value.includes(url)) onChange([...value, url]);
    setUrlDraft("");
  };

  const controlClass =
    "rounded bg-black/60 px-1.5 py-0.5 text-[11px] leading-none text-white hover:bg-black/80 disabled:opacity-30";

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <p className="text-sm text-brand-100">{label}</p>
        <p className="text-xs text-brand-300">
          {value.length} / {max}枚
        </p>
      </div>

      {value.length > 0 && (
        <ul className="mb-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {value.map((url, i) => (
            <li key={url} className="relative aspect-square overflow-hidden rounded-lg bg-brand-950/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`写真${i + 1}`} className="h-full w-full object-cover" />
              {i === 0 && (
                <span className="absolute left-1 top-1 rounded bg-gold px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                  メイン
                </span>
              )}
              <button
                type="button"
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                disabled={disabled || busy}
                aria-label={`写真${i + 1}を削除`}
                className={`absolute right-1 top-1 ${controlClass}`}
              >
                ✕
              </button>
              <div className="absolute inset-x-1 bottom-1 flex justify-between">
                <button
                  type="button"
                  onClick={() => move(i, i - 1)}
                  disabled={disabled || busy || i === 0}
                  aria-label={`写真${i + 1}を前へ`}
                  className={controlClass}
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => move(i, i + 1)}
                  disabled={disabled || busy || i === value.length - 1}
                  aria-label={`写真${i + 1}を後ろへ`}
                  className={controlClass}
                >
                  →
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {remaining > 0 ? (
        <DropZone
          multiple
          disabled={disabled || busy}
          busyLabel={progress}
          hint={`またはここにドラッグ＆ドロップ（複数選択可・あと${remaining}枚）`}
          onFiles={upload}
        />
      ) : (
        <p className="rounded-xl border border-white/10 bg-brand-950/40 px-4 py-3 text-xs text-brand-300">
          上限の{max}枚に達しています。差し替える場合は不要な写真を削除してください。
        </p>
      )}

      <p className="mt-2 text-xs text-brand-300">
        先頭の写真が一覧ページなどに表示されるメイン写真です。← → で並び替えできます。
      </p>

      {remaining > 0 && (
        <>
          <button
            type="button"
            onClick={() => setShowUrl((v) => !v)}
            className="mt-1 text-xs text-brand-300 underline-offset-2 hover:text-brand-100 hover:underline"
          >
            {showUrl ? "URL入力を閉じる" : "画像URLを直接指定する"}
          </button>
          {showUrl && (
            <div className="mt-1.5 flex gap-2">
              <input
                type="text"
                value={urlDraft}
                onChange={(e) => setUrlDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addUrl();
                  }
                }}
                placeholder="https://..."
                className={inputClass}
              />
              <button
                type="button"
                onClick={addUrl}
                disabled={disabled || busy || !urlDraft.trim()}
                className="shrink-0 rounded-xl bg-white/10 px-4 text-xs font-semibold text-white hover:bg-white/15 disabled:opacity-40"
              >
                追加
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

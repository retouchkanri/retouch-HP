"use client";

import { useState, useTransition, useMemo } from "react";
import type { DbFaqItem, DbHorse, DbMediaItem, DbNewsItem } from "@/lib/content";
import {
  deleteMedia,
  deleteNews,
  deleteHorse,
  deleteFaq,
  saveMedia,
  saveNews,
  saveHorse,
  saveFaq,
  seedDatabase,
  signOut,
  uploadImage,
} from "@/app/admin/actions";

type Props = {
  news: DbNewsItem[];
  media: DbMediaItem[];
  horses: DbHorse[];
  faq: DbFaqItem[];
  dbReady: boolean;
};

const emptyNews = { date: "", category: "", title: "", img: "", body: "", linkUrl: "" };
const emptyMedia = {
  outlet: "",
  date: "",
  title: "",
  img: "",
  url: "",
  imgAlt: "",
  mediaType: "",
  sortOrder: "0",
};

export default function AdminDashboard({ news, media, horses, faq, dbReady }: Props) {
  const [tab, setTab] = useState<"news" | "media" | "horses" | "faq">("news");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSeed = () => {
    startTransition(async () => {
      const result = await seedDatabase();
      setMessage(result.error ? `エラー: ${result.error}` : "初期データを投入しました。");
    });
  };

  return (
    <div className="container-x py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="eyebrow !text-gold">ADMIN</p>
          <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">コンテンツ管理</h1>
        </div>
        <form action={signOut}>
          <button type="submit" className="btn-outline !border-white/20 !text-white hover:!bg-white/10">
            ログアウト
          </button>
        </form>
      </div>

      {!dbReady && (
        <div className="mt-8 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-6">
          <h2 className="text-lg font-semibold text-amber-100">データベースのセットアップが必要です</h2>
          <p className="mt-3 text-sm leading-relaxed text-amber-50/90">
            Supabase ダッシュボードの SQL Editor で{" "}
            <code className="rounded bg-black/30 px-1.5 py-0.5">supabase/schema.sql</code>{" "}
            の内容を実行してください。その後、このページを再読み込みし「初期データを投入」を押してください。
          </p>
          <button
            type="button"
            onClick={handleSeed}
            disabled={pending}
            className="btn-gold mt-5 disabled:opacity-60"
          >
            初期データを投入
          </button>
        </div>
      )}

      {dbReady && (news.length === 0 || media.length === 0 || horses.length === 0 || faq.length === 0) && (
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-brand-100">
            一部のテーブルが空です。既存のサイトデータを投入できます。
          </p>
          <button
            type="button"
            onClick={handleSeed}
            disabled={pending}
            className="btn-gold mt-4 disabled:opacity-60"
          >
            初期データを投入
          </button>
        </div>
      )}

      {message && (
        <p className="mt-6 rounded-xl bg-white/10 px-4 py-3 text-sm text-brand-50">{message}</p>
      )}

      <div className="mt-8 flex flex-wrap gap-2">
        {(["news", "horses", "faq", "media"] as const).map((t) => {
          const labels = { news: "お知らせ", horses: "馬", faq: "FAQ", media: "メディア掲載" };
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                tab === t ? "bg-gold text-white" : "bg-white/10 text-brand-100 hover:bg-white/15"
              }`}
            >
              {labels[t]}
            </button>
          );
        })}
      </div>

      {tab === "news" && <NewsPanel items={news} onMessage={setMessage} />}
      {tab === "media" && <MediaPanel items={media} onMessage={setMessage} />}
      {tab === "horses" && <HorsePanel items={horses} onMessage={setMessage} />}
      {tab === "faq" && <FaqPanel items={faq} onMessage={setMessage} />}
    </div>
  );
}

function NewsPanel({
  items,
  onMessage,
}: {
  items: DbNewsItem[];
  onMessage: (msg: string | null) => void;
}) {
  const [editing, setEditing] = useState<DbNewsItem | null>(null);
  const [form, setForm] = useState(emptyNews);
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);

  const openNew = () => {
    setEditing(null);
    setForm(emptyNews);
  };

  const openEdit = (item: DbNewsItem) => {
    setEditing(item);
    setForm({
      date: item.date,
      category: item.category,
      title: item.title,
      img: item.img ?? "",
      body: item.body ?? "",
      linkUrl: item.linkUrl ?? "",
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("bucket", "news-images");
    const result = await uploadImage(fd);
    setUploading(false);
    if (result.error) {
      onMessage(`画像アップロードエラー: ${result.error}`);
    } else if (result.url) {
      setForm((f) => ({ ...f, img: result.url! }));
      onMessage(null);
    }
    // Reset file input so the same file can be re-selected if needed
    e.target.value = "";
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (editing) fd.set("id", editing.id);
    // Sync controlled img/body/linkUrl values into FormData
    fd.set("img", form.img);
    fd.set("body", form.body);
    fd.set("linkUrl", form.linkUrl);
    startTransition(async () => {
      const result = await saveNews(fd);
      onMessage(result?.error ? `エラー: ${result.error}` : "お知らせを保存しました。");
      if (!result?.error) {
        setForm(emptyNews);
        setEditing(null);
      }
    });
  };

  const remove = (id: string) => {
    if (!confirm("このお知らせを削除しますか？")) return;
    startTransition(async () => {
      const result = await deleteNews(id);
      onMessage(result?.error ? `エラー: ${result.error}` : "削除しました。");
    });
  };

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      {/* List */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-white">一覧</h2>
          <button type="button" onClick={openNew} className="text-sm font-semibold text-gold">
            ＋ 新規
          </button>
        </div>
        <ul className="divide-y divide-white/10">
          {items.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-3 py-4">
              <button type="button" onClick={() => openEdit(item)} className="flex items-start gap-3 text-left">
                {item.img && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.img}
                    alt=""
                    className="h-12 w-16 shrink-0 rounded-lg object-cover"
                  />
                )}
                <div>
                  <p className="text-xs text-brand-200">
                    {item.date} ｜ {item.category}
                  </p>
                  <p className="mt-1 text-sm text-white line-clamp-2">{item.title}</p>
                  {item.body && (
                    <p className="mt-0.5 text-xs text-brand-300 line-clamp-1">{item.body}</p>
                  )}
                </div>
              </button>
              <button
                type="button"
                onClick={() => remove(item.id)}
                className="shrink-0 text-xs text-red-300 hover:text-red-200"
              >
                削除
              </button>
            </li>
          ))}
          {!items.length && <li className="py-6 text-sm text-brand-200">データがありません。</li>}
        </ul>
      </div>

      {/* Edit / Create form */}
      <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-5">
        <h2 className="font-semibold text-white">{editing ? "編集" : "新規作成"}</h2>
        {!editing && (
          <p className="text-xs text-brand-300">タイトルのみ入力すれば保存できます。日付・カテゴリは未入力時に自動設定されます。</p>
        )}

        {/* Image */}
        <div>
          <p className="mb-1.5 text-sm text-brand-100">画像</p>
          {form.img && (
            <div className="relative mb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.img}
                alt="プレビュー"
                className="h-36 w-full rounded-xl object-cover"
              />
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, img: "" }))}
                className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white hover:bg-black/80"
              >
                ✕ 削除
              </button>
            </div>
          )}
          <label className="mb-1 block text-xs text-brand-300">ファイルをアップロード</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading || pending}
            className="w-full rounded-xl border border-white/10 bg-brand-950/50 px-3 py-2.5 text-sm text-white
              file:mr-3 file:rounded-lg file:border-0 file:bg-gold file:px-3 file:py-1
              file:text-xs file:font-semibold file:text-white file:cursor-pointer
              disabled:opacity-50"
          />
          {uploading && (
            <p className="mt-1 text-xs text-brand-200">アップロード中…</p>
          )}
          <label className="mt-2 mb-1 block text-xs text-brand-300">または画像 URL を直接入力</label>
          <input
            type="text"
            name="img"
            value={form.img}
            onChange={(e) => setForm((f) => ({ ...f, img: e.target.value }))}
            placeholder="https://... または /images/news.jpg"
            className="w-full rounded-xl border border-white/10 bg-brand-950/50 px-4 py-3 text-sm text-white outline-none ring-gold focus:ring-2"
          />
        </div>

        <Field
          label="日付"
          name="date"
          value={form.date}
          onChange={(v) => setForm({ ...form, date: v })}
          placeholder="2026.05.20"
          optional
        />
        <Field
          label="カテゴリ"
          name="category"
          value={form.category}
          onChange={(v) => setForm({ ...form, category: v })}
          placeholder="お知らせ"
          optional
        />
        <Field
          label="タイトル"
          name="title"
          value={form.title}
          onChange={(v) => setForm({ ...form, title: v })}
          placeholder="タイトルを入力"
          required
        />

        {/* Body text */}
        <div>
          <label className="mb-1.5 block text-sm text-brand-100">
            本文
            <span className="ml-2 text-xs font-normal text-brand-300">（任意）</span>
          </label>
          <textarea
            name="body"
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            placeholder="お知らせの詳細を入力…"
            rows={5}
            className="w-full resize-y rounded-xl border border-white/10 bg-brand-950/50 px-4 py-3 text-sm text-white outline-none ring-gold focus:ring-2"
          />
        </div>

        {/* Link URL */}
        <div>
          <label className="mb-1.5 block text-sm text-brand-100">
            リンク URL
            <span className="ml-2 text-xs font-normal text-brand-300">（任意）</span>
          </label>
          <input
            type="url"
            name="linkUrl"
            value={form.linkUrl}
            onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
            placeholder="https://example.com/article"
            className="w-full rounded-xl border border-white/10 bg-brand-950/50 px-4 py-3 text-sm text-white outline-none ring-gold focus:ring-2"
          />
        </div>

        <button type="submit" disabled={pending || uploading} className="btn-gold w-full disabled:opacity-60">
          {pending ? "保存中…" : "保存"}
        </button>
      </form>
    </div>
  );
}

function MediaPanel({
  items,
  onMessage,
}: {
  items: DbMediaItem[];
  onMessage: (msg: string | null) => void;
}) {
  const [editing, setEditing] = useState<DbMediaItem | null>(null);
  const [form, setForm] = useState(emptyMedia);
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);

  const openNew = () => {
    setEditing(null);
    setForm(emptyMedia);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("bucket", "media-image");
    const result = await uploadImage(fd);
    setUploading(false);
    if (result.error) onMessage(`画像アップロードエラー: ${result.error}`);
    else if (result.url) {
      setForm((f) => ({ ...f, img: result.url! }));
      onMessage(null);
    }
    e.target.value = "";
  };

  const openEdit = (item: DbMediaItem) => {
    setEditing(item);
    setForm({
      outlet: item.outlet,
      date: item.date,
      title: item.title,
      img: item.img,
      url: item.url ?? "",
      imgAlt: item.imgAlt ?? "",
      mediaType: item.mediaType ?? "",
      sortOrder: String(items.indexOf(item)),
    });
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (editing) fd.set("id", editing.id);
    fd.set("img", form.img);
    startTransition(async () => {
      const result = await saveMedia(fd);
      onMessage(result?.error ? `エラー: ${result.error}` : "メディア情報を保存しました。");
      if (!result?.error) {
        setForm(emptyMedia);
        setEditing(null);
      }
    });
  };

  const remove = (id: string) => {
    if (!confirm("このメディア掲載を削除しますか？")) return;
    startTransition(async () => {
      const result = await deleteMedia(id);
      onMessage(result?.error ? `エラー: ${result.error}` : "削除しました。");
    });
  };

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-white">一覧</h2>
          <button type="button" onClick={openNew} className="text-sm font-semibold text-gold">
            ＋ 新規
          </button>
        </div>
        <ul className="divide-y divide-white/10">
          {items.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-3 py-4">
              <button type="button" onClick={() => openEdit(item)} className="text-left">
                <p className="text-xs text-brand-200">
                  {item.date} ｜ {item.outlet}
                </p>
                <p className="mt-1 text-sm text-white">{item.title}</p>
              </button>
              <button
                type="button"
                onClick={() => remove(item.id)}
                className="shrink-0 text-xs text-red-300 hover:text-red-200"
              >
                削除
              </button>
            </li>
          ))}
          {!items.length && <li className="py-6 text-sm text-brand-200">データがありません。</li>}
        </ul>
      </div>

      <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
        <h2 className="font-semibold text-white">{editing ? "編集" : "新規作成"}</h2>
        {!editing && (
          <p className="text-xs text-brand-300">タイトルのみ入力すれば保存できます。その他は未入力時に仮の値が入ります。</p>
        )}
        <Field label="媒体名" name="outlet" value={form.outlet} onChange={(v) => setForm({ ...form, outlet: v })} optional />
        <Field label="日付" name="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} optional />
        <Field label="タイトル" name="title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />

        {/* Image */}
        <div>
          <p className="mb-1.5 text-sm text-brand-100">画像</p>
          {form.img && (
            <div className="relative mb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.img} alt="プレビュー" className="h-36 w-full rounded-xl object-cover" />
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, img: "" }))}
                className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white hover:bg-black/80"
              >
                ✕ 削除
              </button>
            </div>
          )}
          <label className="mb-1 block text-xs text-brand-300">ファイルをアップロード</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading || pending}
            className="w-full rounded-xl border border-white/10 bg-brand-950/50 px-3 py-2.5 text-sm text-white
              file:mr-3 file:rounded-lg file:border-0 file:bg-gold file:px-3 file:py-1
              file:text-xs file:font-semibold file:text-white file:cursor-pointer disabled:opacity-50"
          />
          {uploading && <p className="mt-1 text-xs text-brand-200">アップロード中…</p>}
          <label className="mt-2 mb-1 block text-xs text-brand-300">または画像 URL を直接入力</label>
          <input
            type="text"
            name="img"
            value={form.img}
            onChange={(e) => setForm((f) => ({ ...f, img: e.target.value }))}
            placeholder="https://... または /media/media-example.jpg"
            className="w-full rounded-xl border border-white/10 bg-brand-950/50 px-4 py-3 text-sm text-white outline-none ring-gold focus:ring-2"
          />
        </div>

        <Field label="URL" name="url" value={form.url} onChange={(v) => setForm({ ...form, url: v })} optional />
        <Field label="画像 alt" name="imgAlt" value={form.imgAlt} onChange={(v) => setForm({ ...form, imgAlt: v })} optional />
        <Field label="媒体種別" name="mediaType" value={form.mediaType} onChange={(v) => setForm({ ...form, mediaType: v })} optional />
        <Field label="表示順" name="sortOrder" value={form.sortOrder} onChange={(v) => setForm({ ...form, sortOrder: v })} optional />
        <button type="submit" disabled={pending || uploading} className="btn-gold disabled:opacity-60">
          {pending ? "保存中…" : "保存"}
        </button>
      </form>
    </div>
  );
}

// ============================================================================
// HorsePanel
// ============================================================================

const emptyHorse = {
  name: "", slug: "", sex: "", age: "", status: "protected", statusLabel: "現在の保護馬",
  orderNum: "", personality: "", story: "", beforeStory: "", photo: "",
  ownerStory: "", sortOrder: "0", goal: "0", raised: "0", supporters: "0", note: "",
};

function horseToForm(item: DbHorse) {
  return {
    name: item.name,
    slug: item.slug,
    sex: item.sex ?? "",
    age: item.age ?? "",
    status: item.status,
    statusLabel: item.statusLabel,
    orderNum: String(item.orderNum ?? ""),
    personality: item.personality ?? "",
    story: item.story ?? "",
    beforeStory: item.before ?? "",
    photo: item.photo ?? "",
    ownerStory: item.ownerStory ?? "",
    sortOrder: String(item.sortOrder),
    goal: String(item.goal),
    raised: String(item.raised),
    supporters: String(item.supporters),
    note: item.note ?? "",
  };
}

function horseFormToFormData(form: typeof emptyHorse, id?: string) {
  const fd = new FormData();
  if (id) fd.set("id", id);
  fd.set("name", form.name);
  fd.set("slug", form.slug);
  fd.set("sex", form.sex);
  fd.set("age", form.age);
  fd.set("status", form.status);
  fd.set("statusLabel", form.statusLabel);
  fd.set("orderNum", form.orderNum);
  fd.set("personality", form.personality);
  fd.set("story", form.story);
  fd.set("beforeStory", form.beforeStory);
  fd.set("photo", form.photo);
  fd.set("ownerStory", form.ownerStory);
  fd.set("sortOrder", form.sortOrder);
  fd.set("goal", form.goal);
  fd.set("raised", form.raised);
  fd.set("supporters", form.supporters);
  fd.set("note", form.note);
  return fd;
}

function HorsePanel({
  items,
  onMessage,
}: {
  items: DbHorse[];
  onMessage: (msg: string | null) => void;
}) {
  const [editing, setEditing] = useState<DbHorse | null>(null);
  const [form, setForm] = useState(emptyHorse);
  const [baseline, setBaseline] = useState(emptyHorse);
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);

  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(baseline),
    [form, baseline]
  );

  const openNew = () => {
    setEditing(null);
    setForm(emptyHorse);
    setBaseline(emptyHorse);
  };

  const openEdit = (item: DbHorse) => {
    const next = horseToForm(item);
    setEditing(item);
    setForm(next);
    setBaseline(next);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("bucket", "horse-images");
    const result = await uploadImage(fd);
    setUploading(false);
    if (result.error) onMessage(`画像アップロードエラー: ${result.error}`);
    else if (result.url) setForm((f) => ({ ...f, photo: result.url! }));
    e.target.value = "";
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isDirty) return;
    const fd = horseFormToFormData(form, editing?.id);
    startTransition(async () => {
      const result = await saveHorse(fd);
      onMessage(result?.error ? `エラー: ${result.error}` : "馬情報を保存しました。");
      if (!result?.error) {
        setForm(emptyHorse);
        setBaseline(emptyHorse);
        setEditing(null);
      }
    });
  };

  const remove = (id: string) => {
    if (!confirm("この馬のデータを削除しますか？")) return;
    startTransition(async () => {
      const result = await deleteHorse(id);
      onMessage(result?.error ? `エラー: ${result.error}` : "削除しました。");
    });
  };

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      {/* List */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-white">一覧 ({items.length}頭)</h2>
          <button type="button" onClick={openNew} className="text-sm font-semibold text-gold">＋ 新規</button>
        </div>
        <ul className="divide-y divide-white/10 max-h-[60vh] overflow-y-auto">
          {items.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-3 py-3">
              <button type="button" onClick={() => openEdit(item)} className="flex items-start gap-3 text-left min-w-0">
                {item.photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.photo} alt="" className="h-10 w-12 shrink-0 rounded-lg object-cover" />
                )}
                <div className="min-w-0">
                  <p className="text-xs text-brand-200 truncate">{item.statusLabel} ｜ {item.sex ?? "性別不明"}</p>
                  <p className="mt-0.5 text-sm font-semibold text-white">{item.name}</p>
                  {item.note && <p className="mt-0.5 text-xs text-brand-300 line-clamp-1">{item.note}</p>}
                </div>
              </button>
              <button type="button" onClick={() => remove(item.id)} className="shrink-0 text-xs text-red-300 hover:text-red-200">削除</button>
            </li>
          ))}
          {!items.length && <li className="py-6 text-sm text-brand-200">データがありません。</li>}
        </ul>
      </div>

      {/* Form */}
      <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4 max-h-[80vh] overflow-y-auto">
        <h2 className="font-semibold text-white sticky top-0 bg-brand-950/95 py-1">{editing ? "編集" : "新規作成"}</h2>
        {!editing && (
          <p className="text-xs text-brand-300">任意の項目を入力して保存できます。未入力の項目は空のまま登録されます。</p>
        )}

        {/* Photo */}
        <div>
          <p className="mb-1.5 text-sm text-brand-100">写真</p>
          {form.photo && (
            <div className="relative mb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.photo} alt="プレビュー" className="h-32 w-full rounded-xl object-cover" />
              <button type="button" onClick={() => setForm((f) => ({ ...f, photo: "" }))}
                className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white hover:bg-black/80">
                ✕ 削除
              </button>
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading || pending}
            className="w-full rounded-xl border border-white/10 bg-brand-950/50 px-3 py-2.5 text-sm text-white
              file:mr-3 file:rounded-lg file:border-0 file:bg-gold file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white file:cursor-pointer disabled:opacity-50" />
          {uploading && <p className="mt-1 text-xs text-brand-200">アップロード中…</p>}
          <label className="mt-2 mb-1 block text-xs text-brand-300">または画像 URL</label>
          <input type="text" name="photo" value={form.photo} onChange={(e) => setForm((f) => ({ ...f, photo: e.target.value }))}
            placeholder="https://..." className="w-full rounded-xl border border-white/10 bg-brand-950/50 px-4 py-3 text-sm text-white outline-none ring-gold focus:ring-2" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="馬名" name="name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="ハル号" optional />
          <Field label="スラッグ" name="slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} placeholder="haru（空欄で自動生成）" optional />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm text-brand-100">性別</label>
            <select name="sex" value={form.sex} onChange={(e) => setForm({ ...form, sex: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-brand-950/50 px-4 py-3 text-sm text-white outline-none ring-gold focus:ring-2">
              <option value="">不明</option>
              <option value="牡">牡</option>
              <option value="牝">牝</option>
              <option value="騙">騙</option>
            </select>
          </div>
          <Field label="年齢" name="age" value={form.age} onChange={(v) => setForm({ ...form, age: v })} placeholder="不明" optional />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm text-brand-100">ステータス</label>
            <select name="status" value={form.status} onChange={(e) => {
              const s = e.target.value;
              const label = s === "protected" ? "現在の保護馬" : s === "graduated" ? "卒業馬" : "オーナー決定馬";
              setForm({ ...form, status: s, statusLabel: label });
            }} className="w-full rounded-xl border border-white/10 bg-brand-950/50 px-4 py-3 text-sm text-white outline-none ring-gold focus:ring-2">
              <option value="protected">現在の保護馬</option>
              <option value="graduated">卒業馬</option>
              <option value="owner">オーナー決定馬</option>
            </select>
          </div>
          <Field label="ステータスラベル" name="statusLabel" value={form.statusLabel} onChange={(v) => setForm({ ...form, statusLabel: v })} optional />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="肥育場番号" name="orderNum" value={form.orderNum} onChange={(v) => setForm({ ...form, orderNum: v })} placeholder="16" optional />
          <Field label="表示順" name="sortOrder" value={form.sortOrder} onChange={(v) => setForm({ ...form, sortOrder: v })} optional />
        </div>

        <Field label="性格・特徴" name="personality" value={form.personality} onChange={(v) => setForm({ ...form, personality: v })} placeholder="穏やか・人なつっこい" optional />

        <Textarea label="現在の様子（story）" name="story" value={form.story} onChange={(v) => setForm({ ...form, story: v })} rows={3} optional />
        <Textarea label="保護前の様子（before）" name="beforeStory" value={form.beforeStory} onChange={(v) => setForm({ ...form, beforeStory: v })} rows={2} optional />
        <Textarea label="支援が必要な理由（note）" name="note" value={form.note} onChange={(v) => setForm({ ...form, note: v })} rows={2} optional />
        <Textarea label="オーナーストーリー" name="ownerStory" value={form.ownerStory} onChange={(v) => setForm({ ...form, ownerStory: v })} rows={2} optional />

        <p className="text-xs font-semibold text-brand-200 pt-2">支援データ</p>
        <div className="grid grid-cols-3 gap-3">
          <Field label="月間目標額（円）" name="goal" value={form.goal} onChange={(v) => setForm({ ...form, goal: v })} placeholder="200000" optional />
          <Field label="現在の支援額（円）" name="raised" value={form.raised} onChange={(v) => setForm({ ...form, raised: v })} placeholder="58000" optional />
          <Field label="支援者数" name="supporters" value={form.supporters} onChange={(v) => setForm({ ...form, supporters: v })} placeholder="22" optional />
        </div>

        <button
          type="submit"
          disabled={pending || uploading || !isDirty}
          className="btn-gold w-full disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? "保存中…" : "保存"}
        </button>
      </form>
    </div>
  );
}

// ============================================================================
// FaqPanel
// ============================================================================

const emptyFaq = { question: "", answer: "", sortOrder: "0" };

function FaqPanel({
  items,
  onMessage,
}: {
  items: DbFaqItem[];
  onMessage: (msg: string | null) => void;
}) {
  const [editing, setEditing] = useState<DbFaqItem | null>(null);
  const [form, setForm] = useState(emptyFaq);
  const [pending, startTransition] = useTransition();

  const openNew = () => { setEditing(null); setForm(emptyFaq); };
  const openEdit = (item: DbFaqItem) => {
    setEditing(item);
    setForm({ question: item.question, answer: item.answer, sortOrder: String(item.sortOrder) });
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (editing) fd.set("id", editing.id);
    startTransition(async () => {
      const result = await saveFaq(fd);
      onMessage(result?.error ? `エラー: ${result.error}` : "FAQを保存しました。");
      if (!result?.error) { setForm(emptyFaq); setEditing(null); }
    });
  };

  const remove = (id: string) => {
    if (!confirm("このFAQを削除しますか？")) return;
    startTransition(async () => {
      const result = await deleteFaq(id);
      onMessage(result?.error ? `エラー: ${result.error}` : "削除しました。");
    });
  };

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-white">一覧 ({items.length}件)</h2>
          <button type="button" onClick={openNew} className="text-sm font-semibold text-gold">＋ 新規</button>
        </div>
        <ul className="divide-y divide-white/10 max-h-[60vh] overflow-y-auto">
          {items.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-3 py-3">
              <button type="button" onClick={() => openEdit(item)} className="text-left min-w-0">
                <p className="text-sm text-white line-clamp-2">{item.question}</p>
                <p className="mt-0.5 text-xs text-brand-300 line-clamp-1">{item.answer}</p>
              </button>
              <button type="button" onClick={() => remove(item.id)} className="shrink-0 text-xs text-red-300 hover:text-red-200">削除</button>
            </li>
          ))}
          {!items.length && <li className="py-6 text-sm text-brand-200">データがありません。</li>}
        </ul>
      </div>

      <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
        <h2 className="font-semibold text-white">{editing ? "編集" : "新規作成"}</h2>
        {!editing && (
          <p className="text-xs text-brand-300">質問だけ入力すれば保存できます。回答は後から追記できます。</p>
        )}
        <div>
          <label className="mb-1.5 block text-sm text-brand-100">質問</label>
          <input name="question" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} required
            placeholder="質問を入力" className="w-full rounded-xl border border-white/10 bg-brand-950/50 px-4 py-3 text-sm text-white outline-none ring-gold focus:ring-2" />
        </div>
        <Textarea label="回答" name="answer" value={form.answer} onChange={(v) => setForm({ ...form, answer: v })} rows={5} optional />
        <Field label="表示順" name="sortOrder" value={form.sortOrder} onChange={(v) => setForm({ ...form, sortOrder: v })} optional />
        <button type="submit" disabled={pending} className="btn-gold w-full disabled:opacity-60">
          {pending ? "保存中…" : "保存"}
        </button>
      </form>
    </div>
  );
}

function Textarea({
  label, name, value, onChange, rows = 4, optional = false,
}: {
  label: string; name: string; value: string; onChange: (v: string) => void; rows?: number; optional?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-brand-100">
        {label}
        {optional && <span className="ml-2 text-xs font-normal text-brand-300">（任意）</span>}
      </label>
      <textarea name={name} value={value} onChange={(e) => onChange(e.target.value)} rows={rows}
        className="w-full resize-y rounded-xl border border-white/10 bg-brand-950/50 px-4 py-3 text-sm text-white outline-none ring-gold focus:ring-2" />
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  optional = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm text-brand-100">
        {label}
        {optional && <span className="ml-2 text-xs font-normal text-brand-300">（任意）</span>}
      </label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-brand-950/50 px-4 py-3 text-sm text-white outline-none ring-gold focus:ring-2"
      />
    </div>
  );
}

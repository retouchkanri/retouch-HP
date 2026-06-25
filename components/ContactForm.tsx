"use client";

import { useState } from "react";

const TOPICS = [
  "会員・支援について",
  "一口オーナー制度",
  "法人協賛・スポンサー",
  "行政・乗馬クラブ・観光牧場の連携",
  "学校・教育機関の連携",
  "取材・メディア",
  "見学会・体験乗馬",
  "その他",
];

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    topic: TOPICS[0],
    message: "",
    agree: false,
  });

  const update = (k: string, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "送信に失敗しました。時間をおいて再度お試しください。");
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "送信に失敗しました。");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-3xl bg-brand-700 p-10 text-center text-white">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/15 text-3xl">
          ✓
        </div>
        <h3 className="mt-5 text-2xl font-semibold">送信ありがとうございました</h3>
        <p className="mt-3 text-sm leading-loose text-brand-100">
          {form.name} 様、お問い合わせを受け付けました。
          <br />
          内容を確認のうえ、担当者よりご連絡いたします。
        </p>
        <button
          onClick={() => {
            setSent(false);
            setForm({ name: "", email: "", phone: "", topic: TOPICS[0], message: "", agree: false });
          }}
          className="btn-white mt-7"
        >
          続けて問い合わせる
        </button>
      </div>
    );
  }

  const field =
    "mt-2 w-full rounded-xl border border-brand-900/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200";

  return (
    <form onSubmit={onSubmit} className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-brand-900/5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-brand-800">お名前 <span className="text-gold">*</span></span>
          <input
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className={field}
            placeholder="山田 太郎"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-brand-800">メールアドレス <span className="text-gold">*</span></span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className={field}
            placeholder="you@example.com"
          />
        </label>
      </div>

      <label className="mt-5 block">
        <span className="text-sm font-semibold text-brand-800">電話番号 <span className="text-gold">*</span></span>
        <input
          required
          type="tel"
          inputMode="tel"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          className={field}
          placeholder="090-1234-5678"
        />
      </label>

      <label className="mt-5 block">
        <span className="text-sm font-semibold text-brand-800">お問い合わせ種別</span>
        <select
          value={form.topic}
          onChange={(e) => update("topic", e.target.value)}
          className={field}
        >
          {TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>

      <label className="mt-5 block">
        <span className="text-sm font-semibold text-brand-800">お問い合わせ内容 <span className="text-gold">*</span></span>
        <textarea
          required
          rows={6}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          className={field}
          placeholder="ご質問・ご相談内容をご記入ください。"
        />
      </label>

      <label className="mt-5 flex min-h-11 cursor-pointer items-start gap-3 py-1 text-sm text-ink/75">
        <input
          required
          type="checkbox"
          checked={form.agree}
          onChange={(e) => update("agree", e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 accent-brand-600"
        />
        <span>プライバシーポリシーに同意のうえ送信します。</span>
      </label>

      {error && (
        <p
          role="alert"
          className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="btn-primary mt-7 w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {sending ? "送信中…" : "この内容で送信する"}
      </button>
    </form>
  );
}

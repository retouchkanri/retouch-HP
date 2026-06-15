"use client";

import { useActionState } from "react";
import { signIn } from "@/app/admin/actions";

export default function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(signIn, null);

  return (
    <form action={formAction} className="mx-auto w-full max-w-md space-y-5">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm text-brand-100">
          メールアドレス
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-gold focus:ring-2"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm text-brand-100">
          パスワード
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-gold focus:ring-2"
        />
      </div>
      {state?.error && (
        <p className="rounded-lg bg-red-500/20 px-4 py-3 text-sm text-red-200">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="btn-gold w-full disabled:opacity-60"
      >
        {pending ? "ログイン中…" : "ログイン"}
      </button>
    </form>
  );
}

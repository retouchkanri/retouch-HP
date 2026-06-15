import Link from "next/link";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-dvh items-center justify-center px-5 py-16">
      <div className="w-full max-w-lg">
        <p className="eyebrow !text-gold">ADMIN</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Retouch 管理画面</h1>
        <p className="mt-4 text-sm leading-relaxed text-brand-100">
          登録済みの管理者アカウントのみログインできます。
        </p>
        {error === "unauthorized" && (
          <p className="mt-4 rounded-lg bg-red-500/20 px-4 py-3 text-sm text-red-200">
            管理者権限がありません。
          </p>
        )}
        <div className="mt-8">
          <AdminLoginForm />
        </div>
        <p className="mt-8 text-center text-sm text-brand-200">
          <Link href="/" className="underline underline-offset-4 hover:text-white">
            サイトに戻る
          </Link>
        </p>
      </div>
    </div>
  );
}

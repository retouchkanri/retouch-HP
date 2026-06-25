// retouch.salon 共有DBの支援ステータス（is_supportable）を表示するバッジ。
// isSupportable が undefined（salon未連携・対象外）の場合は何も表示しません。

export default function SupportStatusBadge({
  isSupportable,
  className = "",
}: {
  isSupportable?: boolean;
  className?: string;
}) {
  if (isSupportable === undefined) return null;

  return isSupportable ? (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold text-brand-700 ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
      支援募集中
    </span>
  ) : (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-ink/10 px-2 py-0.5 text-[10px] font-semibold text-ink/55 ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-ink/40" />
      受付停止
    </span>
  );
}

// ============================================================================
// プレースホルダー / Image placeholders (画像なしモード)
// 実画像の代わりに「枠＋画像説明テキスト」を表示します。
// ============================================================================

// インライン画像枠（カード・分割レイアウトなどの画像位置に使用）
export default function Placeholder({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`flex items-center justify-center border border-dashed border-brand-300 bg-brand-50 text-brand-700 ${className}`}
    >
      <span className="px-4 py-3 text-center">
        <span className="block text-[10px] font-semibold tracking-[0.3em] text-brand-400">
          IMAGE
        </span>
        <span className="mt-1.5 block text-xs sm:text-sm leading-relaxed">{label}</span>
      </span>
    </div>
  );
}

// ヒーロー等の背景画像位置に使う「画像説明チップ」（明るい文字）
export function ImageNote({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-dashed border-white/50 bg-white/10 px-4 py-1.5 text-xs text-white/90 backdrop-blur-sm ${className}`}
    >
      <span className="text-[10px] font-semibold tracking-[0.25em] text-gold">IMAGE</span>
      {label}
    </span>
  );
}

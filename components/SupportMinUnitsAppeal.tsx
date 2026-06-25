import {
  MIN_SUPPORT_UNITS,
  formatUnits,
  minSupportUnitsRemaining,
  supportUnitsOf,
  type HorseProfile,
} from "@/lib/horses";

type Variant = "banner" | "inline" | "compact" | "meter";

export function SupportMinUnitsMessage({ className = "" }: { className?: string }) {
  return (
    <p className={className}>
      Retouchで継続して維持管理していくには、
      <span className="font-bold text-brand-800">最低{MIN_SUPPORT_UNITS}口</span>
      の支援が必要です！
    </p>
  );
}

export default function SupportMinUnitsAppeal({
  variant = "banner",
  horse,
  className = "",
}: {
  variant?: Variant;
  horse?: Pick<HorseProfile, "supportUnits" | "status" | "isSupportable">;
  className?: string;
}) {
  const units = horse ? supportUnitsOf(horse) : null;
  const remaining = units != null ? minSupportUnitsRemaining(units) : null;
  const reached = units != null && units >= MIN_SUPPORT_UNITS;

  if (variant === "compact") {
    if (reached) return null;
    return (
      <p className={`text-[11px] font-semibold leading-relaxed text-rose-600 ${className}`}>
        あと{formatUnits(remaining ?? MIN_SUPPORT_UNITS)}口で維持管理の目安（{MIN_SUPPORT_UNITS}口）に到達
      </p>
    );
  }

  if (variant === "meter" && units != null) {
    const pct = Math.min(100, (units / MIN_SUPPORT_UNITS) * 100);
    return (
      <div className={`rounded-2xl bg-brand-50 p-4 ring-1 ring-brand-200/80 ${className}`}>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <p className="text-sm font-semibold text-brand-900">
            支援口数 {formatUnits(units)} / {MIN_SUPPORT_UNITS}口
          </p>
          {!reached ? (
            <p className="text-xs font-semibold text-rose-600">
              あと{formatUnits(remaining!)}口
            </p>
          ) : (
            <p className="text-xs font-semibold text-brand-700">維持管理の目安に到達</p>
          )}
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
          <div
            className={`h-full rounded-full transition-all ${reached ? "bg-brand-600" : "bg-rose-500"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        {reached ? (
          <p className="mt-3 text-xs leading-relaxed text-ink/70">
            現在の支援口数は維持管理の目安（{MIN_SUPPORT_UNITS}口）を満たしています。引き続きのご支援をお願いいたします。
          </p>
        ) : (
          <SupportMinUnitsMessage className="mt-3 text-xs leading-relaxed text-ink/70" />
        )}
        <p className="mt-1 text-[10px] text-ink/45">
          ※ 表示の金額は、すべての支援者からの合計です（個人の毎月負担ではありません）。
        </p>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div
        className={`rounded-2xl border border-brand-200 bg-brand-50/80 px-4 py-3 text-sm leading-relaxed text-ink/80 ${className}`}
      >
        <SupportMinUnitsMessage />
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl bg-gradient-to-r from-brand-800 to-brand-700 px-5 py-4 text-white shadow-sm ${className}`}
    >
      <p className="text-sm font-bold leading-relaxed sm:text-base">
        Retouchで継続して維持管理していくには、最低{MIN_SUPPORT_UNITS}口の支援が必要！
      </p>
      <p className="mt-1.5 text-xs text-white/80 sm:text-sm">
        一口・半口の月額支援で、飼養・医療・再調教を支えてください。
      </p>
    </div>
  );
}

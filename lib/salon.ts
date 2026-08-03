import { createSalonClient } from "@/lib/supabase/salon";

// ============================================================================
// retouch.salon 共有DBから馬ごとの「支援状況（donation status）」を取得します。
//
//  - horses.is_supportable … 支援募集中か（受付停止か）
//  - support_subscriptions … 実際の月額支援（status='active'）。horse_id 単位で
//      支援者数・月額合計・口数を集計します。
//
// salon の horses.sort_order は本体DBの保護順（HorseProfile.order）と一致するため、
// 保護順をキーにして本体の馬プロフィールへ結合します。salon DBが未設定・不通でも
// 空Mapを返し、サイトは（バッジ・支援数値なしで）通常通り動作します。
//
// 【重要】サイト全体の合計値は getSalonSupportTotals() を使ってください。
// 本体の馬マスターを経由して合計すると、salon 側にしか存在しない馬・保護順が
// 未設定の馬の支援が欠落し、retouch.salon の実数と食い違います。
// ============================================================================

/** 集計対象とする support_subscriptions.status（canceled / incomplete は除外）。 */
const ACTIVE_STATUS = "active";

/** PostgREST の1リクエスト上限。これを超える場合は range() で継続取得する。 */
const PAGE_SIZE = 1000;

type SalonClient = NonNullable<ReturnType<typeof createSalonClient>>;

export type SalonHorseStatus = {
  /** retouch.salon horses.id（支援申込み deep link 用） */
  salonHorseId: string;
  /** 支援募集中（true）／受付停止（false） */
  isSupportable: boolean;
  /** 現在アクティブな支援者数（support_subscriptions の active 件数） */
  supporterCount: number;
  /** 月額支援合計（円） */
  monthlySupport: number;
  /** 支援口数の合計（0.5口=半口） */
  supportUnits: number;
};

/** retouch.salon 全体の支援実績（サイトの合計表示はこの値を唯一の正とする）。 */
export type SalonSupportTotals = {
  /** アクティブな支援を受けている馬の頭数（horse_id のユニーク数） */
  horseCount: number;
  /** アクティブな支援件数（support_subscriptions の行数） */
  subscriptionCount: number;
  /** 月額支援の合計（円） */
  monthlyTotal: number;
  /** 支援口数の合計（0.5口=半口） */
  unitTotal: number;
};

type SalonHorseRow = { id: string; sort_order: number | null; is_supportable: boolean | null };
type SalonSubRow = { horse_id: string | null; units: number | null; monthly_amount: number | null };

/**
 * status='active' の support_subscriptions を全件取得します。
 * PostgREST は1リクエストあたり最大 PAGE_SIZE 行しか返さないため、
 * 件数が増えても取りこぼさないようページングします。
 * 取得に失敗した場合は null（＝「0件」と区別する）。
 */
async function fetchActiveSubscriptions(salon: SalonClient): Promise<SalonSubRow[] | null> {
  const all: SalonSubRow[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await salon
      .from("support_subscriptions")
      .select("horse_id, units, monthly_amount")
      .eq("status", ACTIVE_STATUS)
      .range(from, from + PAGE_SIZE - 1);
    if (error) return null;
    const rows = (data ?? []) as SalonSubRow[];
    all.push(...rows);
    if (rows.length < PAGE_SIZE) break;
  }
  return all;
}

/**
 * retouch.salon の支援実績をDBから直接集計します。本体の馬マスターとの結合を
 * 一切挟まないため、salon 側の数値とそのまま一致します。
 * salon DB が未設定・不通の場合は null を返し、呼び出し側でフォールバックします。
 */
export async function getSalonSupportTotals(): Promise<SalonSupportTotals | null> {
  try {
    const salon = createSalonClient();
    if (!salon) return null;

    const subs = await fetchActiveSubscriptions(salon);
    if (!subs) return null;

    const horseIds = new Set<string>();
    let monthlyTotal = 0;
    let unitTotal = 0;
    for (const s of subs) {
      monthlyTotal += Number(s.monthly_amount) || 0;
      unitTotal += Number(s.units) || 0;
      if (s.horse_id) horseIds.add(s.horse_id);
    }

    return {
      horseCount: horseIds.size,
      subscriptionCount: subs.length,
      monthlyTotal,
      unitTotal,
    };
  } catch {
    return null;
  }
}

/** 保護順（sort_order） → 支援状況 のMap。 */
export async function getSalonHorseStatusMap(): Promise<Map<number, SalonHorseStatus>> {
  const map = new Map<number, SalonHorseStatus>();
  try {
    const salon = createSalonClient();
    if (!salon) return map;

    const { data: horses, error: hErr } = await salon
      .from("horses")
      .select("id, sort_order, is_supportable");
    if (hErr || !horses) return map;

    // salon horse id → 保護順（sort_order）
    const idToOrder = new Map<string, number>();
    for (const h of horses as SalonHorseRow[]) {
      if (typeof h.sort_order === "number") {
        idToOrder.set(h.id, h.sort_order);
        map.set(h.sort_order, {
          salonHorseId: h.id,
          isSupportable: !!h.is_supportable,
          supporterCount: 0,
          monthlySupport: 0,
          supportUnits: 0,
        });
      }
    }

    // アクティブな支援サブスクリプションのみ集計
    const subs = await fetchActiveSubscriptions(salon);
    if (!subs) return map;

    for (const s of subs) {
      if (!s.horse_id) continue;
      const order = idToOrder.get(s.horse_id);
      if (order == null) continue;
      const status = map.get(order);
      if (!status) continue;
      status.supporterCount += 1;
      status.monthlySupport += Number(s.monthly_amount) || 0;
      status.supportUnits += Number(s.units) || 0;
    }

    return map;
  } catch {
    return map;
  }
}

const SALON_HORSES_URL = "https://retouch.salon/horses";
/** salon DB 上のポニー救済チーム（番外編）の sort_order */
const SALON_PONY_SORT_ORDER = 153;

type HorseSupportLink = {
  slug?: string;
  order?: number;
  salonHorseId?: string;
};

/**
 * 本体の馬プロフィールに対応する salon 側の sort_order。
 * ポニー救済（番外編）は本体側の保護順を持たないため個別に対応付けます。
 * これを挟まないと、当該馬の支援が salon にあってもサイト側で 0 件になります。
 */
export function salonSortOrderFor(horse: Pick<HorseSupportLink, "slug" | "order">): number | undefined {
  if (horse.slug === "pony-rescue") return SALON_PONY_SORT_ORDER;
  return horse.order;
}

/** 馬ごとの一口支援ページ（retouch.salon）への URL。単発寄付 /donate ではありません。 */
export function salonHorseSupportUrl(horse: HorseSupportLink): string {
  if (horse.salonHorseId) {
    return `${SALON_HORSES_URL}?horse_id=${encodeURIComponent(horse.salonHorseId)}`;
  }
  const sortOrder = salonSortOrderFor(horse);
  if (typeof sortOrder === "number") {
    return `${SALON_HORSES_URL}?sort_order=${sortOrder}`;
  }
  return SALON_HORSES_URL;
}

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
// ============================================================================

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

type SalonHorseRow = { id: string; sort_order: number | null; is_supportable: boolean | null };
type SalonSubRow = { horse_id: string | null; units: number | null; monthly_amount: number | null };

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
    const { data: subs, error: sErr } = await salon
      .from("support_subscriptions")
      .select("horse_id, units, monthly_amount")
      .eq("status", "active");
    if (sErr || !subs) return map;

    for (const s of subs as SalonSubRow[]) {
      if (!s.horse_id) continue;
      const order = idToOrder.get(s.horse_id);
      if (order == null) continue;
      const status = map.get(order);
      if (!status) continue;
      status.supporterCount += 1;
      status.monthlySupport += s.monthly_amount ?? 0;
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

/** 馬ごとの一口支援ページ（retouch.salon）への URL。単発寄付 /donate ではありません。 */
export function salonHorseSupportUrl(horse: HorseSupportLink): string {
  if (horse.salonHorseId) {
    return `${SALON_HORSES_URL}?horse_id=${encodeURIComponent(horse.salonHorseId)}`;
  }
  if (horse.slug === "pony-rescue") {
    return `${SALON_HORSES_URL}?sort_order=${SALON_PONY_SORT_ORDER}`;
  }
  if (typeof horse.order === "number") {
    return `${SALON_HORSES_URL}?sort_order=${horse.order}`;
  }
  return SALON_HORSES_URL;
}

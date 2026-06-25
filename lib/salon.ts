import { createSalonClient } from "@/lib/supabase/salon";

// ============================================================================
// retouch.salon 共有DBから馬の支援ステータス（is_supportable）を取得します。
// salon の horses.sort_order は本体DBの保護順（HorseProfile.order）と一致する
// ため、保護順をキーにして本体の馬プロフィールへ支援ステータスを結合します。
// salon DBが未設定・不通でも空Mapを返し、サイトは通常通り動作します。
// ============================================================================

type SalonHorseRow = {
  sort_order: number | null;
  is_supportable: boolean | null;
};

/** 保護順（sort_order） → 支援募集中か（is_supportable）のMap。 */
export async function getSalonSupportMap(): Promise<Map<number, boolean>> {
  const map = new Map<number, boolean>();
  try {
    const salon = createSalonClient();
    if (!salon) return map;
    const { data, error } = await salon
      .from("horses")
      .select("sort_order, is_supportable");
    if (error || !data) return map;
    for (const row of data as SalonHorseRow[]) {
      if (typeof row.sort_order === "number") {
        map.set(row.sort_order, !!row.is_supportable);
      }
    }
    return map;
  } catch {
    return map;
  }
}

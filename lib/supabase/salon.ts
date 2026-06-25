import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// ============================================================================
// retouch.salon 共有Supabaseプロジェクト用の読み取り専用クライアント。
// 本体DB（NEXT_PUBLIC_SUPABASE_*）とは別プロジェクト。馬の支援ステータス
// （horses.is_supportable）をretouch.salonと共有するために参照します。
// 環境変数が未設定の場合は null を返し、呼び出し側でフォールバックします。
// サーバー専用（service role 優先）。
// ============================================================================

export function createSalonClient() {
  const url = process.env.SALON_SUPABASE_URL;
  const key =
    process.env.SALON_SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SALON_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

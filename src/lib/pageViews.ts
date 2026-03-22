import { getSupabaseClient } from "./supabaseClient";

/**
 * 전체 페이지(문서) 로드 1회당 1 증가. Supabase 미설정·오류 시 무시.
 * DB: supabase/migrations/20260322120000_site_page_views.sql 실행 필요.
 */
export async function recordPageView(): Promise<void> {
  try {
    const supabase = await getSupabaseClient();
    const { error } = await supabase.rpc("increment_page_views");
    if (error) {
      console.warn("[pageViews] increment_page_views:", error.message);
    }
  } catch {
    // VITE_SUPABASE_* 없음 등 — 조용히 스킵
  }
}

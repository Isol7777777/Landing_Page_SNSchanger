import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
// 클라이언트(SPA)에서는 항상 anon(또는 publishable) 키만 사용합니다.
const supabaseKey = (
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() ||
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined)?.trim()
);

let cachedClient: SupabaseClient | null = null;

export async function getSupabaseClient(): Promise<SupabaseClient> {
  if (cachedClient) return cachedClient;

  if (!supabaseUrl) {
    throw new Error(
      "VITE_SUPABASE_URL이 없습니다. 프로젝트 루트 .env에 Supabase 프로젝트 URL을 넣고 npm run dev를 다시 실행하세요."
    );
  }
  if (!supabaseKey) {
    throw new Error(
      "VITE_SUPABASE_ANON_KEY 또는 VITE_SUPABASE_PUBLISHABLE_KEY가 없습니다. .env에 anon public 키를 넣고 dev 서버를 다시 시작하세요."
    );
  }

  const { createClient } = await import("@supabase/supabase-js");
  cachedClient = createClient(supabaseUrl, supabaseKey);
  return cachedClient;
}


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
      "VITE_SUPABASE_URL이 없습니다. 로컬: 프로젝트 루트 .env에 URL을 넣고 npm run dev 재시작. Vercel 등 배포: Dashboard → Settings → Environment Variables에 VITE_SUPABASE_URL 추가 후 Redeploy."
    );
  }
  if (!supabaseKey) {
    throw new Error(
      "VITE_SUPABASE_ANON_KEY 또는 VITE_SUPABASE_PUBLISHABLE_KEY가 없습니다. 로컬: .env에 anon 키 후 dev 재시작. 배포: Vercel 환경 변수에 동일 이름으로 추가 후 Redeploy."
    );
  }

  const { createClient } = await import("@supabase/supabase-js");
  cachedClient = createClient(supabaseUrl, supabaseKey);
  return cachedClient;
}


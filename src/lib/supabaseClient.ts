import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
// 클라이언트(SPA)에서는 항상 anon 키만 사용합니다.
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let cachedClient: SupabaseClient | null = null;

export async function getSupabaseClient(): Promise<SupabaseClient> {
  if (cachedClient) return cachedClient;

  if (!supabaseUrl) {
    throw new Error("VITE_SUPABASE_URL is missing.");
  }
  if (!supabaseKey) {
    throw new Error(
      "VITE_SUPABASE_PUBLISHABLE_KEY or VITE_SUPABASE_ANON_KEY is missing."
    );
  }

  const { createClient } = await import("@supabase/supabase-js");
  cachedClient = createClient(supabaseUrl, supabaseKey);
  return cachedClient;
}


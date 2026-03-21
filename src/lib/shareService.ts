import { getSupabaseClient } from "./supabaseClient";
export type SharedLinkContent = {
  instagram: string;
  naver: string;
  /** 레거시 공유 링크(이전 버전) */
  twitter?: string;
  keywords: string[];
};

const TABLE_NAME = "shared_links";

/**
 * 공유 링크 생성
 * - DB에서 id는 gen_random_uuid() 기본값으로 자동 생성
 * - 클라이언트에서는 content 필드만 전송
 */
export async function createSharedLink(
  content: SharedLinkContent
): Promise<string> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([{ content }]) // id는 명시하지 않음
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const row = data as { id?: unknown };
  if (!row || typeof row.id !== "string") {
    throw new Error("Invalid response from shared_links insert.");
  }
  return row.id;
}

export async function fetchSharedLink(
  id: string
): Promise<SharedLinkContent | null> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("id,content")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return null;
  const row = data as { content?: unknown };
  if (!row.content || typeof row.content !== "object") return null;
  return row.content as SharedLinkContent;
}


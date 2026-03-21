import { getSupabaseClient } from "./supabaseClient";

export type PersonaTranslation = {
  instagram: string;
  naver: string;
};

export async function translateWithPersonaApi(input: string): Promise<PersonaTranslation> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase.functions.invoke("persona-translate", {
    body: { input },
  });

  if (error) {
    throw new Error(error.message);
  }

  const raw = data as { instagram?: string; naver?: string; twitter?: string } | null;
  const naver = (raw?.naver ?? raw?.twitter ?? "").trim();
  const instagram = (raw?.instagram ?? "").trim();
  if (!naver || !instagram) {
    throw new Error("번역 결과 형식이 올바르지 않습니다.");
  }

  return { instagram, naver };
}

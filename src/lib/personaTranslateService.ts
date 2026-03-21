import { getSupabaseClient } from "./supabaseClient";

export type PersonaTranslation = {
  twitter: string;
  instagram: string;
};

export async function translateWithPersonaApi(input: string): Promise<PersonaTranslation> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase.functions.invoke("persona-translate", {
    body: { input },
  });

  if (error) {
    throw new Error(error.message);
  }

  const twitter = (data?.twitter ?? "").trim();
  const instagram = (data?.instagram ?? "").trim();
  if (!twitter || !instagram) {
    throw new Error("번역 결과 형식이 올바르지 않습니다.");
  }

  return { twitter, instagram };
}

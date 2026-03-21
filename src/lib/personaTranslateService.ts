import { getSupabaseClient } from "./supabaseClient";

export type PersonaTranslation = {
  instagram: string;
  naver: string;
};

/** Supabase FunctionsHttpError 등에 붙는 fetch Response에서 본문을 읽어 디버깅에 씁니다. */
async function formatInvokeError(error: unknown): Promise<string> {
  if (!(error instanceof Error)) return String(error);
  let msg = error.message;
  const ctx = (error as Error & { context?: unknown }).context;
  if (ctx && typeof ctx === "object" && "clone" in ctx) {
    try {
      const res = ctx as Response;
      const text = (await res.clone().text()).trim();
      if (text) {
        try {
          const j = JSON.parse(text) as { error?: string; detail?: string };
          if (j.error) {
            msg = `${msg} (${res.status}): ${j.error}${j.detail ? ` — ${j.detail.slice(0, 300)}` : ""}`;
          } else {
            msg = `${msg} (${res.status}): ${text.slice(0, 400)}`;
          }
        } catch {
          msg = `${msg} (${res.status}): ${text.slice(0, 400)}`;
        }
      } else if ("status" in res && typeof (res as Response).status === "number") {
        msg = `${msg} (HTTP ${(res as Response).status})`;
      }
    } catch {
      /* ignore */
    }
  }
  return msg;
}

export async function translateWithPersonaApi(input: string): Promise<PersonaTranslation> {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase.functions.invoke("persona-translate", {
    body: { input },
  });

  if (error) {
    throw new Error(await formatInvokeError(error));
  }

  const raw = data as { instagram?: string; naver?: string; twitter?: string } | null;
  const naver = (raw?.naver ?? raw?.twitter ?? "").trim();
  const instagram = (raw?.instagram ?? "").trim();
  if (!naver || !instagram) {
    throw new Error("번역 결과 형식이 올바르지 않습니다.");
  }

  return { instagram, naver };
}

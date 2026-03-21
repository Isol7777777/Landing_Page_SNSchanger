import { corsHeaders } from "jsr:@supabase/supabase-js@2/cors";

// 짧은 출력 = 생성 토큰↓ → 응답 시간↓ (분량은 프롬프트로 고정)
const SYSTEM_PROMPT = `메모를 네이버 블로그·인스타 두 버전으로 짧게 변환한다.

분량(필수, 넘기지 말 것):
- instagram: 모바일 한 화면에 다 들어가게 짧게. 본문 5~9줄 + 해시태그 4~6개 + 끝 이모지 3개. 장문 금지.
- naver: 인스타보다 조금만 길게. 총 8~14문장 정도(과한 TMI·나열 금지). 인사 1~2문장, 본문, 댓글 유도로 마무리. 이모지 소량.

톤: 블로그=다정한 경어·꿀팁 한두 번. 인스타=갓생·성장 톤, 줄바꿈 적당히.

금지: 비속어·혐오. 같은 말 반복·서론만 길게 늘리기 금지.

반드시 JSON만, 키: {"instagram":"...","naver":"..."}`;

type Output = { naver: string; instagram: string };

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
      ...(init?.headers ?? {}),
    },
  });
}

function parseOutput(raw: string): Output {
  const jsonBlock = raw.match(/\{[\s\S]*\}/)?.[0] ?? raw;
  const parsed = JSON.parse(jsonBlock) as Partial<Output> & { twitter?: string };
  const naver = (parsed.naver ?? parsed.twitter ?? "").trim();
  const instagram = (parsed.instagram ?? "").trim();
  if (!naver || !instagram) {
    throw new Error("Invalid translation format.");
  }
  return { naver, instagram };
}

Deno.serve(async (req) => {
  // 브라우저 프리플라이트 — 공식 corsHeaders(Allow-Methods 등 포함) 필수
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const openAiKey = Deno.env.get("OPENAI_API_KEY");
    const model = Deno.env.get("OPENAI_MODEL") || "gpt-4o-mini";
    const temperature = Number(Deno.env.get("OPENAI_TEMPERATURE") ?? "0.64");
    const maxTokens = Number(Deno.env.get("OPENAI_MAX_TOKENS") ?? "1000");
    const jsonMode = (Deno.env.get("OPENAI_JSON_MODE") ?? "true").toLowerCase() !== "false";

    if (!openAiKey) {
      return json({ error: "OPENAI_API_KEY is missing." }, { status: 500 });
    }

    const body = (await req.json()) as { input?: string };
    const input = (body.input ?? "").trim();
    if (!input) {
      return json({ error: "input is required." }, { status: 400 });
    }

    const payload: Record<string, unknown> = {
      model,
      temperature: Number.isFinite(temperature) ? Math.min(1, Math.max(0, temperature)) : 0.64,
      max_tokens: Number.isFinite(maxTokens) ? Math.min(4096, Math.max(256, Math.floor(maxTokens))) : 1000,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: input },
      ],
    };
    if (jsonMode) {
      payload.response_format = { type: "json_object" };
    }

    const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!openAiRes.ok) {
      const errText = await openAiRes.text();
      return json({ error: "OpenAI request failed", detail: errText }, { status: 502 });
    }

    const data = (await openAiRes.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      return json({ error: "OpenAI empty response." }, { status: 502 });
    }

    const output = parseOutput(content);
    return json(output);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return json({ error: message }, { status: 500 });
  }
});

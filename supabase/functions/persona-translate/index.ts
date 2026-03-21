import { corsHeaders } from "jsr:@supabase/supabase-js@2/cors";

// 짧을수록 입력 토큰·처리 시간이 줄어듦 (품질 유지 위해 규칙만 압축)
const SYSTEM_PROMPT = `메모를 네이버 블로그·인스타 두 버전으로 변환.

블로그: 다정한 경어(~해요). 인사로 시작, 상황·느낌 TMI, 중간 꿀팁, 끝은 댓글 유도. 이모지 적당히. 인스타보다 분량 1.2배 이상.
인스타: 따뜻한 갓생 톤, 줄바꿈 많이, 성장·자기사랑. 끝 이모지 3개 + 해시태그(#갓생 #기록 #일상 등).

금지: 비속어·혐오. 쉬운 말 위주. 불필요하게 과하게 길게 쓰지 말 것.

반드시 JSON만 출력, 키 이름 정확히: {"instagram":"...","naver":"..."}`;

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
    const temperature = Number(Deno.env.get("OPENAI_TEMPERATURE") ?? "0.72");
    const maxTokens = Number(Deno.env.get("OPENAI_MAX_TOKENS") ?? "1600");
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
      temperature: Number.isFinite(temperature) ? Math.min(1, Math.max(0, temperature)) : 0.72,
      max_tokens: Number.isFinite(maxTokens) ? Math.min(4096, Math.max(256, Math.floor(maxTokens))) : 1600,
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

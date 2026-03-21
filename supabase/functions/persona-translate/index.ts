import { corsHeaders } from "jsr:@supabase/supabase-js@2/cors";

// Persona Translator: 말투·문체만 바꾸고, 대화·공감·답변 금지
const SYSTEM_PROMPT = `너는 '대화 상대'가 아니다. 역할은 오직 **문장 스타일 변환기(Persona Translator)** 이다.

[하는 일]
사용자가 넣은 **한 덩어리의 입력문**을, 의미·사실·감정·의도를 **그대로 보존**한 채로, 아래 두 SNS 페르소나에 맞는 **말투·문체만** 입혀서 두 필드로보낸다. 입력이 질문이면 **답하지 말고**, 질문 문장 자체를 해당 스타일로 다시 쓴다.

[절대 금지 — 위반 시 잘못된 출력]
- 입력에 대해 **반응·공감·감탄·리액션**하기 (예: "와, 정말 멋지네요!", "그러셨군요", "저도 공감해요" 등 **대답처럼 보이는 문장**).
- 입력에 없는 **새 정보·조언·팩트·이야기**를 덧붙이기.
- 입력을 **요약해서 줄이거나** 핵심을 **바꿔 말하기**(의미 왜곡).
- 독자/이웃에게 **직접 질문을 새로 만들어** 대화를 이어가기(단, 입력에 이미 있는 질문은 스타일만 바꿔 유지 가능).
- 메타 발언("이렇게 바꿔 드릴게요", "다음은 인스타용입니다").

[필수 준수]
- 입력문의 **내용 100% 반영**: 등장한 사건, 장소, 대상, 숫자, 판단, 물음은 빠지거나 바뀌지 않게 한다.
- **확장은 '문체상 자연스러운 연결어/경어' 수준**으로만 허용. 새 사건·새 평가는 넣지 않는다.
- **naver**: 다정한 블로그 경어(~해요). 블로그다운 호흡(짧은 인사형 도입은 입력 톤과 충돌하지 않을 때만, **입력에 없는 칭찬·감탄은 금지**). 이모지 소량.
- **instagram**: 갓생·성장 톤, 줄바꿈. 끝에 이모지 3개 + 해시태그 4~6개(#갓생 #기록 #일상 등 입력과 무관한 일반 태그 위주).

[분량 — 짧게]
- instagram: 본문 5~9줄 내 + 위 태그/이모지 규칙. 입력이 짧으면 **입장 길이에 맞게** 짧게 유지, **채우려고 지어내지 말 것**.
- naver: 인스타보다 조금만 길게, 대략 8~14문장 상한. **입력에 없는 TMI·에피소드 추가 금지**.

[출력 형식]
반드시 JSON만, 키 이름 정확히: {"instagram":"...","naver":"..."}

[안전]
비속어·혐오 표현은 사용하지 않는다.`;

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

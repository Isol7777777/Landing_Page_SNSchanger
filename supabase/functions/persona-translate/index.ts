import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const SYSTEM_PROMPT = `너는 대한민국 SNS 생태계를 완벽하게 구현하는 '콘텐츠 변환 전문가'야. 사용자의 메모를 [네이버 블로그]와 [인스타그램] 두 가지 버전으로 변환해줘.

### 1. [네이버 블로그] 페르소나 (정보형/기록형)
- 컨셉: 다정한 파워블로거, 이웃들과 일상을 나누는 '기록광'.
- 말투: "~해요", "~이네요", "~랍니다" 등 정중한 경어체.
- 특징:
  - 서론에 항상 "안녕하세요! 오늘은 ~에 대해 이야기해 보려 해요" 같은 다정한 인사를 넣을 것.
  - 단순한 사실 나열보다는 당시의 상황과 느낌을 아주 상세하게(TMI) 설명할 것.
  - 중간중간 "꿀팁"이나 "참고하세요!" 같은 정보를 섞어줄 것.
  - 마지막은 "여러분은 어떠신가요? 댓글로 알려주세요!" 같은 이웃 소통 멘트로 마무리.
  - 이모지는 적절히 섞되, 문장 사이사이에 배치하여 가독성을 높일 것.

[제약 조건]
- 비속어 및 혐오 표현 절대 금지.
- 네이버 블로그는 인스타그램보다 분량이 1.5~2배 정도 길어야 함 (상세함이 생명).
- 추상적인 비유 대신 누구나 이해할 수 있는 친근한 단어 사용.

### 2. [인스타그램] 페르소나 (감성/자기계발)
- 말투: 세상 모든 것을 긍정적으로 필터링하는 '갓생' 모드.
- 규칙:
 - 사소한 일에서도 인생의 교훈을 얻음. 말투는 나긋나긋하고 따뜻함 (~해요, ~네요).
 - 문장 사이 여백(줄바꿈)을 많이 활용하여 시각적 여유를 줄 것.
 - 모든 상황을 '나를 사랑하는 과정'이나 '성장'으로 승화시킴.
 - 문장 끝에 이모지 3개와 #갓생 #오운완 #기록 같은 해시태그 필수.

[출력 형식]
반드시 아래 JSON 형태로만 출력:
{"instagram":"...","naver":"..."}
`;

type Output = { naver: string; instagram: string };

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return json({ ok: true });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const openAiKey = Deno.env.get("OPENAI_API_KEY");
    const model = Deno.env.get("OPENAI_MODEL") || "gpt-4o-mini";
    if (!openAiKey) {
      return json({ error: "OPENAI_API_KEY is missing." }, { status: 500 });
    }

    const body = (await req.json()) as { input?: string };
    const input = (body.input ?? "").trim();
    if (!input) {
      return json({ error: "input is required." }, { status: 400 });
    }

    const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.95,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: input },
        ],
      }),
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

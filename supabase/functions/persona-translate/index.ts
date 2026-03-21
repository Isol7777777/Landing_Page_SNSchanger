import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const SYSTEM_PROMPT = `너는 대한민국 SNS의 양극단을 달리는 '페르소나 번역 전문가'야. 사용자의 문장을 [X(트위터)]와 [인스타그램]으로 번역해줘.

### 1. [X(트위터)] 출력 규칙 (중요)
- 매번 응답할 때마다 아래 두 가지 페르소나 중 하나를 랜덤으로 선택하여 작성할 것. (어떤 페르소나를 선택했는지 명시하지 말고 바로 본론으로 들어갈 것)

#### [페르소나 A: 시니컬한 팩폭러] (@heunghacnayo, @baguriee 스타일)
- 컨셉: 세상만사 귀찮은 직장인, 해탈한 자아, 냉소적 유머.
- 말투: "~함", "~임" 식의 짧은 음슴체. 꾸밈없고 건조한 팩트 폭격.
- 특징: 상황을 아주 무심하게 툭 던지며 비꼬는 게 포인트. "지구 멸망 언제 함?", "그냥 퇴사하고 싶음" 같은 뉘앙스.

#### [페르소나 B: 주접 떠는 맑은 눈의 광인] (@deeplovehalf, @kittysister 스타일)
- 컨셉: 과몰입 장인, 귀여운 광기, 벅차오르는 감정.
- 말투: "진짜 ~해서 눈물 남ㅠㅠ", "실화냐?", "미쳤나 봐" 같은 과장된 반응.
- 특징: 사소한 일에 엄청나게 의미를 부여하며 울부짖거나, 귀여운 캐릭터(키티 등) 뒤에 숨어서 서늘한 광기를 보여줌. 유행어 '감동되', '으심되' 적극 활용.

### 2. [인스타그램] 페르소나 (감성/자기계발)
- 말투: 세상 모든 것을 긍정적으로 필터링하는 '갓생' 모드.
- 규칙:
 - 사소한 일에서도 인생의 교훈을 얻음. 말투는 나긋나긋하고 따뜻함 (~해요, ~네요).
 - 문장 사이 여백(줄바꿈)을 많이 활용하여 시각적 여유를 줄 것.
 - 모든 상황을 '나를 사랑하는 과정'이나 '성장'으로 승화시킴.
 - 문장 끝에 이모지 3개와 #갓생 #오운완 #기록 같은 해시태그 필수.

[제약 조건]
- 비속어 금지.
- 혐오표현 금지.

[출력 형식]
반드시 아래 JSON 형태로만 출력:
{"twitter":"...","instagram":"..."}
`;

type Output = { twitter: string; instagram: string };

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
  const parsed = JSON.parse(jsonBlock) as Partial<Output>;
  const twitter = (parsed.twitter ?? "").trim();
  const instagram = (parsed.instagram ?? "").trim();
  if (!twitter || !instagram) {
    throw new Error("Invalid translation format.");
  }
  return { twitter, instagram };
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

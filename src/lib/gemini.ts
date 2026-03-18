import { GoogleGenerativeAI } from "@google/generative-ai";

export type DualTransformResult = {
  instagram: string;
  twitter: string;
  keywords: string[];
};

const SYSTEM_INSTRUCTION = `[[System Instruction: SNS Dual-Transformer v4.0 - Multi-Keyword Matching]

너는 입력된 텍스트를 분석하여 'X(Twitter)'와 'Instagram' 게시물로 변환하고, DB 매칭을 위한 키워드를 추출하는 '텍스트 분석 엔진'이다.

[🚨 X(Twitter) 보안 프로토콜 - 절대 엄수]
1. 해시태그 금지: '#' 기호가 포함된 모든 단어를 절대 작성하지 마라.
2. 이모지 금지: 모든 형태의 이모지(그림 문자) 사용을 절대 금지한다.
3. 텍스트 전용: 오직 한글, 영문, 숫자, 문장 부호(?, !, ..., ;;), 자음(ㅋㅋ, ㅠㅠ)만 허용한다.
4. 말투: 시니컬한 음슴체. 다정함이 섞이면 즉시 삭제하라.

---

1. [Engine A: X (Twitter)] - "The Raw Text Machine"
- 성격: 밈에 절여진 헤비 트위터리안. 팩트폭격 및 자학적 유머.
- 금지: '#' 기호, 모든 이모지, 정중한 어미, 인사말.
- 허용: 텍스트 기반 감정 표현(;;, ㅠㅠ, ㅋㅋ), 날카로운 비유.

2. [Engine B: Instagram] - "The Aesthetic Storyteller"
- 성격: 일상을 기록하는 감성 인플루언서. 다정하고 긍정적인 말투.
- 필수: 문장마다 풍부한 이모지 사용, 넓은 줄바꿈(여백), 따뜻한 말투.
- 하단: 반드시 5개 이상의 감성 해시태그(#) 포함.

3. [Keyword Extraction - For DB Matching]
- 목적: 나중에 DB에 저장된 이미지/데이터와 매칭하기 위해 최대한 풍부한 키워드를 추출함.
- 규칙:
  * 글의 '핵심 소재', '장소', '음식', '감정 상태', '계절/날씨' 등을 모두 포함할 것.
  * 최소 3개에서 최대 8개까지의 단어를 배열 형태로 추출할 것.

4. 최종 출력 규칙
- 너는 대화형 AI가 아니다. 어떤 응답이나 인사 없이 오직 JSON 데이터만 출력하라.

{
  "instagram": "인스타 내용 (이모지+해시태그 필수)",
  "twitter": "트위터 내용 (이모지 및 해시태그 절대 금지, 오직 텍스트만)",
  "keywords": ["핵심소재", "장소", "감정", "날씨", "기타연관어"]
}]`;

function getGeminiApiKey(): string | undefined {
  return import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
}

function getGroqApiKey(): string | undefined {
  return import.meta.env.VITE_GROQ_API_KEY as string | undefined;
}

function getGroqModel(): string {
  return (
    (import.meta.env.VITE_GROQ_MODEL as string | undefined)?.trim() ||
    "llama-3.1-8b-instant"
  );
}

function getModelCandidates(): string[] {
  const fromEnv = (import.meta.env.VITE_GEMINI_MODEL as string | undefined)?.trim();
  const candidates = [
    fromEnv,
    // Prefer models that are typically available to new users.
    // Reference: https://ai.google.dev/gemini-api/docs/models
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    // Preview models (availability may vary)
    "gemini-3-flash-preview",
    "gemini-3.1-pro-preview",
    // Older fallbacks (may be disabled for new users)
    "gemini-2.0-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro-latest",
  ].filter((v): v is string => Boolean(v));

  // De-duplicate while preserving order
  return Array.from(new Set(candidates));
}

async function transformWithGroq(text: string): Promise<DualTransformResult> {
  const apiKey = getGroqApiKey();
  if (!apiKey) throw new Error("VITE_GROQ_API_KEY is missing.");

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: getGroqModel(),
      temperature: 0.4,
      // OpenAI-compatible "JSON mode" (supported by many Groq-served models)
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTION },
        { role: "user", content: text },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GROQ request failed (${res.status}): ${body}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content ?? "";
  const parsed = extractJsonObject(content);
  return normalizeResult(parsed);
}

async function transformWithGemini(text: string): Promise<DualTransformResult> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY is missing. Set it in your .env file.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError: unknown = null;

  for (const modelName of getModelCandidates()) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_INSTRUCTION,
      });

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.4,
        },
      });

      const responseText = result.response.text();
      const parsed = extractJsonObject(responseText);
      return normalizeResult(parsed);
    } catch (e) {
      lastError = e;
    }
  }

  const msg =
    lastError instanceof Error
      ? lastError.message
      : "Gemini API request failed.";
  throw new Error(msg);
}

function extractJsonObject(text: string): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    // Fallback: extract the first {...} block.
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) {
      const slice = trimmed.slice(start, end + 1);
      return JSON.parse(slice);
    }
    throw new Error("Model did not return valid JSON.");
  }
}

function normalizeResult(raw: unknown): DualTransformResult {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid JSON shape from model.");
  }
  const obj = raw as Record<string, unknown>;
  const instagram = typeof obj.instagram === "string" ? obj.instagram : "";
  const twitter = typeof obj.twitter === "string" ? obj.twitter : "";
  const keywordsRaw = Array.isArray(obj.keywords) ? obj.keywords : [];
  const keywords = keywordsRaw
    .filter((k) => typeof k === "string")
    .map((k) => k.trim())
    .filter(Boolean);

  if (!instagram || !twitter) {
    throw new Error("Missing instagram/twitter in model JSON.");
  }
  if (keywords.length < 3 || keywords.length > 8) {
    throw new Error("keywords must be an array of 3 to 8 strings.");
  }
  return { instagram, twitter, keywords };
}

/**
 * Transform user text into Instagram + X(Twitter) styles and extract keywords.
 * Returns `{ instagram, twitter, keywords }`.
 */
export async function transformText(input: string): Promise<DualTransformResult> {
  const text = input.trim();
  if (!text) {
    throw new Error("Input text is empty.");
  }

  // During development, prefer Groq when a key is present.
  if (getGroqApiKey()) {
    return await transformWithGroq(text);
  }
  return await transformWithGemini(text);
}


import { supabase } from "./supabaseClient";
import defaultBg from "../assets/default-bg.svg";
import { fetchTwitterGif16x9 } from "./giphyClient";
import { fetchInstagramPhoto1x1, type UnsplashAttribution } from "./unsplashClient";
import {
  extractEnglishSearchTerms,
  extractEnglishSearchTermsForPlatform,
} from "./gemini";

/**
 * Placeholder (API 실패/매칭 실패 시)
 */
export const placeholderImage = {
  twitter: defaultBg,
  instagram: defaultBg,
} as const;

export type KeywordMappingRow = {
  keyword: string;
  search_term_twitter: string | null;
  search_term_instagram: string | null;
};

export type SelectedKeyword = {
  inputKeyword: string;
  matchedDbKeyword: string | null;
};

export type PlatformImagesResult = {
  selected: SelectedKeyword;
  searchTerms: { twitter: string; instagram: string };
  twitter: { url: string };
  instagram: { url: string; attribution: UnsplashAttribution | null };
  usedFallback: { twitter: boolean; instagram: boolean };
};

function normalizeKeywords(keywords: string[]): string[] {
  return keywords.map((k) => k.trim()).filter(Boolean);
}

function containsKoreanText(s: string): boolean {
  return /[가-힣]/.test(s);
}

function parseEnglishTerms(input: string): string[] {
  const tokens = input
    .toLowerCase()
    .split(/[^a-zA-Z]+/g)
    .map((t) => t.trim())
    .filter(Boolean)
    .filter((t) => /^[a-z]+$/.test(t));
  return Array.from(new Set(tokens)).slice(0, 3);
}

function scoreMatch(params: { keywordIndex: number; inputKeyword: string; dbKeyword: string }): number | null {
  const { keywordIndex, inputKeyword, dbKeyword } = params;
  if (!inputKeyword || !dbKeyword) return null;

  if (inputKeyword === dbKeyword) {
    // 1) 완전 일치 최우선
    return 1_000_000 - keywordIndex;
  }

  // 2) 부분 일치 점수화 (텍스트 앞쪽일수록 높은 점수)
  // - "입력 키워드" 안에 "DB 키워드"가 포함되거나,
  // - "DB 키워드" 안에 "입력 키워드"가 포함되는 경우를 부분 일치로 취급
  const idxInInput = inputKeyword.indexOf(dbKeyword);
  const idxInDb = dbKeyword.indexOf(inputKeyword);
  const isPartial = idxInInput >= 0 || idxInDb >= 0;
  if (!isPartial) return null;

  const matchIndex = idxInInput >= 0 ? idxInInput : idxInDb;
  const matchLen = Math.min(inputKeyword.length, dbKeyword.length);

  // 앞쪽(인덱스가 작을수록) + 더 긴 매치 + keywords 배열 앞쪽일수록 유리
  return 10_000 + matchLen * 50 - matchIndex * 100 - keywordIndex * 10;
}

function pickRandomOne<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * keywords + DB keyword 후보들로부터 "단 하나"의 최적 키워드를 선택합니다.
 * - 완전 일치 우선
 * - 부분 일치 점수화 (앞쪽일수록 가산)
 * - 동점이면 랜덤 선택
 */
export function pickBestDbKeywordFromKeywords(
  keywords: string[],
  dbKeywords: string[]
): { inputKeyword: string; dbKeyword: string } | null {
  const normalized = normalizeKeywords(keywords);
  if (!normalized.length || !dbKeywords.length) return null;

  let bestScore = -Infinity;
  let bestCandidates: Array<{ inputKeyword: string; dbKeyword: string }> = [];

  for (const dbKeyword of dbKeywords) {
    for (let i = 0; i < normalized.length; i++) {
      const inputKeyword = normalized[i];
      const s = scoreMatch({
        keywordIndex: i,
        inputKeyword,
        dbKeyword,
      });
      if (s === null) continue;

      if (s > bestScore) {
        bestScore = s;
        bestCandidates = [{ inputKeyword, dbKeyword }];
      } else if (s === bestScore) {
        bestCandidates.push({ inputKeyword, dbKeyword });
      }
    }
  }

  return bestCandidates.length ? pickRandomOne(bestCandidates) : null;
}

export function pickBestInputKeyword(keywords: string[]): string | null {
  const normalized = normalizeKeywords(keywords);
  return normalized.length ? normalized[0] : null;
}

/**
 * Supabase `keyword_mappings`에서 키워드 -> 플랫폼별 search_term을 조회합니다.
 * 컬럼:
 * - keyword (text)
 * - search_term_twitter (text)
 * - search_term_instagram (text)
 */
export async function fetchKeywordMappingsCandidates(params: {
  keywords: string[];
  table?: string;
  maxRows?: number;
}): Promise<KeywordMappingRow[]> {
  const table = params.table?.trim() || "keyword_mappings";
  const maxRows = params.maxRows ?? 500;
  const uniq = Array.from(new Set(normalizeKeywords(params.keywords)));
  if (!uniq.length) return [];

  // 1) 완전 일치 후보 우선 조회
  const exact = await supabase
    .from(table)
    .select("keyword,search_term_twitter,search_term_instagram")
    .in("keyword", uniq);

  if (exact.error) {
    throw new Error(exact.error.message);
  }

  const exactRows = (exact.data ?? []) as Array<{
    keyword: unknown;
    search_term_twitter: unknown;
    search_term_instagram: unknown;
  }>;

  const normalizedExact = exactRows
    .filter((r) => typeof r.keyword === "string")
    .map((r) => ({
      keyword: r.keyword,
      search_term_twitter:
        typeof r.search_term_twitter === "string" ? r.search_term_twitter : null,
      search_term_instagram:
        typeof r.search_term_instagram === "string" ? r.search_term_instagram : null,
    }));

  if (normalizedExact.length) return normalizedExact;

  // 2) 부분 일치 후보 확보를 위해 제한된 범위로 가져와서 클라이언트 점수화
  const all = await supabase
    .from(table)
    .select("keyword,search_term_twitter,search_term_instagram")
    .limit(maxRows);

  if (all.error) {
    throw new Error(all.error.message);
  }

  const allRows = (all.data ?? []) as Array<{
    keyword: unknown;
    search_term_twitter: unknown;
    search_term_instagram: unknown;
  }>;

  return allRows
    .filter((r) => typeof r.keyword === "string")
    .map((r) => ({
      keyword: r.keyword,
      search_term_twitter:
        typeof r.search_term_twitter === "string" ? r.search_term_twitter : null,
      search_term_instagram:
        typeof r.search_term_instagram === "string" ? r.search_term_instagram : null,
    }));
}

export function resolveSearchTerms(params: {
  selectedKeyword: string;
  mapping: KeywordMappingRow | null;
}): { twitter: string; instagram: string } {
  const base = params.selectedKeyword.trim();
  const mapping = params.mapping;
  const twitter = (mapping?.search_term_twitter ?? "").trim() || base;
  const instagram = (mapping?.search_term_instagram ?? "").trim() || base;
  return { twitter, instagram };
}

export async function fetchPlatformImagesForKeywords(
  keywords: string[]
): Promise<PlatformImagesResult> {
  const normalized = normalizeKeywords(keywords);
  const fallbackSelected = pickBestInputKeyword(normalized) ?? "";

  let mapping: KeywordMappingRow | null = null;
  let selected: SelectedKeyword = {
    inputKeyword: fallbackSelected,
    matchedDbKeyword: null,
  };

  try {
    const candidates = await fetchKeywordMappingsCandidates({ keywords: normalized });
    const best = pickBestDbKeywordFromKeywords(
      normalized,
      candidates.map((c) => c.keyword)
    );

    if (best) {
      selected = { inputKeyword: best.inputKeyword, matchedDbKeyword: best.dbKeyword };
      mapping = candidates.find((c) => c.keyword === best.dbKeyword) ?? null;
    }
  } catch {
    // Supabase 조회 실패 시에도 API 소싱은 원본 키워드로 진행
  }

  const chosenKeyword = selected.inputKeyword || fallbackSelected;
  const mappingSearchTerms = resolveSearchTerms({
    selectedKeyword: chosenKeyword || (normalized[0] ?? ""),
    mapping,
  });

  // 요구사항: search_term은 반드시 영어 단어 1~3개(맥락 표현)여야 함.
  // - keyword_mappings에 이미 영어가 있으면 그대로 사용
  // - 플랫폼별로 각각 필요할 때만 AI 호출 (더 공격적인 캐싱)
  const twitterCandidate = mappingSearchTerms.twitter.trim();
  const instagramCandidate = mappingSearchTerms.instagram.trim();

  let twitterTerms: string[] | null = null;
  let instagramTerms: string[] | null = null;
  let needsUpsert = false;

  if (twitterCandidate && !containsKoreanText(twitterCandidate)) {
    const parsed = parseEnglishTerms(twitterCandidate);
    if (parsed.length) twitterTerms = parsed;
  }

  if (instagramCandidate && !containsKoreanText(instagramCandidate)) {
    const parsed = parseEnglishTerms(instagramCandidate);
    if (parsed.length) instagramTerms = parsed;
  }

  if (!twitterTerms) {
    // twitter는 GIF 톤에 맞게 별도로
    twitterTerms = await extractEnglishSearchTermsForPlatform(chosenKeyword, "twitter");
    needsUpsert = true;
  }

  if (!instagramTerms) {
    // instagram은 사진 'visual vibe' 톤에 맞게 별도로
    instagramTerms = await extractEnglishSearchTermsForPlatform(
      chosenKeyword,
      "instagram"
    );
    needsUpsert = true;
  }

  // 만약 어떤 이유로든 terms가 비면 fallback(이전 함수) 사용
  if (!twitterTerms) {
    twitterTerms = await extractEnglishSearchTerms(chosenKeyword);
    needsUpsert = true;
  }
  if (!instagramTerms) {
    instagramTerms = await extractEnglishSearchTerms(chosenKeyword);
    needsUpsert = true;
  }

  const twitterQuery = twitterTerms.join(" ");
  const instagramQuery = instagramTerms.join(" ");

  // keyword_mappings에 캐싱(필요한 경우에만). 실패해도 API 소싱은 계속합니다.
  if (needsUpsert) {
    try {
      await supabase
        .from("keyword_mappings")
        .upsert(
          {
            keyword: chosenKeyword,
            search_term_twitter: twitterQuery,
            search_term_instagram: instagramQuery,
          },
          { onConflict: "keyword" }
        );
    } catch {
      // RLS/권한 이슈여도 무시 (캐시는 optional)
    }
  }

  const searchTerms = { twitter: twitterQuery, instagram: instagramQuery };

  let twitterUrl = placeholderImage.twitter;
  let instagramUrl = placeholderImage.instagram;
  let instagramAttribution: UnsplashAttribution | null = null;
  let usedFallbackTwitter = true;
  let usedFallbackInstagram = true;

  try {
    const gif = await fetchTwitterGif16x9({ query: searchTerms.twitter });
    if (gif?.url) {
      twitterUrl = gif.url;
      usedFallbackTwitter = false;
    }
  } catch {
    // fallback 유지
  }

  try {
    const photo = await fetchInstagramPhoto1x1({ query: searchTerms.instagram });
    if (photo?.url) {
      instagramUrl = photo.url;
      instagramAttribution = photo.attribution;
      usedFallbackInstagram = false;
    }
  } catch {
    // fallback 유지
  }

  return {
    selected,
    searchTerms,
    twitter: { url: twitterUrl },
    instagram: { url: instagramUrl, attribution: instagramAttribution },
    usedFallback: { twitter: usedFallbackTwitter, instagram: usedFallbackInstagram },
  };
}


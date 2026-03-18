import defaultBg from "../assets/default-bg.svg";
import cafe from "../assets/cafe.svg";
import sunset from "../assets/sunset.svg";
import { supabase } from "./supabaseClient";

/**
 * 더미 이미지 DB (Supabase 붙이기 전 개발용)
 * - 키워드(한글) -> 플랫폼별 이미지
 */
export const imageDb: Record<string, { twitter: string; instagram: string }> = {
  카페: { twitter: cafe, instagram: cafe },
  노을: { twitter: sunset, instagram: sunset },
  커피: { twitter: cafe, instagram: cafe },
  디저트: { twitter: cafe, instagram: cafe },
  석양: { twitter: sunset, instagram: sunset },
  바다: { twitter: sunset, instagram: sunset },
};

export type PlatformImageUrls = { twitter: string; instagram: string };
export type ImageAsset = { keyword: string } & PlatformImageUrls;

export const placeholderImage: PlatformImageUrls = {
  twitter: defaultBg,
  instagram: defaultBg,
};

function normalizeKeywords(keywords: string[]): string[] {
  return keywords.map((k) => k.trim()).filter(Boolean);
}

function scoreMatch(params: {
  keywordIndex: number;
  inputKeyword: string;
  dbKeyword: string;
}): number | null {
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
 * keywords + asset 후보들로부터 "단 하나"의 최적 매칭 asset을 선택합니다.
 * - 완전 일치 우선
 * - 부분 일치 점수화 (앞쪽일수록 가산)
 * - 동점이면 랜덤 선택
 */
export function pickBestAssetFromKeywords(
  keywords: string[],
  assets: ImageAsset[]
): ImageAsset | null {
  const normalized = normalizeKeywords(keywords);
  if (!normalized.length || !assets.length) return null;

  let bestScore = -Infinity;
  let bestCandidates: ImageAsset[] = [];

  for (const asset of assets) {
    for (let i = 0; i < normalized.length; i++) {
      const inputKeyword = normalized[i];
      const s = scoreMatch({
        keywordIndex: i,
        inputKeyword,
        dbKeyword: asset.keyword,
      });
      if (s === null) continue;

      if (s > bestScore) {
        bestScore = s;
        bestCandidates = [asset];
      } else if (s === bestScore) {
        bestCandidates.push(asset);
      }
    }
  }

  return bestCandidates.length ? pickRandomOne(bestCandidates) : null;
}

export function pickBestFromDummyDb(keywords: string[]): ImageAsset | null {
  const assets: ImageAsset[] = Object.entries(imageDb).map(
    ([keyword, urls]) => ({
      keyword,
      twitter: urls.twitter,
      instagram: urls.instagram,
    })
  );
  return pickBestAssetFromKeywords(keywords, assets);
}

/**
 * Supabase DB에서 keyword -> image URL을 조회합니다.
 *
 * 테이블 예시: public.image_assets
 * - keyword (text, primary key)
 * - url_twitter (text)
 * - url_instagram (text)
 */
export async function fetchImagesFromSupabaseByKeywords(
  keywords: string[],
  options?: { table?: string; maxRows?: number }
): Promise<ImageAsset[]> {
  const table = options?.table?.trim() || "image_assets";
  const maxRows = options?.maxRows ?? 500;
  const uniq = Array.from(new Set(normalizeKeywords(keywords)));
  if (!uniq.length) return [];

  const { data, error } = await supabase
    .from(table)
    .select("keyword,url_twitter,url_instagram")
    // 부분 일치를 점수화해야 해서, 후보 풀을 조금 넓게 잡고 클라이언트에서 선택합니다.
    .limit(maxRows);

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as Array<{
    keyword: unknown;
    url_twitter: unknown;
    url_instagram: unknown;
  }>;

  // Supabase에서 전부 가져와도, pickBestAssetFromKeywords가 실제로 매칭되는 것만 고려합니다.
  // (불필요한 렌더링 방지용으로, 최소한의 유효성은 여기서 체크)
  const assets: ImageAsset[] = rows
    .filter(
      (r) =>
        typeof r.keyword === "string" &&
        typeof r.url_twitter === "string" &&
        typeof r.url_instagram === "string"
    )
    .map((r) => ({
      keyword: r.keyword,
      twitter: r.url_twitter,
      instagram: r.url_instagram,
    }));

  // 키워드 후보가 많을 때, 완전 무관한 row들을 빠르게 제외
  const maybeRelevant = assets.filter((a) =>
    uniq.some((k) => k.includes(a.keyword) || a.keyword.includes(k))
  );

  return maybeRelevant.length ? maybeRelevant : assets;
}


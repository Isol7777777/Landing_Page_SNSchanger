type UnsplashUser = {
  name: string;
  links?: { html?: string };
};

type UnsplashPhoto = {
  id: string;
  width: number;
  height: number;
  urls: { regular: string; small?: string };
  links?: { html?: string };
  user: UnsplashUser;
};

type UnsplashSearchResponse = {
  results: UnsplashPhoto[];
};

function getUnsplashAccessKey(): string | undefined {
  return (
    (import.meta.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY as string | undefined) ??
    (import.meta.env.VITE_UNSPLASH_ACCESS_KEY as string | undefined)
  )?.trim();
}

function scoreSquareish(photo: UnsplashPhoto): number {
  const ratio = photo.width / photo.height;
  const target = 1;
  // 1:1에 가까울수록 높은 점수
  return -Math.abs(ratio - target);
}

export type UnsplashAttribution = {
  authorName: string;
  authorUrl: string | null;
  photoUrl: string | null;
};

async function searchPhotos(
  params: { query: string; perPage?: number; orientation?: "squarish" | "landscape" | "portrait" },
  accessKey: string
): Promise<UnsplashPhoto[]> {
  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", params.query);
  url.searchParams.set("per_page", String(params.perPage ?? 10));
  if (params.orientation) {
    url.searchParams.set("orientation", params.orientation);
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
      "Accept-Version": "v1",
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Unsplash request failed (${res.status}): ${body}`);
  }

  const data = (await res.json()) as UnsplashSearchResponse;
  return data.results ?? [];
}

export async function fetchInstagramPhoto1x1(params: {
  query: string;
}): Promise<{ url: string; attribution: UnsplashAttribution } | null> {
  const accessKey = getUnsplashAccessKey();
  if (!accessKey) throw new Error("NEXT_PUBLIC_UNSPLASH_ACCESS_KEY is missing.");

  const q = params.query.trim();
  if (!q) return null;

  // 1차: 원본 키워드 그대로
  let results = await searchPhotos(
    { query: q, perPage: 10, orientation: "squarish" },
    accessKey
  );

  // 2차: 키워드에 감성 태그를 덧붙여 다시 시도
  if (!results.length) {
    results = await searchPhotos(
      { query: `${q} aesthetic`, perPage: 10, orientation: "squarish" },
      accessKey
    );
  }

  // 3차: 완전 범용적인 백그라운드 키워드
  if (!results.length) {
    results = await searchPhotos(
      { query: "background aesthetic minimal", perPage: 10, orientation: "squarish" },
      accessKey
    );
  }

  if (!results.length) return null;

  const best = [...results].sort((a, b) => scoreSquareish(b) - scoreSquareish(a))[0];
  if (!best?.urls?.regular) return null;

  return {
    url: best.urls.regular,
    attribution: {
      authorName: best.user?.name ?? "Unknown",
      authorUrl: best.user?.links?.html ?? null,
      photoUrl: best.links?.html ?? null,
    },
  };
}


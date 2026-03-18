import { GiphyFetch } from "@giphy/js-fetch-api";

type GiphyImageVariant = { url: string; width: string; height: string };
type GiphyImages = Record<string, GiphyImageVariant | undefined>;
type GiphyGif = {
  id: string;
  title?: string;
  images?: GiphyImages;
};

function getGiphyApiKey(): string | undefined {
  // Vite에서 NEXT_PUBLIC_*도 envPrefix로 허용
  return (
    (import.meta.env.NEXT_PUBLIC_GIPHY_API_KEY as string | undefined) ??
    (import.meta.env.VITE_GIPHY_API_KEY as string | undefined)
  )?.trim();
}

function getBestGifUrl16x9(gif: GiphyGif): string | null {
  const images = gif.images;
  if (!images) return null;

  const candidates: Array<GiphyImageVariant & { key: string }> = [];
  for (const [key, v] of Object.entries(images)) {
    if (!v?.url || !v.width || !v.height) continue;
    const w = Number(v.width);
    const h = Number(v.height);
    if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) continue;
    candidates.push({ key, url: v.url, width: v.width, height: v.height });
  }
  if (!candidates.length) return null;

  const target = 16 / 9;
  candidates.sort((a, b) => {
    const ra = Number(a.width) / Number(a.height);
    const rb = Number(b.width) / Number(b.height);
    const da = Math.abs(ra - target);
    const db = Math.abs(rb - target);
    return da - db;
  });
  return candidates[0]?.url ?? null;
}

export async function fetchTwitterGif16x9(params: {
  query: string;
}): Promise<{ url: string } | null> {
  const apiKey = getGiphyApiKey();
  if (!apiKey) throw new Error("NEXT_PUBLIC_GIPHY_API_KEY is missing.");

  const q = params.query.trim();
  if (!q) return null;

  const gf = new GiphyFetch(apiKey);
  const res = await gf.search(q, { limit: 10, offset: 0, rating: "pg-13" });
  const data = (res?.data ?? []) as GiphyGif[];
  for (const gif of data) {
    const url = getBestGifUrl16x9(gif);
    if (url) return { url };
  }
  return null;
}


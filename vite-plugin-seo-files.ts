import fs from "node:fs/promises";
import path from "node:path";
import type { Plugin } from "vite";

const DEFAULT_SITE = "https://tap-tap828288.vercel.app";

function getSiteUrl(): string {
  const fromEnv = process.env.SITE_URL?.trim().replace(/\/+$/, "");
  if (fromEnv) return fromEnv;
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "");
    return `https://${host}`;
  }
  return DEFAULT_SITE;
}

function formatRssDate(d: Date): string {
  return d.toUTCString();
}

/**
 * public/에서 복사된 뒤 dist 루트의 sitemap·rss·robots를
 * 빌드 시점의 정식 도메인(SITE_URL / VERCEL_URL)으로 덮어씁니다.
 */
export function seoDistFilesPlugin(): Plugin {
  let outDir = "dist";

  return {
    name: "seo-dist-files",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      const base = getSiteUrl();
      const now = new Date();
      const day = now.toISOString().slice(0, 10);
      const rssDate = formatRssDate(now);

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${base}/</loc>
    <lastmod>${day}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

      const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>TapTap(탭탭)</title>
    <link>${base}/</link>
    <description>일상의 생각을 SNS에 맞게 변환하는 TapTap(탭탭) 랜딩페이지</description>
    <language>ko-KR</language>
    <lastBuildDate>${rssDate}</lastBuildDate>
    <atom:link href="${base}/rss.xml" rel="self" type="application/rss+xml"/>
    <item>
      <title>TapTap(탭탭) — 메인</title>
      <link>${base}/</link>
      <guid isPermaLink="true">${base}/</guid>
      <pubDate>${rssDate}</pubDate>
      <description>사전예약 및 서비스 소개</description>
    </item>
  </channel>
</rss>
`;

      const robots = `User-agent: *
Allow: /

# 크롤링 힌트(순응 봇용). 실제 파일 노출 차단은 호스팅·서버 설정으로 보장하세요.
Disallow: /.env
Disallow: /.env.local
Disallow: /.env.development
Disallow: /.env.development.local
Disallow: /.env.production
Disallow: /.env.production.local
Disallow: /.git
Disallow: /.git/
Disallow: /package.json
Disallow: /package-lock.json
Disallow: /pnpm-lock.yaml
Disallow: /yarn.lock
Disallow: /bun.lock
Disallow: /tsconfig.json
Disallow: /vite.config.ts
Disallow: /src/
Disallow: /node_modules/

Sitemap: ${base}/sitemap.xml
`;

      await fs.writeFile(path.join(outDir, "sitemap.xml"), sitemap, "utf8");
      await fs.writeFile(path.join(outDir, "rss.xml"), rss, "utf8");
      await fs.writeFile(path.join(outDir, "robots.txt"), robots, "utf8");
    },
  };
}

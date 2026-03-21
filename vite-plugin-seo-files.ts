import fs from "node:fs/promises";
import path from "node:path";
import type { Plugin } from "vite";

const DEFAULT_SITE = "https://tap-tap828288.vercel.app";

/** Search Console: sitemap <loc> 과 사이트맵 파일 URL의 호스트·스킴이 일치해야 함 (Path mismatch / URL not allowed 방지) */
function normalizeCanonicalOrigin(raw: string): string {
  let u = raw.trim().replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(u)) u = `https://${u}`;
  u = u.replace(/^http:\/\//i, "https://");
  return u;
}

function getSiteUrl(): string {
  const fromEnv = process.env.SITE_URL?.trim();
  if (fromEnv) return normalizeCanonicalOrigin(fromEnv);
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "");
    return `https://${host}`;
  }
  return DEFAULT_SITE;
}

/** XML 텍스트/속성값 이스케이프 (Parsing error / Invalid URL 방지) */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** W3C Datetime: 날짜만 (Google 가이드 예: 2005-02-21) */
function formatSitemapLastmod(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** RSS 2.0 pubDate / lastBuildDate — RFC 822 형식 */
function formatRssDate(d: Date): string {
  return d.toUTCString();
}

/**
 * public/에서 복사된 뒤 dist 루트의 sitemap·rss·robots를
 * 빌드 시점의 정식 도메인(SITE_URL / VERCEL_URL)으로 덮어씁니다.
 *
 * 참고: https://support.google.com/webmasters/answer/7451001#error_list
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
      const canonicalHome = `${base}/`;
      const sitemapUrl = `${base}/sitemap.xml`;
      const rssUrl = `${base}/rss.xml`;
      const now = new Date();
      const lastmod = formatSitemapLastmod(now);
      const rssDate = formatRssDate(now);

      // 선행 공백 없이 XML 선언으로 시작 (Leading whitespace 경고 방지)
      const sitemap =
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        `  <url>\n` +
        `    <loc>${escapeXml(canonicalHome)}</loc>\n` +
        `    <lastmod>${lastmod}</lastmod>\n` +
        `    <changefreq>weekly</changefreq>\n` +
        `    <priority>1.0</priority>\n` +
        `  </url>\n` +
        `</urlset>\n`;

      const rss =
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n` +
        `  <channel>\n` +
        `    <title>${escapeXml("TapTap(탭탭)")}</title>\n` +
        `    <link>${escapeXml(canonicalHome)}</link>\n` +
        `    <description>${escapeXml("일상의 생각을 SNS에 맞게 변환하는 TapTap(탭탭) 랜딩페이지")}</description>\n` +
        `    <language>ko-KR</language>\n` +
        `    <lastBuildDate>${rssDate}</lastBuildDate>\n` +
        `    <atom:link href="${escapeXml(rssUrl)}" rel="self" type="application/rss+xml"/>\n` +
        `    <item>\n` +
        `      <title>${escapeXml("TapTap(탭탭) — 메인")}</title>\n` +
        `      <link>${escapeXml(canonicalHome)}</link>\n` +
        `      <guid isPermaLink="true">${escapeXml(canonicalHome)}</guid>\n` +
        `      <pubDate>${rssDate}</pubDate>\n` +
        `      <description>${escapeXml("사전예약 및 서비스 소개")}</description>\n` +
        `    </item>\n` +
        `  </channel>\n` +
        `</rss>\n`;

      const robots =
        `# Google Search Console: 사이트맵 가져오기 차단 방지 — sitemap.xml·rss.xml 명시 허용\n` +
        `# https://support.google.com/webmasters/answer/7451001#error_list\n` +
        `User-agent: *\n` +
        `Allow: /sitemap.xml\n` +
        `Allow: /rss.xml\n` +
        `Allow: /\n` +
        `\n` +
        `# 크롤링 힌트(순응 봇용). 실제 노출 차단은 호스팅·서버 설정으로 보장하세요.\n` +
        `Disallow: /.env\n` +
        `Disallow: /.env.local\n` +
        `Disallow: /.env.development\n` +
        `Disallow: /.env.development.local\n` +
        `Disallow: /.env.production\n` +
        `Disallow: /.env.production.local\n` +
        `Disallow: /.git\n` +
        `Disallow: /.git/\n` +
        `Disallow: /package.json\n` +
        `Disallow: /package-lock.json\n` +
        `Disallow: /pnpm-lock.yaml\n` +
        `Disallow: /yarn.lock\n` +
        `Disallow: /bun.lock\n` +
        `Disallow: /tsconfig.json\n` +
        `Disallow: /vite.config.ts\n` +
        `Disallow: /src/\n` +
        `Disallow: /node_modules/\n` +
        `\n` +
        `Sitemap: ${sitemapUrl}\n`;

      await fs.writeFile(path.join(outDir, "sitemap.xml"), sitemap, "utf8");
      await fs.writeFile(path.join(outDir, "rss.xml"), rss, "utf8");
      await fs.writeFile(path.join(outDir, "robots.txt"), robots, "utf8");
    },
  };
}

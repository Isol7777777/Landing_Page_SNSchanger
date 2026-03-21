import { writeFileSync } from 'fs'
import path from 'path'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

function resolveCanonicalSiteUrl(mode: string): string {
  const env = loadEnv(mode, process.cwd(), '')
  let base = env.VITE_SITE_URL?.trim().replace(/\/$/, '') ?? ''
  if (!base && process.env.VERCEL_URL) {
    base = `https://${process.env.VERCEL_URL}`.replace(/\/$/, '')
  }
  if (!base) {
    // 프로덕션 기본 도메인 (커스텀 도메인 쓰면 VITE_SITE_URL로 덮어쓰기)
    base = 'https://tap-tap828288.vercel.app'
    console.info(`[vite] VITE_SITE_URL 미설정 → sitemap/rss/robots에 기본값 사용: ${base}`)
  }
  return base
}

/** 빌드 완료 후 dist에 sitemap.xml, rss.xml, robots.txt 생성 (Search Console용) */
function generateSeoFilesPlugin(siteUrl: string): Plugin {
  let outDir = 'dist'
  return {
    name: 'generate-seo-files',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
    },
    closeBundle() {
      const dir = path.resolve(process.cwd(), outDir)
      const lastmod = new Date().toISOString().slice(0, 10)
      const pubDate = new Date().toUTCString()

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`

      const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>TapTap(탭탭)</title>
    <link>${siteUrl}/</link>
    <description>일상의 생각을 SNS에 맞게 변환하는 TapTap(탭탭) 랜딩페이지</description>
    <language>ko-KR</language>
    <lastBuildDate>${pubDate}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <item>
      <title>TapTap(탭탭) — 메인</title>
      <link>${siteUrl}/</link>
      <guid isPermaLink="true">${siteUrl}/</guid>
      <pubDate>${pubDate}</pubDate>
      <description>사전예약 및 서비스 소개</description>
    </item>
  </channel>
</rss>
`

      const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`

      writeFileSync(path.join(dir, 'sitemap.xml'), sitemap, 'utf8')
      writeFileSync(path.join(dir, 'rss.xml'), rss, 'utf8')
      writeFileSync(path.join(dir, 'robots.txt'), robots, 'utf8')
      console.info(`[generate-seo-files] → ${path.join(dir, 'sitemap.xml')}, rss.xml, robots.txt (${siteUrl})`)
    },
  }
}

export default defineConfig(({ mode }) => {
  const siteUrl = resolveCanonicalSiteUrl(mode)

  return {
    // Allow Next-style NEXT_PUBLIC_* env vars in Vite.
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    plugins: [
      react(),
      tailwindcss(),
      generateSeoFilesPlugin(siteUrl),
      process.env.ANALYZE === 'true' &&
        visualizer({
          filename: 'dist/stats.html',
          template: 'treemap',
          gzipSize: true,
          brotliSize: true,
          open: false,
        }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    assetsInclude: ['**/*.svg', '**/*.csv'],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return
            const modulePath = id.split('node_modules/')[1] ?? ''
            const pkg = modulePath.startsWith('@')
              ? modulePath.split('/').slice(0, 2).join('/')
              : modulePath.split('/')[0]

            if (pkg === 'modern-screenshot') return 'vendor-capture'
            if (pkg === '@supabase/supabase-js') return 'vendor-supabase'
            if (pkg === '@google/generative-ai') return 'vendor-ai'
            if (pkg === 'motion') return 'vendor-motion'
            return
          },
        },
      },
    },
  }
})

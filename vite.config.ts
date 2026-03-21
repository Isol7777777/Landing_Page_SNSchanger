import path from 'path'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { seoDistFilesPlugin } from './vite-plugin-seo-files'

// public/ 의 sitemap·rss·robots 는 dev용; 프로덕션 빌드 시 seoDistFilesPlugin 이 SITE_URL/VERCEL_URL 기준으로 dist 루트에 덮어씀

export default defineConfig({
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  plugins: [
    react(),
    tailwindcss(),
    seoDistFilesPlugin(),
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
})

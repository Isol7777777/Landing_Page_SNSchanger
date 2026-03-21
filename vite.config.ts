import path from 'path'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// sitemap.xml, rss.xml, robots.txt → public/ 에 두면 빌드 시 dist 루트로 복사됨 (Vite 기본 동작)

export default defineConfig({
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  plugins: [
    react(),
    tailwindcss(),
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

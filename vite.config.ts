import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  // Allow Next-style NEXT_PUBLIC_* env vars in Vite.
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
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
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
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
          // Leave the rest to Rollup defaults to avoid circular-chunk traps.
          return
        },
      },
    },
  },
})

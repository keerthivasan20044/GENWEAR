import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import compression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: 'react',
      fastRefresh: true,
    }),
    // compression({
    //   algorithm: 'gzip',
    //   ext: '.gz',
    // }),
  ],
  server: {
    port: 5173,
    host: 'localhost',
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      }
    },
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
    },
    cors: true,
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false,
    cssCodeSplit: true,
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom',
          ],
          'state-management': [
            '@reduxjs/toolkit',
            'react-redux',
            'redux-persist',
          ],
          'utils': [
            'axios',
            'lodash',
          ],
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@reduxjs/toolkit',
      'react-redux',
      'axios',
      'framer-motion',
      'lucide-react',
    ],
    exclude: ['node_modules/.vite'],
  },
})

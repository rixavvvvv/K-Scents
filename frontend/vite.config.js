import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
  server: {
    port: 5500,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5100',
        changeOrigin: true,
      },
    },
  },
})

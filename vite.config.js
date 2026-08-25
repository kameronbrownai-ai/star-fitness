import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@mediapipe/tasks-vision'],
  },
  server: {
    proxy: {
      // Dev proxies to the live API so local testing exercises the real backend.
      // In production nginx maps /api/ -> localhost:3001 directly.
      '/api': {
        target: 'https://starmat.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})

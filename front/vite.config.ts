import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,   // binds to 0.0.0.0 — required for Docker port mapping
    watch: {
      usePolling: true,
      interval: 100,
      ignored: ['**/node_modules/**', '**/.git/**'],
    },
    hmr: {
      overlay: true,
    },
  },
})

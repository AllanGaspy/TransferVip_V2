import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3003,
    open: '/admin/login'
  },
  build: {
    outDir: 'dist'
  }
})

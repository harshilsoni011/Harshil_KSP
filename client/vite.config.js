import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/users': 'http://localhost:8000',
      '/question': 'http://localhost:8000',
      '/answers': 'http://localhost:8000',
      '/tags': 'http://localhost:8000',
    },
  },
}) 
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
  },
  allowedHosts: ['*'],
  preview: {
    host: '0.0.0.0',
    port: 10000,
    allowedHosts: ['terra-frontend-1fma.onrender.com'],
  },
  base: '/',
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5199 },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        poster: resolve(__dirname, 'poster/index.html'),
        signup: resolve(__dirname, 'signup/index.html'),
      },
    },
  },
})

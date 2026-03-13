import { defineConfig } from 'vite'
import { lovinspPlugin } from 'lovinsp'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import fs from 'fs'

function reviewPersistPlugin() {
  const dataDir = resolve(__dirname, 'review')
  const dataFile = resolve(dataDir, 'review-data.json')

  const load = () => {
    try { return JSON.parse(fs.readFileSync(dataFile, 'utf-8')) } catch { return {} }
  }

  return {
    name: 'review-persist',
    configureServer(server) {
      server.middlewares.use('/api/review-data', (req, res) => {
        if (req.method === 'GET') {
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify(load()))
        } else if (req.method === 'POST') {
          let body = ''
          req.on('data', c => body += c)
          req.on('end', () => {
            try {
              const data = JSON.parse(body)
              const existing = load()
              Object.assign(existing, data)
              fs.writeFileSync(dataFile, JSON.stringify(existing, null, 2))
              res.end('ok')
            } catch (e) {
              res.statusCode = 400
              res.end(e.message)
            }
          })
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [lovinspPlugin({ bundler: 'vite' }), react(), tailwindcss(), reviewPersistPlugin()],
  server: {
    port: 5199,
    watch: { ignored: ['**/review-data.json'] },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        poster: resolve(__dirname, 'poster/index.html'),
        signup: resolve(__dirname, 'signup/index.html'),
        review: resolve(__dirname, 'review/index.html'),
      },
    },
  },
})

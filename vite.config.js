import { defineConfig } from 'vite'
import { lovinspPlugin } from 'lovinsp'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import fs from 'fs'

function aiProxyPlugin() {
  return {
    name: 'ai-proxy',
    configureServer(server) {
      server.middlewares.use('/api/ai-score', (req, res) => {
        if (req.method !== 'POST') { res.statusCode = 405; res.end(); return }
        let body = ''
        req.on('data', c => body += c)
        req.on('end', async () => {
          try {
            const { buildPrompt } = await import('./review/prompt.js')
            const { record } = JSON.parse(body)
            const upstream = await fetch('https://zenmux.ai/api/v1/messages', {
              method: 'POST',
              headers: {
                'x-api-key': process.env.ZENMUX_API_KEY,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json',
              },
              body: JSON.stringify({
                model: 'claude-opus-4-6',
                max_tokens: 512,
                stream: true,
                messages: [{ role: 'user', content: buildPrompt(record) }],
              }),
            })
            res.writeHead(upstream.status, {
              'content-type': 'text/event-stream',
              'cache-control': 'no-cache',
            })
            upstream.body.pipeTo(new WritableStream({
              write(chunk) { res.write(chunk) },
              close() { res.end() },
            }))
          } catch (e) {
            res.statusCode = 500
            res.end(e.message)
          }
        })
      })
    },
  }
}

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
  plugins: [lovinspPlugin({ bundler: 'vite' }), react(), tailwindcss(), aiProxyPlugin(), reviewPersistPlugin()],
  server: {
    port: 5199,
    host: true,
    watch: { ignored: ['**/review-data.json'] },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        poster: resolve(__dirname, 'poster/index.html'),
        signup: resolve(__dirname, 'signup/index.html'),
        review: resolve(__dirname, 'review/index.html'),
        checkin: resolve(__dirname, 'checkin/index.html'),
        checkinAdmin: resolve(__dirname, 'checkin/admin.html'),
        checkinQrcodes: resolve(__dirname, 'checkin/qrcodes.html'),
        reviewDemo: resolve(__dirname, 'review/demo.html'),
        broadcast: resolve(__dirname, 'broadcast/index.html'),
        wayfinding: resolve(__dirname, 'wayfinding/index.html'),
      },
    },
  },
})

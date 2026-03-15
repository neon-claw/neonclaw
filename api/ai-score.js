import { buildPrompt } from '../review/prompt.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { record } = req.body
  if (!record) return res.status(400).json({ error: 'missing record' })

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

  if (!upstream.ok) {
    return res.status(upstream.status).json({ error: 'upstream error' })
  }

  res.setHeader('content-type', 'text/event-stream')
  res.setHeader('cache-control', 'no-cache')

  const reader = upstream.body.getReader()
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    res.write(value)
  }
  res.end()
}

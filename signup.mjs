import { createInterface } from 'node:readline'

const SUPABASE_URL = 'https://nouchjcfeoobplxkwasg.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vdWNoamNmZW9vYnBseGt3YXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNjI1OTMsImV4cCI6MjA4MTczODU5M30.P3A_AoAjp0EXIafeBBeqp972h_lO7oXjbKgu0OdMsjA'
const ROLES = ['开发者', '创业者', '投资人', '学生', '其他']

function ask(rl, question) {
  return new Promise((resolve) => rl.question(question, resolve))
}

export async function signup() {
  const rl = createInterface({ input: process.stdin, output: process.stdout })

  console.log(`
  ╔══════════════════════════════════╗
  ║  OpenClaw Meetup · 报名         ║
  ║  March 14, 2026 · Beijing       ║
  ╚══════════════════════════════════╝
`)

  const name = (await ask(rl, '  姓名: ')).trim()
  if (!name) { console.log('\n  ✗ 姓名不能为空'); rl.close(); process.exit(1) }

  const wechat = (await ask(rl, '  微信号: ')).trim()
  if (!wechat) { console.log('\n  ✗ 微信号不能为空'); rl.close(); process.exit(1) }

  console.log(`\n  你是: ${ROLES.map((r, i) => `[${i + 1}] ${r}`).join('  ')}`)
  const roleIdx = (await ask(rl, '  选择 (1-5): ')).trim()
  const role = ROLES[parseInt(roleIdx, 10) - 1]
  if (!role) { console.log('\n  ✗ 请选择 1-5'); rl.close(); process.exit(1) }

  const intro = (await ask(rl, '  一句话介绍自己（回车跳过）: ')).trim() || null

  rl.close()

  const res = await fetch(`${SUPABASE_URL}/rest/v1/neonclaw_signups`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ name, wechat, role, intro }),
  })

  if (res.ok) {
    console.log('\n  ✓ 报名成功！我们会通过微信联系你。\n')
  } else {
    const err = await res.json().catch(() => ({}))
    console.log(`\n  ✗ 报名失败: ${err.message || res.statusText}\n`)
    process.exit(1)
  }
}

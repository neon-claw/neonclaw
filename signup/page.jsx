import '../app.css'
import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { supabase } from './supabase.js'
import { Layout } from '../components/Layout.jsx'
import { CAPACITY, VENUE } from '../constants.js'

const ROLES = ['开发者', '创业者', '投资人', '学生', '其他']

const SignupPage = () => {
  const [form, setForm] = useState({ name: '', wechat: '', role: '', intro: '' })
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.wechat || !form.role) return
    setStatus('submitting')
    const { error } = await supabase.from('neonclaw_signups').insert({
      name: form.name,
      wechat: form.wechat,
      role: form.role,
      intro: form.intro || null,
    })
    if (error) {
      setStatus('error')
      setErrorMsg(error.message)
    } else {
      setStatus('success')
    }
  }

  const inputClass = 'w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 outline-none focus:border-[#FF3B00] focus:ring-1 focus:ring-[#FF3B00] transition-colors'
  const labelClass = 'block text-sm text-white/60 mb-1.5'

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-16 pb-12 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF3B00]/10 to-transparent pointer-events-none" />
        <div className="relative max-w-2xl mx-auto">
          <p className="text-[#FF3B00] text-sm tracking-[0.3em] uppercase mb-4" style={{ fontFamily: 'Anonymous Pro' }}>
            March 14, 2026 · Beijing
          </p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-4" style={{ fontFamily: 'Inter', fontWeight: 900 }}>
            <span className="text-[#FF3B00]">Neon</span>Claw
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ fontFamily: 'Inter', fontWeight: 700 }}>
            AI Meetup
          </h2>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-white/60" style={{ fontFamily: 'Anonymous Pro' }}>
            <span><i className="fa-solid fa-location-dot mr-1.5 text-[#FF3B00]" />{VENUE}</span>
            <span><i className="fa-solid fa-clock mr-1.5 text-[#FF3B00]" />19:00 - 22:00</span>
            <span><i className="fa-solid fa-users mr-1.5 text-[#FF3B00]" />{`限 ${CAPACITY} 人`}</span>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="max-w-2xl mx-auto px-6 pb-12">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="border border-white/10 rounded-xl p-5 bg-white/[0.02]">
            <div className="text-[#FF3B00] text-lg mb-2"><i className="fa-solid fa-microphone" /></div>
            <h3 className="font-bold mb-1.5" style={{ fontFamily: 'Inter' }}>嘉宾分享</h3>
            <p className="text-sm text-white/50 leading-relaxed">AI 创业者、技术大牛、投资人现场分享，涵盖 Agent、Vibe Coding、AI Infra 等前沿话题</p>
          </div>
          <div className="border border-white/10 rounded-xl p-5 bg-white/[0.02]">
            <div className="text-[#FF3B00] text-lg mb-2"><i className="fa-solid fa-gamepad" /></div>
            <h3 className="font-bold mb-1.5" style={{ fontFamily: 'Inter' }}>NeonClaw Game</h3>
            <p className="text-sm text-white/50 leading-relaxed">大型多人在线 Agent 沙盒 — 激活龙虾、组队结盟、见证文明涌现</p>
          </div>
        </div>
      </section>

      {/* Signup Form */}
      <section className="max-w-lg mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-center mb-8" style={{ fontFamily: 'Inter' }}>
          立即<span className="text-[#FF3B00]">报名</span>
        </h2>

        {status === 'success' ? (
          <div className="text-center border border-[#FF3B00]/30 rounded-xl p-8 bg-[#FF3B00]/5">
            <div className="text-4xl mb-4"><i className="fa-solid fa-check-circle text-[#FF3B00]" /></div>
            <h3 className="text-xl font-bold mb-2">报名成功!</h3>
            <p className="text-white/50 text-sm">我们会通过微信联系你，确认参会信息。</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={labelClass}>姓名 *</label>
              <input type="text" value={form.name} onChange={set('name')} placeholder="你的名字" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>微信号 *</label>
              <input type="text" value={form.wechat} onChange={set('wechat')} placeholder="方便我们联系你" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>你是 *</label>
              <div className="flex flex-wrap gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, role: r }))}
                    className={`px-4 py-2 rounded-lg border text-sm transition-colors cursor-pointer ${
                      form.role === r
                        ? 'border-[#FF3B00] bg-[#FF3B00]/10 text-[#FF3B00]'
                        : 'border-white/20 text-white/50 hover:border-white/40'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>一句话介绍自己（选填）</label>
              <input type="text" value={form.intro} onChange={set('intro')} placeholder="例：做 AI Agent 的独立开发者" className={inputClass} />
            </div>

            {status === 'error' && (
              <p className="text-red-400 text-sm">{errorMsg || '提交失败，请重试'}</p>
            )}

            <button
              type="submit"
              disabled={!form.name || !form.wechat || !form.role || status === 'submitting'}
              className="w-full py-3.5 bg-[#FF3B00] hover:bg-[#FF3B00]/90 text-white font-bold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {status === 'submitting' ? '提交中...' : '确认报名'}
            </button>
          </form>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 text-center">
        <p className="text-white/20 text-xs mb-3" style={{ fontFamily: 'Anonymous Pro' }}>
          npx neonclaw signup
        </p>
        <p className="text-white/30 text-sm">
          报名/商务：Ariel（微信 ashincherry_love）&nbsp;&nbsp;|&nbsp;&nbsp;统筹/技术：手工川（微信 youshouldspeakhow）
        </p>
      </footer>
    </Layout>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<SignupPage />)

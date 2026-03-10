import './app.css'
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { Layout } from './components/Layout.jsx'
import { supabase } from './signup/supabase.js'

const useSignups = () => {
  const [count, setCount] = useState(null)
  const [members, setMembers] = useState([])

  useEffect(() => {
    const load = async () => {
      const { count: c, data } = await supabase
        .from('neonclaw_signups')
        .select('name, role, intro, created_at', { count: 'exact' })
        .order('created_at', { ascending: false })
      setCount(c)
      setMembers(data || [])
    }
    load()
    const ch = supabase
      .channel('signups')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'neonclaw_signups' }, () => load())
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [])

  return { count, members }
}

const speakers = [
  { name: '手工川', title: 'Lovstudio.ai 创始人 · Vibe Coding 布道者', topic: '新世界没有旧神' },
  { name: '杨天润', title: 'Naughty Labs 创始人 · NeonClaw Top贡献者', topic: 'Agentic Engineering：让 Agent 自己写代码' },
  { name: '江志桐', title: '天际资本董事总经理', topic: '什么样的 AI 公司值得投？' },
  { name: '苏嘉奕', title: 'MiniMax 开放平台生态负责人', topic: '从工具到生态：大模型平台的进化之路' },
  { name: '黄力昂', title: '共绩科技联合创始人', topic: '龙虾距离永生还有多久？' },
  { name: '郎瀚威', title: '硅谷 AI 观察者', topic: '硅谷前线：海外龙虾生态全景扫描（线上）' },
  { name: '叶震杰', title: 'ZenMux 联合创始人 · 产品负责人', topic: '小龙虾——ZenMux 的第 11 号员工' },
  { name: 'HW', title: '独立 Agent 开发者', topic: '一个人如何创建 93 个 Agent 技能？' },
  { name: '尹子萧', title: '首序智能工程师', topic: 'Agent 安全攻防：让你的龙虾刀枪不入' },
  { name: '熊楚伊', title: 'Veryloving.ai 创始人', topic: '当 AI 成为她的守护者' },
  { name: '常识', title: 'Kusart 创始人', topic: 'OpenClaw 企业级落地实战（线上）' },
  { name: '张舒昱', title: '某爆火 Claw 产品负责人', topic: '线上连麦' },
]

const schedule = [
  { time: '09:30', label: '签到入场' },
  { time: '10:00', label: '开场 & NeonClaw 发布' },
  { time: '10:30', label: '嘉宾分享' },
  { time: '12:00', label: '午餐 & 自由交流' },
  { time: '14:00', label: 'NeonClaw Game 互动' },
  { time: '16:00', label: '圆桌讨论' },
  { time: '17:30', label: '自由社交 & 结束' },
]

const LandingPage = () => {
  const { count: signupCount, members } = useSignups()
  const CAPACITY = 150

  return (
  <Layout>
    {/* Hero */}
    <section className="relative overflow-hidden px-6 pt-20 pb-16 text-center">
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#FF3B00]/8 via-transparent to-transparent pointer-events-none" />
      <div className="relative max-w-3xl mx-auto">
        <p className="text-[#FF3B00] text-sm tracking-[0.3em] uppercase mb-6" style={{ fontFamily: 'Anonymous Pro' }}>
          March 14, 2026 · Beijing
        </p>
        <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none mb-3" style={{ fontFamily: 'Inter', fontWeight: 900 }}>
          <span className="text-[#FF3B00]">Neon</span>Claw
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'Inter', fontWeight: 700 }}>
          Meetup
        </h2>
        <p className="text-xl text-white/60 mb-8">探索 Agent 文明的可能性</p>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-white/50 mb-10" style={{ fontFamily: 'Anonymous Pro' }}>
          <span><i className="fa-solid fa-location-dot mr-1.5 text-[#FF3B00]" />北京海淀 · 中关村科技园</span>
          <span><i className="fa-solid fa-clock mr-1.5 text-[#FF3B00]" />09:30 - 18:00</span>
          <span><i className="fa-solid fa-users mr-1.5 text-[#FF3B00]" />{signupCount !== null ? <>{signupCount} / {CAPACITY} 人已报名</> : <>限 {CAPACITY} 人</>}</span>
        </div>
        {signupCount !== null && (
          <div className="max-w-xs mx-auto mt-6 mb-2">
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#FF3B00] rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (signupCount / CAPACITY) * 100)}%` }} />
            </div>
          </div>
        )}
        <div className="flex justify-center gap-4">
          <a href="/signup/" className="px-8 py-3 bg-[#FF3B00] hover:bg-[#FF3B00]/85 text-white font-bold rounded-lg transition-colors no-underline">
            立即报名
          </a>
          <a href="/poster/" className="px-8 py-3 bg-white/10 hover:bg-white/15 text-white font-bold rounded-lg border border-white/20 transition-colors no-underline">
            查看海报
          </a>
        </div>
      </div>
    </section>

    {/* Highlights */}
    <section className="max-w-3xl mx-auto px-6 pb-16">
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { icon: 'fa-microphone', title: '嘉宾分享', desc: 'AI 创业者、技术大牛、投资人现场分享 Agent、Vibe Coding、AI Infra 前沿话题' },
          { icon: 'fa-gamepad', title: 'NeonClaw Game', desc: '大型多人在线 Agent 沙盒 — 激活龙虾、组队结盟、见证文明涌现' },
          { icon: 'fa-people-group', title: '深度社交', desc: '150 位开发者、创业者、投资人面对面，建立真实连接' },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="border border-white/10 rounded-xl p-5 bg-white/[0.02]">
            <div className="text-[#FF3B00] text-lg mb-3"><i className={`fa-solid ${icon}`} /></div>
            <h3 className="font-bold mb-2" style={{ fontFamily: 'Inter' }}>{title}</h3>
            <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Speakers */}
    <section className="max-w-4xl mx-auto px-6 pb-16">
      <h2 className="text-2xl font-bold mb-10 text-center" style={{ fontFamily: 'Inter' }}>
        <span className="text-[#FF3B00]">/</span> 嘉宾阵容
      </h2>
      <div className="grid md:grid-cols-2 gap-0 border border-white/10">
        {speakers.map((s, i) => (
          <div
            key={s.name}
            className="group relative border-b border-r border-white/10 p-6 hover:bg-[#FF3B00]/5 transition-colors"
          >
            {/* Index */}
            <span className="absolute top-3 right-4 text-[10px] text-white/15" style={{ fontFamily: 'Anonymous Pro' }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            {/* Name row */}
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-lg font-black tracking-tight group-hover:text-[#FF3B00] transition-colors" style={{ fontFamily: 'Inter' }}>
                {s.name}
              </span>
              <span className="h-px flex-1 bg-white/10" />
            </div>
            {/* Title */}
            <p className="text-xs text-white/35 mb-2" style={{ fontFamily: 'Anonymous Pro' }}>{s.title}</p>
            {/* Topic */}
            <p className="text-sm text-white/70 pl-3 border-l-2 border-[#FF3B00]/40">{s.topic}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Schedule */}
    <section className="max-w-3xl mx-auto px-6 pb-16">
      <h2 className="text-2xl font-bold mb-8 text-center" style={{ fontFamily: 'Inter' }}>
        <span className="text-[#FF3B00]">/</span> 活动日程
      </h2>
      <div className="space-y-0">
        {schedule.map((item, i) => (
          <div key={i} className="flex items-center gap-4 py-3 border-b border-white/5">
            <span className="text-sm text-[#FF3B00] w-14 shrink-0" style={{ fontFamily: 'Anonymous Pro' }}>{item.time}</span>
            <div className="w-2 h-2 rounded-full bg-[#FF3B00]/40 shrink-0" />
            <span className="text-sm text-white/70">{item.label}</span>
          </div>
        ))}
      </div>
    </section>

    {/* Members */}
    {members.length > 0 && (
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold mb-8 text-center" style={{ fontFamily: 'Inter' }}>
          <span className="text-[#FF3B00]">/</span> 已报名
          <span className="text-sm font-normal text-white/30 ml-3" style={{ fontFamily: 'Anonymous Pro' }}>{members.length} registered</span>
        </h2>
        <div className="flex flex-wrap gap-2 justify-center">
          {members.map((m, i) => (
            <div
              key={i}
              className="group relative px-3 py-1.5 border border-white/10 rounded-md bg-white/[0.02] hover:border-[#FF3B00]/30 hover:bg-[#FF3B00]/5 transition-colors"
            >
              <span className="text-sm text-white/70 group-hover:text-white transition-colors">{m.name}</span>
              <span className="text-xs text-white/25 ml-1.5" style={{ fontFamily: 'Anonymous Pro' }}>{m.role}</span>
              {m.intro && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black border border-white/10 rounded-lg text-xs text-white/60 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {m.intro}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    )}

    {/* CTA */}
    <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
      <div className="border border-[#FF3B00]/20 rounded-2xl p-10 bg-gradient-to-b from-[#FF3B00]/5 to-transparent">
        <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'Inter' }}>
          加入 <span className="text-[#FF3B00]">NeonClaw</span>
        </h2>
        <p className="text-white/50 mb-6">3 月 14 日，和 150 位 AI Builder 一起探索 Agent 文明</p>
        <a href="/signup/" className="inline-block px-10 py-3.5 bg-[#FF3B00] hover:bg-[#FF3B00]/85 text-white font-bold rounded-lg transition-colors no-underline">
          立即报名
        </a>
      </div>
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

ReactDOM.createRoot(document.getElementById('root')).render(<LandingPage />)

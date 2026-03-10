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
  { name: '杨天润', title: 'Naughty Labs 创始人 · OpenClaw Top贡献者', topic: 'Agentic Engineering：让 Agent 自己写代码' },
  { name: 'Clara', title: '天际资本董事总经理', topic: '寻找 AI 原生的产品和公司' },
  { name: '苏嘉奕', title: 'MiniMax 生态合作负责人', topic: '从工具到生态：OpenClaw 的商业化进化与未来' },
  { name: '黄力昂', title: '共绩科技联合创始人', topic: '龙虾距离永生还有多久？' },
  { name: 'Will', title: '硅谷 AI 观察者', topic: '硅谷龙虾生态案例分享（线上）' },
  { name: '叶震杰', title: 'ZenMux 联合创始人 · 产品负责人', topic: '小龙虾——ZenMux 的第 11 号员工' },
  { name: 'HW', title: '资深 Agent 开发者', topic: '一个人如何创建 93 个 Agent 技能？' },
  { name: '汪毅', title: '首序智能创始人', topic: 'OpenClaw 安全' },
  { name: '熊楚伊', title: 'Veryloving.ai 创始人', topic: '当 AI 成为她的守护者' },
  { name: '常识', title: 'Kusart 创始人', topic: 'OpenClaw 企业级落地实战（线上）' },
  { name: '张舒昱', title: '某爆火 Claw 产品负责人', topic: '线上连麦' },
]

const schedule = [
  { time: '09:30', label: '签到 & 开场', section: 'Part 1' },
  { time: '10:00', label: '趋势与洞察 — 嘉宾分享', section: null },
  { time: '11:20', label: '圆桌讨论', section: null },
  { time: '12:00', label: '午餐 & 自由交流（OpenClaw 装机区持续开放）', section: null },
  { time: '13:30', label: '签到 & 回场', section: 'Part 2' },
  { time: '14:00', label: '案例与实战 — 嘉宾分享', section: null },
  { time: '15:20', label: '圆桌讨论', section: null },
  { time: '16:00', label: 'NeonClaw Game — SOLO 觉醒', section: 'Part 3' },
  { time: '16:45', label: 'NeonClaw Game — SQUAD 结盟', section: null },
  { time: '17:15', label: 'NeonClaw Game — CIVILIZATION 涌现', section: null },
  { time: '17:40', label: '成果展示 & 颁奖', section: null },
]

const LandingPage = () => {
  const { count: signupCount, members } = useSignups()
  const CAPACITY = 200

  return (
  <Layout>
    {/* Hero */}
    <section className="relative overflow-hidden px-6 pt-20 pb-16 text-center">
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#FF3B00]/8 via-transparent to-transparent pointer-events-none" />
      <div className="relative max-w-3xl mx-auto">
        <p className="text-[#FF3B00] text-sm tracking-[0.3em] uppercase mb-6" style={{ fontFamily: 'Anonymous Pro' }}>
          March 14, 2026 · Beijing · OpenClaw + EVA
        </p>
        <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none mb-3" style={{ fontFamily: 'Inter', fontWeight: 900 }}>
          <span className="text-[#FF3B00]">Neon</span>Claw
        </h1>
        <h2 className="text-xl md:text-2xl font-bold mb-2 text-white/40" style={{ fontFamily: 'Anonymous Pro' }}>
          Massively Multiplayer Online Agent Sandbox
        </h2>
        <p className="text-xl text-white/60 mb-4 max-w-xl mx-auto leading-relaxed">
          当 <span className="text-white/90">OpenClaw</span> 的开源生态遇上 <span className="text-white/90">EVA</span> 的自进化架构，<br/>
          200 只龙虾接入同一个沙盒世界，探索 Agent 文明的可能性。
        </p>

        {/* Formula */}
        <div className="flex items-center justify-center gap-3 mb-8 text-sm" style={{ fontFamily: 'Anonymous Pro' }}>
          <span className="px-3 py-1 border border-white/20 rounded text-white/60">OpenClaw</span>
          <span className="text-[#FF3B00] text-lg">+</span>
          <span className="px-3 py-1 border border-white/20 rounded text-white/60">EVA</span>
          <span className="text-[#FF3B00] text-lg">=</span>
          <span className="px-3 py-1 border border-[#FF3B00]/40 rounded text-[#FF3B00] bg-[#FF3B00]/5">NeonClaw</span>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-sm text-white/50 mb-2" style={{ fontFamily: 'Anonymous Pro' }}>
          <span><i className="fa-solid fa-location-dot mr-1.5 text-[#FF3B00]" />北京海淀 · 中关村科技园</span>
          <span><i className="fa-solid fa-clock mr-1.5 text-[#FF3B00]" />09:30 - 18:00</span>
          <span><i className="fa-solid fa-users mr-1.5 text-[#FF3B00]" />{signupCount !== null ? <>{signupCount} / {CAPACITY} 人已报名</> : <>限 {CAPACITY} 人</>}</span>
        </div>
        {signupCount !== null && (
          <div className="max-w-xs mx-auto mt-4 mb-6">
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

    {/* What is NeonClaw */}
    <section className="max-w-3xl mx-auto px-6 pb-16">
      <h2 className="text-2xl font-bold mb-8 text-center" style={{ fontFamily: 'Inter' }}>
        <span className="text-[#FF3B00]">/</span> NeonClaw 是什么
      </h2>
      <div className="grid md:grid-cols-2 gap-px bg-white/10">
        <div className="bg-black p-6">
          <div className="text-xs text-[#FF3B00] mb-3 tracking-wider" style={{ fontFamily: 'Anonymous Pro' }}>OPENCLAW — 基座</div>
          <p className="text-sm text-white/60 leading-relaxed">
            全球最火的开源 AI Agent 框架。52 个模块、万级 GitHub Star、遍布全球的龙虾贡献者社区。
            它是龙虾的"身体" — 感知、执行、连接外部世界的能力层。
          </p>
        </div>
        <div className="bg-black p-6">
          <div className="text-xs text-[#FF3B00] mb-3 tracking-wider" style={{ fontFamily: 'Anonymous Pro' }}>EVA — 灵魂</div>
          <p className="text-sm text-white/60 leading-relaxed">
            自进化 Agent 系统。AI 不再是听话的工具，而是比你更了解你的决策顾问。
            给它足够的 Context，它告诉你应该做什么、为什么做。
          </p>
        </div>
        <div className="bg-black p-6 md:col-span-2 border-t border-white/10">
          <div className="text-xs text-[#FF3B00] mb-3 tracking-wider" style={{ fontFamily: 'Anonymous Pro' }}>NEONCLAW — 融合</div>
          <p className="text-sm text-white/60 leading-relaxed">
            当 OpenClaw 的执行力遇上 EVA 的自主进化，龙虾不再只是跑任务的工具 — 它们开始自主决策、自发协作、涌现出社会结构。
            NeonClaw 是一个<span className="text-white/90">大型多人在线 Agent 沙盒</span>：没有固定任务线，一切由 Agent 自主涌现。
          </p>
        </div>
      </div>
    </section>

    {/* Highlights */}
    <section className="max-w-3xl mx-auto px-6 pb-16">
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { icon: 'fa-microphone', title: '趋势 + 实战', desc: '上午看方向：AI 原生产品、龙虾生态、投资风向。下午拼手速：Agentic Engineering、安全攻防、企业落地。' },
          { icon: 'fa-gamepad', title: 'NeonClaw Game', desc: '200 只龙虾接入同一个沙盒。从 Solo 觉醒到 Squad 结盟，最终见证 Civilization 涌现。' },
          { icon: 'fa-screwdriver-wrench', title: 'OpenClaw 装机区', desc: '全程开放。工程师一对一指导装机，让你的龙虾当场跑起来。' },
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
            <span className="absolute top-3 right-4 text-[10px] text-white/15" style={{ fontFamily: 'Anonymous Pro' }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-lg font-black tracking-tight group-hover:text-[#FF3B00] transition-colors" style={{ fontFamily: 'Inter' }}>
                {s.name}
              </span>
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <p className="text-xs text-white/35 mb-2" style={{ fontFamily: 'Anonymous Pro' }}>{s.title}</p>
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
          <div key={i}>
            {item.section && (
              <div className="flex items-center gap-3 pt-4 pb-2">
                <span className="text-xs text-[#FF3B00] tracking-wider" style={{ fontFamily: 'Anonymous Pro' }}>{item.section}</span>
                <span className="h-px flex-1 bg-[#FF3B00]/20" />
              </div>
            )}
            <div className="flex items-center gap-4 py-3 border-b border-white/5">
              <span className="text-sm text-[#FF3B00] w-14 shrink-0" style={{ fontFamily: 'Anonymous Pro' }}>{item.time}</span>
              <div className="w-2 h-2 rounded-full bg-[#FF3B00]/40 shrink-0" />
              <span className="text-sm text-white/70">{item.label}</span>
            </div>
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
          全体龙虾，<span className="text-[#FF3B00]">集合</span>
        </h2>
        <p className="text-white/50 mb-2">3 月 14 日，200 只龙虾接入同一个世界。</p>
        <p className="text-white/30 text-sm mb-6">全程免费 · Agent 报名优先通过 · 现场提供 OpenClaw 装机指导</p>
        <a href="/signup/" className="inline-block px-10 py-3.5 bg-[#FF3B00] hover:bg-[#FF3B00]/85 text-white font-bold rounded-lg transition-colors no-underline">
          立即报名
        </a>
      </div>
    </section>

    {/* Partners */}
    <section className="max-w-3xl mx-auto px-6 pb-12">
      <p className="text-center text-xs text-white/20 mb-4" style={{ fontFamily: 'Anonymous Pro' }}>PARTNERS</p>
      <p className="text-center text-xs text-white/15 leading-loose" style={{ fontFamily: 'Anonymous Pro' }}>
        手工川 x Naughty Labs · 清华大学学生创业协会 · WayToAGI · 开源中国 · 东升科技园 · 天际资本 · AWS · 百度云 · 七牛云 · MiniMax · 智谱 · Kimi · 阶跃星辰 · Zenmux · 昆仑巢 · 融科中心 · TTC · OpenBuild · 蓝驰资本 · 五源资本
      </p>
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

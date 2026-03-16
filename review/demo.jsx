import '../app.css'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import ReactDOM from 'react-dom/client'
import { Layout } from '../components/Layout.jsx'
import { ScoreBadge, StatusBadge, Card } from './components.jsx'
import { supabase } from '../lib/supabase.js'

const DEMO_RECORDS = [
  { id: 'D001', name: '张明远', org: '清华大学', dept: '计算机系 博士生', role: '学生', hasAgent: '是', agentDesc: '基于 RAG 的论文检索助手，支持跨语言学术搜索', intro: '清华计算机系在读博士，研究方向为大语言模型与检索增强生成。曾在 ACL 发表论文，对 AI Agent 的学术应用场景非常感兴趣。', session: '下午场' },
  { id: 'D002', name: '李思琪', org: '字节跳动', dept: '产品经理', role: '互联网从业者', hasAgent: '否', agentDesc: '', intro: '负责飞书智能助手产品线，关注 AI 在企业协作场景的落地。希望了解开源社区在 Agent 方向的最新进展。', session: '上午场' },
  { id: 'D003', name: '王浩然', org: '独立开发者', dept: '', role: '创业者', hasAgent: '是', agentDesc: '自动化客服 Agent，集成微信/飞书多渠道消息', intro: '全栈开发者，正在做一个面向中小企业的 AI 客服 SaaS。产品已有 200+ 付费用户，想认识更多技术同好。', session: '全天' },
  { id: 'D004', name: '陈雨薇', org: '清华大学', dept: '新闻学院 硕士生', role: '学生', hasAgent: '否', agentDesc: '', intro: '关注 AI 对新闻行业的影响，正在撰写关于 AI 生成内容伦理问题的毕业论文。希望从技术视角理解 Agent 的能力边界。', session: '上午场' },
  { id: 'D005', name: '赵凯文', org: '美团', dept: '算法工程师', role: '程序员', hasAgent: '是', agentDesc: '代码审查 Agent，自动检测 PR 中的安全隐患和代码规范问题', intro: '5 年后端开发经验，目前在美团做推荐系统。业余时间在 GitHub 上维护一个开源的 Code Review Agent 项目，star 数 1.2k。', session: '全天' },
  { id: 'D006', name: '刘诗涵', org: '36氪', dept: '科技记者', role: '媒体', hasAgent: '否', agentDesc: '', intro: '36氪 AI 方向记者，长期跟踪报道国内 AI 创业公司。参加活动主要是采访和报道。', session: '上午场' },
  { id: 'D007', name: '林子轩', org: '清华大学', dept: '交叉信息研究院', role: '学生', hasAgent: '是', agentDesc: '多模态 Agent，能同时处理文本、图像和语音指令完成复杂任务', intro: '姚班大四学生，对多智能体协作系统感兴趣。目前在做一个让多个 Agent 协同完成软件开发任务的框架。', session: '全天' },
  { id: 'D008', name: '杨佳慧', org: '红杉资本', dept: '投资经理', role: '投资人', hasAgent: '否', agentDesc: '', intro: '关注 AI Infra 和开发者工具方向的早期投资。过去一年看了 50+ Agent 相关项目，想来了解社区生态。', session: '下午场' },
  { id: 'D009', name: '吴天成', org: '华为', dept: '云计算部门 架构师', role: '程序员', hasAgent: '是', agentDesc: '运维 Agent，自动诊断服务器故障并执行修复操作', intro: '10 年云计算经验，目前负责华为云 AI 平台架构。对如何在企业级场景安全地部署 Agent 有深入思考。', session: '下午场' },
  { id: 'D010', name: '孙小鹿', org: '北京大学', dept: '心理学系', role: '学生', hasAgent: '否', agentDesc: '', intro: '研究方向是人机交互心理学，特别关注人们对 AI Agent 的信任度和依赖问题。想从技术社区了解一线开发者的视角。', session: '上午场' },
]

const DEMO_AI_SCORES = {
  D001: { score: 9, reason: '清华计算机系博士，ACL 发表经历，有实际 RAG Agent 项目，非常匹配活动主题。' },
  D003: { score: 8, reason: '独立开发者，有实际落地的 Agent 产品且有付费用户，实战经验丰富。' },
  D005: { score: 8, reason: '有开源 Agent 项目且有一定影响力（1.2k stars），技术背景扎实。' },
  D007: { score: 9, reason: '姚班学生，多智能体协作研究方向完美契合，技术能力顶尖。' },
  D009: { score: 7, reason: '企业级 Agent 部署经验，架构师视角有价值，但偏传统云计算。' },
}

const DEMO_RESULTS = {
  D001: 'approved',
  D003: 'approved',
  D007: 'approved',
}

const DEMO_BOOKMARKS = {
  D005: true,
  D007: true,
}

const DemoApp = () => {
  const [results, setResults] = useState(DEMO_RESULTS)
  const [aiScores, setAiScores] = useState(DEMO_AI_SCORES)
  const [bookmarks, setBookmarks] = useState(DEMO_BOOKMARKS)
  const [currentIdx, setCurrentIdx] = useState(3) // Start at an unreviewed card
  const [swipeDir, setSwipeDir] = useState(null)
  const [history, setHistory] = useState([])
  const [immersive, setImmersive] = useState(false)
  const [filter, setFilterRaw] = useState('all')
  const setFilter = (f) => { setFilterRaw(f); setCurrentIdx(0) }
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const searchRef = useRef(null)
  const touchStart = useRef(null)

  const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
  const isAdmin = (session) => {
    const email = session?.user?.email?.toLowerCase()
    return email && ADMIN_EMAILS.includes(email)
  }

  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setAuthed(isAdmin(session)))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setAuthed(isAdmin(session)))
    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/review/demo.html',
        queryParams: { prompt: 'select_account' },
      },
    })
  }

  const records = DEMO_RECORDS

  const isTsinghua = (r) => /清华/.test(r.org)
  const filteredRecords = records.filter(r => {
    if (filter === 'tsinghua') return isTsinghua(r)
    if (filter === 'non-tsinghua') return !isTsinghua(r)
    if (filter === 'pending') return !results[r.id]
    if (filter === 'bookmarked') return bookmarks[r.id]
    return true
  })
  const record = filteredRecords[currentIdx]

  const toggleBookmark = useCallback(() => {
    if (!record) return
    setBookmarks(prev => {
      const next = { ...prev }
      if (next[record.id]) delete next[record.id]
      else next[record.id] = true
      return next
    })
  }, [record])

  const mockAiScore = useCallback(() => {
    if (!record || aiScores[record.id]) return
    const scores = [6, 7, 7, 8, 8, 8, 9]
    const reasons = [
      '背景与活动主题相关，有一定参与价值。',
      '专业背景匹配，能为活动带来多元视角。',
      '技术能力突出，对 Agent 生态有深入了解。',
    ]
    setAiScores(prev => ({
      ...prev,
      [record.id]: {
        score: scores[Math.floor(Math.random() * scores.length)],
        reason: reasons[Math.floor(Math.random() * reasons.length)],
      },
    }))
  }, [record, aiScores])

  const decide = useCallback((decision) => {
    if (!record) return
    setHistory(h => [...h, { idx: currentIdx, id: record.id }])
    setResults(prev => ({ ...prev, [record.id]: decision }))
    setSwipeDir(decision === 'approved' ? 'right' : decision === 'rejected' ? 'left' : 'up')
    setTimeout(() => {
      setSwipeDir(null)
      setCurrentIdx(i => Math.min(i + 1, filteredRecords.length))
    }, 200)
  }, [record, currentIdx, filteredRecords.length])

  const undo = useCallback(() => {
    if (history.length === 0) return
    const last = history[history.length - 1]
    setHistory(h => h.slice(0, -1))
    setResults(prev => { const n = { ...prev }; delete n[last.id]; return n })
    setCurrentIdx(last.idx)
  }, [history])

  const navigate = useCallback((dir) => {
    setCurrentIdx(i => Math.max(0, Math.min(i + dir, filteredRecords.length - 1)))
  }, [filteredRecords.length])

  useEffect(() => {
    const onKey = (e) => {
      if (searchOpen && document.activeElement === searchRef.current) {
        if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery('') }
        return
      }
      if (e.key === '/' || (e.metaKey && e.key === 'k') || (e.ctrlKey && e.key === 'k')) {
        e.preventDefault(); setSearchOpen(true); return
      }
      if (e.key === 'ArrowRight') { e.preventDefault(); navigate(1) }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); navigate(-1) }
      else if (e.key === 'ArrowUp') { e.preventDefault(); decide('approved') }
      else if (e.key === 'ArrowDown') { e.preventDefault(); decide('rejected') }
      else if (e.key === 'z' || e.key === 'Z') undo()
      else if (e.key === 'a' || e.key === 'A') mockAiScore()
      else if (e.key === ' ') { e.preventDefault(); decide('skipped') }
      else if (e.key === 'b' || e.key === 'B') toggleBookmark()
      else if (e.key === 'f' || e.key === 'F') setImmersive(v => !v)
      else if (e.key === 'Escape') { setImmersive(false); setSearchOpen(false); setSearchQuery('') }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [decide, undo, mockAiScore, searchOpen])

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus()
  }, [searchOpen])

  const onTouchStart = (e) => { touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY } }
  const onTouchEnd = (e) => {
    if (!touchStart.current) return
    const dx = e.changedTouches[0].clientX - touchStart.current.x
    const dy = e.changedTouches[0].clientY - touchStart.current.y
    touchStart.current = null
    if (Math.abs(dy) > Math.abs(dx) && dy < -60) decide('skipped')
    else if (dx > 60) decide('approved')
    else if (dx < -60) decide('rejected')
  }

  const total = filteredRecords.length
  const approved = filteredRecords.filter(r => results[r.id] === 'approved').length
  const rejected = filteredRecords.filter(r => results[r.id] === 'rejected').length
  const skipped = filteredRecords.filter(r => results[r.id] === 'skipped').length
  const reviewed = approved + rejected + skipped
  const bookmarked = Object.keys(bookmarks).length

  const filters = [
    ['all', '全部'],
    ['tsinghua', '清华'],
    ['non-tsinghua', '非清华'],
    ['pending', '待审'],
    ['bookmarked', '收藏'],
  ]

  const demoBanner = (
    <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs text-center py-2 px-4 rounded-lg mb-4 flex items-center justify-center gap-3" style={{ fontFamily: 'Anonymous Pro' }}>
      <span>演示模式 — 数据均为虚构，仅展示系统功能</span>
      {authed ? (
        <>
          <a href="/review/" className="text-[#FF3B00] hover:underline">进入真实审批 →</a>
          <button onClick={() => supabase.auth.signOut()} className="text-white/30 hover:text-white/60 cursor-pointer bg-transparent border-none" style={{ fontFamily: 'Anonymous Pro', fontSize: 'inherit' }}>退出</button>
        </>
      ) : (
        <button onClick={handleLogin} className="text-[#FF3B00] hover:underline cursor-pointer bg-transparent border-none" style={{ fontFamily: 'Anonymous Pro', fontSize: 'inherit' }}>管理员登录</button>
      )}
    </div>
  )

  const navActions = (
    <div className="flex gap-2">
      <select
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="px-2 py-1.5 text-xs rounded border border-white/20 bg-transparent text-white/70 cursor-pointer outline-none"
        style={{ fontFamily: 'Anonymous Pro' }}
      >
        {filters.map(([v, l]) => <option key={v} value={v} className="bg-black">{l}</option>)}
      </select>
      <button onClick={() => setImmersive(true)} className="px-3 py-1.5 text-xs rounded border border-white/20 text-white/50 hover:text-white hover:border-white/40 transition-colors cursor-pointer" style={{ fontFamily: 'Anonymous Pro' }}>
        沉浸 (f)
      </button>
    </div>
  )

  const searchMatches = searchQuery
    ? records.reduce((acc, r, i) => {
        const q = searchQuery.toLowerCase()
        const hay = `${r.name} ${r.org} ${r.dept} ${r.role} ${r.intro} ${r.agentDesc}`.toLowerCase()
        if (hay.includes(q)) acc.push(i)
        return acc
      }, [])
    : []

  const jumpToMatch = (idx) => {
    setCurrentIdx(idx)
    setSearchOpen(false)
    setSearchQuery('')
  }

  const searchPanel = searchOpen && (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-start justify-center pt-24" onClick={() => { setSearchOpen(false); setSearchQuery('') }}>
      <div className="w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
        <input
          ref={searchRef}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="搜索姓名、单位、介绍..."
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm outline-none focus:border-[#FF3B00]/50 placeholder-white/30"
          style={{ fontFamily: 'Noto Sans, sans-serif' }}
        />
        {searchQuery && (
          <div className="mt-2 max-h-80 overflow-y-auto rounded-xl border border-white/10 bg-black/90">
            {searchMatches.length === 0 ? (
              <div className="px-4 py-3 text-xs text-white/30">无结果</div>
            ) : searchMatches.slice(0, 20).map(i => {
              const r = records[i]
              const decision = results[r.id]
              return (
                <button
                  key={r.id}
                  onClick={() => jumpToMatch(i)}
                  className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer text-left border-b border-white/5 last:border-0"
                >
                  <span className="text-sm text-white/90 flex-1">{r.name}</span>
                  <span className="text-xs text-white/30 truncate max-w-48">{r.org}</span>
                  {bookmarks[r.id] && <span className="text-[#FF3B00] text-xs">&#9733;</span>}
                  {decision && <StatusBadge decision={decision} />}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )

  const progressBar = (
    <div className="mb-4">
      <div className="flex justify-between text-xs text-white/40 mb-1" style={{ fontFamily: 'Anonymous Pro' }}>
        <span>审批进度</span>
        <span>{reviewed} / {total}</span>
      </div>
      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-[#FF3B00] transition-all duration-300 rounded-full" style={{ width: total ? `${(reviewed / total) * 100}%` : '0%' }} />
      </div>
    </div>
  )

  const cardSection = record ? (
    <>
      <Card
        record={record}
        swipeDir={swipeDir}
        aiResult={aiScores[record.id]}
        onAiScore={mockAiScore}
        aiLoading={false}
        aiStreamData={null}
        bookmarked={!!bookmarks[record.id]}
        onToggleBookmark={toggleBookmark}
        decision={results[record.id]}
      />
      <div className="flex justify-center gap-4 mt-6">
        <button onClick={() => decide('rejected')} className="w-14 h-14 rounded-full border-2 border-red-500/50 text-red-500 text-2xl hover:bg-red-500/10 transition-colors cursor-pointer">✕</button>
        <button onClick={() => decide('skipped')} className="w-14 h-14 rounded-full border-2 border-yellow-500/50 text-yellow-500 text-lg hover:bg-yellow-500/10 transition-colors cursor-pointer">↑</button>
        <button onClick={() => decide('approved')} className="w-14 h-14 rounded-full border-2 border-green-500/50 text-green-500 text-2xl hover:bg-green-500/10 transition-colors cursor-pointer">✓</button>
      </div>
      <div className="text-center mt-3">
        <button onClick={undo} disabled={history.length === 0} className="text-xs text-white/30 hover:text-white/60 disabled:opacity-20 cursor-pointer" style={{ fontFamily: 'Anonymous Pro' }}>
          撤销 (z)
        </button>
      </div>
    </>
  ) : total > 0 ? (
    <div className="text-center py-20 text-white/50">
      <div className="text-4xl mb-4">🎉</div>
      <div className="text-lg">全部审批完成</div>
    </div>
  ) : (
    <div className="text-center py-20 text-white/40">无数据</div>
  )

  const statsBar = (
    <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-black/90 backdrop-blur-md z-50">
      <div className="max-w-5xl mx-auto px-6 h-10 flex items-center justify-center gap-8 text-xs" style={{ fontFamily: 'Anonymous Pro' }}>
        <span className="text-green-500">通过 {approved}</span>
        <span className="text-red-500">拒绝 {rejected}</span>
        <span className="text-yellow-500">跳过 {skipped}</span>
        {bookmarked > 0 && <span className="text-[#FF3B00]">&#9733; {bookmarked}</span>}
        <span className="text-white/30">←→ ↑↓ z a b f</span>
      </div>
    </div>
  )

  if (immersive) {
    return (
      <>
      {searchPanel}
      <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col" style={{ fontFamily: 'Noto Sans, sans-serif' }} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="flex items-center justify-between px-6 h-10 border-b border-white/5">
          <div className="flex items-center gap-3 text-xs text-white/30" style={{ fontFamily: 'Anonymous Pro' }}>
            <span className="text-yellow-400">DEMO</span>
            <span>{currentIdx + 1} / {total}</span>
            <span className="text-green-500">{approved}</span>
            <span className="text-red-500">{rejected}</span>
          </div>
          <button onClick={() => setImmersive(false)} className="text-xs text-white/30 hover:text-white/60 cursor-pointer" style={{ fontFamily: 'Anonymous Pro' }}>ESC 退出</button>
        </div>
        <div className="w-full h-0.5 bg-white/5">
          <div className="h-full bg-[#FF3B00] transition-all duration-300" style={{ width: total ? `${(reviewed / total) * 100}%` : '0%' }} />
        </div>
        <div className="flex-1 flex items-center justify-center overflow-y-auto px-6 py-6">
          <div className="w-full max-w-xl">
            {cardSection}
          </div>
        </div>
      </div>
      </>
    )
  }

  return (
    <>
    {searchPanel}
    <Layout actions={navActions}>
      <div className="max-w-5xl mx-auto px-6 py-6" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {demoBanner}
        {progressBar}
        {cardSection}
        {statsBar}
      </div>
    </Layout>
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<DemoApp />)

import '../app.css'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import ReactDOM from 'react-dom/client'
import { Layout } from '../components/Layout.jsx'
import { csvToRecords } from './parse-csv.js'
import { parse as parsePartialJson } from 'partial-json'

const STORAGE_KEY = 'neonclaw-review-results'
const AI_SCORES_KEY = 'neonclaw-ai-scores'
const BOOKMARKS_KEY = 'neonclaw-bookmarks'
const ZENMUX_API_KEY = import.meta.env.VITE_ZENMUX_API_KEY

const loadLocal = (key) => {
  try { return JSON.parse(localStorage.getItem(key)) || {} } catch { return {} }
}

const persistToServer = (data) => {
  fetch('/api/review-data', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(data),
  }).catch(() => {})
}

const loadResults = () => loadLocal(STORAGE_KEY)
const saveResults = (results) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results))
  persistToServer({ results })
}

const loadAiScores = () => loadLocal(AI_SCORES_KEY)
const saveAiScores = (scores) => {
  localStorage.setItem(AI_SCORES_KEY, JSON.stringify(scores))
  persistToServer({ aiScores: scores })
}

const loadBookmarks = () => loadLocal(BOOKMARKS_KEY)
const saveBookmarks = (bm) => {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bm))
  persistToServer({ bookmarks: bm })
}

function buildPrompt(record) {
  return `你是 OpenClaw 活动的审批助手。这是一个 AI Agent 技术交流活动，主要面向清华/北大及周边的创业者、程序员、学生、产品经理等。
请根据以下报名信息，给出 1-10 分的评分和一句话理由。评分标准（按优先级）：
- 有影响力的媒体人/KOL/自媒体（能带来传播，高优）
- 真诚的粉丝（对 Claw/AI Agent 有热情和实际行动）
- 技术黑客（有硬核技术能力，能 vibe coding / hack）
- 产品天才（产品思维强，有独到洞察）
- 方向契合的创业者（AI/Agent 相关创业，有实际项目）
- 是否已有 Claw Agent（加分项）
- 自我介绍的质量和诚意

报名信息：
- 编号: ${record.id}
- 姓名: ${record.name}
- 单位: ${record.org}
- 院系/职务: ${record.dept}
- 身份: ${record.role}
- 是否有 Claw Agent: ${record.hasAgent}
- Agent 描述: ${record.agentDesc || '无'}
- 自我介绍: ${record.intro || '无'}
- 参加场次: ${record.session}

仅返回 JSON: {"score": 数字, "reason": "一句话理由"}`
}

async function aiScoreStream(record, onPartial) {
  const res = await fetch('https://zenmux.ai/api/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ZENMUX_API_KEY,
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
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let full = ''
  let buf = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buf += decoder.decode(value, { stream: true })
    const lines = buf.split('\n')
    buf = lines.pop()
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const data = line.slice(6)
      if (data === '[DONE]') continue
      try {
        const evt = JSON.parse(data)
        if (evt.type === 'content_block_delta' && evt.delta?.text) {
          full += evt.delta.text
          try { onPartial(parsePartialJson(full)) } catch {}
        }
      } catch {}
    }
  }
  const match = full.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('No JSON in response')
  return JSON.parse(match[0])
}

const ScoreBadge = ({ score }) => {
  const color = score >= 8 ? 'text-green-400 border-green-500/50' :
    score >= 5 ? 'text-yellow-400 border-yellow-500/50' :
    'text-red-400 border-red-500/50'
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-bold ${color}`} style={{ fontFamily: 'Anonymous Pro' }}>
      AI {score}/10
    </span>
  )
}

const StatusBadge = ({ decision }) => {
  if (!decision) return null
  const cfg = {
    approved: { label: '已通过', cls: 'text-green-400 border-green-500/40 bg-green-500/10' },
    rejected: { label: '已拒绝', cls: 'text-red-400 border-red-500/40 bg-red-500/10' },
    skipped: { label: '已跳过', cls: 'text-yellow-400 border-yellow-500/40 bg-yellow-500/10' },
  }[decision]
  if (!cfg) return null
  return <span className={`text-xs px-1.5 py-0.5 rounded border ${cfg.cls}`} style={{ fontFamily: 'Anonymous Pro' }}>{cfg.label}</span>
}

const Card = ({ record, swipeDir, aiResult, onAiScore, aiLoading, aiStreamData, bookmarked, onToggleBookmark, decision }) => {
  const borderColor = swipeDir === 'right' ? 'rgba(0,255,0,0.6)'
    : swipeDir === 'left' ? 'rgba(255,0,0,0.6)'
    : swipeDir === 'up' ? 'rgba(255,255,0,0.6)' : 'rgba(255,255,255,0.1)'

  const fields = [
    ['姓名', record.name],
    ['单位', record.org],
    ['院系/职务', record.dept],
    ['身份', record.role],
    ['Claw Agent', record.hasAgent],
    ['Agent 描述', record.agentDesc],
    ['自我介绍', record.intro],
    ['参加场次', record.session],
  ]

  return (
    <div
      className="w-full max-w-xl mx-auto rounded-2xl border-2 p-6 transition-colors duration-200"
      style={{ borderColor, background: 'rgba(255,255,255,0.03)' }}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/20" style={{ fontFamily: 'Anonymous Pro' }}>#{record.id}</span>
          <StatusBadge decision={decision} />
        </div>
        <button onClick={onToggleBookmark} className={`text-sm cursor-pointer transition-colors ${bookmarked ? 'text-[#FF3B00]' : 'text-white/15 hover:text-white/40'}`}>&#9733;</button>
      </div>
      {fields.map(([label, value]) => value ? (
        <div key={label} className="mb-3">
          <div className="text-xs text-white/40 mb-0.5" style={{ fontFamily: 'Anonymous Pro' }}>{label}</div>
          <div className="text-sm text-white/90 whitespace-pre-wrap leading-relaxed">{value}</div>
        </div>
      ) : null)}

      {/* AI Score section */}
      <div className="mt-4 pt-4 border-t border-white/10">
        {aiStreamData ? (
          <div className="flex items-start gap-3">
            {aiStreamData.score != null && <ScoreBadge score={aiStreamData.score} />}
            {aiStreamData.reason && <span className="text-xs text-white/50 leading-relaxed">{aiStreamData.reason}</span>}
            {!aiStreamData.score && !aiStreamData.reason && <span className="text-xs text-white/30 animate-pulse">思考中...</span>}
          </div>
        ) : aiResult ? (
          <div className="flex items-start gap-3">
            <ScoreBadge score={aiResult.score} />
            <span className="text-xs text-white/50 leading-relaxed flex-1">{aiResult.reason}</span>
            <button onClick={onAiScore} disabled={aiLoading} className="text-xs text-white/20 hover:text-white/50 shrink-0 cursor-pointer" style={{ fontFamily: 'Anonymous Pro' }}>重评(a)</button>
          </div>
        ) : (
          <button
            onClick={onAiScore}
            disabled={aiLoading}
            className="text-xs px-3 py-1.5 rounded border border-[#FF3B00]/50 text-[#FF3B00] hover:bg-[#FF3B00]/10 disabled:opacity-40 transition-colors cursor-pointer"
            style={{ fontFamily: 'Anonymous Pro' }}
          >
            {aiLoading ? '评分中...' : 'AI 评分 (a)'}
          </button>
        )}
      </div>
    </div>
  )
}

const App = () => {
  const [records, setRecords] = useState([])
  const [results, setResults] = useState(loadResults)
  const [aiScores, setAiScores] = useState(loadAiScores)
  const [bookmarks, setBookmarks] = useState(loadBookmarks)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [swipeDir, setSwipeDir] = useState(null)
  const [history, setHistory] = useState([])
  const [aiLoading, setAiLoading] = useState(false)
  const [aiStreamData, setAiStreamData] = useState(null)
  const [immersive, setImmersive] = useState(false)
  const [autoAi, setAutoAi] = useState(() => localStorage.getItem('neonclaw-auto-ai') === 'true')
  const [filter, setFilterRaw] = useState('all')
  const setFilter = (f) => { setFilterRaw(f); setCurrentIdx(0) }
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const searchRef = useRef(null)
  const touchStart = useRef(null)
  const initialized = useRef(false)

  useEffect(() => {
    Promise.all([
      fetch('/signup-data.csv').then(r => r.text()),
      fetch('/api/review-data').then(r => r.json()).catch(() => ({})),
    ]).then(([csv, serverData]) => {
      // Merge server data into localStorage (server is source of truth)
      if (serverData.results) {
        const merged = { ...loadResults(), ...serverData.results }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
        setResults(merged)
      }
      if (serverData.aiScores) {
        const merged = { ...loadAiScores(), ...serverData.aiScores }
        localStorage.setItem(AI_SCORES_KEY, JSON.stringify(merged))
        setAiScores(merged)
      }
      if (serverData.bookmarks) {
        const merged = { ...loadBookmarks(), ...serverData.bookmarks }
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(merged))
        setBookmarks(merged)
      }

      const recs = csvToRecords(csv)
      setRecords(recs)
      const saved = serverData.results || loadResults()
      const firstUnreviewed = recs.findIndex(r => !saved[r.id])
      if (firstUnreviewed >= 0) setCurrentIdx(firstUnreviewed)
      initialized.current = true
    })
  }, [])

  useEffect(() => { if (initialized.current) saveResults(results) }, [results])
  useEffect(() => { if (initialized.current) saveAiScores(aiScores) }, [aiScores])
  useEffect(() => { if (initialized.current) saveBookmarks(bookmarks) }, [bookmarks])

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

  const toggleAutoAi = useCallback(() => {
    setAutoAi(v => { const next = !v; localStorage.setItem('neonclaw-auto-ai', String(next)); return next })
  }, [])

  const triggerAiScore = useCallback(async () => {
    if (!record || aiLoading) return
    setAiLoading(true)
    setAiStreamData(null)
    try {
      const result = await aiScoreStream(record, (obj) => setAiStreamData(obj))
      setAiScores(prev => ({ ...prev, [record.id]: result }))
      setAiStreamData(null)
    } catch (e) {
      console.error('AI scoring failed:', e)
      setAiStreamData(null)
    }
    setAiLoading(false)
  }, [record, aiLoading, aiScores])

  // Auto AI score when switching to a new card
  useEffect(() => {
    if (autoAi && record && !aiScores[record.id] && !aiLoading) {
      triggerAiScore()
    }
  }, [currentIdx, autoAi]) // intentionally minimal deps

  const batchAiScore = useCallback(async () => {
    if (records.length === 0) return
    for (const rec of records) {
      if (aiScores[rec.id]) continue
      setAiLoading(true)
      setAiStreamText('')
      try {
        const result = await aiScoreStream(rec, (text) => setAiStreamText(text))
        setAiScores(prev => {
          const next = { ...prev, [rec.id]: result }
          saveAiScores(next)
          return next
        })
        setAiStreamText('')
      } catch (e) {
        console.error(`AI scoring failed for ${rec.id}:`, e)
        setAiStreamText('')
      }
    }
    setAiLoading(false)
  }, [records, aiScores])

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
    if (record && !results[record.id]) {
      setResults(prev => ({ ...prev, [record.id]: 'skipped' }))
    }
    setCurrentIdx(i => Math.max(0, Math.min(i + dir, filteredRecords.length - 1)))
  }, [record, results, filteredRecords.length])

  useEffect(() => {
    const onKey = (e) => {
      // Don't handle shortcuts when search input is focused
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
      else if (e.key === 'a' || e.key === 'A') triggerAiScore()
      else if (e.key === ' ') { e.preventDefault(); decide('skipped') }
      else if (e.key === 'b' || e.key === 'B') toggleBookmark()
      else if (e.key === 'f' || e.key === 'F') setImmersive(v => !v)
      else if (e.key === 'Escape') { setImmersive(false); setSearchOpen(false); setSearchQuery('') }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [decide, undo, triggerAiScore, searchOpen])

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

  const download = (content, filename, type) => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }

  const exportResults = () => {
    const data = records.map(r => ({
      ...r,
      decision: results[r.id] || 'pending',
      aiScore: aiScores[r.id]?.score ?? null,
      aiReason: aiScores[r.id]?.reason ?? null,
      bookmarked: !!bookmarks[r.id],
    }))
    download(JSON.stringify(data, null, 2), 'review-results.json', 'application/json')
  }

  const exportApproved = () => {
    const approved = records.filter(r => results[r.id] === 'approved')
    const csvField = (v) => v.includes(',') || v.includes('"') || v.includes('\n') ? `"${v.replace(/"/g, '""')}"` : v
    const header = '姓名,手机号,微信号,单位,身份,参加场次'
    const rows = approved.map(r => [r.name, r.phone, r.wechat, r.org, r.role, r.session].map(csvField).join(','))
    download('\uFEFF' + [header, ...rows].join('\n'), 'approved-list.csv', 'text/csv;charset=utf-8')
  }

  const total = filteredRecords.length
  const approved = Object.values(results).filter(v => v === 'approved').length
  const rejected = Object.values(results).filter(v => v === 'rejected').length
  const skipped = Object.values(results).filter(v => v === 'skipped').length
  const reviewed = approved + rejected + skipped
  const scored = Object.keys(aiScores).length
  const bookmarked = Object.keys(bookmarks).length

  const filters = [
    ['all', '全部'],
    ['tsinghua', '清华'],
    ['non-tsinghua', '非清华'],
    ['pending', '待审'],
    ['bookmarked', '收藏'],
  ]

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
      <button onClick={toggleAutoAi} className={`px-3 py-1.5 text-xs rounded border transition-colors cursor-pointer ${autoAi ? 'border-green-500/50 text-green-400' : 'border-white/20 text-white/50 hover:text-white hover:border-white/40'}`} style={{ fontFamily: 'Anonymous Pro' }}>
        自动评分 {autoAi ? 'ON' : 'OFF'}
      </button>
      <button onClick={() => setImmersive(true)} className="px-3 py-1.5 text-xs rounded border border-white/20 text-white/50 hover:text-white hover:border-white/40 transition-colors cursor-pointer" style={{ fontFamily: 'Anonymous Pro' }}>
        沉浸 (f)
      </button>
      <button onClick={batchAiScore} disabled={aiLoading} className="px-3 py-1.5 text-xs rounded border border-[#FF3B00]/50 text-[#FF3B00] hover:bg-[#FF3B00]/10 disabled:opacity-40 transition-colors cursor-pointer" style={{ fontFamily: 'Anonymous Pro' }}>
        {aiLoading ? `评分中 (${scored}/${total})` : `批量AI评分 (${scored}/${total})`}
      </button>
      <button onClick={exportApproved} className="px-3 py-1.5 text-xs rounded bg-[#FF3B00] text-white hover:bg-[#FF3B00]/80 transition-colors cursor-pointer" style={{ fontFamily: 'Anonymous Pro' }}>
        导出通过 ({approved})
      </button>
      <button onClick={exportResults} className="px-3 py-1.5 text-xs rounded border border-white/20 text-white/50 hover:text-white transition-colors cursor-pointer" style={{ fontFamily: 'Anonymous Pro' }}>
        导出全部
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
            {searchMatches.length > 20 && <div className="px-4 py-2 text-xs text-white/30 text-center">还有 {searchMatches.length - 20} 条结果...</div>}
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
        onAiScore={triggerAiScore}
        aiLoading={aiLoading}
        aiStreamData={aiStreamData}
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
    <div className="text-center py-20 text-white/40">加载中...</div>
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
        {/* Minimal top bar */}
        <div className="flex items-center justify-between px-6 h-10 border-b border-white/5">
          <div className="flex items-center gap-3 text-xs text-white/30" style={{ fontFamily: 'Anonymous Pro' }}>
            <span>{currentIdx + 1} / {total}</span>
            <span className="text-green-500">{approved}</span>
            <span className="text-red-500">{rejected}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={exportResults} className="text-xs text-white/30 hover:text-white/60 cursor-pointer" style={{ fontFamily: 'Anonymous Pro' }}>导出</button>
            <button onClick={() => setImmersive(false)} className="text-xs text-white/30 hover:text-white/60 cursor-pointer" style={{ fontFamily: 'Anonymous Pro' }}>ESC 退出</button>
          </div>
        </div>
        {/* Progress thin line */}
        <div className="w-full h-0.5 bg-white/5">
          <div className="h-full bg-[#FF3B00] transition-all duration-300" style={{ width: total ? `${(reviewed / total) * 100}%` : '0%' }} />
        </div>
        {/* Card centered */}
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
        {progressBar}
        {cardSection}
        {statsBar}
      </div>
    </Layout>
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)

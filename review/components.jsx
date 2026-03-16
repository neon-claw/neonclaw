import React from 'react'

export const ScoreBadge = ({ score }) => {
  const color = score >= 8 ? 'text-green-400 border-green-500/50' :
    score >= 5 ? 'text-yellow-400 border-yellow-500/50' :
    'text-red-400 border-red-500/50'
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-bold ${color}`} style={{ fontFamily: 'Anonymous Pro' }}>
      AI {score}/10
    </span>
  )
}

export const StatusBadge = ({ decision }) => {
  if (!decision) return null
  const cfg = {
    approved: { label: '已通过', cls: 'text-green-400 border-green-500/40 bg-green-500/10' },
    rejected: { label: '已拒绝', cls: 'text-red-400 border-red-500/40 bg-red-500/10' },
    skipped: { label: '已跳过', cls: 'text-yellow-400 border-yellow-500/40 bg-yellow-500/10' },
  }[decision]
  if (!cfg) return null
  return <span className={`text-xs px-1.5 py-0.5 rounded border ${cfg.cls}`} style={{ fontFamily: 'Anonymous Pro' }}>{cfg.label}</span>
}

export const Card = ({ record, swipeDir, aiResult, onAiScore, aiLoading, aiStreamData, bookmarked, onToggleBookmark, decision }) => {
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

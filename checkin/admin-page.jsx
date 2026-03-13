import '../app.css'
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { Layout } from '../components/Layout.jsx'
import { supabase } from './supabase.js'
import { SPOTS, TOTAL_SPOTS } from './spots.js'

const AdminPage = () => {
  const [ranking, setRanking] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchRanking = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('neonclaw_checkins')
      .select('user_id, nickname, spot_id, created_at')
      .order('created_at')

    if (!data) { setLoading(false); return }

    // Group by user
    const users = {}
    for (const row of data) {
      if (!users[row.user_id]) {
        users[row.user_id] = { nickname: row.nickname, spots: new Set(), lastCheckin: row.created_at }
      }
      users[row.user_id].spots.add(row.spot_id)
      if (row.created_at > users[row.user_id].lastCheckin) {
        users[row.user_id].lastCheckin = row.created_at
      }
    }

    // Sort: more spots first, then earlier completion time
    const sorted = Object.entries(users)
      .map(([id, u]) => ({ id, nickname: u.nickname, count: u.spots.size, spots: u.spots, lastCheckin: u.lastCheckin }))
      .sort((a, b) => b.count - a.count || new Date(a.lastCheckin) - new Date(b.lastCheckin))

    setRanking(sorted)
    setLoading(false)
  }

  useEffect(() => { fetchRanking() }, [])

  return (
    <Layout actions={
      <button onClick={fetchRanking} className="px-3 py-1 bg-white/10 text-white/70 text-sm rounded hover:bg-white/20 transition">
        刷新
      </button>
    }>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black mb-6">
          <span className="text-[#FF3B00]">打卡排行榜</span>
        </h1>

        {loading ? (
          <p className="text-white/50">加载中...</p>
        ) : ranking.length === 0 ? (
          <p className="text-white/50">暂无打卡数据</p>
        ) : (
          <div className="space-y-3">
            {ranking.map((u, i) => (
              <div key={u.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${
                  i === 0 ? 'bg-yellow-500 text-black' :
                  i === 1 ? 'bg-gray-300 text-black' :
                  i === 2 ? 'bg-orange-700 text-white' :
                  'bg-white/10 text-white/50'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="font-bold">{u.nickname}</div>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {SPOTS.map(s => (
                      <span
                        key={s.id}
                        title={s.name}
                        className={`w-5 h-5 rounded text-[10px] flex items-center justify-center ${
                          u.spots.has(s.id)
                            ? 'bg-[#FF3B00]/30'
                            : 'bg-white/5 text-white/20'
                        }`}
                      >
                        {u.spots.has(s.id) ? '🦞' : '·'}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-mono text-[#FF3B00]">{u.count}/{TOTAL_SPOTS}</div>
                  {u.count === TOTAL_SPOTS && <div className="text-xs text-green-400">已集齐</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<AdminPage />)

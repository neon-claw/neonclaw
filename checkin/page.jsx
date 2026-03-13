import '../app.css'
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { Layout } from '../components/Layout.jsx'
import { SPOTS, SPOT_MAP, TOTAL_SPOTS } from './spots.js'
import { useCheckin } from './use-checkin.js'

const CheckinPage = () => {
  const params = new URLSearchParams(window.location.search)
  const spotCode = params.get('spot')
  const spot = spotCode ? SPOT_MAP[spotCode] : null

  const { user, checkins, loading, register, doCheckin } = useCheckin()
  const [nickname, setNickname] = useState('')
  const [checkinDone, setCheckinDone] = useState(false)
  const [error, setError] = useState('')

  const checkedSpots = new Set(checkins.map(c => c.spot_id))

  const handleRegisterAndCheckin = async (e) => {
    e.preventDefault()
    if (!nickname.trim()) return
    const u = register(nickname.trim())
    if (spot) {
      const { error: err } = await doCheckinWithUser(u)
      if (err) setError(err)
      else setCheckinDone(true)
    }
  }

  const doCheckinWithUser = async (u) => {
    const { supabase } = await import('./supabase.js')
    const { error } = await supabase
      .from('neonclaw_checkins')
      .upsert(
        { user_id: u.id, nickname: u.nickname, spot_id: spotCode },
        { onConflict: 'user_id,spot_id' }
      )
    return { error: error?.message }
  }

  useEffect(() => {
    if (user && spot && !checkinDone) {
      doCheckin(spotCode).then(({ error: err }) => {
        if (err) setError(err)
        else setCheckinDone(true)
      })
    }
  }, [user, spot])

  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 py-8">
        {spotCode && !spot && (
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🚫</div>
            <p className="text-red-400">无效的打卡码</p>
          </div>
        )}

        {spot && (
          <div className="mb-8 text-center">
            {!user ? (
              <form onSubmit={handleRegisterAndCheckin} className="space-y-4">
                <div className="text-5xl mb-4">🦞</div>
                <h2 className="text-xl font-bold">{spot.name}</h2>
                <p className="text-white/50 text-sm">首次打卡，请输入你的昵称</p>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="你的昵称"
                  maxLength={20}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/30 outline-none focus:border-[#FF3B00]"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-[#FF3B00] text-white font-bold rounded-lg hover:bg-[#FF3B00]/80 transition"
                >
                  打卡
                </button>
              </form>
            ) : checkinDone ? (
              <>
                <div className="text-5xl mb-4">✅</div>
                <h2 className="text-xl font-bold">{spot.name}</h2>
                <p className="text-green-400 text-sm mt-2">打卡成功！</p>
              </>
            ) : loading ? (
              <p className="text-white/50">打卡中...</p>
            ) : error ? (
              <>
                <div className="text-5xl mb-4">❌</div>
                <p className="text-red-400 text-sm">{error}</p>
              </>
            ) : null}
          </div>
        )}

        {!spotCode && (
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black mb-2">
              <span className="text-[#FF3B00]">Neon</span>Claw 打卡集章
            </h1>
            <p className="text-white/50 text-sm">扫描现场二维码，集齐 {TOTAL_SPOTS} 个地点赢奖品！</p>
          </div>
        )}

        {user && (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/50 text-sm">{user.nickname} 的进度</span>
              <span className="text-sm font-mono text-[#FF3B00]">{checkedSpots.size}/{TOTAL_SPOTS}</span>
            </div>

            {checkedSpots.size === TOTAL_SPOTS && (
              <div className="mb-4 p-4 bg-[#FF3B00]/10 border border-[#FF3B00]/30 rounded-lg text-center">
                <span className="text-2xl">🎉</span>
                <p className="text-[#FF3B00] font-bold mt-1">恭喜集齐全部地点！请找工作人员领奖</p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              {SPOTS.map(s => {
                const checked = checkedSpots.has(s.id)
                return (
                  <div
                    key={s.id}
                    className={`p-3 rounded-lg border text-center transition ${
                      checked
                        ? 'bg-[#FF3B00]/10 border-[#FF3B00]/40 text-white'
                        : 'bg-white/5 border-white/10 text-white/30'
                    }`}
                  >
                    <div className="text-2xl mb-1">{checked ? '🦞' : '❓'}</div>
                    <div className="text-xs">{s.name}</div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<CheckinPage />)

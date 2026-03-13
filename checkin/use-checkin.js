import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase.js'

const USER_KEY = 'neonclaw_checkin_user'

function getUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

function genId() {
  return 'xxxx-xxxx-xxxx'.replace(/x/g, () => Math.floor(Math.random() * 16).toString(16))
}

export function useCheckin() {
  const [user, setUser] = useState(getUser)
  const [checkins, setCheckins] = useState([])
  const [loading, setLoading] = useState(false)

  const register = useCallback((nickname) => {
    const u = { id: genId(), nickname }
    saveUser(u)
    setUser(u)
    return u
  }, [])

  const fetchCheckins = useCallback(async (userId) => {
    const uid = userId || user?.id
    if (!uid) return
    const { data } = await supabase
      .from('neonclaw_checkins')
      .select('spot_id, created_at')
      .eq('user_id', uid)
      .order('created_at')
    if (data) setCheckins(data)
  }, [user?.id])

  const doCheckin = useCallback(async (spotId) => {
    if (!user) return { error: 'no user' }
    setLoading(true)
    const { error } = await supabase
      .from('neonclaw_checkins')
      .upsert(
        { user_id: user.id, nickname: user.nickname, spot_id: spotId },
        { onConflict: 'user_id,spot_id' }
      )
    setLoading(false)
    if (!error) await fetchCheckins()
    return { error }
  }, [user, fetchCheckins])

  useEffect(() => {
    if (user) fetchCheckins()
  }, [user, fetchCheckins])

  return { user, checkins, loading, register, doCheckin, fetchCheckins }
}

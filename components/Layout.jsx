import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase.js'

const baseNavLinks = [
  { label: '首页', href: '/' },
  { label: '海报', href: '/poster/' },
  { label: '报名', href: '/signup/' },
  { label: '路引', href: '/wayfinding/' },
  { label: '打卡', href: '/checkin/' },
  { label: '排行', href: '/checkin/admin.html' },
  { label: '二维码', href: '/checkin/qrcodes.html' },
  { label: '播报', href: '/broadcast/' },
]

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean)

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

const UserMenu = ({ user, onSignOut }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const initial = (user.email || '?')[0].toUpperCase()
  const avatar = user.avatar

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-xs font-bold cursor-pointer hover:border-white/40 transition-colors overflow-hidden"
        style={{ fontFamily: 'Anonymous Pro', background: avatar ? 'none' : 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
      >
        {avatar ? <img src={avatar} alt="" className="w-full h-full object-cover" /> : initial}
      </button>
      {open && (
        <div className="absolute right-0 top-10 w-52 rounded-lg border border-white/10 bg-black/95 backdrop-blur-md shadow-xl z-[100] py-1">
          <div className="px-3 py-2 border-b border-white/10">
            <div className="text-xs text-white/70 truncate">{user.email}</div>
            {user.isAdmin && <div className="text-[10px] text-[#FF3B00] mt-0.5" style={{ fontFamily: 'Anonymous Pro' }}>管理员</div>}
          </div>
          {user.isAdmin && (
            <a href="/review/" className="block px-3 py-2 text-xs text-white/60 hover:text-white hover:bg-white/5 no-underline transition-colors">
              审批管理
            </a>
          )}
          <button
            onClick={onSignOut}
            className="w-full text-left px-3 py-2 text-xs text-white/40 hover:text-white hover:bg-white/5 cursor-pointer bg-transparent border-none transition-colors"
            style={{ fontFamily: 'Anonymous Pro' }}
          >
            退出登录
          </button>
        </div>
      )}
    </div>
  )
}

const SignInButton = () => {
  const btnRef = useRef(null)
  const rendered = useRef(false)

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || rendered.current) return

    const initGsi = () => {
      if (!window.google?.accounts?.id || !btnRef.current) return
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          await supabase.auth.signInWithIdToken({ provider: 'google', token: response.credential })
        },
      })
      window.google.accounts.id.renderButton(btnRef.current, {
        theme: 'filled_black', size: 'small', shape: 'pill', text: 'signin',
      })
      rendered.current = true
    }

    if (window.google?.accounts?.id) {
      initGsi()
    } else {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.onload = initGsi
      document.head.appendChild(script)
    }
  }, [])

  return <div ref={btnRef} />
}

export const Layout = ({ children, actions }) => {
  const [user, setUser] = useState(null) // null=loading, false=not logged in, {email,isAdmin,avatar}

  useEffect(() => {
    const check = (session) => {
      if (!session) return setUser(false)
      const email = session.user.email?.toLowerCase()
      const admin = email && ADMIN_EMAILS.includes(email)
      const avatar = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture
      setUser({ email: session.user.email, isAdmin: admin, avatar })
    }
    supabase.auth.getSession().then(({ data: { session } }) => check(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => check(session))
    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(false)
  }

  const navLinks = [
    ...baseNavLinks.slice(0, 3),
    { label: '审批', href: user?.isAdmin ? '/review/' : '/review/demo.html' },
    ...baseNavLinks.slice(3),
  ]

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Noto Sans, sans-serif' }}>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
          <a href="/" className="flex-shrink-0 flex items-center text-white no-underline">
            <span className="text-lg font-black tracking-tight" style={{ fontFamily: 'Inter' }}>
              <span className="text-[#FF3B00]">Neon</span>Claw
            </span>
          </a>
          <div className="flex-1 min-w-0 overflow-x-auto flex gap-3 scrollbar-hide">
            {navLinks.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="flex-shrink-0 text-sm text-white/50 hover:text-white transition-colors no-underline"
                style={{ fontFamily: 'Anonymous Pro' }}
              >
                {label}
              </a>
            ))}
          </div>
          {actions && <div className="flex-shrink-0 flex gap-2">{actions}</div>}
          <div className="flex-shrink-0">
            {user === null ? null : user ? (
              <UserMenu user={user} onSignOut={handleSignOut} />
            ) : (
              <SignInButton />
            )}
          </div>
        </div>
      </nav>
      <main className="pt-14">{children}</main>
    </div>
  )
}

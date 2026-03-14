import React from 'react'

const navLinks = [
  { label: '首页', href: '/' },
  { label: '海报', href: '/poster/' },
  { label: '报名', href: '/signup/' },
  { label: '审批', href: '/review/' },
  { label: '路引', href: '/wayfinding/' },
  { label: '打卡', href: '/checkin/' },
  { label: '排行', href: '/checkin/admin.html' },
  { label: '二维码', href: '/checkin/qrcodes.html' },
  { label: '播报', href: '/broadcast/' },
]

export const Layout = ({ children, actions }) => (
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
      </div>
    </nav>
    <main className="pt-14">{children}</main>
  </div>
)

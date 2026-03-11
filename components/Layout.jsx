import React from 'react'

const navLinks = [
  { label: '首页', href: '/' },
  { label: '海报', href: '/poster/' },
  { label: '报名', href: '/signup/' },
]

export const Layout = ({ children, actions }) => (
  <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Noto Sans, sans-serif' }}>
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center text-white no-underline">
            <span className="text-lg font-black tracking-tight" style={{ fontFamily: 'Inter' }}>
              <span className="text-[#FF3B00]">Neon</span>Claw
            </span>
          </a>
          <div className="flex gap-5">
            {navLinks.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="text-sm text-white/50 hover:text-white transition-colors no-underline"
                style={{ fontFamily: 'Anonymous Pro' }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
    </nav>
    <main className="pt-14">{children}</main>
  </div>
)

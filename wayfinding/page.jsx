import '../app.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Layout } from '../components/Layout.jsx'

const TOTAL = 43
const images = Array.from({ length: TOTAL }, (_, i) => `/wayfinding/${String(i + 1).padStart(2, '0')}.jpg`)

const WayfindingPage = () => (
  <Layout>
    <section className="max-w-5xl mx-auto px-6 pt-20 pb-16">
      <h1 className="text-3xl font-bold mb-2 text-center" style={{ fontFamily: 'Inter' }}>
        <span className="text-[#FF3B00]">/</span> 路引
      </h1>
      <p className="text-center text-white/40 text-sm mb-10" style={{ fontFamily: 'Anonymous Pro' }}>
        WAYFINDING · 活动现场导航指引 · 设计：徐婉婷
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((src, i) => (
          <a key={i} href={src} target="_blank" rel="noopener noreferrer" className="block relative group">
            <img
              src={src}
              alt={`路引 ${i + 1}`}
              className="w-full rounded-lg border border-white/10 group-hover:border-[#FF3B00]/50 transition-colors"
            />
            <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded" style={{ fontFamily: 'Anonymous Pro' }}>
              {String(i + 1).padStart(2, '0')}
            </span>
          </a>
        ))}
      </div>
    </section>
  </Layout>
)

ReactDOM.createRoot(document.getElementById('root')).render(<WayfindingPage />)

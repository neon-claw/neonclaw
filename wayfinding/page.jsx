import '../app.css'
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { Layout } from '../components/Layout.jsx'

const WayfindingPage = () => {
  const [images, setImages] = useState([])

  useEffect(() => {
    // Scan for images in /wayfinding/ directory
    // Try loading numbered images 01.png through 99.png
    const tryLoad = async () => {
      const found = []
      for (let i = 1; i <= 99; i++) {
        const name = String(i).padStart(2, '0')
        for (const ext of ['png', 'jpg', 'jpeg', 'webp']) {
          const url = `/wayfinding/${name}.${ext}`
          try {
            const res = await fetch(url, { method: 'HEAD' })
            if (res.ok) {
              found.push(url)
              break
            }
          } catch {}
        }
      }
      setImages(found)
    }
    tryLoad()
  }, [])

  return (
    <Layout>
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        <h1 className="text-3xl font-bold mb-2 text-center" style={{ fontFamily: 'Inter' }}>
          <span className="text-[#FF3B00]">/</span> 路引
        </h1>
        <p className="text-center text-white/40 text-sm mb-10" style={{ fontFamily: 'Anonymous Pro' }}>
          WAYFINDING · 活动现场导航指引
        </p>

        {images.length === 0 ? (
          <p className="text-center text-white/30 py-20">暂无路引图片</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((src, i) => (
              <a key={i} href={src} target="_blank" rel="noopener noreferrer" className="block">
                <img
                  src={src}
                  alt={`路引 ${i + 1}`}
                  className="w-full aspect-square object-cover rounded-lg border border-white/10 hover:border-[#FF3B00]/50 transition-colors"
                />
              </a>
            ))}
          </div>
        )}
      </section>
    </Layout>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<WayfindingPage />)

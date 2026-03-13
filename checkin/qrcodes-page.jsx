import '../app.css'
import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom/client'
import { Layout } from '../components/Layout.jsx'
import { SPOTS, BASE_URL } from './spots.js'
import QRCode from 'qrcode'

const QRCard = ({ spot }) => {
  const canvasRef = useRef(null)
  const url = `${BASE_URL}?spot=${spot.id}`

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 200,
        margin: 2,
        color: { dark: '#FF3B00', light: '#000000' },
      })
    }
  }, [url])

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-5 text-center hover:border-[#FF3B00]/40 transition">
      <div className="bg-black rounded-md p-3 inline-block mb-3">
        <canvas ref={canvasRef} className="mx-auto" />
      </div>
      <div className="text-lg font-bold text-[#FF3B00]">🦞 {spot.name}</div>
      <div className="text-[10px] text-white/20 font-mono mt-1">{spot.id}</div>
    </div>
  )
}

const QRCodesPage = () => (
  <Layout>
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black mb-2">
        <span className="text-[#FF3B00]">Neon</span>Claw 打卡二维码
      </h1>
      <p className="text-white/50 text-sm mb-6">打印后张贴到对应地点，共 {SPOTS.length} 个</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SPOTS.map(s => <QRCard key={s.id} spot={s} />)}
      </div>
    </div>
  </Layout>
)

ReactDOM.createRoot(document.getElementById('root')).render(<QRCodesPage />)

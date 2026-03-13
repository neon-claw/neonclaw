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
        color: { dark: '#000', light: '#fff' },
      })
    }
  }, [url])

  return (
    <div className="bg-white rounded-lg p-4 text-center text-black">
      <canvas ref={canvasRef} className="mx-auto" />
      <div className="mt-2 font-bold text-lg">#{spot.id} {spot.name}</div>
      <div className="text-xs text-gray-400 break-all mt-1">{url}</div>
    </div>
  )
}

const QRCodesPage = () => (
  <Layout>
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black mb-2">
        <span className="text-[#FF3B00]">二维码生成</span>
      </h1>
      <p className="text-white/50 text-sm mb-6">打印后张贴到对应地点</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SPOTS.map(s => <QRCard key={s.id} spot={s} />)}
      </div>
    </div>
  </Layout>
)

ReactDOM.createRoot(document.getElementById('root')).render(<QRCodesPage />)

import '../app.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Layout } from '../components/Layout.jsx'

const BroadcastPage = () => (
  <Layout>
    <section className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black mb-3" style={{ fontFamily: 'Inter' }}>
          <span className="text-[#FF3B00]">AI</span> 字幕播报系统
        </h1>
        <p className="text-white/50 text-lg">AI Host Broadcast Controller — 活动现场 TTS 播报稿件管理</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-sm text-[#FF3B00] mb-3 tracking-wider" style={{ fontFamily: 'Anonymous Pro' }}>V1 — 初版播报控制台</h3>
          <div className="border border-white/10 rounded-xl overflow-hidden">
            <img src="/broadcast/v1.png" alt="字幕播报系统 V1" className="w-full" />
          </div>
          <p className="text-xs text-white/30 mt-3 leading-relaxed">
            TTS 音频生成 + 播报控制，支持批量生成、单条播放、编辑删除。
          </p>
        </div>
        <div>
          <h3 className="text-sm text-[#FF3B00] mb-3 tracking-wider" style={{ fontFamily: 'Anonymous Pro' }}>V2 — 优化版</h3>
          <div className="border border-white/10 rounded-xl overflow-hidden">
            <img src="/broadcast/v2.png" alt="字幕播报系统 V2" className="w-full" />
          </div>
          <p className="text-xs text-white/30 mt-3 leading-relaxed">
            新增全选、导入稿件、用户登录，30 条稿件全部音频就绪。
          </p>
        </div>
      </div>
    </section>
  </Layout>
)

ReactDOM.createRoot(document.getElementById('root')).render(<BroadcastPage />)

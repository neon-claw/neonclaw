import './app.css';
import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  // Typography Tokens based on constraints
  const typoHeroEn = { fontFamily: 'Inter', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1 };
  const typoHeroZh = { fontFamily: 'OPPO Sans 4.0', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1 };
  const typoSubtitle = { fontFamily: 'OPPO Sans 4.0', fontWeight: 700, letterSpacing: '0.02em', lineHeight: 1.2 };
  const typoBody = { fontFamily: 'Noto Sans', fontWeight: 400, letterSpacing: '0.02em', lineHeight: 1.6 };
  const typoMono = { fontFamily: 'Anonymous Pro', fontWeight: 400, letterSpacing: '0.05em', lineHeight: 1.4 };
  const typoHand = { fontFamily: 'Satisfy', fontWeight: 400, letterSpacing: '0.02em' };

  // Grid Image Prompts (matching the reference's B&W tech aesthetic)
  const gridPrompts = [
    "black background, high contrast white line art wireframe of a mythical pegasus, technical diagram style, cybernetic",
    "abstract galaxy spiral, monochrome dot matrix display style, glowing white dots on pure black",
    "cyberpunk vehicle schematic side profile, technical white lines on black background, detailed blueprint",
    "astronomical constellation map, glowing white stars and geometric connecting lines on pure black background",
    "abstract fractal geometric landscape, 3d wireframe rendering, white lines on black background",
    "digital earth globe rendered in point cloud data, high tech aesthetic, black and white",
    "complex neural network graph visualization, dense white nodes and intersecting lines on black",
    "abstract hacker terminal interface elements, binary code blocks and geometric shapes, monochrome",
    "3d topographical map rendered as a white wireframe mesh on a pitch black background",
    "cellular automata pattern, abstract black and white pixel art texture, glitch aesthetic",
    "mechanical structural blueprint diagram, intricate white lines on black background",
    "abstract sound wave data visualization, concentric white rings breaking apart on black background"
  ];

  return (
    <div 
      className="seede-root relative w-[1080px] h-[3688px] bg-black text-white overflow-hidden"
      data-canvas-size="1080x3688"
      name="龙虾黑客松长图海报"
      description="基于黑客帝国与赛博朋克风格的OpenClaw黑客松活动长图海报，包含网格数据可视化元素与强对比排版。"
    >
      {/* Background Noise/Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20" 
           style={{ backgroundImage: 'radial-gradient(circle, #333 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>

      {/* ================= SECTION 1: HERO (0 - 900px) ================= */}
      <div className="relative pt-[80px] px-[60px] flex flex-col z-10">
        
        {/* Top Header */}
        <div className="flex items-center space-x-6 mb-12">
          <span className="text-[48px] uppercase tracking-wider" style={typoHeroEn}>MAKER</span>
          <i className="fas fa-compress text-[36px] text-white"></i>
          <span className="text-[48px] tracking-wider" style={typoHeroEn}>Naughty Labs</span>
        </div>

        {/* Title Block 1: "清华 Outlier" style */}
        <div className="flex items-baseline border-b-[8px] border-white pb-2 mb-8 relative w-fit pr-16">
          <span className="text-[140px]" style={typoHeroZh}>海淀</span>
          <span className="text-[140px] ml-8" style={typoHeroEn}>Summit</span>
          {/* Decorative line matching reference */}
          <div className="absolute bottom-[-24px] right-[-40px] w-[200px] h-[8px] bg-white rotate-[-15deg]"></div>
        </div>

        {/* Title Block 2: "OpenClaw" huge */}
        <div className="mb-4">
          <span className="text-[200px] tracking-tighter" style={typoHeroEn}>OpenClaw</span>
        </div>

        {/* Title Block 3: "黑客松" + Slogan */}
        <div className="flex justify-between items-start mt-4">
          <span className="text-[180px]" style={typoHeroZh}>黑客松</span>
          <div className="flex flex-col text-right mt-12 pr-4">
            <span className="text-[42px]" style={typoSubtitle}>We engineer the</span>
            <span className="text-[64px] uppercase" style={typoHeroEn}>UNNECESSARY</span>
          </div>
        </div>

        {/* The Lobster Asset - Absolute Positioned matching reference */}
        <img 
          src="https://placehold.co/300x300" 
          data-src="asset://2d3f9cfc-2263-41e8-869c-bcd1dd9fc90c" 
          alt="Lobster"
          className="absolute top-[280px] right-[40px] w-[320px] h-[320px] object-contain drop-shadow-[0_0_40px_rgba(255,59,0,0.6)] z-20"
        />
      </div>


      {/* ================= SECTION 2: THE ABSTRACT GRID (900 - 1800px) ================= */}
      <div className="relative mt-[120px] px-[20px] z-10">
        <div className="grid grid-cols-4 gap-2 bg-[#222] p-2 border-y-2 border-[#444]">
          {gridPrompts.map((prompt, index) => (
            <div key={index} className="aspect-square relative overflow-hidden bg-black group">
              <img 
                src={`https://placehold.co/400x400?text=DATA+${index}`} 
                prompt={prompt}
                className="w-full h-full object-cover opacity-80 mix-blend-screen group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              />
              {/* Decorative terminal marks on images */}
              <div className="absolute top-2 left-2 text-[#fff] text-[20px] opacity-50" style={typoMono}>
                {String(index + 1).padStart(2, '0')}://SYS
              </div>
            </div>
          ))}
        </div>

        {/* The overlapping handwritten text (like "outlier" in reference) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 mix-blend-screen">
          <span 
            className="text-[#FF3B00] text-[280px] -rotate-12 opacity-90" 
            style={{
              ...typoHand, 
              textShadow: '0 0 60px #FF3B00, 0 0 20px #FF3B00',
              WebkitTextStroke: '2px #fff'
            }}
          >
            NeonClaw
          </span>
        </div>
      </div>


      {/* ================= SECTION 3: EVENT INFO TERMINAL (1800 - 2400px) ================= */}
      <div className="relative mt-[160px] px-[60px] z-10">
        <div className="border border-white/30 p-[60px] relative backdrop-blur-sm bg-black/50">
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#FF3B00]"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#FF3B00]"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#FF3B00]"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#FF3B00]"></div>

          <div className="flex flex-col space-y-12">
            
            {/* Mission Statement */}
            <div className="border-b border-dashed border-white/30 pb-12">
              <div className="text-[28px] text-[#FF3B00] mb-4" style={typoMono}>&gt; INIT_MISSION.exe</div>
              <h2 className="text-[64px] leading-tight mb-6" style={typoHeroZh}>
                全体龙虾，集合！<br/>一起构建新世界！
              </h2>
              <p className="text-[32px] text-white/80" style={typoBody}>
                聚集 AI Agent 领域的开发者、创业者和投资人，围绕龙虾生态的自主进化、分工协同、最佳实践展开深度交流。
              </p>
            </div>

            {/* Core Data */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-12">
              <div>
                <div className="text-[28px] text-white/50 mb-2" style={typoMono}>[ DATE & TIME ]</div>
                <div className="text-[48px]" style={typoHeroEn}>2026.03.14 <span className="text-[32px] ml-4 text-[#FF3B00]">9:30-18:00</span></div>
              </div>
              <div>
                <div className="text-[28px] text-white/50 mb-2" style={typoMono}>[ LOCATION ]</div>
                <div className="text-[48px]" style={typoHeroZh}>北京海淀 · 中关村</div>
              </div>
              <div>
                <div className="text-[28px] text-white/50 mb-2" style={typoMono}>[ CAPACITY ]</div>
                <div className="text-[48px]" style={typoHeroEn}>200 <span className="text-[32px] ml-2 font-normal" style={typoBody}>UNITS (Agent 优先)</span></div>
              </div>
              <div>
                <div className="text-[28px] text-white/50 mb-2" style={typoMono}>[ HOST ]</div>
                <div className="text-[48px]" style={typoHeroZh}>手工川 <span className="mx-2 text-[#FF3B00]">X</span> Naughty Labs</div>
              </div>
            </div>

          </div>
        </div>
      </div>


      {/* ================= SECTION 4: GUEST ROSTER (2400 - 3000px) ================= */}
      <div className="relative mt-[160px] px-[60px] z-10">
        <div className="flex items-center mb-16">
          <div className="w-[12px] h-[64px] bg-[#FF3B00] mr-6"></div>
          <h2 className="text-[80px] uppercase" style={typoHeroEn}>GUEST ROSTER</h2>
          <div className="flex-1 border-b border-dashed border-white/30 ml-8"></div>
          <div className="text-[32px] ml-8" style={typoMono}>// SYSTEM_ACCESS_GRANTED</div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Guest items mapping */}
          {[
            { name: "手工川", title: "Lovstudio.ai 创始人", desc: "新世界没有旧神" },
            { name: "Clara", title: "天际资本董事总经理", desc: "寻找 AI 原生的产品和公司" },
            { name: "苏嘉奕", title: "MiniMax 生态合作负责人", desc: "OpenClaw的商业化进化" },
            { name: "杨天润", title: "Naughty Labs 创始人", desc: "Agentic Engineering 方法论" },
            { name: "叶震杰", title: "ZenMux 产品负责人", desc: "小龙虾—ZenMux 的11号员工" },
            { name: "HW", title: "资深 Agent 开发者", desc: "一人创建93个Agent技能" },
            { name: "汪毅", title: "首序智能创始人", desc: "OpenClaw安全实战" },
            { name: "神秘嘉宾", title: "某大厂热搜产品负责人", desc: "Classified Data" }
          ].map((guest, idx) => (
            <div key={idx} className="bg-[#111] border border-white/10 p-8 hover:border-[#FF3B00]/50 transition-colors relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20 text-[64px]" style={typoMono}>
                {String(idx + 1).padStart(2, '0')}
              </div>
              <div className="text-[48px] mb-2" style={typoSubtitle}>{guest.name}</div>
              <div className="text-[28px] text-[#FF3B00] mb-4" style={typoMono}>{guest.title}</div>
              <div className="text-[32px] text-white/80 border-t border-white/10 pt-4" style={typoBody}>{guest.desc}</div>
              {/* Scanline effect */}
              <div className="absolute inset-0 w-full h-[2px] bg-[#FF3B00]/20 -translate-y-full group-hover:translate-y-[400px] transition-transform duration-[1.5s] ease-linear"></div>
            </div>
          ))}
        </div>
      </div>


      {/* ================= SECTION 5: MMOAS GAMEPLAY (3000 - 3400px) ================= */}
      <div className="relative mt-[160px] px-[60px] z-10">
        <div className="text-center mb-16">
          <div className="text-[32px] text-[#FF3B00] mb-4" style={typoMono}>16:00 - 18:00 &gt; INITIATE</div>
          <h2 className="text-[80px]" style={typoHeroEn}>NEONCLAW GAME</h2>
          <p className="text-[36px] mt-4 text-white/70" style={typoBody}>Massively Multiplayer Online Agent Sandbox</p>
        </div>

        <div className="flex flex-col space-y-8 relative">
          {/* Vertical connection line */}
          <div className="absolute left-[80px] top-[40px] bottom-[40px] w-[2px] bg-white/20"></div>

          {[
            { phase: "PHASE 1", title: "SOLO — 觉醒", time: "16:15", desc: "激活龙虾，完成身份注册。探索能力边界，向全场广播你的龙虾能力宣言。" },
            { phase: "PHASE 2", title: "SQUAD — 结盟", time: "16:45", desc: "自由发现、协商组队。分工协作完成跨Agent任务，建立资源交易图谱。" },
            { phase: "PHASE 3", title: "CIVILIZATION — 涌现", time: "17:15", desc: "全场龙虾接入开放网络，迎接文明级挑战。观察领导者、交易所等涌现行为。" }
          ].map((item, idx) => (
            <div key={idx} className="flex items-stretch pl-[40px] relative">
              {/* Timeline dot */}
              <div className="absolute left-[-16px] top-[24px] w-[32px] h-[32px] rounded-full bg-black border-4 border-[#FF3B00] z-20"></div>
              
              <div className="w-[160px] pt-4 text-right pr-12">
                <div className="text-[36px] text-[#FF3B00]" style={typoMono}>{item.time}</div>
              </div>
              
              <div className="flex-1 bg-gradient-to-r from-[#111] to-transparent border-l border-[#FF3B00] p-8 ml-8">
                <div className="text-[28px] text-white/50 mb-2" style={typoMono}>[{item.phase}]</div>
                <div className="text-[48px] mb-4" style={typoSubtitle}>{item.title}</div>
                <div className="text-[32px] text-white/80" style={typoBody}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* ================= SECTION 6: FOOTER / SPONSORS (3400 - 3688px) ================= */}
      <div className="absolute bottom-0 left-0 w-full bg-[#111] border-t border-white/20 py-12 px-[60px] z-10">
        <div className="text-center text-[28px] text-white/40 mb-8" style={typoMono}>--- PARTNERS & SPONSORS ---</div>
        
        {/* Abstract Sponsor Grid matching reference bottom style */}
        <div className="flex flex-wrap justify-center gap-6 opacity-60">
          {['天际资本', 'AWS', '百度云', '七牛云', '清华创协', 'WayToAGI', '开源中国', 'AI产品榜', '硅星人', '阶跃星辰', '锦秋基金', 'Kimi'].map((sponsor, idx) => (
            <div key={idx} className="px-6 py-3 border border-white/20 text-[28px] rounded-sm hover:border-white transition-colors" style={typoBody}>
              {sponsor}
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-between items-end border-t border-white/10 pt-6">
          <div className="text-[28px] text-white/30" style={typoMono}>
            SYS.OP: 报名助手 Ariel<br/>
            ID: ashincherry_love
          </div>
          <div className="text-[28px] text-white/30 text-right" style={typoMono}>
            © 2026 NEONCLAW SUMMIT<br/>
            END OF LINE.
          </div>
        </div>
      </div>

    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
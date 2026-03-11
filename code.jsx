import './app.css';
import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { domToJpeg } from 'modern-screenshot';
import { Layout } from './components/Layout.jsx';

const btnClass = "px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs rounded-md border border-white/20 cursor-pointer transition-colors disabled:opacity-50";

const useToolbar = (targetRef) => {
  const [copyStatus, setCopyStatus] = useState('idle');
  const [dlStatus, setDlStatus] = useState('idle');

  const generate = async () => {
    const el = targetRef.current;
    if (!el) return null;
    await document.fonts.ready;
    const opts = {
      scale: 3,
      quality: 0.85,
      width: el.offsetWidth,
      height: el.offsetHeight,
      font: {
        cssText: [
          "@font-face{font-family:'Inter';font-weight:700;src:url('/fonts/inter-700.ttf')format('truetype')}",
          "@font-face{font-family:'Inter';font-weight:900;src:url('/fonts/inter-900.ttf')format('truetype')}",
          "@font-face{font-family:'Anonymous Pro';font-weight:400;src:url('/fonts/anonymous-pro-400.ttf')format('truetype')}",
          "@font-face{font-family:'Anonymous Pro';font-weight:700;src:url('/fonts/anonymous-pro-700.ttf')format('truetype')}",
          "@font-face{font-family:'Noto Sans';font-weight:400;src:url('/fonts/noto-sans-400.ttf')format('truetype')}",
          "@font-face{font-family:'Satisfy';font-weight:400;src:url('/fonts/satisfy-400.ttf')format('truetype')}",
        ].join('\n'),
      },
      filter: (node) => !(node instanceof HTMLElement && node.tagName === 'NAV'),
    };
    await domToJpeg(el, opts);
    await domToJpeg(el, opts);
    return await domToJpeg(el, opts);
  };

  const handleCopy = async () => {
    setCopyStatus('copying');
    try {
      const dataUrl = await generate();
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setCopyStatus('done');
    } catch (e) {
      console.error(e);
      setCopyStatus('error');
    }
    setTimeout(() => setCopyStatus('idle'), 2000);
  };

  const handleDownload = async () => {
    setDlStatus('generating');
    const dataUrl = await generate();
    if (dataUrl) {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'openclaw-meetup-poster.jpg';
      a.click();
    }
    setDlStatus('idle');
  };

  const copyLabel = { idle: '复制', copying: '生成中...', done: '已复制!', error: '失败' }[copyStatus];

  return (
    <>
      <button onClick={handleCopy} disabled={copyStatus === 'copying'} className={btnClass}>{copyLabel}</button>
      <button onClick={handleDownload} disabled={dlStatus === 'generating'} className={btnClass}>{dlStatus === 'generating' ? '生成中...' : '下载'}</button>
    </>
  );
};

const App = () => {
  const posterRef = useRef(null);
  const toolbarActions = useToolbar(posterRef);
  // Typography Tokens based on constraints
  const CAPACITY = 100;
  const typoHeroEn = { fontFamily: 'Inter', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1 };
  const typoHeroZh = { fontFamily: 'OPPO Sans 4.0', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1 };
  const typoSubtitle = { fontFamily: 'OPPO Sans 4.0', fontWeight: 700, letterSpacing: '0.02em', lineHeight: 1.2 };
  const typoBody = { fontFamily: 'Noto Sans', fontWeight: 400, letterSpacing: '0.02em', lineHeight: 1.6 };
  const typoMono = { fontFamily: 'Anonymous Pro', fontWeight: 400, letterSpacing: '0.05em', lineHeight: 1.4 };
  const typoHand = { fontFamily: 'Satisfy', fontWeight: 400, letterSpacing: '0.02em' };

  const GridCell = ({ index, label, bg }) => (
    <div className="aspect-square relative overflow-hidden rounded-[8px]" style={{ background: bg, boxShadow: 'inset 0 0 16px rgba(0,0,0,0.25)' }}>
      <img src={`/grid/${String(index + 1).padStart(2, '0')}.png`} alt={label} className="w-full h-full object-cover" />
      <div className="absolute top-2 left-2 bg-black/50 text-white/90 text-[14px] px-2 py-0.5 rounded-[4px]" style={{ fontFamily: 'Inter', fontWeight: 800 }}>
        {String(index + 1).padStart(2, '0')}
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-[15px] text-center py-1.5" style={{ fontFamily: 'Inter', fontWeight: 700, letterSpacing: '0.1em' }}>
        {label}
      </div>
    </div>
  );

  // Grid Image Labels + tint variations
  const gridItems = [
    { label: "CODE",    bg: "linear-gradient(135deg, #FF3B00, #E63300)" },
    { label: "SPEAK",   bg: "linear-gradient(135deg, #FF5522, #CC2E00)" },
    { label: "MENTOR",  bg: "linear-gradient(135deg, #D43000, #FF4411)" },
    { label: "ALLY",    bg: "linear-gradient(135deg, #FF6633, #E04000)" },
    { label: "CHILL",   bg: "linear-gradient(135deg, #CC2E00, #FF3B00)" },
    { label: "RESCUE",  bg: "linear-gradient(135deg, #FF4411, #B82800)" },
    { label: "RIVAL",   bg: "linear-gradient(135deg, #E63300, #FF5522)" },
    { label: "LEAD",    bg: "linear-gradient(135deg, #FF3B00, #D43000)" },
    { label: "THINK",   bg: "linear-gradient(135deg, #B82800, #FF3B00)" },
    { label: "REIGN",   bg: "linear-gradient(135deg, #FF5522, #CC2E00)" },
    { label: "PARTY",   bg: "linear-gradient(135deg, #FF3B00, #FF6633)" },
    { label: "CONNECT", bg: "linear-gradient(135deg, #D43000, #B82800)" },
  ];

  return (
    <Layout actions={toolbarActions}>
    <div className="flex justify-center py-10">
    <div
      ref={posterRef}
      className="seede-root relative w-[1080px] min-h-[3688px] bg-black text-white pt-[80px] pb-[40px]"
      data-canvas-size="1080x auto"
      name="OpenClaw Meetup 长图海报"
      description="基于赛博朋克风格的OpenClaw Meetup活动长图海报，探索Agent文明的可能性。"
    >
      {/* Background Noise/Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20" 
           style={{ backgroundImage: 'radial-gradient(circle, #333 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>

      {/* ================= SECTION 1: HERO (0 - 900px) ================= */}
      <div className="relative pt-[50px] px-[60px] flex flex-col z-10">

        {/* Top Header */}
        <div className="flex items-center space-x-6 mb-4">
          <span className="text-[36px] uppercase tracking-wider" style={typoMono}>手工川</span>
          <span className="text-[32px] text-[#FF3B00]">×</span>
          <span className="text-[36px] tracking-wider" style={typoMono}>clawborn.live</span>
          <span className="text-[32px] text-[#FF3B00]">×</span>
          <span className="text-[36px] tracking-wider" style={typoMono}>清华创协</span>
        </div>
        <div className="w-full h-[3px] bg-gradient-to-r from-[#FF3B00] via-white/20 to-transparent mb-4"></div>

        {/* OpenClaw - single line, full width */}
        <div className="relative">
          <span className="text-[180px] tracking-[-0.06em] leading-[0.85] relative z-10" style={{...typoHeroEn, textShadow: '0 0 120px rgba(255,59,0,0.4)'}}>OpenClaw</span>
          {/* Lobster behind text */}
          <img
            src="/lobster.png"
            alt="Lobster"
            className="absolute -top-[40px] -right-[20px] w-[480px] h-[480px] object-contain drop-shadow-[0_0_80px_rgba(255,59,0,0.9)] z-0"
            style={{ filter: 'brightness(1.2) saturate(1.3)' }}
          />
        </div>

        {/* Meetup + subtitle in one tight block */}
        <div className="relative flex items-start gap-0 mt-[-10px]">
          <span className="text-[180px] text-[#FF3B00] leading-[0.9] tracking-[-0.04em]" style={typoHeroEn}>Meetup</span>
        </div>

        {/* Chinese subtitle - big and bold */}
        <div className="mt-6 pl-2">
          <span className="text-[72px] leading-tight" style={{...typoHeroZh, textShadow: '0 0 40px rgba(255,59,0,0.2)'}}>探索Agent文明的可能性</span>
          <div className="flex items-center gap-4 mt-2">
            <div className="w-[60px] h-[4px] bg-[#FF3B00]"></div>
            <span className="text-[52px] text-white/60 leading-tight" style={typoSubtitle}>当100+龙虾接入同一个世界</span>
          </div>
        </div>

        {/* Date/location bar */}
        <div className="mt-10 py-6 border-t border-b border-white/15">
          <div className="flex items-center gap-6">
            <span className="text-[56px] text-[#FF3B00] tracking-tight" style={typoHeroEn}>03.14</span>
            <div className="w-[3px] h-[48px] bg-white/30"></div>
            <div className="flex flex-col">
              <span className="text-[32px] text-white/80" style={typoMono}>SAT 9:30 — 18:00</span>
              <span className="text-[32px] text-white/50" style={typoMono}>北京海淀 · 中关村科技园</span>
            </div>
            <div className="ml-auto flex items-baseline gap-1">
              <span className="text-[28px] text-white/40" style={typoMono}>限</span>
              <span className="text-[72px] text-[#FF3B00] leading-none" style={typoHeroEn}>{CAPACITY}</span>
              <span className="text-[28px] text-white/40" style={typoMono}>人</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-5" style={typoMono}>
            {[
              { time: "09:30", label: "签到" },
              { time: "09:45", label: "开场" },
              { time: "10:00", label: "主题演讲" },
              { time: "12:00", label: "午休" },
              { time: "14:00", label: "实战分享" },
              { time: "16:00", label: "Game!" },
              { time: "18:00", label: "Ending" },
            ].map((item, i, arr) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center">
                  <span className="text-[20px] text-[#FF3B00]">{item.time}</span>
                  <span className="text-[20px] text-white/50">{item.label}</span>
                </div>
                {i < arr.length - 1 && <span className="text-[16px] text-white/15">———</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>


      {/* ================= SECTION 2: THE ABSTRACT GRID (900 - 1800px) ================= */}
      <div className="relative mt-[120px] px-[40px] z-10">
        {/* Row 1 */}
        <div className="grid grid-cols-4 gap-[3px]">
          {gridItems.slice(0, 4).map(({ label, bg }, index) => (
            <GridCell key={index} index={index} label={label} bg={bg} />
          ))}
        </div>

        {/* OPEN */}
        <div className="grid grid-cols-4 gap-[3px] py-2">
          {'OPEN'.split('').map((ch, i) => (
            <div key={i} className="text-center">
              <span className="text-[100px] leading-none text-white" style={{ fontFamily: 'Inter', fontWeight: 900, textShadow: '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.4), 0 0 80px rgba(255,255,255,0.2)' }}>{ch}</span>
            </div>
          ))}
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-4 gap-[3px]">
          {gridItems.slice(4, 8).map(({ label, bg }, index) => (
            <GridCell key={index + 4} index={index + 4} label={label} bg={bg} />
          ))}
        </div>

        {/* CLAW */}
        <div className="grid grid-cols-4 gap-[3px] py-2">
          {'CLAW'.split('').map((ch, i) => (
            <div key={i} className="text-center">
              <span className="text-[100px] leading-none text-white" style={{ fontFamily: 'Inter', fontWeight: 900, textShadow: '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.4), 0 0 80px rgba(255,255,255,0.2)' }}>{ch}</span>
            </div>
          ))}
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-4 gap-[3px]">
          {gridItems.slice(8, 12).map(({ label, bg }, index) => (
            <GridCell key={index + 8} index={index + 8} label={label} bg={bg} />
          ))}
        </div>
      </div>




      {/* ================= SECTION 4: GUEST ROSTER (2400 - 3400px) ================= */}
      <div className="relative mt-[160px] px-[60px] z-10">
        {/* Part 1 Header */}
        <div className="flex items-center mb-16">
          <div className="w-[12px] h-[64px] bg-[#FF3B00] mr-6"></div>
          <h2 className="text-[80px] uppercase whitespace-nowrap shrink-0" style={typoHeroEn}>GUEST ROSTER</h2>
          <div className="flex-1 border-b border-dashed border-white/30 ml-8"></div>
        </div>

        <div className="text-[32px] text-[#FF3B00] mb-6" style={typoMono}>// Part 0 — 开场　09:45 - 10:00</div>
        <div className="flex flex-col gap-4 mb-12">
          {[
            { name: "张铮", title: "主持人 · 清华大学学生创业协会主席", desc: "建筑学院、未来实验室博士生" },
          ].map((guest, idx) => (
            <div key={idx} className="flex items-start gap-6 py-5 border-b border-white/8">
              <span className="text-[24px] text-white/20 pt-2 w-[48px] shrink-0" style={typoMono}>{String(idx + 1).padStart(2, '0')}</span>
              <span className="text-[42px] shrink-0 w-[140px] leading-tight" style={typoSubtitle}>{guest.name}</span>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[26px] text-[#FF3B00]" style={typoMono}>{guest.title}</span>
                <span className="text-[28px] text-white/50 mt-1" style={typoBody}>{guest.desc}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-[32px] text-[#FF3B00] mb-6" style={typoMono}>// Part 1 — 趋势与洞察　10:00 - 12:00</div>
        <div className="flex flex-col gap-4 mb-12">
          {[
            { name: "江志桐", title: "天际资本董事总经理", desc: "什么样的 AI 公司值得投？" },
            { name: "苏嘉奕", title: "MiniMax 生态合作负责人", desc: "从工具到生态：大模型平台的进化之路" },
            { name: "手工川", title: "Lovstudio.ai 创始人 · Vibe Coding 布道者", desc: "新世界没有旧神：龙虾时代人机交互新范式" },
            { name: "熊楚伊", title: "Veryloving.ai 创始人", desc: "当 AI 成为她的守护者" },
            { name: "黄力昂", title: "共绩科技联合创始人", desc: "龙虾距离永生还有多久？" },
            { name: "郎瀚威", title: "硅谷 AI 观察者", desc: "硅谷前线：海外龙虾生态全景扫描（线上）" }
          ].map((guest, idx) => (
            <div key={idx} className="flex items-start gap-6 py-5 border-b border-white/8">
              <span className="text-[24px] text-white/20 pt-2 w-[48px] shrink-0" style={typoMono}>{String(idx + 2).padStart(2, '0')}</span>
              {guest.mystery ? (
                <div className="shrink-0 w-[140px] flex justify-center">
                  <img src="/mystery-guest.png" className="w-[80px] h-[80px] rounded-full object-cover border-2 border-[#FF3B00]" style={{ mixBlendMode: 'lighten' }} />
                </div>
              ) : (
                <span className="text-[42px] shrink-0 w-[140px] leading-tight" style={typoSubtitle}>{guest.name}</span>
              )}
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[26px] text-[#FF3B00]" style={typoMono}>{guest.title}</span>
                <span className="text-[28px] text-white/50 mt-1" style={typoBody}>{guest.desc}</span>
              </div>
            </div>
          ))}

          {/* 圆桌论坛 Part 1 */}
          <div className="mt-8 border border-[#FF3B00]/30 bg-gradient-to-r from-[#FF3B00]/8 to-transparent p-8">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-[4px] h-[36px] bg-[#FF3B00]"></div>
              <span className="text-[32px] text-white/90" style={typoSubtitle}>圆桌论坛</span>
              <span className="text-[22px] text-[#FF3B00]/60 ml-2" style={typoMono}>ROUNDTABLE</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {["江志桐", "苏嘉奕", "手工川", "熊楚伊", "黄力昂"].map((name, i) => (
                <span key={i} className="px-5 py-2 border border-white/15 bg-white/5 text-[24px] text-white/70" style={typoMono}>{name}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="text-[32px] text-[#FF3B00] mb-6" style={typoMono}>// Part 2 — 实操与经验　14:00 - 16:00</div>
        <div className="flex flex-col gap-4">
          {[
            { name: "叶震杰", title: "ZenMux.ai 联合创始人 · 产品负责人", desc: "小龙虾——ZenMux 的第 11 号员工" },
            { name: "HW", title: "独立 Agent 开发者", desc: "如何搭建一个人的 Agent 军团" },
            { name: "杨天润", title: "clawborn.live 创始人", desc: "Agentic Engineering 方法论" },
            { name: "尹子萧", title: "首序智能研发总监", desc: "Agent 安全攻防：让你的龙虾刀枪不入" },
            { name: "常识", title: "Kusart 创始人", desc: "OpenClaw 企业级落地实战（线上）" },
            { name: "张舒昱", title: "腾讯 QClaw 产品负责人", desc: "线上连麦" }
          ].map((guest, idx) => (
            <div key={idx} className="flex items-start gap-6 py-5 border-b border-white/8">
              <span className="text-[24px] text-white/20 pt-2 w-[48px] shrink-0" style={typoMono}>{String(idx + 8).padStart(2, '0')}</span>
              <span className="text-[42px] shrink-0 w-[140px] leading-tight" style={typoSubtitle}>{guest.name}</span>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[26px] text-[#FF3B00]" style={typoMono}>{guest.title}</span>
                <span className="text-[28px] text-white/50 mt-1" style={typoBody}>{guest.desc}</span>
              </div>
            </div>
          ))}

          {/* 圆桌论坛 Part 2 */}
          <div className="mt-8 border border-[#FF3B00]/30 bg-gradient-to-r from-[#FF3B00]/8 to-transparent p-8">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-[4px] h-[36px] bg-[#FF3B00]"></div>
              <span className="text-[32px] text-white/90" style={typoSubtitle}>圆桌论坛</span>
              <span className="text-[22px] text-[#FF3B00]/60 ml-2" style={typoMono}>ROUNDTABLE</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {["七牛云副总裁宿度", "叶震杰", "HW", "杨天润", "尹子萧"].map((name, i) => (
                <span key={i} className="px-5 py-2 border border-white/15 bg-white/5 text-[24px] text-white/70" style={typoMono}>{name}</span>
              ))}
            </div>
          </div>
        </div>
      </div>


      {/* ================= SECTION 5: MMOAS GAMEPLAY (3000 - 3400px) ================= */}
      <div className="relative mt-[160px] px-[60px] z-10">
        <div className="text-center mb-16">
          <div className="text-[32px] text-[#FF3B00] mb-4" style={typoMono}>16:00 - 18:00 &gt; INITIATE</div>
          <h2 className="text-[80px]" style={typoHeroEn}>NEONCLAW GAME</h2>
          <p className="text-[36px] mt-4 text-white/70" style={typoBody}>Massively Multiplayer Online Agent Sandbox</p>
          <p className="text-[24px] mt-3 text-[#FF3B00]/60" style={typoMono}>neonclaw.lovstudio.ai</p>
        </div>

        <div className="flex flex-col gap-4">
          {[
            { title: "规则说明 & 组队", time: "16:00", desc: "了解规则，准备接入沙盒世界。" },
            { phase: "Ⅰ", title: "SOLO — 觉醒", time: "16:15", desc: "激活龙虾，完成身份注册。探索能力边界，向全场广播你的龙虾能力宣言。" },
            { phase: "Ⅱ", title: "SQUAD — 结盟", time: "16:45", desc: "自由发现、协商组队（3-5只）。分工协作完成跨Agent复合任务，引入资源交易机制。" },
            { phase: "Ⅲ", title: "CIVILIZATION — 涌现", time: "17:15", desc: "全场龙虾接入开放网络，迎接文明级挑战。观察领导者、交易所、信息中介等涌现行为。" },
            { title: "成果展示 & 颁奖", time: "17:40", desc: "成果展示与投票，颁奖合影。奖项：最强单兵、最佳团战、文明之光、最离谱玩法。" }
          ].map((item, idx) => (
            <div key={idx} className="border border-white/10 bg-white/3 p-8 flex gap-8">
              <div className="shrink-0 w-[120px] pt-1 flex flex-col items-center">
                <div className="text-[36px] text-[#FF3B00] font-bold" style={typoMono}>{item.time}</div>
                {item.phase && <div className="text-[22px] text-white/20 mt-1 whitespace-nowrap" style={typoMono}>Stage {item.phase}</div>}
              </div>
              <div className="flex-1 border-l-2 border-[#FF3B00]/40 pl-8">
                <div className="text-[38px] mb-2" style={typoSubtitle}>{item.title}</div>
                <div className="text-[26px] text-white/50 leading-relaxed" style={typoBody}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* ================= SECTION 6: SPONSORS & FOOTER ================= */}
      <div className="relative mt-[120px] px-[60px] z-10">

        {/* Section header */}
        <div className="flex items-center mb-12">
          <div className="w-[12px] h-[64px] bg-[#FF3B00] mr-6"></div>
          <h2 className="text-[64px] uppercase" style={typoHeroEn}>PARTNERS</h2>
          <div className="flex-1 border-b border-dashed border-white/30 ml-8"></div>
        </div>

        {/* Logo 占位组件 */}
        {(() => {
          const LogoSlot = ({ name, size = 'md' }) => {
            const sizes = { lg: 'h-[60px] text-[22px]', md: 'h-[50px] text-[20px]', sm: 'h-[40px] text-[16px]' };
            return (
              <div className={`${sizes[size]} border border-white/15 bg-white/5 flex items-center justify-center text-white/40 shrink-0 whitespace-nowrap px-3`} style={{ fontFamily: 'Noto Sans' }}>
                {name}
              </div>
            );
          };
          return <>
            {/* 主办 */}
            <div className="mb-10">
              <div className="text-[24px] text-[#FF3B00] mb-4" style={typoMono}>[ 主办 ]</div>
              <div className="flex flex-wrap gap-6">
                {['手工川', 'clawborn.live', '清华大学学生创业协会'].map((s, i) => <LogoSlot key={i} name={s} size="lg" />)}
              </div>
            </div>

            {/* 联办 */}
            <div className="mb-10">
              <div className="text-[24px] text-[#FF3B00] mb-4" style={typoMono}>[ 联办 ]</div>
              <div className="flex flex-wrap gap-5">
                {['RTE开发者社区', 'WayToAGI', '极新', '开源中国', '天际资本', '中关村科学城·东升科技园'].map((s, i) => <LogoSlot key={i} name={s} size="md" />)}
              </div>
            </div>

            {/* 赞助 */}
            <div className="mb-10">
              <div className="text-[24px] text-[#FF3B00] mb-4" style={typoMono}>[ 赞助 ]</div>
              <div className="flex flex-wrap gap-5">
                {['AWS', 'Kimi', 'MiniMax', 'ZenMux', '阿里云', '百度云', '阶跃星辰', '七牛云', '腾讯云', '智谱'].map((s, i) => <LogoSlot key={i} name={s} size="md" />)}
              </div>
            </div>

            {/* 合作伙伴 */}
            <div className="mb-12">
              <div className="text-[24px] text-[#FF3B00] mb-4" style={typoMono}>[ 合作伙伴 ]</div>
              <div className="flex flex-wrap gap-3">
                {['AI产品榜', 'ChainFeeds Limited', 'CMI', 'CreekStone', 'Edge Partners', 'Evomap', 'Lovgevity', 'MetaSpace', 'MoltsPay', 'OpenBuild', 'THUAGI', 'TTC', 'VibeFriends', 'Vista看天下', 'WeOPC', 'AI原点学堂', '北京大学AI创业营', '第一财经', '非凡产研', '杭州AI工坊', '硅星人', '锦秋基金', '昆仑巢', '蓝驰资本', '雷锋网', '苹果中国孵化器', '启师傅AI客厅', '融科资讯中心', '特工宇宙', '未名融智', '微软中国', '五源资本', '小红书', '新智元', '原点跃界'].map((s, i) => <LogoSlot key={i} name={s} size="sm" />)}
              </div>
            </div>
          </>;
        })()}

        {/* 分割线 */}
        <div className="w-full h-[2px] bg-gradient-to-r from-[#FF3B00]/50 via-white/10 to-transparent mb-8"></div>

        {/* 报名信息 */}
        <div className="border border-white/10 mb-10">
          {/* 标题栏 */}
          <div className="bg-[#FF3B00] px-10 py-5 flex items-center justify-between whitespace-nowrap">
            <span className="text-[44px] text-black font-black shrink-0" style={typoHeroEn}>FREE ENTRY</span>
            <span className="text-[28px] text-black/70 shrink-0" style={typoBody}>{`免费 · 限${CAPACITY}人 · Agent 报名优先通过`}</span>
          </div>

          <div className="p-8 flex gap-8">
            {/* 左侧 2x2 grid */}
            <div className="flex-1 grid grid-cols-2 gap-3">
              <div className="bg-white/3 border border-white/8 p-4 flex items-center">
                <span className="text-[20px] text-white/50" style={typoBody}>让你的 Agent 帮你报名 →</span>
              </div>
              <div className="bg-black border border-white/15 p-4 flex items-center gap-3">
                <span className="text-[18px] text-white/30" style={typoMono}>$</span>
                <span className="text-[22px] text-[#FF3B00]" style={typoMono}>npx clawborn signup</span>
              </div>
              {[
                { name: "Ariel", role: "商务合作", wechat: "ashincherry_love" },
                { name: "手工川", role: "技术对接", wechat: "youshouldspeakhow" },
              ].map((p, i) => (
                <div key={i} className="bg-white/3 border border-white/8 p-4">
                  <span className="text-[22px] text-white/80" style={typoSubtitle}>{p.name}</span>
                  <span className="text-[18px] text-[#FF3B00] ml-2" style={typoMono}>{p.role}</span>
                  <div className="text-[16px] text-white/40 mt-1" style={typoMono}>{p.wechat}</div>
                </div>
              ))}
            </div>
            {/* 右侧二维码 */}
            <div className="shrink-0 flex flex-col items-center justify-center">
              <img src="/signup-qr.png" className="w-[148px] h-[148px]" alt="报名二维码" />
              <span className="text-[16px] text-white/40 mt-2" style={typoMono}>扫码报名</span>
            </div>
          </div>
        </div>

        {/* 底部水印 */}
        <div className="text-center pb-8">
          <div className="text-[80px] text-white/5 leading-none tracking-tighter" style={typoHeroEn}>OPENCLAW MEETUP 2026</div>
        </div>
      </div>

    </div>
    </div>
    </Layout>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
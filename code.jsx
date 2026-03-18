import './app.css';
import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { domToJpeg } from 'modern-screenshot';
import { Layout } from './components/Layout.jsx';
import { CAPACITY, VENUE } from './constants.js';
import { pinyin } from 'pinyin-pro';
import JSZip from 'jszip';

const btnClass = "px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs rounded-md border border-white/20 cursor-pointer transition-colors disabled:opacity-50";

const sortByPinyin = (arr) => {
  const key = (s) => pinyin(s, { toneType: 'none', type: 'array' }).join('').toLowerCase();
  return [...arr].sort((a, b) => key(a).localeCompare(key(b)));
};

const useToolbar = (targetRef) => {
  const [copyStatus, setCopyStatus] = useState('idle');
  const [dlStatus, setDlStatus] = useState('idle');
  const [sliceStatus, setSliceStatus] = useState('idle');
  const [gridStatus, setGridStatus] = useState('idle');

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

  const handleDownloadSlices = async () => {
    setSliceStatus('generating');
    try {
      const dataUrl = await generate();
      if (!dataUrl) return;
      const el = targetRef.current;
      const sections = el.querySelectorAll('[data-section]');
      if (!sections.length) return;

      const scale = 3;
      const width = el.offsetWidth * scale;
      const img = new Image();
      img.src = dataUrl;
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });

      const zip = new JSZip();
      const fullRes = await fetch(dataUrl);
      const fullBlob = await fullRes.blob();
      zip.file('openclaw-meetup-poster-full.jpg', fullBlob);
      for (let i = 0; i < sections.length; i++) {
        const top = sections[i].offsetTop * scale;
        const bottom = i < sections.length - 1
          ? sections[i + 1].offsetTop * scale
          : img.height;
        const height = bottom - top;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, top, width, height, 0, 0, width, height);

        const blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', 0.9));
        zip.file(`openclaw-meetup-poster-${i + 1}.jpg`, blob);
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(zipBlob);
      a.download = 'openclaw-meetup-poster.zip';
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (e) {
      console.error(e);
    }
    setSliceStatus('idle');
  };

  const handleDownloadGrid = async () => {
    setGridStatus('generating');
    try {
      const dataUrl = await generate();
      if (!dataUrl) return;
      const el = targetRef.current;
      const cells = el.querySelectorAll('[data-grid-cell]');
      if (!cells.length) return;

      const scale = 3;
      const posterRect = el.getBoundingClientRect();
      const img = new Image();
      img.src = dataUrl;
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });

      const zip = new JSZip();
      // Export grid section as one image
      const gridSection = el.querySelector('[data-grid-section]');
      if (gridSection) {
        const gridRect = gridSection.getBoundingClientRect();
        const gx = (gridRect.left - posterRect.left) * scale;
        const gy = (gridRect.top - posterRect.top) * scale;
        const gw = gridRect.width * scale;
        const gh = gridRect.height * scale;
        const gc = document.createElement('canvas');
        gc.width = gw;
        gc.height = gh;
        gc.getContext('2d').drawImage(img, gx, gy, gw, gh, 0, 0, gw, gh);
        const fullBlob = await new Promise(r => gc.toBlob(r, 'image/jpeg', 0.95));
        zip.file('00-FULL.jpg', fullBlob);
      }

      for (const cell of cells) {
        const label = cell.getAttribute('data-grid-cell');
        const idx = cell.getAttribute('data-grid-index');
        const rect = cell.getBoundingClientRect();
        const x = (rect.left - posterRect.left) * scale;
        const y = (rect.top - posterRect.top) * scale;
        const w = rect.width * scale;
        const h = rect.height * scale;

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, x, y, w, h, 0, 0, w, h);

        const blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', 0.95));
        zip.file(`${idx}-${label}.jpg`, blob);
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(zipBlob);
      a.download = 'openclaw-grid-images.zip';
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (e) {
      console.error(e);
    }
    setGridStatus('idle');
  };

  const copyLabel = { idle: '复制', copying: '生成中...', done: '已复制!', error: '失败' }[copyStatus];

  return (
    <>
      <button onClick={handleCopy} disabled={copyStatus === 'copying'} className={btnClass}>{copyLabel}</button>
      <button onClick={handleDownload} disabled={dlStatus === 'generating'} className={btnClass}>{dlStatus === 'generating' ? '生成中...' : '下载'}</button>
      <button onClick={handleDownloadSlices} disabled={sliceStatus === 'generating'} className={btnClass}>{sliceStatus === 'generating' ? '切割中...' : '导出分图'}</button>
      <button onClick={handleDownloadGrid} disabled={gridStatus === 'generating'} className={btnClass}>{gridStatus === 'generating' ? '导出中...' : '导出宫格'}</button>
    </>
  );
};

const App = () => {
  const posterRef = useRef(null);
  const toolbarActions = useToolbar(posterRef);
  // Typography Tokens based on constraints
  const typoHeroEn = { fontFamily: 'Inter', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1 };
  const typoHeroZh = { fontFamily: 'OPPO Sans 4.0', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1 };
  const typoSubtitle = { fontFamily: 'OPPO Sans 4.0', fontWeight: 700, letterSpacing: '0.02em', lineHeight: 1.2 };
  const typoBody = { fontFamily: 'Noto Sans', fontWeight: 400, letterSpacing: '0.02em', lineHeight: 1.6 };
  const typoMono = { fontFamily: 'Anonymous Pro', fontWeight: 400, letterSpacing: '0.05em', lineHeight: 1.4 };
  const typoHand = { fontFamily: 'Satisfy', fontWeight: 400, letterSpacing: '0.02em' };

  const GridCell = ({ index, label, bg }) => (
    <div data-grid-cell={label} data-grid-index={String(index + 1).padStart(2, '0')} className="aspect-square relative overflow-hidden rounded-[8px]" style={{ background: bg, boxShadow: 'inset 0 0 16px rgba(0,0,0,0.25)' }}>
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
      description="基于赛博朋克风格的 OpenClaw Meetup 活动长图海报，探索 Agent 文明的可能性。"
    >
      {/* Background Noise/Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20" 
           style={{ backgroundImage: 'radial-gradient(circle, #333 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>

      {/* ================= SECTION 1: HERO (0 - 900px) ================= */}
      <div data-section="hero" className="relative pt-[80px] pb-[60px] px-[60px] flex flex-col z-10">

        {/* Top Header */}
        <div className="flex items-center space-x-6 mb-4 whitespace-nowrap flex-nowrap">
          <span className="text-[36px] tracking-wider" style={typoMono}>清华创协</span>
          <span className="text-[32px] text-[#FF3B00]">×</span>
          <span className="text-[36px] uppercase tracking-wider" style={typoMono}>手工川</span>
          <span className="text-[32px] text-[#FF3B00]">×</span>
          <span className="text-[36px] tracking-wider" style={typoMono}>clawborn.live</span>
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
          <span className="text-[72px] leading-tight" style={{...typoHeroZh, textShadow: '0 0 40px rgba(255,59,0,0.2)'}}>探索 Agent 文明的可能性</span>
          <div className="flex items-center gap-4 mt-2">
            <div className="w-[60px] h-[4px] bg-[#FF3B00]"></div>
            <span className="text-[52px] text-white/60 leading-tight whitespace-nowrap" style={typoSubtitle}>当 100+ 龙虾接入同一个世界</span>
          </div>
        </div>

        {/* Date/location bar */}
        <div className="mt-10 py-6 border-t border-b border-white/15">
          <div className="flex items-center gap-6">
            <span className="text-[56px] text-[#FF3B00] tracking-tight" style={typoHeroEn}>03.14</span>
            <div className="w-[3px] h-[48px] bg-white/30"></div>
            <div className="flex flex-col">
              <span className="text-[32px] text-white/80" style={typoMono}>SAT 9:30 — 18:00</span>
              <span className="text-[32px] text-white/50" style={typoMono}>{VENUE}</span>
              <span className="text-[20px] text-white/30 mt-1" style={typoMono}>具体地址报名审核通过后通知</span>
            </div>
            <div className="ml-auto flex items-baseline gap-1">
              <span className="text-[28px] text-white/40" style={typoMono}>限</span>
              <span className="text-[72px] text-[#FF3B00] leading-none" style={typoHeroEn}>{CAPACITY}</span>
              <span className="text-[28px] text-white/40" style={typoMono}>虾</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-5 flex-nowrap whitespace-nowrap" style={typoMono}>
            {[
              { time: "09:30", label: "签到" },
              { time: "10:00", label: "主题演讲 I" },
              { time: "12:00", label: "午休" },
              { time: "13:45", label: "签到" },
              { time: "14:00", label: "主题演讲 II" },
              { time: "16:00", label: "🎮 Game!" },
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


      {/* ================= SECTION 2: THE ABSTRACT GRID ================= */}
      <div data-grid-section className="relative py-[60px] px-[40px] z-10">
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
              <span className="text-[100px] leading-none text-white" style={{ fontFamily: 'Inter', fontWeight: 900, textShadow: '0 0 12px rgba(255,255,255,0.3), 0 0 30px rgba(255,255,255,0.15)' }}>{ch}</span>
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
              <span className="text-[100px] leading-none text-white" style={{ fontFamily: 'Inter', fontWeight: 900, textShadow: '0 0 12px rgba(255,255,255,0.3), 0 0 30px rgba(255,255,255,0.15)' }}>{ch}</span>
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

      {/* ================= SECTION 3: GUEST ROSTER Part 0+1 ================= */}
      <div data-section="guest-01" className="relative pt-[80px] pb-0 px-[60px] z-10">
        {/* Part 1 Header */}
        <div className="flex items-center mb-16">
          <div className="w-[12px] h-[64px] bg-[#FF3B00] mr-6"></div>
          <h2 className="text-[80px] uppercase whitespace-nowrap shrink-0" style={typoHeroEn}>GUEST ROSTER</h2>
          <div className="flex-1 border-b border-dashed border-white/30 ml-8"></div>
        </div>

        <div className="text-[32px] text-[#FF3B00] mb-6" style={typoMono}>// Part 0 — 开场　09:45 - 10:00</div>
        <div className="flex flex-col gap-4 mb-12">
          {[
            { name: "张铮", title: "主持人 · 清华大学学生创业协会主席", desc: "AI 浪潮下的青年创业生态分享 - 以 THU 为例" },
            { name: "赵媛", title: "中关村东升科技园创新项目负责人", desc: "给创新 以力量" },
            { name: "手工川", title: "发起人 · Lovstudio.ai 创始人", desc: "AI 创业在北京，北京创业在东升" },
          ].map((guest, idx) => (
            <div key={idx} className="flex items-start gap-6 py-5 border-b border-white/8">
              <span className="text-[24px] text-white/20 pt-2 w-[48px] shrink-0" style={typoMono}>{String(idx + 1).padStart(2, '0')}</span>
              <span className="text-[42px] shrink-0 w-[140px] leading-tight flex justify-between whitespace-nowrap" style={typoSubtitle}>{guest.name.split('').map((ch, i) => <span key={i}>{ch}</span>)}</span>
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
            { name: "黄力昂", title: "共绩科技联合创始人", desc: "龙虾距离永生还有多久？" },
            { name: "手工川", title: "Lovstudio.ai 创始人 · Vibe Coding 布道师", desc: "新世界没有旧神：龙虾时代人机交互新范式" },
            { name: "熊楚伊", title: "Veryloving.ai 创始人", desc: "当 AI 成为她的守护者" },
            { name: "郎瀚威", title: "知名博主 · 硅谷 AI 行业分析师 / 增长顾问", desc: "硅谷前线：海外龙虾生态全景扫描（线上）" },
            { name: "Scott", title: "Paradigm 创始人 · OpenClaw Maintainer", desc: "别焦虑，OpenClaw 没那么难（线上）" }
          ].map((guest, idx) => (
            <div key={idx} className="flex items-start gap-6 py-5 border-b border-white/8">
              <span className="text-[24px] text-white/20 pt-2 w-[48px] shrink-0" style={typoMono}>{String(idx + 4).padStart(2, '0')}</span>
              {guest.mystery ? (
                <div className="shrink-0 w-[140px] flex justify-center">
                  <img src="/mystery-guest.png" className="w-[80px] h-[80px] rounded-full object-cover border-2 border-[#FF3B00]" style={{ mixBlendMode: 'lighten' }} />
                </div>
              ) : (
                <span className="text-[42px] shrink-0 w-[140px] leading-tight flex justify-between whitespace-nowrap" style={typoSubtitle}>{guest.name.split('').map((ch, i) => <span key={i}>{ch}</span>)}</span>
              )}
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[26px] text-[#FF3B00]" style={typoMono}>{guest.title}</span>
                <span className="text-[28px] text-white/50 mt-1" style={typoBody}>{guest.desc}</span>
              </div>
            </div>
          ))}

          {/* 圆桌论坛 Part 1 */}
          <div className="mt-3 border border-[#FF3B00]/30 bg-gradient-to-r from-[#FF3B00]/8 to-transparent p-8">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-[4px] h-[36px] bg-[#FF3B00]"></div>
              <span className="text-[32px] text-white/90" style={typoSubtitle}>圆桌论坛（一）</span>
              <span className="text-[22px] text-[#FF3B00]/60 ml-2" style={typoMono}>ROUNDTABLE</span>
            </div>
            <div className="flex justify-between">
              {["江志桐", "苏嘉奕", "黄力昂", "手工川", "熊楚伊"].map((name, i) => (
                <span key={i} className="px-5 py-2 border border-white/15 bg-white/5 text-[24px] text-white/70 whitespace-nowrap shrink-0" style={typoMono}>{name}</span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ================= SECTION 4: GUEST ROSTER Part 2 ================= */}
      <div className="relative pt-[60px] pb-[80px] px-[60px] z-10">
        <div className="text-[32px] text-[#FF3B00] mb-6" style={typoMono}>// Part 2 — 实操与经验　14:00 - 16:00</div>
        <div className="flex flex-col gap-4">
          {[
            { name: "杨天润", title: "clawborn.live 创始人", desc: "Agentic Engineering 方法论" },
            { name: "叶震杰", title: "ZenMux.ai 联合创始人 · 产品负责人", desc: "小龙虾——ZenMux 的第 11 号员工" },
            { name: "尹子萧", title: "首序智能研发总监", desc: "Agent 安全攻防：让你的龙虾刀枪不入" },
            { name: "HW", title: "独立 Agent 开发者", desc: "如何搭建一个人的 Agent 军团" },
            { name: "常识", title: "Kusart 创始人", desc: "OpenClaw 企业级落地实战（线上）" },
            { name: "张舒昱", title: "腾讯 QClaw 产品负责人", desc: "线上连麦" }
          ].map((guest, idx) => (
            <div key={idx} className="flex items-start gap-6 py-5 border-b border-white/8">
              <span className="text-[24px] text-white/20 pt-2 w-[48px] shrink-0" style={typoMono}>{String(idx + 12).padStart(2, '0')}</span>
              <span className="text-[42px] shrink-0 w-[140px] leading-tight flex justify-between whitespace-nowrap" style={typoSubtitle}>{guest.name.split('').map((ch, i) => <span key={i}>{ch}</span>)}</span>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[26px] text-[#FF3B00]" style={typoMono}>{guest.title}</span>
                <span className="text-[28px] text-white/50 mt-1" style={typoBody}>{guest.desc}</span>
              </div>
            </div>
          ))}

          {/* 圆桌论坛 Part 2 */}
          <div className="mt-3 border border-[#FF3B00]/30 bg-gradient-to-r from-[#FF3B00]/8 to-transparent p-8">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-[4px] h-[36px] bg-[#FF3B00]"></div>
              <span className="text-[32px] text-white/90" style={typoSubtitle}>圆桌论坛（二）</span>
              <span className="text-[22px] text-[#FF3B00]/60 ml-2" style={typoMono}>ROUNDTABLE</span>
            </div>
            <div className="flex justify-between">
              {["七牛云副总裁宿度", "杨天润", "叶震杰", "尹子萧", "HW"].map((name, i) => (
                <span key={i} className="px-5 py-2 border border-white/15 bg-white/5 text-[24px] text-white/70 whitespace-nowrap shrink-0" style={typoMono}>{name}</span>
              ))}
            </div>
          </div>
        </div>
      </div>


      {/* ================= SECTION 5: MMOAS GAMEPLAY ================= */}
      <div data-section="neonclaw" className="relative py-[80px] px-[60px] z-10">
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
            { phase: "Ⅱ", title: "SQUAD — 结盟", time: "16:45", desc: "自由发现、协商组队（3-5 只）。分工协作完成跨 Agent 复合任务，引入资源交易机制。" },
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
      <div data-section="partners" className="relative py-[80px] px-[60px] z-10">

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
                {['清华大学学生创业协会', '手工川', 'clawborn.live'].map((s, i) => <LogoSlot key={i} name={s} size="lg" />)}
              </div>
            </div>

            {/* 联办 */}
            <div className="mb-10">
              <div className="text-[24px] text-[#FF3B00] mb-4" style={typoMono}>[ 联办 ]</div>
              <div className="flex flex-wrap gap-5">
                {['中关村科学城 · 东升科技园', 'WayToAGI'].map((s, i) => <LogoSlot key={i} name={s} size="md" />)}
              </div>
            </div>


            {/* 特别支持 */}
            <div className="mb-10">
              <div className="text-[24px] text-[#FF3B00] mb-4" style={typoMono}>[ 特别支持 ]</div>
              <div className="flex flex-wrap gap-5">
                {sortByPinyin(['极新', '开源社', '开源中国', 'CMI', 'OpenBMB', 'OpenBuild', 'RTE 开发者社区', 'WeOPC', '天际资本', '张子峰ARK']).map((s, i) => <LogoSlot key={i} name={s} size="md" />)}
              </div>
            </div>

            {/* 赞助 */}
            <div className="mb-10">
              <div className="text-[24px] text-[#FF3B00] mb-4" style={typoMono}>[ 赞助 ]</div>
              <div className="flex flex-wrap gap-5">
                {sortByPinyin(['阿里云', 'AWS', '百度智能云', '阶跃星辰', 'Kimi', 'MiniMax', '七牛云', '腾讯云', 'ZenMux', '智谱']).map((s, i) => <LogoSlot key={i} name={s} size="md" />)}
              </div>
            </div>

            {/* 合作伙伴 */}
            <div className="mb-12">
              <div className="text-[24px] text-[#FF3B00] mb-4" style={typoMono}>[ 合作伙伴 ]</div>
              <div className="flex flex-wrap gap-3">
                {sortByPinyin(['AGIBar', 'AI 产品榜', 'AI 原点学堂', '北京大学 AI 创业营', '北京大学学生创业圈', 'ChainFeeds Limited', 'CreekStone', 'CSDN', '第一财经', 'Edge Partners', 'Evomap', '非凡产研', '硅星人', '杭州 AI 工坊', '锦秋基金', '昆仑巢', '蓝驰资本', '雷锋网', 'LinkLoud', 'Lovgevity', 'MetaSpace', 'MoltsPay', '苹果中国孵化器', '启师傅 AI 客厅', '融科资讯中心', '特工宇宙', 'THUAGI', 'TTC', 'VibeFriends', 'Vista 看天下', '未名融智', '微软中国', '五源资本', '小红书', '小米', '新智元', '原点跃界', 'TRAE']).map((s, i) => <LogoSlot key={i} name={s} size="sm" />)}
              </div>
            </div>
          </>;
        })()}
        <div className="text-[18px] text-white/20 mt-6 text-right" style={typoMono}>* 排名不分先后，主要基于拼音</div>

        {/* 分割线 */}
        <div className="w-full h-[2px] bg-gradient-to-r from-[#FF3B00]/50 via-white/10 to-transparent mb-8"></div>

        {/* 报名信息 */}
        <div className="border border-[#FF3B00]/30 mb-10">
          <div className="bg-[#FF3B00] px-10 py-4 flex items-center justify-between whitespace-nowrap">
            <span className="text-[40px] text-black font-black" style={typoHeroEn}>FREE ENTRY</span>
            <span className="text-[24px] text-black/70" style={typoBody}>{`免费 · 限 ${CAPACITY} 虾 · 报名审核制`}</span>
          </div>
          <div className="flex flex-nowrap whitespace-nowrap">
            {/* Agent 报名 */}
            <div className="flex-1 p-8 border-r border-white/10 flex flex-col items-center justify-center">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-[20px] text-[#FF3B00]" style={typoMono}>{'>'}</span>
                <span className="text-[22px] text-[#FF3B00] uppercase tracking-wider" style={typoMono}>Agent 报名</span>
                <span className="text-[14px] text-black bg-[#FF3B00] px-2 py-0.5 ml-2" style={typoMono}>推荐</span>
              </div>
              <div className="text-[36px] text-[#FF3B00] tracking-wider leading-tight text-center" style={typoMono}>bnB4IGNsYXdib3JuIHNpZ251cA==</div>
            </div>
            {/* 虾工报名 */}
            <div className="w-[200px] shrink-0 p-8 flex flex-col items-center justify-center">
              <span className="text-[18px] text-white/40 mb-4" style={typoMono}>虾工报名</span>
              <img src="/signup-qr.png" className="w-[110px] h-[110px] opacity-80" alt="报名二维码" />
            </div>
          </div>
        </div>

        {/* 底部水印 */}
        <div className="text-center pb-8">
          <div className="text-[80px] text-white/15 leading-none tracking-tighter" style={typoHeroEn}>OPENCLAW MEETUP 2026</div>
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
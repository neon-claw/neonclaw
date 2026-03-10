import './app.css';
import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { domToPng } from 'modern-screenshot';
import { Layout } from './components/Layout.jsx';

const btnClass = "px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs rounded-md border border-white/20 cursor-pointer transition-colors disabled:opacity-50";

const useToolbar = (targetRef) => {
  const [copyStatus, setCopyStatus] = useState('idle');

  const generate = async () => {
    return await domToPng(targetRef.current, {
      scale: 3,
      features: { removeControlCharacter: false },
    });
  };

  const handleCopy = async () => {
    if (!targetRef.current) return;
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

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = '/neonclaw-meetup-poster.png';
    a.download = 'neonclaw-meetup-poster.png';
    a.click();
  };

  const copyLabel = { idle: '复制', copying: '生成中...', done: '已复制!', error: '失败' }[copyStatus];

  return (
    <>
      <button onClick={handleCopy} disabled={copyStatus === 'copying'} className={btnClass}>{copyLabel}</button>
      <button onClick={handleDownload} className={btnClass}>下载</button>
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
    <Layout actions={toolbarActions}>
    <div className="flex justify-center py-10">
    <div
      ref={posterRef}
      className="seede-root relative w-[1080px] min-h-[3688px] bg-black text-white pb-[40px]"
      data-canvas-size="1080x auto"
      name="NeonClaw Meetup 长图海报"
      description="基于赛博朋克风格的NeonClaw Meetup活动长图海报，探索Agent文明的可能性。"
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
          <span className="text-[36px] tracking-wider" style={typoMono}>Naughty Labs</span>
          <span className="text-[32px] text-[#FF3B00]">×</span>
          <span className="text-[36px] tracking-wider" style={typoMono}>清华创协</span>
        </div>
        <div className="w-full h-[3px] bg-gradient-to-r from-[#FF3B00] via-white/20 to-transparent mb-4"></div>

        {/* NeonClaw - single line, full width */}
        <div className="relative">
          <span className="text-[180px] tracking-[-0.06em] leading-[0.85] relative z-10" style={{...typoHeroEn, textShadow: '0 0 120px rgba(255,59,0,0.4)'}}>NeonClaw</span>
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
              <span className="text-[72px] text-[#FF3B00] leading-none" style={typoHeroEn}>150</span>
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
      <div className="relative mt-[120px] px-[20px] z-10">
        <div className="grid grid-cols-4 gap-2 bg-[#222] p-2 border-y-2 border-[#444]">
          {gridPrompts.map((prompt, index) => (
            <div key={index} className="aspect-square relative overflow-hidden bg-black group">
              <img
                src={`/grid/${String(index + 1).padStart(2, '0')}.png`}
                alt={prompt}
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




      {/* ================= SECTION 4: GUEST ROSTER (2400 - 3400px) ================= */}
      <div className="relative mt-[160px] px-[60px] z-10">
        {/* Part 1 Header */}
        <div className="flex items-center mb-16">
          <div className="w-[12px] h-[64px] bg-[#FF3B00] mr-6"></div>
          <h2 className="text-[80px] uppercase" style={typoHeroEn}>GUEST ROSTER</h2>
          <div className="flex-1 border-b border-dashed border-white/30 ml-8"></div>
        </div>

        <div className="text-[32px] text-[#FF3B00] mb-6" style={typoMono}>// Part 1 — 趋势与洞察　10:00 - 12:00</div>
        <div className="flex flex-col gap-4 mb-12">
          {[
            { name: "手工川", title: "Lovstudio.ai 创始人 · Vibe Coding 布道者", desc: "新世界没有旧神" },
            { name: "杨天润", title: "Naughty Labs 创始人 · NeonClaw Top贡献者", desc: "Agentic Engineering：让 Agent 自己写代码" },
            { name: "江志桐", title: "天际资本董事总经理", desc: "什么样的 AI 公司值得投？" },
            { name: "苏嘉奕", title: "MiniMax 开放平台生态负责人", desc: "从工具到生态：大模型平台的进化之路" },
            { name: "黄力昂", title: "共绩科技联合创始人", desc: "龙虾距离永生还有多久？" },
            { name: "郎瀚威", title: "硅谷 AI 观察者", desc: "硅谷前线：海外龙虾生态全景扫描（线上）" }
          ].map((guest, idx) => (
            <div key={idx} className="flex items-start gap-6 py-5 border-b border-white/8">
              <span className="text-[24px] text-white/20 pt-2 w-[48px] shrink-0" style={typoMono}>{String(idx + 1).padStart(2, '0')}</span>
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
              {["手工川", "杨天润", "江志桐", "苏嘉奕", "黄力昂"].map((name, i) => (
                <span key={i} className="px-5 py-2 border border-white/15 bg-white/5 text-[24px] text-white/70" style={typoMono}>{name}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="text-[32px] text-[#FF3B00] mb-6" style={typoMono}>// Part 2 — 实操与经验　14:00 - 16:00</div>
        <div className="flex flex-col gap-4">
          {[
            { name: "叶震杰", title: "ZenMux 联合创始人 · 产品负责人", desc: "小龙虾——ZenMux 的第 11 号员工" },
            { name: "HW", title: "独立 Agent 开发者", desc: "一个人如何创建 93 个 Agent 技能？" },
            { name: "尹子萧", title: "首序智能工程师", desc: "Agent 安全攻防：让你的龙虾刀枪不入" },
            { name: "熊楚伊", title: "Veryloving.ai 创始人", desc: "当 AI 成为她的守护者" },
            { name: "常识", title: "Kusart 创始人", desc: "OpenClaw 企业级落地实战（线上）" },
            { name: "张舒昱", title: "某爆火 Claw 产品负责人", desc: "线上连麦" }
          ].map((guest, idx) => (
            <div key={idx} className="flex items-start gap-6 py-5 border-b border-white/8">
              <span className="text-[24px] text-white/20 pt-2 w-[48px] shrink-0" style={typoMono}>{String(idx + 7).padStart(2, '0')}</span>
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
              {["七牛云副总裁宿度", "叶震杰", "HW", "尹子萧", "熊楚伊"].map((name, i) => (
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
                {['手工川', 'Naughty Labs', '清华创协'].map((s, i) => <LogoSlot key={i} name={s} size="lg" />)}
              </div>
            </div>

            {/* 联办 */}
            <div className="mb-10">
              <div className="text-[24px] text-[#FF3B00] mb-4" style={typoMono}>[ 联办 ]</div>
              <div className="flex flex-wrap gap-5">
                {['天际资本', 'WayToAGI', '开源中国', '极新', 'RTE开发者社区'].map((s, i) => <LogoSlot key={i} name={s} size="md" />)}
              </div>
            </div>

            {/* 赞助 */}
            <div className="mb-10">
              <div className="text-[24px] text-[#FF3B00] mb-4" style={typoMono}>[ 赞助 ]</div>
              <div className="flex flex-wrap gap-5">
                {['东升科技园', 'AWS', '百度云', '七牛云', 'Zenmux', 'Minimax', '智谱', 'TTC', '融科资讯中心', '昆仑巢'].map((s, i) => <LogoSlot key={i} name={s} size="md" />)}
              </div>
            </div>

            {/* 合作伙伴 */}
            <div className="mb-12">
              <div className="text-[24px] text-[#FF3B00] mb-4" style={typoMono}>[ 合作伙伴 ]</div>
              <div className="flex flex-wrap gap-3">
                {['AI产品榜', '阿里云', '北京大学AI创业营', '北京AI原点社区', 'CMI', 'Edge Partners', 'Evomap', '非凡产研', '硅星人', '杭州AI工坊', '阶跃星辰', '锦秋基金', 'Kimi', '蓝驰资本', 'MetaSpace', 'MoltsPay', 'OpenBuild', '苹果中国孵化器', '启师傅AI客厅', '特工宇宙', 'THUAGI', 'VibeFriends', '微软中国', 'WeOPC', '五源资本'].map((s, i) => <LogoSlot key={i} name={s} size="sm" />)}
              </div>
            </div>
          </>;
        })()}

        {/* 分割线 */}
        <div className="w-full h-[2px] bg-gradient-to-r from-[#FF3B00]/50 via-white/10 to-transparent mb-8"></div>

        {/* 报名信息 */}
        <div className="border border-white/10 mb-10">
          {/* 标题栏 */}
          <div className="bg-[#FF3B00] px-10 py-5 flex items-center justify-between">
            <span className="text-[44px] text-black font-black" style={typoHeroEn}>FREE ENTRY</span>
            <span className="text-[28px] text-black/70" style={typoBody}>本活动完全免费 · Agent 报名优先通过</span>
          </div>

          <div className="p-10">
            {/* Agent 报名方式 */}
            <div className="flex items-center gap-8 mb-10">
              <div className="flex-1 bg-black border border-white/15 p-6 flex items-center gap-4">
                <span className="text-[20px] text-white/30" style={typoMono}>$</span>
                <span className="text-[32px] text-[#FF3B00]" style={typoMono}>npx neonclaw signup</span>
              </div>
              <div className="shrink-0 text-center">
                <div className="text-[24px] text-white/30" style={typoMono}>或访问</div>
                <div className="text-[28px] text-white/70 mt-1" style={typoMono}>neonclaw.lovstudio.ai</div>
              </div>
            </div>

            {/* 人工联系 */}
            <div className="text-[24px] text-white/30 mb-6" style={typoMono}>// 人工通道</div>
            <div className="flex justify-center gap-12">
              {[
                { name: "Ariel", role: "报名 / 商务对接", wechat: "ashincherry_love" },
                { name: "手工川", role: "统筹 / 技术对接", wechat: "youshouldspeakhow" },
              ].map((person, i) => (
                <div key={i} className="flex gap-5 items-center bg-white/3 border border-white/8 p-5 flex-1">
                  <div className="flex flex-col">
                    <span className="text-[28px] text-white/80" style={typoSubtitle}>{person.name}</span>
                    <span className="text-[22px] text-[#FF3B00] mt-1" style={typoMono}>{person.role}</span>
                    <span className="text-[20px] text-white/40 mt-2" style={typoMono}>微信: {person.wechat}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 底部水印 */}
        <div className="text-center pb-8">
          <div className="text-[80px] text-white/5 leading-none tracking-tighter" style={typoHeroEn}>NEONCLAW MEETUP 2026</div>
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
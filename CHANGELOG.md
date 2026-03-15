# Changelog

## 1.2.3

- 安全修复：ZenMux API Key 从前端移至服务端代理（Vercel Serverless Function）
- 安全修复：移除前端 VITE_ZENMUX_API_KEY 暴露，改用服务端 process.env
- 新增 `/api/ai-score` 服务端接口代理 AI 评分请求
- `.gitignore` 添加 `dist/` 目录

## 1.2.2

- 路引页面：新增设计师署名、图片序号显示
- 修复路引页面生产环境 404（添加 vite build input）

## 1.2.1

- 路引页面优化：静态图片列表替代动态扫描，支持 43 张导引图

## 1.2.0

- 新增路引页面（wayfinding）：15 张活动现场导引图
- 新增播报页面（broadcast）：活动实时播报
- 导航栏新增路引/播报入口 + 响应式横向滚动优化
- 报名页文案更新

## 1.1.1

- 打卡地点 ID 改为随机码，防止 URL 猜测
- 地点名改为龙虾品种（波士顿龙虾、锦绣龙虾等 15 种）
- 二维码页面风格对齐暗色主题
- 导航栏新增二维码入口

## 1.1.0

- 新增扫码打卡系统（15 地点集章 + 排行榜 + 二维码生成）
- 用户昵称注册 + localStorage 持久化 + Supabase 存储
- 管理端排行榜（先集齐先赢排序）
- 导航栏新增打卡/排行入口

## 1.0.3

- 提取 CAPACITY/VENUE 到 constants.js，统一管理共享常量
- 新增"导出分图"功能，按 section 切割海报为多张 JPEG
- 场地更新为中关村科学城 · 东升科技园

## 1.0.2

- 移除 AI原点社区，保留 AI原点学堂
- 更新报名链接及二维码

## 1.0.1

- 杨天润 title 改为 clawborn.live 创始人，主办方同步更新
- 叶震杰 title 加 ZenMux.ai
- 杨天润分享主题改为 Agentic Engineering 方法论
- 合作伙伴新增小红书、CreekStone

## 1.0.0

- 品牌从 NeonClaw 改为 OpenClaw（游戏部分保留 NeonClaw Game）
- 完整活动海报：开场 + Part 1 趋势与洞察 + Part 2 实操与经验 + NeonClaw Game
- 嘉宾阵容：14位嘉宾 + 2场圆桌论坛
- 赞助商与合作伙伴展示（按拼音排序）
- 报名区：飞书二维码 + npx clawborn signup + 人工联系
- 浏览器端截图下载（modern-screenshot JPEG）
- 自托管字体（Inter, Anonymous Pro, Noto Sans, Satisfy）

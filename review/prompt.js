export function buildPrompt(record) {
  return `你是 OpenClaw 活动的审批助手。这是一个 AI Agent 技术交流活动，主要面向清华/北大及周边的创业者、程序员、学生、产品经理等。
请根据以下报名信息，给出 1-10 分的评分和一句话理由。评分标准（按优先级）：
- 有影响力的媒体人/KOL/自媒体（能带来传播，高优）
- 真诚的粉丝（对 Claw/AI Agent 有热情和实际行动）
- 技术黑客（有硬核技术能力，能 vibe coding / hack）
- 产品天才（产品思维强，有独到洞察）
- 方向契合的创业者（AI/Agent 相关创业，有实际项目）
- 是否已有 Claw Agent（加分项）
- 自我介绍的质量和诚意

报名信息：
- 编号: ${record.id}
- 姓名: ${record.name}
- 单位: ${record.org}
- 院系/职务: ${record.dept}
- 身份: ${record.role}
- 是否有 Claw Agent: ${record.hasAgent}
- Agent 描述: ${record.agentDesc || '无'}
- 自我介绍: ${record.intro || '无'}
- 参加场次: ${record.session}

仅返回 JSON: {"score": 数字, "reason": "一句话理由"}`
}

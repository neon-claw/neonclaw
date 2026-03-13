export const SPOTS = [
  { id: 'x7k2m', name: '波士顿龙虾' },
  { id: 'p9f3w', name: '澳洲岩龙虾' },
  { id: 'q4n8v', name: '加州刺龙虾' },
  { id: 'h6t1j', name: '新西兰岩龙虾' },
  { id: 'r2c5z', name: '古巴龙虾' },
  { id: 'y8b4d', name: '挪威海螯虾' },
  { id: 'e3g7s', name: '南非龙虾' },
  { id: 'w1a9l', name: '日本伊势龙虾' },
  { id: 'u5m2f', name: '莫桑比克龙虾' },
  { id: 'k8v6n', name: '花龙虾' },
  { id: 'd4j3p', name: '青龙虾' },
  { id: 'b7h9t', name: '锦绣龙虾' },
  { id: 'f1r5c', name: '小龙虾' },
  { id: 'z6w2g', name: '红螯螯虾' },
  { id: 'n3y8q', name: '中华龙虾' },
]

export const SPOT_MAP = Object.fromEntries(SPOTS.map(s => [s.id, s]))

export const TOTAL_SPOTS = SPOTS.length

export const BASE_URL = typeof window !== 'undefined'
  ? `${window.location.origin}/checkin/`
  : 'https://neonclaw.lovstudio.ai/checkin/'

export const SPOTS = [
  { id: 1, name: '签到处' },
  { id: 2, name: '展区 A' },
  { id: 3, name: '展区 B' },
  { id: 4, name: '展区 C' },
  { id: 5, name: '展区 D' },
  { id: 6, name: '工作坊 1' },
  { id: 7, name: '工作坊 2' },
  { id: 8, name: '工作坊 3' },
  { id: 9, name: '演讲厅' },
  { id: 10, name: '休息区' },
  { id: 11, name: '美食区' },
  { id: 12, name: '合影墙' },
  { id: 13, name: '互动区' },
  { id: 14, name: '周边商店' },
  { id: 15, name: '出口处' },
]

export const TOTAL_SPOTS = SPOTS.length

export const BASE_URL = typeof window !== 'undefined'
  ? `${window.location.origin}/checkin/`
  : 'https://example.com/checkin/'

// CSV parser that handles quoted fields with newlines/commas
export function parseCSV(text) {
  const rows = []
  let i = 0
  while (i < text.length) {
    const row = []
    while (i < text.length) {
      if (text[i] === '"') {
        i++ // skip opening quote
        let field = ''
        while (i < text.length) {
          if (text[i] === '"') {
            if (text[i + 1] === '"') { field += '"'; i += 2 }
            else { i++; break }
          } else { field += text[i]; i++ }
        }
        row.push(field)
      } else {
        let field = ''
        while (i < text.length && text[i] !== ',' && text[i] !== '\n' && text[i] !== '\r') {
          field += text[i]; i++
        }
        row.push(field)
      }
      if (i < text.length && text[i] === ',') { i++; continue }
      if (i < text.length && text[i] === '\r') i++
      if (i < text.length && text[i] === '\n') i++
      break
    }
    if (row.length > 1 || (row.length === 1 && row[0] !== '')) rows.push(row)
  }
  return rows
}

export function csvToRecords(text) {
  const rows = parseCSV(text)
  if (rows.length === 0) return []
  const records = []
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i]
    records.push({
      id: r[0] || String(i),
      name: r[1] || '',
      dept: r[2] || '',
      phone: r[3] || '',
      wechat: r[4] || '',
      org: r[5] || '',
      role: r[8] || '',
      hasAgent: r[11] || '',
      agentDesc: r[12] || '',
      intro: r[13] || '',
      session: r[17] || '',
    })
  }
  return records
}

// ─────────────────────────────────────────────
//  Formatting helpers
// ─────────────────────────────────────────────

export const fmtCurrency = (n) =>
  'LKR ' + Number(n).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const fmtShort = (n) =>
  'LKR ' + Number(n).toLocaleString('en-LK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

// Number only — no LKR prefix (used in table rows where the column header already says LKR)
export const fmtNumber = (n) =>
  Number(n).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const fmtDate = (d) => {
  if (!d) return ''
  const date = new Date(d + 'T00:00:00')
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const monthLabel = (year, month) => {
  const d = new Date(year, month - 1, 1)
  return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

export const monthKey = (dateStr) => dateStr?.slice(0, 7) // "2026-04"

// Local calendar date as YYYY-MM-DD. Do NOT use toISOString() for this: it converts
// to UTC, so in Sri Lanka (UTC+5:30) local midnight becomes the previous day.
export const toLocalISO = (d) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export const todayISO = () => toLocalISO(new Date())

// 1 January of the current year (default start for Dashboard / Statements)
export const firstOfYearISO = () => toLocalISO(new Date(new Date().getFullYear(), 0, 1))

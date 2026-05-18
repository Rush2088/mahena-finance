import { useState, useMemo, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend,
         PieChart, Pie, LabelList } from 'recharts'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../utils/categories'
import { fmtShort, fmtCurrency } from '../../utils/formatters'

// ── Pastel colour palettes (75% opacity) ──────────────────────────────────────
const INCOME_PASTELS = [
  'rgba(134,200,150,0.75)',
  'rgba(255,183, 77,0.75)',
  'rgba(255,138,101,0.75)',
  'rgba(174,137,194,0.75)',
  'rgba(100,181,246,0.75)',
  'rgba(255,241,118,0.75)',
  'rgba(128,203,196,0.75)',
]
const EXPENSE_PASTELS = [
  'rgba(255,179,186,0.75)',
  'rgba(255,210,161,0.75)',
  'rgba(167,219,170,0.75)',
  'rgba(130,196,212,0.75)',
  'rgba(210,186,255,0.75)',
  'rgba(186,230,255,0.75)',
  'rgba(255,218,185,0.75)',
  'rgba(204,204,255,0.75)',
]

// ── Date helpers ──────────────────────────────────────────────────────────────
function toISO(d)      { return d.toISOString().slice(0, 10) }
function todayISO()    { return toISO(new Date()) }
function firstOfMonth(){ const d = new Date(); d.setDate(1); return toISO(d) }

function fmtDisplay(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${d} ${months[parseInt(m,10)-1]} ${y}`
}

// Returns [{key:'2026-01', label:'Jan'}, ...] for every month in [from, to]
function getMonthsInRange(from, to) {
  const result = []
  const [fy, fm] = from.split('-').map(Number)
  const [ty, tm] = to.split('-').map(Number)
  let y = fy, m = fm
  const SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const totalMonths = (ty - fy) * 12 + (tm - fm) + 1
  while (y < ty || (y === ty && m <= tm)) {
    const key = `${y}-${String(m).padStart(2,'0')}`
    // For ranges > 12 months show 3-char month + 2-digit year to distinguish years
    const label = totalMonths > 12
      ? `${SHORT[m-1]} '${String(y).slice(2)}`
      : SHORT[m-1]
    result.push({ key, label })
    m++
    if (m > 12) { m = 1; y++ }
  }
  return result
}

function getPresets() {
  const now  = new Date()
  const y    = now.getFullYear()
  const mo   = now.getMonth()
  const today = todayISO()
  return [
    { label: 'This Month', from: toISO(new Date(y, mo, 1)),      to: today },
    { label: 'Last Month', from: toISO(new Date(y, mo-1, 1)),    to: toISO(new Date(y, mo, 0)) },
    { label: 'Last 6 Mo',  from: toISO(new Date(y, mo-5, 1)),    to: today },
    { label: 'This Year',  from: toISO(new Date(y, 0, 1)),        to: today },
  ]
}

// Bar sizing based on number of months displayed
function barProps(n) {
  if (n <= 4)  return { barCategoryGap: '35%' }
  if (n <= 6)  return { barCategoryGap: '30%' }
  if (n <= 12) return { barCategoryGap: '40%', barSize: 18 }
  if (n <= 18) return { barCategoryGap: '45%', barSize: 12 }
  return              { barCategoryGap: '50%', barSize: 8  }
}

// ── Pie breakdown ─────────────────────────────────────────────────────────────
function PieBreakdown({ data, palette }) {
  const active = data.filter(d => d.value > 0)
  const total  = active.reduce((s, d) => s + d.value, 0)
  if (active.length === 0)
    return <div className="flex items-center justify-center py-8 text-xs text-gray-400">No data for period</div>

  const pieData = active.map(d => ({ ...d, fill: palette[data.indexOf(d) % palette.length] }))

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    const { name, value } = payload[0].payload
    return (
      <div className="bg-white border border-gray-200 rounded px-3 py-1.5 shadow-sm text-xs">
        <div className="font-medium text-gray-700">{name}</div>
        <div className="text-gray-500">{fmtCurrency(value)}</div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 mt-2">
      <div style={{ width: 140, height: 140, flexShrink: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name"
              cx="50%" cy="50%" outerRadius={62} strokeWidth={1} stroke="rgba(255,255,255,0.6)">
              {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col gap-1 overflow-y-auto" style={{ maxHeight: 140, flex: 1 }}>
        {pieData.map((d, i) => {
          const pct = total > 0 ? Math.round((d.value / total) * 100) : 0
          return (
            <div key={i} className="flex items-center gap-1.5 min-w-0">
              <div className="rounded-full shrink-0" style={{ width: 8, height: 8, background: d.fill, border: '1px solid rgba(0,0,0,0.1)' }} />
              <span className="text-xs text-gray-600 truncate flex-1">{d.name}</span>
              <span className="text-xs text-gray-400 shrink-0">{pct}%</span>
              <span className="text-xs font-medium shrink-0" style={{ color: '#555', minWidth: 56, textAlign: 'right' }}>
                {fmtShort(d.value)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Metric card ───────────────────────────────────────────────────────────────
function MetricCard({ label, value, sub, color }) {
  return (
    <div className="rounded-lg p-3" style={{ background: '#f3f4f4' }}>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-xl font-medium" style={{ color }}>{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
    </div>
  )
}

// ── Custom label for Net Profit bars — always above the bar, black, never clipped ─
function NetLabel({ x, y, width, height, value, monthCount }) {
  if (!value || Math.abs(value) < 1) return null
  // For positive bars: y = top of bar. For negative bars: y = zero line (bar goes down).
  // In both cases placing the label at y - 6 puts it just above the highest point.
  const absK  = Math.round(Math.abs(value) / 1000)
  const label = value >= 0 ? `${absK}k` : `-${absK}k`
  return (
    <text x={x + width / 2} y={y - 4} textAnchor="middle"
      dominantBaseline="auto"
      fill="#111827"
      fontSize={monthCount > 12 ? 8 : 10} fontWeight="600">
      {label}
    </text>
  )
}

// ── Main dashboard ─────────────────────────────────────────────────────────────
export default function Dashboard({ transactions, loading }) {
  const [fromDate, setFromDate] = useState(firstOfMonth())
  const [toDate,   setToDate]   = useState(todayISO())

  useEffect(() => {
    const onBeforePrint = () => {
      window.dispatchEvent(new Event('resize'))
      setTimeout(() => window.dispatchEvent(new Event('resize')), 100)
    }
    window.addEventListener('beforeprint', onBeforePrint)
    return () => window.removeEventListener('beforeprint', onBeforePrint)
  }, [])

  const rangeTxns = useMemo(() =>
    transactions.filter(t => t.date && t.date >= fromDate && t.date <= toDate),
    [transactions, fromDate, toDate])

  const totalIncome  = rangeTxns.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
  const totalExpense = rangeTxns.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
  const netProfit    = totalIncome - totalExpense
  const margin       = totalIncome > 0 ? Math.round((netProfit / totalIncome) * 100) : 0

  const incomeByCategory  = useMemo(() =>
    INCOME_CATEGORIES.map(name => ({
      name, value: rangeTxns.filter(t => t.type === 'income' && t.category === name)
                             .reduce((s, t) => s + Number(t.amount), 0)
    })), [rangeTxns])

  const expenseByCategory = useMemo(() =>
    EXPENSE_CATEGORIES.map(name => ({
      name, value: rangeTxns.filter(t => t.type === 'expense' && t.category === name)
                             .reduce((s, t) => s + Number(t.amount), 0)
    })), [rangeTxns])

  // Bar chart: one bar per month in the selected range
  const chartMonths = useMemo(() => getMonthsInRange(fromDate, toDate), [fromDate, toDate])

  const trendData = useMemo(() =>
    chartMonths.map(({ key, label }) => {
      const txns = transactions.filter(t => t.date?.startsWith(key))
      return {
        label,
        Income:   txns.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0),
        Expenses: txns.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0),
      }
    }), [transactions, chartMonths])

  const netData = useMemo(() =>
    chartMonths.map(({ key, label }) => {
      const txns = transactions.filter(t => t.date?.startsWith(key))
      const inc = txns.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
      const exp = txns.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
      return { label, Net: Math.round(inc - exp) }
    }), [transactions, chartMonths])

  const monthCount   = chartMonths.length
  const bProps       = barProps(monthCount)
  const periodStr    = `${fmtDisplay(fromDate)} — ${fmtDisplay(toDate)}`
  const presets      = getPresets()
  const card         = "bg-white border border-gray-200 rounded-lg p-4"
  const sl           = "text-xs font-medium text-gray-400 uppercase tracking-wider mb-1"
  const fmtTooltip   = (val) => fmtCurrency(val)
  const inputCls     = "border border-gray-200 rounded px-2.5 py-1.5 text-sm bg-white text-gray-700 focus:outline-none focus:border-gray-400"

  // XAxis tick font-size: shrink for many months
  const tickFontSize = monthCount > 18 ? 8 : monthCount > 12 ? 9 : 11

  return (
    <div className="p-4 flex flex-col gap-3" style={{ background: '#f9fafb' }}>

      {/* Toolbar */}
      <div className="no-print flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {/* From / To */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500">From</span>
            <input type="date" className={inputCls} value={fromDate}
              onChange={e => { if (e.target.value <= toDate) setFromDate(e.target.value) }} />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500">To</span>
            <input type="date" className={inputCls} value={toDate}
              onChange={e => { if (e.target.value >= fromDate) setToDate(e.target.value) }} />
          </div>
          {/* Presets */}
          <div className="flex gap-1 ml-1">
            {presets.map(p => (
              <button key={p.label}
                onClick={() => { setFromDate(p.from); setToDate(p.to) }}
                className="px-2.5 py-1.5 text-xs rounded border cursor-pointer transition-colors"
                style={fromDate === p.from && toDate === p.to
                  ? { background: '#1a3020', color: '#f5edd8', borderColor: '#1a3020' }
                  : { background: 'white',   color: '#6b7280',  borderColor: '#e5e7eb' }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">All figures in LKR</span>
          <button onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded font-medium cursor-pointer border"
            style={{ background: '#fcebeb', borderColor: '#e24b4a', color: '#a32d2d' }}>
            🖨 Print / Save PDF
          </button>
        </div>
      </div>

      {loading && <div className="text-sm text-gray-400 text-center py-6 no-print">Loading…</div>}

      {/* Print header */}
      <div className="print-only hidden items-center justify-between px-1 pb-3 mb-1"
        style={{ borderBottom: '2px solid #1a3020' }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '0.15em', color: '#1a3020' }}>
            <span style={{ color: '#c9a84c' }}>Ma'he'na</span> Estate
          </div>
          <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2, letterSpacing: '0.1em' }}>Finance Tracker</div>
        </div>
        <div style={{ textAlign: 'right', fontSize: 11, color: '#6b7280', lineHeight: 1.6 }}>
          <div style={{ fontWeight: 600, color: '#1f2937', fontSize: 13 }}>Dashboard — {periodStr}</div>
          <div>Generated: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
          <div>Prepared by: R. Dahanayake &nbsp;·&nbsp; All figures in LKR</div>
        </div>
      </div>

      {/* Printable content */}
      <div id="dashboard-print-area" className="flex flex-col gap-3">

        {/* Metric cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MetricCard label="Total Income"   value={fmtShort(totalIncome)}  sub={`${rangeTxns.filter(t=>t.type==='income').length} transactions`}  color="#3a6b3c" />
          <MetricCard label="Total Expenses" value={fmtShort(totalExpense)} sub={`${rangeTxns.filter(t=>t.type==='expense').length} transactions`} color="#a32d2d" />
          <MetricCard label="Net Profit"     value={fmtShort(netProfit)}    sub="selected period" color={netProfit >= 0 ? '#185fa5' : '#a32d2d'} />
          <MetricCard label="Profit Margin"  value={`${margin}%`}           sub="of income"       color="#854f0b" />
        </div>

        {/* Pie charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className={card}>
            <div className={sl}>Income by subcategory</div>
            <PieBreakdown data={incomeByCategory} palette={INCOME_PASTELS} />
          </div>
          <div className={card}>
            <div className={sl}>Expenses by subcategory</div>
            <PieBreakdown data={expenseByCategory} palette={EXPENSE_PASTELS} />
          </div>
        </div>

        {/* Trend charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className={card}>
            <div className={sl}>Monthly Income vs Expenses</div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={trendData} {...bProps} margin={{ top: 4, right: 20, left: -20, bottom: 0 }}>
                <XAxis dataKey="label" tick={{ fontSize: tickFontSize, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `${Math.round(v/1000)}k`} />
                <Tooltip formatter={fmtTooltip} contentStyle={{ fontSize: 12, border: '1px solid #e5e7eb' }} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Income"   fill="#3a6b3c" radius={[3,3,0,0]} />
                <Bar dataKey="Expenses" fill="#c9a84c" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className={card}>
            <div className={sl}>Monthly Net Profit</div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={netData} {...bProps} margin={{ top: 24, right: 20, left: -20, bottom: 0 }}>
                <XAxis dataKey="label" tick={{ fontSize: tickFontSize, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `${Math.round(v/1000)}k`} />
                <Tooltip formatter={fmtTooltip} contentStyle={{ fontSize: 12, border: '1px solid #e5e7eb' }} />
                <Bar dataKey="Net" radius={[3,3,0,0]}>
                  {netData.map((entry, i) => (
                    <Cell key={i} fill={entry.Net >= 0 ? '#3a6b3c' : '#a32d2d'} />
                  ))}
                  <LabelList content={<NetLabel monthCount={monthCount} />} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-100 text-right" style={{ background: '#f9fafb' }}>
        <a href="https://rush2088.github.io/mahena-estate/" target="_blank" rel="noopener noreferrer"
           className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
          Ma'he'na Estate ↗
        </a>
      </div>

    </div>
  )
}

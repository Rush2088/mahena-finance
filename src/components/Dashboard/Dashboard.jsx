import { useState, useMemo, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend,
         PieChart, Pie } from 'recharts'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../utils/categories'
import { fmtShort, fmtCurrency, monthLabel } from '../../utils/formatters'

// ── Pastel colour palettes (75% opacity) ──────────────────────────────────────
const INCOME_PASTELS = [
  'rgba(134,200,150,0.75)',  // Coconut        — sage green
  'rgba(255,183, 77,0.75)',  // King Coconut   — amber
  'rgba(255,138,101,0.75)',  // Areca Nut      — coral
  'rgba(174,137,194,0.75)',  // Pepper         — lavender
  'rgba(100,181,246,0.75)',  // Cinnamon       — sky blue
  'rgba(255,241,118,0.75)',  // Banana         — lemon
  'rgba(128,203,196,0.75)',  // Garden Greens  — teal
]

const EXPENSE_PASTELS = [
  'rgba(255,179,186,0.75)',  // Fertilizer             — pink
  'rgba(255,210,161,0.75)',  // Weed Killer            — peach
  'rgba(255,241,118,0.75)',  // Pesticide              — lemon
  'rgba(167,219,170,0.75)',  // Labour – Maintenance   — mint
  'rgba(130,196,212,0.75)',  // Labour – Harvesting    — sky
  'rgba(210,186,255,0.75)',  // Electricity            — lavender
  'rgba(255,186,230,0.75)',  // Council Rates          — rose
  'rgba(186,230,255,0.75)',  // Equipment Maintenance  — powder blue
  'rgba(255,218,185,0.75)',  // Security               — bisque
  'rgba(204,204,255,0.75)',  // Miscellaneous          — periwinkle
]

// ── Pie breakdown component ────────────────────────────────────────────────────
function PieBreakdown({ data, palette }) {
  const active = data.filter(d => d.value > 0)
  const total  = active.reduce((s, d) => s + d.value, 0)

  if (active.length === 0) {
    return <div className="flex items-center justify-center py-8 text-xs text-gray-400">No data this month</div>
  }

  const pieData = active.map((d, i) => ({
    ...d,
    fill: palette[data.indexOf(d) % palette.length],
  }))

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
      {/* Pie */}
      <div style={{ width: 140, height: 140, flexShrink: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={62}
              strokeWidth={1}
              stroke="rgba(255,255,255,0.6)"
            >
              {pieData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
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

const MONTHS_BACK = 6

function getLast6Months() {
  const result = []
  const now = new Date()
  for (let i = MONTHS_BACK - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    result.push({ key, label: d.toLocaleDateString('en-GB', { month: 'short' }) })
  }
  return result
}

// ── Main dashboard ─────────────────────────────────────────────────────────────
export default function Dashboard({ transactions, loading }) {
  const months = getLast6Months()
  const [selectedMonthKey, setSelectedMonthKey] = useState(months[months.length - 1].key)

  // Force Recharts to re-measure at print width before the browser renders the print layout
  useEffect(() => {
    const onBeforePrint = () => {
      window.dispatchEvent(new Event('resize'))
      // Give the charts a moment to re-render at the new width
      setTimeout(() => window.dispatchEvent(new Event('resize')), 100)
    }
    window.addEventListener('beforeprint', onBeforePrint)
    return () => window.removeEventListener('beforeprint', onBeforePrint)
  }, [])

  const monthTxns = useMemo(() =>
    transactions.filter(t => t.date?.startsWith(selectedMonthKey)),
    [transactions, selectedMonthKey]
  )

  const totalIncome  = monthTxns.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
  const totalExpense = monthTxns.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
  const netProfit    = totalIncome - totalExpense
  const margin       = totalIncome > 0 ? Math.round((netProfit / totalIncome) * 100) : 0

  const incomeByCategory = useMemo(() =>
    INCOME_CATEGORIES.map(name => ({
      name,
      value: monthTxns.filter(t => t.type === 'income' && t.category === name)
                      .reduce((s, t) => s + Number(t.amount), 0)
    })), [monthTxns])

  const expenseByCategory = useMemo(() =>
    EXPENSE_CATEGORIES.map(name => ({
      name,
      value: monthTxns.filter(t => t.type === 'expense' && t.category === name)
                      .reduce((s, t) => s + Number(t.amount), 0)
    })), [monthTxns])

  const trendData = useMemo(() =>
    months.map(({ key, label }) => {
      const txns = transactions.filter(t => t.date?.startsWith(key))
      return {
        label,
        Income:   txns.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0),
        Expenses: txns.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0),
      }
    }), [transactions, months])

  const netData = useMemo(() =>
    months.map(({ key, label }) => {
      const txns = transactions.filter(t => t.date?.startsWith(key))
      const inc = txns.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
      const exp = txns.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
      return { label, Net: Math.round(inc - exp) }
    }), [transactions, months])

  const card = "bg-white border border-gray-200 rounded-lg p-4"
  const sl   = "text-xs font-medium text-gray-400 uppercase tracking-wider mb-1"
  const fmtTooltip = (val) => fmtCurrency(val)
  const currentMonthTitle = monthLabel(...selectedMonthKey.split('-').map(Number))

  return (
    <div className="p-4 flex flex-col gap-3" style={{ background: '#f9fafb' }}>

      {/* Toolbar */}
      <div className="no-print flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button onClick={() => {
            const i = months.findIndex(m => m.key === selectedMonthKey)
            if (i > 0) setSelectedMonthKey(months[i - 1].key)
          }} className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded text-gray-500 cursor-pointer bg-white hover:bg-gray-50">‹</button>
          <span className="text-sm font-medium text-gray-800">{currentMonthTitle}</span>
          <button onClick={() => {
            const i = months.findIndex(m => m.key === selectedMonthKey)
            if (i < months.length - 1) setSelectedMonthKey(months[i + 1].key)
          }} className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded text-gray-500 cursor-pointer bg-white hover:bg-gray-50">›</button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">All figures in LKR</span>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded font-medium cursor-pointer border"
            style={{ background: '#fcebeb', borderColor: '#e24b4a', color: '#a32d2d' }}
          >
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
          <div style={{ fontWeight: 600, color: '#1f2937', fontSize: 13 }}>Dashboard — {currentMonthTitle}</div>
          <div>Generated: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
          <div>Prepared by: R. Dahanayake &nbsp;·&nbsp; All figures in LKR</div>
        </div>
      </div>

      {/* Printable content */}
      <div id="dashboard-print-area" className="flex flex-col gap-3">

        {/* Metric cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MetricCard label="Total Income"   value={fmtShort(totalIncome)}  sub={`${monthTxns.filter(t=>t.type==='income').length} transactions`}  color="#3a6b3c" />
          <MetricCard label="Total Expenses" value={fmtShort(totalExpense)} sub={`${monthTxns.filter(t=>t.type==='expense').length} transactions`} color="#a32d2d" />
          <MetricCard label="Net Profit"     value={fmtShort(netProfit)}    sub="this month"   color={netProfit >= 0 ? '#185fa5' : '#a32d2d'} />
          <MetricCard label="Profit Margin"  value={`${margin}%`}           sub="of income"    color="#854f0b" />
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
            <div className={sl}>6-month income vs expenses</div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={trendData} barCategoryGap="30%" margin={{ top: 4, right: 20, left: -20, bottom: 0 }}>
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `${Math.round(v/1000)}k`} />
                <Tooltip formatter={fmtTooltip} contentStyle={{ fontSize: 12, border: '1px solid #e5e7eb' }} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Income"   fill="#3a6b3c" radius={[3,3,0,0]} />
                <Bar dataKey="Expenses" fill="#c9a84c" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className={card}>
            <div className={sl}>Monthly net profit — last 6 months</div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={netData} margin={{ top: 4, right: 20, left: -20, bottom: 0 }}>
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `${Math.round(v/1000)}k`} />
                <Tooltip formatter={fmtTooltip} contentStyle={{ fontSize: 12, border: '1px solid #e5e7eb' }} />
                <Bar dataKey="Net" radius={[3,3,0,0]}>
                  {netData.map((entry, i) => (
                    <Cell key={i} fill={entry.Net >= 0 ? '#3a6b3c' : '#a32d2d'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  )
}

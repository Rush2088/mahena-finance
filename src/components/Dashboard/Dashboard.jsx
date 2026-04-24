import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, CATEGORY_COLOR } from '../../utils/categories'
import { fmtShort, fmtCurrency, monthLabel } from '../../utils/formatters'

function MetricCard({ label, value, sub, color }) {
  return (
    <div className="rounded-lg p-3" style={{ background: '#f3f4f4' }}>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-xl font-medium" style={{ color }}>{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
    </div>
  )
}

function HBarChart({ data, maxVal }) {
  return (
    <div className="flex flex-col gap-1.5 mt-2">
      {data.map(({ name, value }) => (
        <div key={name} className="grid items-center gap-2" style={{ gridTemplateColumns: '120px 1fr 72px' }}>
          <div className="text-xs text-gray-500 text-right truncate">{name}</div>
          <div className="rounded h-3 overflow-hidden" style={{ background: '#f3f4f4' }}>
            <div className="h-full rounded transition-all" style={{
              width: maxVal > 0 ? `${Math.round((value / maxVal) * 100)}%` : '0%',
              background: CATEGORY_COLOR[name] || '#ccc'
            }} />
          </div>
          <div className="text-xs font-medium text-right" style={{ color: CATEGORY_COLOR[name] || '#999' }}>
            {value > 0 ? fmtShort(value) : '—'}
          </div>
        </div>
      ))}
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

function printDashboard(monthTitle) {
  const el = document.getElementById('dashboard-print-area')
  if (!el) return
  const printWindow = window.open('', '_blank')
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Ma'he'na Estate — Dashboard ${monthTitle}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, sans-serif; background: #fff; color: #1f2937; }
        .print-header {
          background: #1a3020; color: #f5edd8; padding: 12px 20px;
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 16px;
        }
        .print-header .title { font-size: 15px; font-weight: 500; letter-spacing: 0.15em; }
        .print-header .title span { color: #c9a84c; }
        .print-header .sub { font-size: 10px; color: rgba(245,237,216,0.5); margin-top: 2px; letter-spacing: 0.1em; }
        .print-header .right { text-align: right; font-size: 11px; color: rgba(245,237,216,0.7); }
        .content { padding: 0 16px 16px; }
        svg text { font-family: system-ui, sans-serif !important; }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      </style>
    </head>
    <body>
      <div class="print-header">
        <div>
          <div class="title"><span>Ma'he'na</span> Estate</div>
          <div class="sub">Finance Tracker</div>
        </div>
        <div class="right">
          Dashboard — ${monthTitle}<br/>
          Generated: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}<br/>
          Prepared by: R. Dahanayake
        </div>
      </div>
      <div class="content">${el.innerHTML}</div>
    </body>
    </html>
  `)
  printWindow.document.close()
  setTimeout(() => {
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }, 500)
}

export default function Dashboard({ transactions, loading }) {
  const months = getLast6Months()
  const [selectedMonthKey, setSelectedMonthKey] = useState(months[months.length - 1].key)

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

  const maxIncome  = Math.max(...incomeByCategory.map(d => d.value), 1)
  const maxExpense = Math.max(...expenseByCategory.map(d => d.value), 1)
  const card = "bg-white border border-gray-200 rounded-lg p-4"
  const sl   = "text-xs font-medium text-gray-400 uppercase tracking-wider mb-1"
  const fmtTooltip = (val) => fmtCurrency(val)
  const currentMonthTitle = monthLabel(...selectedMonthKey.split('-').map(Number))

  return (
    <div className="p-4 flex flex-col gap-3" style={{ background: '#f9fafb' }}>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
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
            onClick={() => printDashboard(currentMonthTitle)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded font-medium cursor-pointer border"
            style={{ background: '#fcebeb', borderColor: '#e24b4a', color: '#a32d2d' }}
          >
            🖨 Print / Save PDF
          </button>
        </div>
      </div>

      {loading && <div className="text-sm text-gray-400 text-center py-6">Loading…</div>}

      {/* Printable area */}
      <div id="dashboard-print-area" className="flex flex-col gap-3">

        {/* Metric cards */}
        <div className="grid grid-cols-4 gap-3">
          <MetricCard label="Total Income"   value={fmtShort(totalIncome)}  sub={`${monthTxns.filter(t=>t.type==='income').length} transactions`}  color="#3a6b3c" />
          <MetricCard label="Total Expenses" value={fmtShort(totalExpense)} sub={`${monthTxns.filter(t=>t.type==='expense').length} transactions`} color="#a32d2d" />
          <MetricCard label="Net Profit"     value={fmtShort(netProfit)}    sub="this month"   color={netProfit >= 0 ? '#185fa5' : '#a32d2d'} />
          <MetricCard label="Profit Margin"  value={`${margin}%`}           sub="of income"    color="#854f0b" />
        </div>

        {/* Breakdown charts */}
        <div className="grid grid-cols-2 gap-3">
          <div className={card}>
            <div className={sl}>Income by subcategory</div>
            <HBarChart data={incomeByCategory} maxVal={maxIncome} />
          </div>
          <div className={card}>
            <div className={sl}>Expenses by subcategory</div>
            <HBarChart data={expenseByCategory} maxVal={maxExpense} />
          </div>
        </div>

        {/* Trend charts */}
        <div className="grid grid-cols-2 gap-3">
          <div className={card}>
            <div className={sl}>6-month income vs expenses</div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={trendData} barCategoryGap="30%" margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
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
              <BarChart data={netData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
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

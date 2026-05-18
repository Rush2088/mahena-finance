import { useState, useMemo } from 'react'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../utils/categories'
import { fmtCurrency, fmtNumber } from '../../utils/formatters'
import { exportExcel } from './exportExcel'
import { exportPDF }   from './exportPDF'

// ── Date helpers ──────────────────────────────────────────────────────────────
function toISO(d)      { return d.toISOString().slice(0, 10) }
function todayISO()    { return toISO(new Date()) }
function firstOfMonth(){ const d = new Date(); d.setDate(1); return toISO(d) }
function firstOfYear() { const d = new Date(); d.setMonth(0, 1); return toISO(d) }

function fmtDisplayDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${d} ${months[parseInt(m,10)-1]} ${y}`
}

function periodLabel(from, to) {
  return `${fmtDisplayDate(from)} — ${fmtDisplayDate(to)}`
}

// ── Quick presets ─────────────────────────────────────────────────────────────
function getPresets() {
  const now   = new Date()
  const y     = now.getFullYear()
  const m     = now.getMonth()
  const today = todayISO()

  const firstThisMonth = toISO(new Date(y, m, 1))
  const lastThisMonth  = toISO(new Date(y, m + 1, 0))

  const firstLastMonth = toISO(new Date(y, m - 1, 1))
  const lastLastMonth  = toISO(new Date(y, m, 0))

  const firstThisYear  = toISO(new Date(y, 0, 1))
  const lastThisYear   = toISO(new Date(y, 11, 31))

  return [
    { label: 'This Month', from: firstThisMonth, to: today },
    { label: 'Last Month', from: firstLastMonth, to: lastLastMonth },
    { label: 'This Year',  from: firstThisYear,  to: today },
  ]
}

export default function Statements({ transactions }) {
  const [fromDate, setFromDate] = useState(firstOfMonth())
  const [toDate,   setToDate]   = useState(todayISO())

  const filtered = useMemo(() =>
    transactions.filter(t => t.date && t.date >= fromDate && t.date <= toDate),
    [transactions, fromDate, toDate])

  const incomeRows = INCOME_CATEGORIES.map(cat => ({
    cat,
    amount: filtered.filter(t => t.type === 'income' && t.category === cat).reduce((s, t) => s + Number(t.amount), 0)
  }))

  const expenseRows = EXPENSE_CATEGORIES.map(cat => ({
    cat,
    amount: filtered.filter(t => t.type === 'expense' && t.category === cat).reduce((s, t) => s + Number(t.amount), 0)
  }))

  const totalIncome  = incomeRows.reduce((s, r) => s + r.amount, 0)
  const totalExpense = expenseRows.reduce((s, r) => s + r.amount, 0)
  const net          = totalIncome - totalExpense
  const margin       = totalIncome > 0 ? Math.round((net / totalIncome) * 100) : 0

  const today      = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
  const periodStr  = periodLabel(fromDate, toDate)
  const stmtData   = { selectedLabel: periodStr, periodStr, today, incomeRows, expenseRows, totalIncome, totalExpense, net, margin }

  const maxIncome  = Math.max(...incomeRows.map(r => r.amount), 1)
  const maxExpense = Math.max(...expenseRows.map(r => r.amount), 1)

  const presets    = getPresets()
  const inputCls   = "border border-gray-200 rounded px-2.5 py-1.5 text-sm bg-white text-gray-700 focus:outline-none focus:border-gray-400"

  return (
    <div className="p-4" style={{ background: '#f9fafb' }}>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">

        {/* Date range + presets */}
        <div className="flex items-center gap-2 flex-wrap">
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
          {/* Quick presets */}
          <div className="flex gap-1 ml-1">
            {presets.map(p => (
              <button key={p.label}
                onClick={() => { setFromDate(p.from); setToDate(p.to) }}
                className="px-2.5 py-1.5 text-xs rounded border cursor-pointer transition-colors"
                style={fromDate === p.from && toDate === p.to
                  ? { background: '#1a3020', color: '#f5edd8', borderColor: '#1a3020' }
                  : { background: 'white', color: '#6b7280', borderColor: '#e5e7eb' }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Export buttons */}
        <div className="flex gap-2">
          <button onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded border border-gray-200 bg-white text-gray-600 cursor-pointer hover:bg-gray-50">
            🖨 Print
          </button>
          <button onClick={() => exportExcel(stmtData, filtered)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded font-medium cursor-pointer"
            style={{ background: '#e6f1fb', border: '1px solid #378add', color: '#185fa5' }}>
            ⬇ Export Excel
          </button>
          <button onClick={() => exportPDF(stmtData)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded font-medium cursor-pointer"
            style={{ background: '#fcebeb', border: '1px solid #e24b4a', color: '#a32d2d' }}>
            ⬇ Export PDF
          </button>
        </div>
      </div>

      {/* Statement */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden" id="statement-print">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <div className="text-base font-medium text-gray-800 tracking-wide">Ma'he'na Estate</div>
            <div className="text-xs text-gray-500 mt-0.5">Batepolea, Waturagam, Sri Lanka</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-800">Income &amp; Expenditure Statement</div>
            <div className="text-xs text-gray-500 mt-0.5">Period: {periodStr}</div>
            <div className="text-xs text-gray-400 mt-0.5">Generated: {today}</div>
          </div>
        </div>

        <table className="w-full border-collapse text-sm">
          <tbody>
            {/* INCOME */}
            <tr style={{ background: '#f9fafb', borderLeft: '3px solid #3a6b3c', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
              <td className="px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>Income</td>
              <td className="px-6 py-2 text-xs font-medium text-right" style={{ color: '#3a6b3c' }}>LKR</td>
            </tr>
            {incomeRows.map(({ cat, amount }) => (
              <tr key={cat} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="pl-10 pr-4 py-1.5 text-gray-500 w-48">{cat}</td>
                <td className="px-4 py-1.5 w-28">
                  <div className="rounded h-1.5 overflow-hidden" style={{ background: '#f3f4f4' }}>
                    <div className="h-full rounded" style={{ width: `${Math.round((amount/maxIncome)*100)}%`, background: '#3a6b3c' }} />
                  </div>
                </td>
                <td className="px-6 py-1.5 text-right font-medium" style={{ color: amount > 0 ? '#3a6b3c' : '#9ca3af' }}>
                  {amount > 0 ? fmtNumber(amount) : '—'}
                </td>
              </tr>
            ))}
            <tr style={{ background: '#f9fafb', borderTop: '1px solid #d1d5db' }}>
              <td className="px-6 py-2 text-sm font-medium text-gray-700" colSpan={2}>Total Income</td>
              <td className="px-6 py-2 text-right font-medium" style={{ color: '#3a6b3c' }}>{fmtNumber(totalIncome)}</td>
            </tr>

            {/* EXPENSES */}
            <tr style={{ background: '#f9fafb', borderLeft: '3px solid #a32d2d', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
              <td className="px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>Expenses</td>
              <td className="px-6 py-2 text-xs font-medium text-right" style={{ color: '#a32d2d' }}>LKR</td>
            </tr>
            {expenseRows.map(({ cat, amount }) => (
              <tr key={cat} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="pl-10 pr-4 py-1.5 text-gray-500 w-48">{cat}</td>
                <td className="px-4 py-1.5 w-28">
                  <div className="rounded h-1.5 overflow-hidden" style={{ background: '#f3f4f4' }}>
                    <div className="h-full rounded" style={{ width: `${Math.round((amount/maxExpense)*100)}%`, background: '#a32d2d' }} />
                  </div>
                </td>
                <td className="px-6 py-1.5 text-right font-medium" style={{ color: amount > 0 ? '#a32d2d' : '#9ca3af' }}>
                  {amount > 0 ? fmtNumber(amount) : '—'}
                </td>
              </tr>
            ))}
            <tr style={{ background: '#f9fafb', borderTop: '1px solid #d1d5db' }}>
              <td className="px-6 py-2 text-sm font-medium text-gray-700" colSpan={2}>Total Expenses</td>
              <td className="px-6 py-2 text-right font-medium" style={{ color: '#a32d2d' }}>{fmtNumber(totalExpense)}</td>
            </tr>

            {/* NET */}
            <tr style={{ borderTop: '2px solid #d1d5db' }}>
              <td className="px-6 py-3 font-medium text-gray-800" colSpan={2}>
                Net Profit / (Loss)
                <span className="ml-2 text-xs px-2 py-0.5 rounded" style={{ background: '#eaf3de', color: '#3b6d11' }}>{margin}% margin</span>
              </td>
              <td className="px-6 py-3 text-right text-base font-medium" style={{ color: net >= 0 ? '#185fa5' : '#a32d2d' }}>
                {fmtCurrency(net)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100" style={{ background: '#f9fafb' }}>
          <span className="text-xs text-gray-400">Ma'he'na Estate Finance Tracker · All amounts in Sri Lankan Rupees (LKR)</span>
          <span className="text-xs text-gray-400">Prepared by: R. Dahanayake</span>
        </div>
      </div>
    </div>
  )
}

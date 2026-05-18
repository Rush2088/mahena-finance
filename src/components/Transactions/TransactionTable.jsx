import { useState } from 'react'
import { fmtNumber, fmtDate } from '../../utils/formatters'
import { userLabel } from '../../utils/userLabels'

const PAGE_SIZE = 10

const SORTABLE = ['Date', 'Description', 'Type', 'Category', 'Amount (LKR)']

function sortRows(rows, key, dir) {
  if (!key) return rows
  return [...rows].sort((a, b) => {
    let av, bv
    if (key === 'Date')          { av = a.date;        bv = b.date }
    else if (key === 'Description') { av = (a.description || '').toLowerCase(); bv = (b.description || '').toLowerCase() }
    else if (key === 'Type')     { av = a.type;        bv = b.type }
    else if (key === 'Category') { av = a.category;    bv = b.category }
    else if (key === 'Amount (LKR)') { av = Number(a.amount); bv = Number(b.amount) }
    if (av < bv) return dir === 'asc' ? -1 : 1
    if (av > bv) return dir === 'asc' ? 1 : -1
    return 0
  })
}

export default function TransactionTable({ transactions, page, setPage, onEdit, onDelete }) {
  const [sortKey, setSortKey] = useState('Date')
  const [sortDir, setSortDir] = useState('desc')

  const handleSort = (col) => {
    if (!SORTABLE.includes(col)) return
    if (sortKey === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(col)
      setSortDir('asc')
    }
    setPage(1)
  }

  const sorted = sortRows(transactions, sortKey, sortDir)
  const total  = sorted.length
  const pages  = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const rows   = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const pillStyle = (type) => type === 'income'
    ? { background: '#eaf3de', color: '#3b6d11' }
    : { background: '#fcebeb', color: '#a32d2d' }

  const amtStyle = (type) => ({ color: type === 'income' ? '#3a6b3c' : '#a32d2d', fontWeight: 500 })

  const SortIcon = ({ col }) => {
    if (!SORTABLE.includes(col)) return null
    const active = sortKey === col
    return (
      <span className="inline-flex flex-col ml-1 leading-none" style={{ verticalAlign: 'middle', gap: 1 }}>
        <span style={{ fontSize: 7, lineHeight: 1, color: active && sortDir === 'asc' ? '#1a3020' : '#c0c0c0' }}>▲</span>
        <span style={{ fontSize: 7, lineHeight: 1, color: active && sortDir === 'desc' ? '#1a3020' : '#c0c0c0' }}>▼</span>
      </span>
    )
  }

  const COLS = ['Date', 'Description', 'Type', 'Category', 'Amount (LKR)', 'Notes', 'Entered By', '']

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              {COLS.map(h => (
                <th key={h}
                  onClick={() => handleSort(h)}
                  className={`text-left px-3 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap last:text-right select-none ${SORTABLE.includes(h) ? 'cursor-pointer hover:text-gray-800' : ''}`}>
                  {h}<SortIcon col={h} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={8} className="text-center py-8 text-gray-400 text-sm">No transactions found</td></tr>
            )}
            {rows.map(txn => (
              <tr key={txn.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{fmtDate(txn.date)}</td>
                <td className="px-3 py-2 text-gray-800 max-w-xs truncate">{txn.description}</td>
                <td className="px-3 py-2">
                  <span className="text-xs px-2 py-0.5 rounded font-medium capitalize" style={pillStyle(txn.type)}>
                    {txn.type === 'income' ? 'Income' : 'Expense'}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">{txn.category}</span>
                </td>
                <td className="px-3 py-2 text-right whitespace-nowrap" style={amtStyle(txn.type)}>
                  {txn.type === 'income' ? '+' : '–'} {fmtNumber(txn.amount)}
                </td>
                <td className="px-3 py-2 text-gray-400 max-w-xs truncate">{txn.notes || '—'}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: '#f3f4f6', color: '#374151' }}>
                    {userLabel(txn.entered_by)}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-1.5 justify-end">
                    <button onClick={() => onEdit(txn)}
                      className="px-2.5 py-1 text-xs rounded border border-gray-200 text-gray-600 cursor-pointer hover:bg-gray-50">
                      Edit
                    </button>
                    <button onClick={() => { if (window.confirm('Delete this transaction?')) onDelete(txn.id) }}
                      className="px-2.5 py-1 text-xs rounded cursor-pointer"
                      style={{ background: '#fcebeb', color: '#a32d2d', border: '1px solid #fca5a5' }}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100">
        <span className="text-xs text-gray-500">Showing {Math.min((page-1)*PAGE_SIZE+1, total)}–{Math.min(page*PAGE_SIZE, total)} of {total} transactions</span>
        <div className="flex gap-1">
          <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
            className="px-2.5 py-1 text-xs border border-gray-200 rounded cursor-pointer disabled:opacity-40 hover:bg-gray-50">‹</button>
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className="px-2.5 py-1 text-xs border rounded cursor-pointer"
              style={p === page ? { background: '#1a3020', color: '#f5edd8', borderColor: '#1a3020' } : { borderColor: '#e5e7eb', color: '#6b7280' }}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(pages, p+1))} disabled={page === pages}
            className="px-2.5 py-1 text-xs border border-gray-200 rounded cursor-pointer disabled:opacity-40 hover:bg-gray-50">›</button>
        </div>
      </div>
    </div>
  )
}

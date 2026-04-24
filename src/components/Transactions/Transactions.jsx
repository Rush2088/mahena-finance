import { useState, useMemo } from 'react'
import TransactionForm from './TransactionForm'
import TransactionTable from './TransactionTable'
import { ALL_CATEGORIES, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../utils/categories'
import { fmtShort } from '../../utils/formatters'

export default function Transactions({ transactions, loading, error, addTransaction, updateTransaction, deleteTransaction }) {
  const [editingTxn, setEditingTxn]   = useState(null)
  const [page, setPage]               = useState(1)
  const [filterMonth, setFilterMonth] = useState('all')
  const [filterType, setFilterType]   = useState('all')
  const [filterCat, setFilterCat]     = useState('all')
  const [search, setSearch]           = useState('')

  // Build unique month options
  const months = useMemo(() => {
    const seen = new Set()
    transactions.forEach(t => { if (t.date) seen.add(t.date.slice(0, 7)) })
    return Array.from(seen).sort().reverse()
  }, [transactions])

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      if (filterMonth !== 'all' && !t.date.startsWith(filterMonth)) return false
      if (filterType  !== 'all' && t.type !== filterType) return false
      if (filterCat   !== 'all' && t.category !== filterCat) return false
      if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [transactions, filterMonth, filterType, filterCat, search])

  const totals = useMemo(() => {
    const income  = filtered.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
    const expense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
    return { income, expense }
  }, [filtered])

  const handleSave = async (form) => {
    if (editingTxn) {
      await updateTransaction(editingTxn.id, form)
      setEditingTxn(null)
    } else {
      await addTransaction(form)
    }
    setPage(1)
  }

  const selectCls = "border border-gray-200 rounded px-2.5 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:border-gray-400"

  return (
    <div className="p-4 flex flex-col gap-3" style={{ background: '#f9fafb', minHeight: 500 }}>
      {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">{error}</div>}

      {/* Form — shows edit or add */}
      <TransactionForm
        onSave={handleSave}
        editingTxn={editingTxn}
        onCancelEdit={() => setEditingTxn(null)}
      />

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <select className={selectCls} value={filterMonth} onChange={e => { setFilterMonth(e.target.value); setPage(1) }}>
          <option value="all">All months</option>
          {months.map(m => <option key={m} value={m}>{new Date(m + '-01').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</option>)}
        </select>
        <select className={selectCls} value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1) }}>
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select className={selectCls} value={filterCat} onChange={e => { setFilterCat(e.target.value); setPage(1) }}>
          <option value="all">All categories</option>
          <optgroup label="Income">{INCOME_CATEGORIES.map(c => <option key={c}>{c}</option>)}</optgroup>
          <optgroup label="Expenses">{EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}</optgroup>
        </select>
        <input type="text" placeholder="Search description…" value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="border border-gray-200 rounded px-2.5 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:border-gray-400 flex-1 min-w-40" />
        <span className="text-xs px-2.5 py-1.5 rounded font-medium" style={{ background: '#eaf3de', color: '#3b6d11' }}>
          Income: {fmtShort(totals.income)}
        </span>
        <span className="text-xs px-2.5 py-1.5 rounded font-medium" style={{ background: '#fcebeb', color: '#a32d2d' }}>
          Expenses: {fmtShort(totals.expense)}
        </span>
      </div>

      {/* Table */}
      {loading
        ? <div className="text-sm text-gray-500 text-center py-10">Loading transactions…</div>
        : <TransactionTable transactions={filtered} page={page} setPage={setPage} onEdit={setEditingTxn} onDelete={deleteTransaction} />
      }
    </div>
  )
}

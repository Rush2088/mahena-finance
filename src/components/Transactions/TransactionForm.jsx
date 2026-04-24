import { useState } from 'react'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../utils/categories'
import { todayISO } from '../../utils/formatters'

const EMPTY = { date: todayISO(), description: '', type: 'income', category: 'Coconut', amount: '', notes: '' }

export default function TransactionForm({ onSave, editingTxn, onCancelEdit }) {
  const [form, setForm] = useState(editingTxn || EMPTY)
  const [saving, setSaving] = useState(false)
  const isEditing = !!editingTxn

  // Sync when editingTxn changes
  if (editingTxn && editingTxn.id !== form.id) setForm(editingTxn)

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  const set = (field, val) => {
    setForm(prev => {
      const updated = { ...prev, [field]: val }
      if (field === 'type') updated.category = val === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]
      return updated
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.description.trim() || !form.amount || !form.date) return
    setSaving(true)
    await onSave({ ...form, amount: parseFloat(form.amount) })
    setSaving(false)
    if (!isEditing) setForm({ ...EMPTY, date: form.date })
  }

  const inputCls = "w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm text-gray-800 bg-white focus:outline-none focus:border-gray-400"
  const labelCls = "block text-xs text-gray-500 mb-1"

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-800">{isEditing ? 'Edit transaction' : 'Add transaction'}</span>
        {/* Type toggle */}
        <div className="flex rounded overflow-hidden border border-gray-200" style={{ width: 180 }}>
          {['income', 'expense'].map(t => (
            <button key={t} type="button" onClick={() => set('type', t)}
              className="flex-1 py-1.5 text-xs font-medium cursor-pointer transition-colors"
              style={form.type === t
                ? t === 'income'
                  ? { background: '#eaf3de', color: '#3b6d11' }
                  : { background: '#fcebeb', color: '#a32d2d' }
                : { background: 'transparent', color: '#9ca3af' }
              }>
              {t === 'income' ? '+ Income' : '– Expense'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2 items-end">
        <div>
          <label className={labelCls}>Date</label>
          <input type="date" className={inputCls} value={form.date} onChange={e => set('date', e.target.value)} required />
        </div>
        <div className="col-span-2">
          <label className={labelCls}>Description</label>
          <input type="text" className={inputCls} placeholder="e.g. Coconut harvest batch 4"
            value={form.description} onChange={e => set('description', e.target.value)} required />
        </div>
        <div>
          <label className={labelCls}>Category</label>
          <select className={inputCls} value={form.category} onChange={e => set('category', e.target.value)}>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Amount (LKR)</label>
          <input type="number" className={inputCls} placeholder="0.00" min="0" step="0.01"
            value={form.amount} onChange={e => set('amount', e.target.value)} required />
        </div>
        <div>
          <label className={labelCls}>Notes</label>
          <input type="text" className={inputCls} placeholder="Optional"
            value={form.notes} onChange={e => set('notes', e.target.value)} />
        </div>
      </div>

      <div className="flex gap-2 mt-3 justify-end">
        {isEditing && (
          <button type="button" onClick={onCancelEdit}
            className="px-4 py-1.5 text-sm rounded border border-gray-200 text-gray-600 cursor-pointer hover:bg-gray-50">
            Cancel
          </button>
        )}
        <button type="submit" disabled={saving}
          className="px-5 py-1.5 text-sm rounded text-white cursor-pointer"
          style={{ background: '#1a3020' }}>
          {saving ? 'Saving…' : isEditing ? 'Update' : 'Save'}
        </button>
      </div>
    </form>
  )
}

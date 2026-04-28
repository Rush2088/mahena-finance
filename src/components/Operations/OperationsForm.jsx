import { useState } from 'react'
import { todayISO } from '../../utils/formatters'

const ACTIVITY_CATEGORIES = ['Harvest', 'Fertilizer', 'Maintenance', 'Planting']

const EMPTY = { date: todayISO(), activity: '', category: 'Harvest', notes: '' }

export default function OperationsForm({ onSave, editingEntry, onCancelEdit }) {
  const [form, setForm]     = useState(editingEntry || EMPTY)
  const [saving, setSaving] = useState(false)
  const isEditing           = !!editingEntry

  // Sync when editingEntry changes
  if (editingEntry && editingEntry.id !== form.id) setForm(editingEntry)

  const set = (field, val) => setForm(prev => ({ ...prev, [field]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.activity.trim() || !form.date) return
    setSaving(true)
    await onSave({ ...form })
    setSaving(false)
    if (!isEditing) setForm({ ...EMPTY, date: form.date })
  }

  const inputCls = "w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm text-gray-800 bg-white focus:outline-none focus:border-gray-400"
  const labelCls = "block text-xs text-gray-500 mb-1"

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-800">
          {isEditing ? 'Edit journal entry' : 'Add journal entry'}
        </span>
      </div>

      <div className="grid grid-cols-6 gap-2 items-start">
        {/* Date */}
        <div>
          <label className={labelCls}>Date</label>
          <input type="date" className={inputCls} value={form.date}
            onChange={e => set('date', e.target.value)} required />
        </div>

        {/* Activity description — spans 3 columns, textarea 3 rows */}
        <div className="col-span-3">
          <label className={labelCls}>Activity Description</label>
          <textarea rows={3} className={inputCls} style={{ resize: 'vertical', minHeight: 72 }}
            placeholder="Describe the activity in detail…"
            value={form.activity} onChange={e => set('activity', e.target.value)} required />
        </div>

        {/* Category */}
        <div>
          <label className={labelCls}>Category</label>
          <select className={inputCls} value={form.category} onChange={e => set('category', e.target.value)}>
            {ACTIVITY_CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className={labelCls}>Notes</label>
          <textarea rows={3} className={inputCls} style={{ resize: 'vertical', minHeight: 72 }}
            placeholder="Optional notes…"
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

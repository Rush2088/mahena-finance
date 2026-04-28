import { useState } from 'react'
import { todayISO } from '../../utils/formatters'
import { OPERATIONS_CATEGORIES, CATEGORY_EMOJI } from './Operations'

const MAINTENANCE_SUBCATEGORIES = ['House', 'Land', 'Equipment', 'Other']
const FRUIT_SUBCATEGORIES       = ['Harvest', 'Planting', 'Fertilizer', 'Other']

const makeEmpty = (cat) => ({
  date:         todayISO(),
  crop:         (cat && cat !== 'all') ? cat : OPERATIONS_CATEGORIES[0],
  sub_category: '',
  activity:     '',
  notes:        '',
})

export default function OperationsForm({ onSave, editingEntry, onCancelEdit, defaultCategory }) {
  const [form, setForm]     = useState(editingEntry || makeEmpty(defaultCategory))
  const [saving, setSaving] = useState(false)
  const isEditing           = !!editingEntry

  // Sync when editingEntry changes
  if (editingEntry && editingEntry.id !== form.id) setForm(editingEntry)
  // Sync default category for new entries when filter changes
  if (!editingEntry && !form.id && defaultCategory && defaultCategory !== 'all' && form.crop !== defaultCategory) {
    setForm(prev => ({ ...prev, crop: defaultCategory, sub_category: '' }))
  }

  const set = (field, val) => setForm(prev => {
    const updated = { ...prev, [field]: val }
    // Clear sub_category when switching away from Maintenance
    if (field === 'crop' && val !== 'Maintenance') updated.sub_category = ''
    return updated
  })

  const isMaintenance  = form.crop === 'Maintenance'
  const subCategories  = isMaintenance ? MAINTENANCE_SUBCATEGORIES : FRUIT_SUBCATEGORIES

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.activity.trim() || !form.date || !form.crop) return
    if (isMaintenance && !form.sub_category) return
    setSaving(true)
    await onSave({ ...form })
    setSaving(false)
    if (!isEditing) setForm(makeEmpty(defaultCategory !== 'all' ? defaultCategory : form.crop))
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

      {/* Responsive grid: 1 col on mobile, 6 cols on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 items-start">

        {/* Date */}
        <div>
          <label className={labelCls}>Date</label>
          <input type="date" className={inputCls} value={form.date}
            onChange={e => set('date', e.target.value)} required />
        </div>

        {/* Category */}
        <div>
          <label className={labelCls}>Category</label>
          <select className={inputCls} value={form.crop} onChange={e => set('crop', e.target.value)} required>
            {OPERATIONS_CATEGORIES.map(c => (
              <option key={c} value={c}>{CATEGORY_EMOJI[c] ? `${CATEGORY_EMOJI[c]} ${c}` : c}</option>
            ))}
          </select>
        </div>

        {/* Sub Category */}
        <div>
          <label className={labelCls}>Sub Category</label>
          <select className={inputCls} value={form.sub_category}
            onChange={e => set('sub_category', e.target.value)} required>
            <option value="">Select…</option>
            {subCategories.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Description — full width on mobile, 2 cols on desktop */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-2">
          <label className={labelCls}>Description</label>
          <textarea rows={3} className={inputCls} style={{ resize: 'vertical', minHeight: 72 }}
            placeholder="Describe the activity in detail…"
            value={form.activity} onChange={e => set('activity', e.target.value)} required />
        </div>

        {/* Notes — full width on mobile */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
          <label className={labelCls}>Notes</label>
          <textarea rows={3} className={inputCls} style={{ resize: 'vertical', minHeight: 72 }}
            placeholder="Optional…"
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

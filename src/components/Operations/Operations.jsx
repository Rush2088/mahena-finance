import { useState } from 'react'
import { useOperations } from '../../hooks/useOperations'
import OperationsForm from './OperationsForm'
import OperationsTable from './OperationsTable'

export const OPERATIONS_CATEGORIES = [
  'Coconut',
  'King Coconut',
  'Areca Nut',
  'Pepper',
  'Cinnamon',
  'Banana',
  'Maintenance',
]

export const CATEGORY_EMOJI = {
  'Coconut':      '🥥',
  'King Coconut': '🌴',
  'Areca Nut':    '🌿',
  'Pepper':       '🫑',
  'Cinnamon':     '🪵',
  'Banana':       '🍌',
  'Maintenance':  '🔧',
}

export default function Operations({ userEmail, ready }) {
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [editingEntry, setEditingEntry]     = useState(null)
  const [page, setPage]                     = useState(1)

  const { entries, loading, error, addEntry, updateEntry, deleteEntry } =
    useOperations(userEmail, categoryFilter, ready)

  const handleSave = async (form) => {
    if (editingEntry) {
      await updateEntry(editingEntry.id, form)
      setEditingEntry(null)
    } else {
      await addEntry(form)
    }
    setPage(1)
  }

  const handleFilterChange = (cat) => {
    setCategoryFilter(cat)
    setEditingEntry(null)
    setPage(1)
  }

  return (
    <div className="p-4 flex flex-col gap-3" style={{ background: '#f9fafb', minHeight: 500 }}>

      {/* Category filter */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Filter by Category</div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => handleFilterChange('all')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded border cursor-pointer transition-colors whitespace-nowrap"
            style={categoryFilter === 'all'
              ? { background: '#1a3020', borderColor: '#1a3020', color: '#f5edd8' }
              : { background: 'white', borderColor: '#e5e7eb', color: '#6b7280' }}>
            🌾 All
          </button>
          {OPERATIONS_CATEGORIES.map(cat => (
            <button key={cat} type="button" onClick={() => handleFilterChange(cat)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded border cursor-pointer transition-colors whitespace-nowrap"
              style={categoryFilter === cat
                ? { background: '#1a3020', borderColor: '#1a3020', color: '#f5edd8' }
                : { background: 'white', borderColor: '#e5e7eb', color: '#6b7280' }}>
              <span>{CATEGORY_EMOJI[cat] || '🌱'}</span>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Section header */}
      <div className="flex items-center gap-2">
        <span className="text-base">{categoryFilter === 'all' ? '🌾' : (CATEGORY_EMOJI[categoryFilter] || '🌱')}</span>
        <span className="text-sm font-medium text-gray-700">Operations Journal</span>
        <span className="text-xs text-gray-400 ml-1">
          ({entries.length} {entries.length === 1 ? 'entry' : 'entries'})
        </span>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">{error}</div>
      )}

      {/* Form */}
      <OperationsForm
        onSave={handleSave}
        editingEntry={editingEntry}
        onCancelEdit={() => setEditingEntry(null)}
        defaultCategory={categoryFilter}
      />

      {/* Table */}
      {loading
        ? <div className="text-sm text-gray-500 text-center py-10">Loading journal…</div>
        : <OperationsTable
            entries={entries}
            page={page}
            setPage={setPage}
            onEdit={setEditingEntry}
            onDelete={deleteEntry}
            showSubCategory={categoryFilter === 'all' || categoryFilter === 'Maintenance'}
          />
      }
    </div>
  )
}

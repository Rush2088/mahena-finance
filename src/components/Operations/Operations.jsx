import { useState } from 'react'
import { INCOME_CATEGORIES } from '../../utils/categories'
import { useOperations } from '../../hooks/useOperations'
import OperationsForm from './OperationsForm'
import OperationsTable from './OperationsTable'

const CROP_EMOJI = {
  'Coconut':      '🥥',
  'King Coconut': '🌴',
  'Areca Nut':    '🌿',
  'Pepper':       '🫑',
  'Cinnamon':     '🪵',
  'Banana':       '🍌',
  'Garden Greens':'🥬',
}

export default function Operations({ userEmail, ready }) {
  const [selectedCrop, setSelectedCrop] = useState(INCOME_CATEGORIES[0])
  const [editingEntry, setEditingEntry] = useState(null)
  const [page, setPage]                 = useState(1)

  const { entries, loading, error, addEntry, updateEntry, deleteEntry } =
    useOperations(userEmail, selectedCrop, ready)

  const handleSave = async (form) => {
    if (editingEntry) {
      await updateEntry(editingEntry.id, form)
      setEditingEntry(null)
    } else {
      await addEntry(form)
    }
    setPage(1)
  }

  const handleCropChange = (crop) => {
    setSelectedCrop(crop)
    setEditingEntry(null)
    setPage(1)
  }

  return (
    <div className="p-4 flex flex-col gap-3" style={{ background: '#f9fafb', minHeight: 500 }}>

      {/* Crop selector */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Select Crop</div>
        <div className="flex flex-wrap gap-2">
          {INCOME_CATEGORIES.map(crop => (
            <button
              key={crop}
              type="button"
              onClick={() => handleCropChange(crop)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded border cursor-pointer transition-colors whitespace-nowrap"
              style={selectedCrop === crop
                ? { background: '#1a3020', borderColor: '#1a3020', color: '#f5edd8' }
                : { background: 'white', borderColor: '#e5e7eb', color: '#6b7280' }
              }
            >
              <span>{CROP_EMOJI[crop] || '🌱'}</span>
              {crop}
            </button>
          ))}
        </div>
      </div>

      {/* Section header */}
      <div className="flex items-center gap-2">
        <span className="text-base">{CROP_EMOJI[selectedCrop] || '🌱'}</span>
        <span className="text-sm font-medium text-gray-700">{selectedCrop} — Operations Journal</span>
        <span className="text-xs text-gray-400 ml-1">({entries.length} {entries.length === 1 ? 'entry' : 'entries'})</span>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">{error}</div>
      )}

      {/* Form */}
      <OperationsForm
        onSave={handleSave}
        editingEntry={editingEntry}
        onCancelEdit={() => setEditingEntry(null)}
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
          />
      }
    </div>
  )
}

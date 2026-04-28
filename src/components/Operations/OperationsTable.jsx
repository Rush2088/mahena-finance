import { fmtDate } from '../../utils/formatters'
import { userLabel } from '../../utils/userLabels'

const PAGE_SIZE = 15

const CATEGORY_BADGE = {
  'Harvest':     { bg: '#eaf3de', color: '#3b6d11' },
  'Fertilizer':  { bg: '#fcebeb', color: '#a32d2d' },
  'Maintenance': { bg: '#e6f1fb', color: '#185fa5' },
  'Planting':    { bg: '#fdf6e3', color: '#92610a' },
}

const CROP_EMOJI = {
  'Coconut':      '🥥',
  'King Coconut': '🌴',
  'Areca Nut':    '🌿',
  'Pepper':       '🫑',
  'Cinnamon':     '🪵',
  'Banana':       '🍌',
  'Garden Greens':'🥬',
}

export default function OperationsTable({ entries, page, setPage, onEdit, onDelete, showCrop }) {
  const totalPages = Math.max(1, Math.ceil(entries.length / PAGE_SIZE))
  const paged      = entries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  if (entries.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg flex items-center justify-center py-16 text-sm text-gray-400">
        No journal entries yet — add the first one above.
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 w-28">Date</th>
            {showCrop && (
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 w-32">Crop</th>
            )}
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Activity</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 w-28">Category</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Notes</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 w-20">By</th>
            <th className="px-4 py-2 w-16"></th>
          </tr>
        </thead>
        <tbody>
          {paged.map(entry => {
            const badge = CATEGORY_BADGE[entry.category] || { bg: '#f3f4f4', color: '#6b7280' }
            return (
              <tr key={entry.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-2 text-gray-500 whitespace-nowrap">{fmtDate(entry.date)}</td>
                {showCrop && (
                  <td className="px-4 py-2 text-gray-600 whitespace-nowrap text-xs">
                    {CROP_EMOJI[entry.crop] || '🌱'} {entry.crop}
                  </td>
                )}
                <td className="px-4 py-2 text-gray-700" style={{ whiteSpace: 'pre-wrap', maxWidth: 320 }}>{entry.activity}</td>
                <td className="px-4 py-2">
                  <span className="text-xs px-2 py-0.5 rounded font-medium"
                    style={{ background: badge.bg, color: badge.color }}>
                    {entry.category}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-500" style={{ whiteSpace: 'pre-wrap', maxWidth: 180 }}>{entry.notes || '—'}</td>
                <td className="px-4 py-2 text-gray-400 text-xs whitespace-nowrap">{userLabel(entry.entered_by)}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-1.5 justify-end">
                    <button onClick={() => onEdit(entry)}
                      className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-500 cursor-pointer hover:bg-gray-50">
                      Edit
                    </button>
                    <button onClick={() => { if (window.confirm('Delete this entry?')) onDelete(entry.id) }}
                      className="text-xs px-2 py-1 rounded border cursor-pointer"
                      style={{ borderColor: '#f5c0c0', color: '#a32d2d', background: '#fff' }}>
                      Del
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 text-xs text-gray-500">
          <span>{entries.length} entries</span>
          <div className="flex gap-1">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="px-2 py-1 rounded border border-gray-200 disabled:opacity-40 cursor-pointer hover:bg-gray-50">‹</button>
            <span className="px-2 py-1">{page} / {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
              className="px-2 py-1 rounded border border-gray-200 disabled:opacity-40 cursor-pointer hover:bg-gray-50">›</button>
          </div>
        </div>
      )}
    </div>
  )
}

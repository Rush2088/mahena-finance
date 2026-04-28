import { fmtDate } from '../../utils/formatters'
import { userLabel } from '../../utils/userLabels'
import { CATEGORY_EMOJI } from './Operations'

const PAGE_SIZE = 10

export default function OperationsTable({ entries, page, setPage, onEdit, onDelete, showSubCategory }) {
  const totalPages = Math.max(1, Math.ceil(entries.length / PAGE_SIZE))
  const paged      = entries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const start      = (page - 1) * PAGE_SIZE + 1
  const end        = Math.min(page * PAGE_SIZE, entries.length)

  if (entries.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg flex items-center justify-center py-16 text-sm text-gray-400">
        No journal entries yet — add the first one above.
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">

      {/* Horizontally scrollable table wrapper */}
      <div className="overflow-x-auto">
        <table className="border-collapse text-sm" style={{ minWidth: 640 }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap" style={{ minWidth: 100 }}>Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap" style={{ minWidth: 120 }}>Category</th>
              {showSubCategory && (
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap" style={{ minWidth: 110 }}>Sub Category</th>
              )}
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500" style={{ minWidth: 200 }}>Description</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500" style={{ minWidth: 140 }}>Notes</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap" style={{ minWidth: 56 }}>By</th>
              <th className="px-4 py-2" style={{ minWidth: 80 }}></th>
            </tr>
          </thead>
          <tbody>
            {paged.map(entry => (
              <tr key={entry.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-2 text-gray-500 whitespace-nowrap text-xs">{fmtDate(entry.date)}</td>
                <td className="px-4 py-2 text-gray-600 whitespace-nowrap text-xs">
                  {CATEGORY_EMOJI[entry.crop] || '🌱'} {entry.crop}
                </td>
                {showSubCategory && (
                  <td className="px-4 py-2 text-gray-500 text-xs whitespace-nowrap">
                    {entry.sub_category || '—'}
                  </td>
                )}
                <td className="px-4 py-2 text-gray-700 text-xs" style={{ whiteSpace: 'pre-wrap', maxWidth: 280 }}>
                  {entry.activity}
                </td>
                <td className="px-4 py-2 text-gray-500 text-xs" style={{ whiteSpace: 'pre-wrap', maxWidth: 160 }}>
                  {entry.notes || '—'}
                </td>
                <td className="px-4 py-2 text-gray-400 text-xs whitespace-nowrap">
                  {userLabel(entry.entered_by)}
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-1.5 justify-end">
                    <button onClick={() => onEdit(entry)}
                      className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-500 cursor-pointer hover:bg-gray-50 whitespace-nowrap">
                      Edit
                    </button>
                    <button onClick={() => { if (window.confirm('Delete this entry?')) onDelete(entry.id) }}
                      className="text-xs px-2 py-1 rounded border cursor-pointer whitespace-nowrap"
                      style={{ borderColor: '#f5c0c0', color: '#a32d2d', background: '#fff' }}>
                      Del
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 text-xs text-gray-500 flex-wrap gap-2">
        <span>{start}–{end} of {entries.length} {entries.length === 1 ? 'entry' : 'entries'}</span>
        {totalPages > 1 && (
          <div className="flex gap-1">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="px-2 py-1 rounded border border-gray-200 disabled:opacity-40 cursor-pointer hover:bg-gray-50">‹</button>
            <span className="px-2 py-1">{page} / {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
              className="px-2 py-1 rounded border border-gray-200 disabled:opacity-40 cursor-pointer hover:bg-gray-50">›</button>
          </div>
        )}
      </div>

    </div>
  )
}

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function exportOperationsPDF({ entries, categoryFilter, today }) {
  const doc   = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()   // 297mm landscape
  const pageH = doc.internal.pageSize.getHeight()  // 210mm landscape

  const filterLabel = categoryFilter === 'all' ? 'All Categories' : categoryFilter

  // ── Header bar ──────────────────────────────────
  doc.setFillColor(26, 48, 32)
  doc.rect(0, 0, pageW, 20, 'F')

  doc.setTextColor(245, 237, 216)
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text("Ma'he'na Estate", 14, 9)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('Finance & Operations', 14, 14.5)

  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Operations Journal', pageW - 14, 9, { align: 'right' })
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text(`Category: ${filterLabel}`, pageW - 14, 14.5, { align: 'right' })

  // ── Sub-header ──────────────────────────────────
  doc.setTextColor(100, 100, 100)
  doc.setFontSize(8)
  doc.text('Batepolea, Waturagam, Sri Lanka', 14, 26)
  doc.text(`Generated: ${today}  ·  ${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}`, pageW - 14, 26, { align: 'right' })

  // ── Build table rows ────────────────────────────
  const showSubCat = entries.some(e => e.sub_category)

  const head = showSubCat
    ? [['Date', 'Category', 'Sub Category', 'Description', 'Notes', 'Entered By']]
    : [['Date', 'Category', 'Description', 'Notes', 'Entered By']]

  const USER_LABELS = {
    'rashmil.dahanayake@gmail.com': 'RS. D.',
    'tissa.dahanayake@gmail.com':   'DP. D.',
    'pdmn_dahanayake@yahoo.com':    'MP. D.',
  }
  const userLabel = (email) => USER_LABELS[email?.toLowerCase()] || email || '—'

  const fmtDate = (d) => {
    if (!d) return ''
    return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    })
  }

  const body = entries.map(e => showSubCat
    ? [fmtDate(e.date), e.crop || '—', e.sub_category || '—', e.activity || '', e.notes || '—', userLabel(e.entered_by)]
    : [fmtDate(e.date), e.crop || '—', e.activity || '', e.notes || '—', userLabel(e.entered_by)]
  )

  // ── Journal table ────────────────────────────────
  autoTable(doc, {
    startY: 31,
    head,
    body,
    headStyles: {
      fillColor: [26, 48, 32],
      textColor: [245, 237, 216],
      fontStyle: 'bold',
      fontSize: 8,
    },
    bodyStyles: { fontSize: 8, textColor: [60, 60, 60] },
    alternateRowStyles: { fillColor: [245, 248, 245] },
    columnStyles: showSubCat
      ? {
          0: { cellWidth: 24 },   // Date
          1: { cellWidth: 30 },   // Category
          2: { cellWidth: 26 },   // Sub Category
          3: { cellWidth: 'auto' }, // Description
          4: { cellWidth: 50 },   // Notes
          5: { cellWidth: 20 },   // By
        }
      : {
          0: { cellWidth: 24 },   // Date
          1: { cellWidth: 30 },   // Category
          2: { cellWidth: 'auto' }, // Description
          3: { cellWidth: 55 },   // Notes
          4: { cellWidth: 20 },   // By
        },
    styles: { overflow: 'linebreak', cellPadding: 2.5 },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      // Footer on every page
      doc.setFillColor(249, 250, 251)
      doc.rect(0, pageH - 10, pageW, 10, 'F')
      doc.setFontSize(7)
      doc.setTextColor(160, 160, 160)
      doc.text("Ma'he'na Estate · Finance & Operations", 14, pageH - 4)
      doc.text(`Page ${data.pageNumber}`, pageW - 14, pageH - 4, { align: 'right' })
    },
  })

  const filename = categoryFilter === 'all'
    ? 'Mahena_Operations_Journal_All.pdf'
    : `Mahena_Operations_${categoryFilter.replace(/ /g, '_')}.pdf`

  doc.save(filename)
}

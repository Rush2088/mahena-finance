import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const fmt = (n) => `LKR ${Number(n).toLocaleString('en-LK', { minimumFractionDigits: 2 })}`

export function exportPDF({ selectedLabel, periodStr, today, incomeRows, expenseRows, totalIncome, totalExpense, net, margin }) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()

  // ── Header ──────────────────────────────────────
  doc.setFillColor(26, 48, 32)
  doc.rect(0, 0, pageW, 22, 'F')

  doc.setTextColor(245, 237, 216)
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text("Ma'he'na Estate", 14, 10)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('Finance Tracker', 14, 15.5)

  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Income & Expenditure Statement', pageW - 14, 10, { align: 'right' })
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text(`Period: ${periodStr}`, pageW - 14, 15.5, { align: 'right' })

  // ── Sub-header ──────────────────────────────────
  doc.setTextColor(80, 80, 80)
  doc.setFontSize(8)
  doc.text('Batepolea, Waturagam, Sri Lanka', 14, 29)
  doc.text(`Generated: ${today}`, pageW - 14, 29, { align: 'right' })

  // ── Income table ────────────────────────────────
  autoTable(doc, {
    startY: 34,
    head: [['Income Category', 'Amount (LKR)']],
    body: [
      ...incomeRows.map(r => [r.cat, r.amount > 0 ? fmt(r.amount) : '—']),
      [{ content: 'Total Income', styles: { fontStyle: 'bold' } },
       { content: fmt(totalIncome), styles: { fontStyle: 'bold', textColor: [58, 107, 60] } }]
    ],
    headStyles: { fillColor: [58, 107, 60], textColor: 255, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: [60, 60, 60] },
    columnStyles: { 1: { halign: 'right' } },
    alternateRowStyles: { fillColor: [245, 250, 245] },
    margin: { left: 14, right: 14 },
  })

  // ── Expense table ───────────────────────────────
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 6,
    head: [['Expense Category', 'Amount (LKR)']],
    body: [
      ...expenseRows.map(r => [r.cat, r.amount > 0 ? fmt(r.amount) : '—']),
      [{ content: 'Total Expenses', styles: { fontStyle: 'bold' } },
       { content: fmt(totalExpense), styles: { fontStyle: 'bold', textColor: [163, 45, 45] } }]
    ],
    headStyles: { fillColor: [163, 45, 45], textColor: 255, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: [60, 60, 60] },
    columnStyles: { 1: { halign: 'right' } },
    alternateRowStyles: { fillColor: [252, 245, 245] },
    margin: { left: 14, right: 14 },
  })

  // ── Net profit row ──────────────────────────────
  const y = doc.lastAutoTable.finalY + 6
  doc.setDrawColor(180, 180, 180)
  doc.line(14, y, pageW - 14, y)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(24, 95, 165)
  doc.text('Net Profit / (Loss)', 14, y + 7)
  doc.text(fmt(net), pageW - 14, y + 7, { align: 'right' })
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(59, 109, 17)
  doc.text(`${margin}% profit margin`, 14, y + 13)

  // ── Footer ──────────────────────────────────────
  const pageH = doc.internal.pageSize.getHeight()
  doc.setFillColor(249, 250, 251)
  doc.rect(0, pageH - 12, pageW, 12, 'F')
  doc.setFontSize(7.5)
  doc.setTextColor(150, 150, 150)
  doc.text("Ma'he'na Estate Finance Tracker · All amounts in Sri Lankan Rupees (LKR)", 14, pageH - 5)
  doc.text('Prepared by: R. Dahanayake', pageW - 14, pageH - 5, { align: 'right' })

  doc.save(`Mahena_Estate_${selectedLabel.replace(/ /g, '_')}.pdf`)
}

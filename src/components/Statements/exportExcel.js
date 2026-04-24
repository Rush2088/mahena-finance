import * as XLSX from 'xlsx'

export function exportExcel({ selectedLabel, periodStr, incomeRows, expenseRows, totalIncome, totalExpense, net, margin }, allTxns) {
  const wb = XLSX.utils.book_new()

  // ── Sheet 1: Statement summary ──────────────────
  const summaryData = [
    ["Ma'he'na Estate — Income & Expenditure Statement"],
    [`Period: ${periodStr}`],
    [],
    ['INCOME'],
    ['Category', 'Amount (LKR)'],
    ...incomeRows.map(r => [r.cat, r.amount > 0 ? r.amount : '']),
    ['Total Income', totalIncome],
    [],
    ['EXPENSES'],
    ['Category', 'Amount (LKR)'],
    ...expenseRows.map(r => [r.cat, r.amount > 0 ? r.amount : '']),
    ['Total Expenses', totalExpense],
    [],
    ['Net Profit / (Loss)', net],
    ['Profit Margin', `${margin}%`],
    [],
    ['Prepared by: R. Dahanayake'],
  ]

  const ws1 = XLSX.utils.aoa_to_sheet(summaryData)
  ws1['!cols'] = [{ wch: 30 }, { wch: 18 }]
  // Bold title
  if (ws1['A1']) ws1['A1'].s = { font: { bold: true, sz: 13 } }
  XLSX.utils.book_append_sheet(wb, ws1, 'Statement')

  // ── Sheet 2: Raw transactions ───────────────────
  const txnData = [
    ['Date', 'Description', 'Type', 'Category', 'Amount (LKR)', 'Notes'],
    ...allTxns.map(t => [t.date, t.description, t.type, t.category, Number(t.amount), t.notes || ''])
  ]
  const ws2 = XLSX.utils.aoa_to_sheet(txnData)
  ws2['!cols'] = [{ wch: 14 }, { wch: 36 }, { wch: 10 }, { wch: 24 }, { wch: 16 }, { wch: 28 }]
  XLSX.utils.book_append_sheet(wb, ws2, 'Transactions')

  XLSX.writeFile(wb, `Mahena_Estate_${selectedLabel.replace(/ /g, '_')}.xlsx`)
}

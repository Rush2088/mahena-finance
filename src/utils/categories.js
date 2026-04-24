// ─────────────────────────────────────────────
//  Ma'he'na Estate — income & expense categories
// ─────────────────────────────────────────────

export const INCOME_CATEGORIES = [
  'Coconut',
  'King Coconut',
  'Areca Nut',
  'Pepper',
  'Cinnamon',
  'Banana',
  'Garden Greens',
]

export const EXPENSE_CATEGORIES = [
  'Fertilizer',
  'Weed Killer',
  'Pesticide',
  'Labour – Maintenance',
  'Labour – Harvesting',
  'Electricity',
  'Council Rates',
  'Equipment Maintenance',
  'Security',
  'Miscellaneous',
]

export const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]

export const CATEGORY_COLOR = {
  // income — greens
  'Coconut':        '#3a6b3c',
  'King Coconut':   '#4a8c4e',
  'Areca Nut':      '#5a9e5e',
  'Pepper':         '#6aab6e',
  'Cinnamon':       '#7ab87e',
  'Banana':         '#8abe8e',
  'Garden Greens':  '#a0d0a0',
  // expenses — reds
  'Fertilizer':           '#a32d2d',
  'Weed Killer':          '#b84040',
  'Pesticide':            '#c96060',
  'Labour – Maintenance': '#d47070',
  'Labour – Harvesting':  '#d48080',
  'Electricity':          '#de9090',
  'Council Rates':        '#e0a0a0',
  'Equipment Maintenance':'#e8b0b0',
  'Security':             '#eec0c0',
  'Miscellaneous':        '#f5d0d0',
}

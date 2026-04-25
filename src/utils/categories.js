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
  'Pest & Weed Control',
  'Labour – Maintenance',
  'Labour – Harvesting',
  'Utilities',
  'Equipment',
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
  'Pest & Weed Control':  '#b84040',
  'Labour – Maintenance': '#c96060',
  'Labour – Harvesting':  '#d47070',
  'Utilities':            '#dd8585',
  'Equipment':            '#e69898',
  'Security':             '#f2c0c0',
  'Miscellaneous':        '#f5d0d0',
}

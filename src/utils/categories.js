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
  'Utilities',
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
  'Labour – Harvesting':  '#dd8585',
  'Utilities':            '#e69898',
  'Equipment Maintenance':'#edadad',
  'Security':             '#f2c0c0',
  'Miscellaneous':        '#f5d0d0',
}

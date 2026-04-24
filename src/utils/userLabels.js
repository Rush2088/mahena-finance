// Maps Supabase user email addresses to display abbreviations
const USER_LABELS = {
  'rashmil.dahanayake@gmail.com': 'RS. D.',
  'tissa.dahanayake@gmail.com':   'DP. D.',
  'pdmn_dahanayake@yahoo.com':    'MP. D.',
}

export const userLabel = (email) => USER_LABELS[email?.toLowerCase()] || email || '—'

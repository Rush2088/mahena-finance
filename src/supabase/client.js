// ─────────────────────────────────────────────
//  SUPABASE CLIENT
//  Replace the two values below with your own
//  Supabase project URL and anon key.
//  Find them at: https://supabase.com/dashboard
//  → Your Project → Settings → API
// ─────────────────────────────────────────────
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL  = 'https://YOUR_PROJECT_ID.supabase.co'
const SUPABASE_ANON = 'YOUR_ANON_PUBLIC_KEY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)

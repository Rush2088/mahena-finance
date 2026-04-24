import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL  = 'https://ntiqnyxgcrffldumttcq.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aXFueXhnY3JmZmxkdW10dGNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMDc4ODEsImV4cCI6MjA5MjU4Mzg4MX0.AbBup7xRqSycxnrxbAWF_cM_-ItacQxpgKKAQ-KXCSo'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)

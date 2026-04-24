-- ═══════════════════════════════════════════════════
--  Ma'he'na Estate Finance Tracker — Supabase Schema
--  Run this in: Supabase Dashboard → SQL Editor → New query
-- ═══════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS transactions (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  date        DATE        NOT NULL,
  description TEXT        NOT NULL,
  type        TEXT        NOT NULL CHECK (type IN ('income', 'expense')),
  category    TEXT        NOT NULL,
  amount      NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast monthly queries
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Allow all operations for anonymous users (public app — no login)
CREATE POLICY "Allow public access"
  ON transactions FOR ALL
  USING (true)
  WITH CHECK (true);

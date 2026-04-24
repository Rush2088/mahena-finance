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

CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- ── Run this separately to update RLS to require login ──
-- Drop old public policy first:
DROP POLICY IF EXISTS "Allow public access" ON transactions;

-- New policy: only authenticated (logged-in) users can access data
CREATE POLICY "Allow authenticated access"
  ON transactions FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

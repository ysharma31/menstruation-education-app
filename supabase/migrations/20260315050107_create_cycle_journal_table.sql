/*
  # Create cycle_journal table

  ## Summary
  Adds a daily symptom and mood journal for period tracking users.

  ## New Tables
  - `cycle_journal`
    - `id` (uuid, primary key) - unique record identifier
    - `user_id` (uuid, FK to auth.users) - owner of the entry
    - `entry_date` (date, NOT NULL) - the date of the journal entry
    - `flow_intensity` (text) - one of: none, light, medium, heavy, very_heavy
    - `mood` (text) - one of: great, good, okay, low, rough
    - `symptoms` (text[]) - multi-select array of symptom strings
    - `sleep_quality` (int, 1–5) - star rating for sleep
    - `energy_level` (int, 1–5) - dot rating for energy
    - `notes` (text) - optional free-text notes
    - `created_at` (timestamptz) - record creation timestamp
    - UNIQUE constraint on (user_id, entry_date) — one entry per user per day

  ## Security
  - RLS enabled on `cycle_journal`
  - Single ALL policy: users can only manage their own entries via auth.uid() check

  ## Notes
  1. No guest/localStorage fallback — journal is auth-only
  2. Symptoms stored as text array for flexible multi-select
  3. sleep_quality and energy_level have CHECK constraints (1–5)
*/

CREATE TABLE IF NOT EXISTS cycle_journal (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_date date NOT NULL,
  flow_intensity text,
  mood text,
  symptoms text[] DEFAULT '{}',
  sleep_quality int CHECK (sleep_quality BETWEEN 1 AND 5),
  energy_level int CHECK (energy_level BETWEEN 1 AND 5),
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, entry_date)
);

ALTER TABLE cycle_journal ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own journal"
  ON cycle_journal
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS cycle_journal_user_date_idx ON cycle_journal(user_id, entry_date DESC);

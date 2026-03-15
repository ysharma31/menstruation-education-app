/*
  # Medication Tracking System

  1. New Tables
    - `medications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text) - Medication name (e.g., Ibuprofen, Birth Control)
      - `purpose` (text) - Reason for taking (cramps, PCOS, hormonal, other)
      - `dosage` (text, nullable) - Optional dosage notes
      - `start_date` (date) - When the medication was started
      - `end_date` (date, nullable) - When stopped (null if ongoing)
      - `is_ongoing` (boolean) - Whether still actively taking
      - `notes` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `medications` table
    - Authenticated users can only access their own records

  3. Indexes
    - Index on user_id and start_date for efficient queries

  4. Notes
    - Purpose categories: cramps, pcos, hormonal, pain_relief, other
    - Used to correlate medication periods with cycle changes in analysis
*/

CREATE TABLE IF NOT EXISTS medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  purpose text NOT NULL DEFAULT 'other',
  dosage text,
  start_date date NOT NULL,
  end_date date,
  is_ongoing boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_med_dates CHECK (end_date IS NULL OR end_date >= start_date),
  CONSTRAINT valid_purpose CHECK (purpose IN ('cramps', 'pcos', 'hormonal', 'pain_relief', 'other'))
);

ALTER TABLE medications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own medications"
  ON medications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own medications"
  ON medications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own medications"
  ON medications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own medications"
  ON medications FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_medications_user_id ON medications(user_id);
CREATE INDEX IF NOT EXISTS idx_medications_start_date ON medications(start_date DESC);
CREATE INDEX IF NOT EXISTS idx_medications_user_start ON medications(user_id, start_date DESC);

CREATE OR REPLACE FUNCTION update_medications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_medications_updated_at ON medications;
CREATE TRIGGER set_medications_updated_at
  BEFORE UPDATE ON medications
  FOR EACH ROW
  EXECUTE FUNCTION update_medications_updated_at();
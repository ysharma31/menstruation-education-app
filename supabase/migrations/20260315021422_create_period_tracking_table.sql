/*
  # Period Tracking System

  1. New Tables
    - `period_cycles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users) - Links to authenticated user
      - `start_date` (date, not null) - First day of period
      - `end_date` (date, nullable) - Last day of period (null if ongoing)
      - `cycle_length` (integer, nullable) - Days between this cycle and previous one
      - `period_length` (integer, nullable) - Number of days the period lasted
      - `notes` (text, nullable) - Optional notes about symptoms, flow, etc.
      - `created_at` (timestamptz) - When record was created
      - `updated_at` (timestamptz) - When record was last updated

  2. Security
    - Enable RLS on `period_cycles` table
    - Add policy for authenticated users to read their own data
    - Add policy for authenticated users to insert their own data
    - Add policy for authenticated users to update their own data
    - Add policy for authenticated users to delete their own data

  3. Indexes
    - Index on user_id for faster queries
    - Index on start_date for sorting and date-based queries

  4. Important Notes
    - Anonymous tracking: For users who don't want to create accounts, we'll use localStorage
    - Database tracking: For authenticated users with full history and sync
    - Cycle length is automatically calculated based on previous cycle
    - Period length is calculated when end_date is set
*/

-- Create period_cycles table
CREATE TABLE IF NOT EXISTS period_cycles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date,
  cycle_length integer,
  period_length integer,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_dates CHECK (end_date IS NULL OR end_date >= start_date),
  CONSTRAINT valid_lengths CHECK (
    (cycle_length IS NULL OR cycle_length > 0) AND
    (period_length IS NULL OR period_length > 0)
  )
);

-- Enable RLS
ALTER TABLE period_cycles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own period cycles"
  ON period_cycles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own period cycles"
  ON period_cycles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own period cycles"
  ON period_cycles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own period cycles"
  ON period_cycles FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_period_cycles_user_id ON period_cycles(user_id);
CREATE INDEX IF NOT EXISTS idx_period_cycles_start_date ON period_cycles(start_date DESC);
CREATE INDEX IF NOT EXISTS idx_period_cycles_user_start ON period_cycles(user_id, start_date DESC);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_period_cycles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS set_period_cycles_updated_at ON period_cycles;
CREATE TRIGGER set_period_cycles_updated_at
  BEFORE UPDATE ON period_cycles
  FOR EACH ROW
  EXECUTE FUNCTION update_period_cycles_updated_at();

-- Create function to calculate period length when end_date is set
CREATE OR REPLACE FUNCTION calculate_period_length()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.end_date IS NOT NULL AND NEW.start_date IS NOT NULL THEN
    NEW.period_length = (NEW.end_date - NEW.start_date) + 1;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for period length calculation
DROP TRIGGER IF EXISTS set_period_length ON period_cycles;
CREATE TRIGGER set_period_length
  BEFORE INSERT OR UPDATE ON period_cycles
  FOR EACH ROW
  EXECUTE FUNCTION calculate_period_length();
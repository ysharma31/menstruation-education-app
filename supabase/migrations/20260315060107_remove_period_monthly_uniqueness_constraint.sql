/*
  # Remove monthly uniqueness constraint from period_cycles

  ## Summary
  Removes any unique constraint that limits one cycle per calendar month per user.
  The only uniqueness enforced is (user_id, start_date) — a user cannot start
  two periods on the exact same day, but CAN have multiple periods in the same
  calendar month (which is valid for irregular cycles).

  ## Changes
  - Drop period_cycles_user_id_month_key if it exists
  - Add unique constraint on (user_id, start_date) if not already present
  - No data loss, no schema changes beyond constraint adjustment
*/

-- Drop the monthly uniqueness constraint if it exists
ALTER TABLE period_cycles DROP CONSTRAINT IF EXISTS period_cycles_user_id_month_key;

-- Ensure we have a unique constraint on (user_id, start_date) — same day, same user is not allowed
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'period_cycles'
      AND constraint_name = 'period_cycles_user_id_start_date_key'
  ) THEN
    ALTER TABLE period_cycles ADD CONSTRAINT period_cycles_user_id_start_date_key UNIQUE (user_id, start_date);
  END IF;
END $$;

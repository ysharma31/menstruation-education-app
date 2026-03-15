/*
  # Add is_active column to teacher_classes

  ## Summary
  The application queries teacher_classes with `.eq('is_active', true)` but the
  column was never added to the table. This migration adds it with a default of
  true so all existing classes are immediately active.

  ## Changes
  - `teacher_classes`: add `is_active` boolean column, default true
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'teacher_classes' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE teacher_classes ADD COLUMN is_active boolean NOT NULL DEFAULT true;
  END IF;
END $$;

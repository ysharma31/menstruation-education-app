/*
  # Add school_name to course_materials

  ## Summary
  Adds a `school_name` column to `course_materials` so that materials can be
  scoped to a specific school. This allows the student dashboard to filter
  materials to only those published by teachers from the same school.

  ## Changes
  - `course_materials`: new nullable `school_name` text column

  ## Notes
  - Nullable so existing records are unaffected
  - Populated at insert time from the teacher's class school_name
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'course_materials' AND column_name = 'school_name'
  ) THEN
    ALTER TABLE course_materials ADD COLUMN school_name text;
  END IF;
END $$;

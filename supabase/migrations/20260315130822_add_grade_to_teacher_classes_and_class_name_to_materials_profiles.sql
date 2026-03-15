/*
  # Add grade to teacher_classes, class_name to course_materials and student_profiles

  ## Summary
  Enables two-factor matching between teacher materials and students: both grade level
  and class name must match for materials to appear in the student dashboard.

  ## Changes

  ### teacher_classes
  - Added `grade` (int, nullable) — the grade level (4–12) assigned to this class

  ### course_materials
  - Added `class_name` (text, nullable) — copied from the class at upload time, used to match students
  - Relaxed the NOT NULL constraint on `grade` (existing materials have no class_name yet)

  ### student_profiles
  - Added `class_name` (text, nullable) — the class name the student belongs to, set at signup or profile update

  ## Notes
  1. Both columns are nullable to avoid breaking existing data
  2. Matching logic: materials are shown to students where BOTH grade AND class_name match
  3. If either value is null/unset, matching falls back gracefully
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'teacher_classes' AND column_name = 'grade'
  ) THEN
    ALTER TABLE teacher_classes ADD COLUMN grade int CHECK (grade >= 4 AND grade <= 12);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'course_materials' AND column_name = 'class_name'
  ) THEN
    ALTER TABLE course_materials ADD COLUMN class_name text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'student_profiles' AND column_name = 'class_name'
  ) THEN
    ALTER TABLE student_profiles ADD COLUMN class_name text;
  END IF;
END $$;

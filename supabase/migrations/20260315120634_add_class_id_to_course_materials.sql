/*
  # Add class_id to course_materials

  ## Summary
  Links uploaded course materials to a specific teacher class.

  ## Changes

  ### Modified Tables
  - `course_materials`
    - Added `class_id` (uuid, nullable) — references teacher_classes(id)
      Nullable so existing materials are not broken.

  ## Notes
  1. Foreign key cascades to null on class deletion so materials are not lost.
  2. An index is added for efficient filtering by class.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'course_materials' AND column_name = 'class_id'
  ) THEN
    ALTER TABLE course_materials
      ADD COLUMN class_id uuid REFERENCES teacher_classes(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_course_materials_class_id ON course_materials(class_id);

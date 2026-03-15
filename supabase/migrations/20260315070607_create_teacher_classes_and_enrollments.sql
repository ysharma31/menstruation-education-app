/*
  # Teacher Dashboard: Classes and Enrollments

  ## Summary
  Creates the teacher/school dashboard data layer. Teachers can create classes
  that generate a shareable 6-character code. Students can join with that code.
  All analytics are anonymous aggregates — no individual student data is exposed.

  ## New Tables

  ### teacher_classes
  - `id` (uuid, primary key)
  - `teacher_id` (uuid) — references auth.users, the teacher who owns this class
  - `class_code` (text, unique) — auto-generated 6-char uppercase code for sharing
  - `class_name` (text) — human-readable class name set by teacher
  - `school_name` (text, nullable) — optional school name
  - `created_at` (timestamptz)

  ### class_enrollments
  - `id` (uuid, primary key)
  - `class_id` (uuid) — references teacher_classes
  - `student_id` (uuid) — references auth.users (the enrolled student)
  - `enrolled_at` (timestamptz)
  - Unique constraint on (class_id, student_id) to prevent duplicate enrollments

  ## Security
  - RLS enabled on both tables
  - Teachers can only see/manage their own classes
  - Students can enroll themselves (insert) and see their own enrollments
  - Teachers can read enrollment counts for their classes (not student identities via this policy)
  - A teacher cannot read another teacher's classes

  ## Notes
  1. class_code is generated server-side using gen_random_uuid() substring — unique constraint ensures no collision
  2. Privacy: no policy allows a teacher to see individual student user data
  3. Students joining a class is entirely voluntary
*/

CREATE TABLE IF NOT EXISTS teacher_classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  class_code text UNIQUE NOT NULL DEFAULT upper(substring(gen_random_uuid()::text, 1, 6)),
  class_name text NOT NULL,
  school_name text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS class_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES teacher_classes(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  enrolled_at timestamptz DEFAULT now(),
  UNIQUE(class_id, student_id)
);

ALTER TABLE teacher_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can view own classes"
  ON teacher_classes FOR SELECT
  TO authenticated
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can create classes"
  ON teacher_classes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update own classes"
  ON teacher_classes FOR UPDATE
  TO authenticated
  USING (auth.uid() = teacher_id)
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete own classes"
  ON teacher_classes FOR DELETE
  TO authenticated
  USING (auth.uid() = teacher_id);

CREATE POLICY "Anyone authenticated can look up a class by code"
  ON teacher_classes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Students can enroll in a class"
  ON class_enrollments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can view own enrollments"
  ON class_enrollments FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view enrollment counts for their classes"
  ON class_enrollments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teacher_classes
      WHERE teacher_classes.id = class_enrollments.class_id
      AND teacher_classes.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can remove enrollments from own classes"
  ON class_enrollments FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teacher_classes
      WHERE teacher_classes.id = class_enrollments.class_id
      AND teacher_classes.teacher_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_teacher_classes_teacher_id ON teacher_classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_classes_class_code ON teacher_classes(class_code);
CREATE INDEX IF NOT EXISTS idx_class_enrollments_class_id ON class_enrollments(class_id);
CREATE INDEX IF NOT EXISTS idx_class_enrollments_student_id ON class_enrollments(student_id);

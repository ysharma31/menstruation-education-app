/*
  # Course Materials, Student Profiles, and Material Access

  1. New Tables
    - `course_materials`
      - `id` (uuid, primary key)
      - `teacher_id` (uuid, references auth.users)
      - `title` (text, required)
      - `description` (text, optional)
      - `type` (text: pdf | image | video)
      - `url` (text, required)
      - `file_name` (text, optional — storage path)
      - `grade` (int, 4–12)
      - `created_at` (timestamptz)

    - `student_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text, required)
      - `school_name` (text, optional)
      - `grade` (int, 4–12)
      - `gender` (text: female | male | other | prefer_not_to_say)
      - `created_at` (timestamptz)

    - `material_access`
      - `id` (uuid, primary key)
      - `material_id` (uuid, references course_materials)
      - `student_id` (uuid, references auth.users)
      - `accessed_at` (timestamptz)
      - unique constraint on (material_id, student_id)

  2. Security
    - RLS enabled on all three tables
    - Teachers manage their own materials; students can view all materials
    - Students manage their own profile; teachers can view all student profiles
    - Students insert/view their own access records; teachers view access for their materials
*/

CREATE TABLE IF NOT EXISTS course_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('pdf', 'image', 'video')),
  url text NOT NULL,
  file_name text,
  grade int NOT NULL CHECK (grade >= 4 AND grade <= 12),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE course_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers manage materials"
  ON course_materials
  FOR ALL
  TO authenticated
  USING (auth.uid() = teacher_id)
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Students view materials"
  ON course_materials
  FOR SELECT
  USING (true);

-- Student profiles
CREATE TABLE IF NOT EXISTS student_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  school_name text,
  grade int CHECK (grade >= 4 AND grade <= 12),
  gender text CHECK (gender IN ('female', 'male', 'other', 'prefer_not_to_say')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students manage own profile"
  ON student_profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Teachers view student profiles"
  ON student_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'teacher'
    )
  );

-- Material access tracking
CREATE TABLE IF NOT EXISTS material_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id uuid REFERENCES course_materials(id) ON DELETE CASCADE NOT NULL,
  student_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  accessed_at timestamptz DEFAULT now(),
  UNIQUE(material_id, student_id)
);

ALTER TABLE material_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students insert own access"
  ON material_access
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students view own access"
  ON material_access
  FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Students upsert own access"
  ON material_access
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Teachers view material access"
  ON material_access
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM course_materials cm
      WHERE cm.id = material_access.material_id
      AND cm.teacher_id = auth.uid()
    )
  );

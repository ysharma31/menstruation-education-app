/*
  # Create Questions Table

  1. New Tables
    - `questions`
      - `id` (uuid, primary key) - Unique identifier
      - `question` (text) - The question text submitted by user
      - `category` (text) - Category: general, health, products, emotions, other
      - `age_group` (text) - Age group: under10, 10to12, 13to15, 16plus, parent
      - `created_at` (timestamptz) - When the question was submitted

  2. Security
    - Enable RLS on `questions` table
    - Add policy for anonymous users to insert questions (public submission)
    - No select policy for regular users (admin-only viewing)

  3. Notes
    - Questions are submitted anonymously
    - No personal information is collected
*/

CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  age_group text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit questions anonymously"
  ON questions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

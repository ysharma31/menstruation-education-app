/*
  # Create question AI feedback table

  1. New Tables
    - `question_feedback`
      - `id` (uuid, primary key)
      - `question_text` (text) - the question that was asked
      - `ai_answer` (text) - the AI-generated answer
      - `helpful` (boolean) - thumbs up = true, thumbs down = false
      - `user_id` (uuid, nullable) - linked to auth.users if logged in
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Authenticated users can insert their own feedback
    - Authenticated users can read their own feedback
*/

CREATE TABLE IF NOT EXISTS question_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text text NOT NULL,
  ai_answer text NOT NULL,
  helpful boolean NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE question_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can insert own feedback"
  ON question_feedback FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can read own feedback"
  ON question_feedback FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

/*
  # Create Admin Table

  1. New Tables
    - `admins`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique, not null)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `admins` table
    - Only authenticated users can check if they are admin (select own row)
    - Only admins can insert/update/delete (managed via service role or seeding)

  3. Notes
    - Admin check: query admins table for current user's id
    - Admin email yoshita.as.sharma@gmail.com will be seeded after auth signup
*/

CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read own record"
  ON admins FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

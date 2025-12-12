/*
  # Add Email Column to Questions Table

  1. Changes
    - Add `email` column (text, nullable) to `questions` table
    - Email is optional so users can still submit anonymously if preferred

  2. Notes
    - Existing questions will have NULL email values
    - Email allows for follow-up replies to submitted questions
*/

ALTER TABLE questions ADD COLUMN IF NOT EXISTS email text;

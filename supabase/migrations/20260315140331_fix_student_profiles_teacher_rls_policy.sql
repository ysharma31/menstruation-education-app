/*
  # Fix teacher RLS policy on student_profiles

  ## Problem
  The existing "Teachers view student profiles" policy queries auth.users directly,
  which is not accessible via the anon/authenticated role in client-side queries.
  This causes the query to return empty results for teachers.

  ## Fix
  Replace the auth.users subquery with auth.jwt() to check the teacher role
  from the JWT token directly, which is always accessible.
*/

DROP POLICY IF EXISTS "Teachers view student profiles" ON student_profiles;

CREATE POLICY "Teachers view student profiles"
  ON student_profiles
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'teacher'
  );

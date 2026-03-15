/*
  # Allow public video uploads

  ## Summary
  The video upload page is used by admins/educators to upload educational videos.
  The existing INSERT policy only allows authenticated users, but the upload page
  does not require login. This migration adds a policy to allow anonymous (public)
  uploads to the videos bucket so the upload page works without authentication.

  ## Changes
  - Add INSERT policy on storage.objects for public (anon) users on the 'videos' bucket
*/

DROP POLICY IF EXISTS "Public can upload videos" ON storage.objects;

CREATE POLICY "Public can upload videos"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'videos');

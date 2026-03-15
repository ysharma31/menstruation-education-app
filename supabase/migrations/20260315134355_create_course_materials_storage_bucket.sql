/*
  # Create course-materials Storage Bucket

  Creates the `course-materials` storage bucket for teacher-uploaded files
  (PDFs, images, documents, etc.) with appropriate public access and RLS policies.

  1. New Bucket
    - `course-materials` (public) — stores files uploaded by teachers

  2. Security
    - Authenticated users can upload to their own folder (user_id prefix)
    - Anyone can read/download files (public bucket)
    - Only the uploader can delete their own files
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('course-materials', 'course-materials', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload course materials"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'course-materials' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view course materials"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'course-materials');

CREATE POLICY "Users can delete their own course materials"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'course-materials' AND auth.uid()::text = (storage.foldername(name))[1]);

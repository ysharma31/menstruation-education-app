/*
  # Create Guides Storage Bucket

  1. Storage Setup
    - Creates a public storage bucket named 'guides'
    - Sets up policies for public read access
    - Configures bucket for PDF files with 20MB size limit
  
  2. Security
    - Public read access (anyone can view and download guides)
    - Authenticated users can upload guides
    - Guides are accessible via public URLs
    - Optimized for educational PDF content
*/

-- Create the guides bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'guides',
  'guides',
  true,
  20971520,
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist and recreate them
DO $$
BEGIN
  DROP POLICY IF EXISTS "Public can view guides" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload guides" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can update guides" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can delete guides" ON storage.objects;
END $$;

-- Allow public access to view guides
CREATE POLICY "Public can view guides"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'guides');

-- Allow authenticated users to upload guides
CREATE POLICY "Authenticated users can upload guides"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'guides');

-- Allow authenticated users to update guides
CREATE POLICY "Authenticated users can update guides"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'guides');

-- Allow authenticated users to delete guides
CREATE POLICY "Authenticated users can delete guides"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'guides');
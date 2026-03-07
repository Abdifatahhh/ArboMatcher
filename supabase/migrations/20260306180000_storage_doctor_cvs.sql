-- Bucket for doctor CV uploads (PDF of Word). Public read so opdrachtgevers can open cv_url.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'doctor-cvs',
  'doctor-cvs',
  true,
  10485760,
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- RLS: doctors can upload/update/delete their own files (path: user_id/filename)
DROP POLICY IF EXISTS "Doctors can upload own CV" ON storage.objects;
CREATE POLICY "Doctors can upload own CV"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'doctor-cvs'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Doctors can update own CV" ON storage.objects;
CREATE POLICY "Doctors can update own CV"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'doctor-cvs'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Doctors can delete own CV" ON storage.objects;
CREATE POLICY "Doctors can delete own CV"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'doctor-cvs'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Public read doctor CVs" ON storage.objects;
CREATE POLICY "Public read doctor CVs"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'doctor-cvs');

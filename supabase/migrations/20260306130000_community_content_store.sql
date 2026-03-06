-- Community content store: topics and articles as JSON per key.
-- Public read; only ADMIN can write.

CREATE TABLE IF NOT EXISTS content_store (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '[]',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE content_store ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read content_store"
  ON content_store FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert content_store"
  ON content_store FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN')
  );

CREATE POLICY "Admins can update content_store"
  ON content_store FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN')
  );

CREATE POLICY "Admins can delete content_store"
  ON content_store FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN')
  );

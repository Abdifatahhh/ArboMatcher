-- Job review and publication workflow
-- New status flow: draft | submitted | under_review | changes_requested | approved | published | rejected
-- Existing: DRAFT, PUBLISHED, CLOSED -> map to draft, published, closed (add closed for legacy)

ALTER TABLE jobs ADD COLUMN IF NOT EXISTS review_status text DEFAULT 'draft';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS submitted_at timestamptz;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS approved_at timestamptz;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES profiles(id);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS published_at timestamptz;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS published_by uuid REFERENCES profiles(id);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS rejected_at timestamptz;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS rejected_by uuid REFERENCES profiles(id);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS rejection_reason text;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS changes_requested_at timestamptz;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS changes_requested_by uuid REFERENCES profiles(id);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS changes_requested_reason text;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS review_notes text;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS structure_score integer;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS ai_score integer;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS overall_score integer;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS ai_status text;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS ai_feedback_summary text;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS ai_strengths jsonb DEFAULT '[]';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS ai_improvements jsonb DEFAULT '[]';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS ai_warnings jsonb DEFAULT '[]';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS ai_suggested_changes jsonb DEFAULT '[]';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS ai_last_reviewed_at timestamptz;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS target_profession text;

UPDATE jobs SET review_status = CASE
  WHEN status = 'DRAFT' THEN 'draft'
  WHEN status = 'PUBLISHED' THEN 'published'
  WHEN status = 'CLOSED' THEN 'closed'
  ELSE 'draft'
END WHERE review_status IS NULL;

ALTER TABLE jobs ALTER COLUMN review_status SET DEFAULT 'draft';

CREATE TABLE IF NOT EXISTS job_review_history (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  action text NOT NULL,
  old_status text,
  new_status text NOT NULL,
  note text,
  metadata jsonb DEFAULT '{}',
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_job_review_history_job_id ON job_review_history(job_id);
CREATE INDEX IF NOT EXISTS idx_job_review_history_created_at ON job_review_history(created_at DESC);

CREATE TABLE IF NOT EXISTS job_admin_notes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  note text NOT NULL,
  created_by uuid NOT NULL REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_job_admin_notes_job_id ON job_admin_notes(job_id);

ALTER TABLE job_review_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_admin_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "job_review_history_select_admin" ON job_review_history
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );
CREATE POLICY "job_review_history_insert_admin" ON job_review_history
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

CREATE POLICY "job_admin_notes_select_admin" ON job_admin_notes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );
CREATE POLICY "job_admin_notes_insert_admin" ON job_admin_notes
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );
CREATE POLICY "job_admin_notes_update_admin" ON job_admin_notes
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

COMMENT ON COLUMN jobs.review_status IS 'draft|submitted|under_review|changes_requested|approved|published|rejected|closed';

/*
  # Add Early Access (Soft Lock) fields to jobs table

  1. Changes
    - Add `published_at` column: timestamp when job was published
    - Add `early_access_until` column: timestamp until premium-only access (published_at + 48 hours)
    - Add `is_early_access_active` column: boolean flag for easy querying

  2. Notes
    - Early access period is 48 hours from publication
    - During early access, only premium professionals can respond
    - After 48 hours, all professionals can respond
    - Jobs remain visible to everyone (no SEO impact)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'jobs' AND column_name = 'published_at'
  ) THEN
    ALTER TABLE jobs ADD COLUMN published_at timestamptz DEFAULT now();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'jobs' AND column_name = 'early_access_until'
  ) THEN
    ALTER TABLE jobs ADD COLUMN early_access_until timestamptz DEFAULT (now() + interval '48 hours');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'jobs' AND column_name = 'is_early_access_active'
  ) THEN
    ALTER TABLE jobs ADD COLUMN is_early_access_active boolean DEFAULT true;
  END IF;
END $$;

UPDATE jobs
SET 
  published_at = COALESCE(published_at, created_at),
  early_access_until = COALESCE(early_access_until, created_at + interval '48 hours'),
  is_early_access_active = CASE 
    WHEN COALESCE(early_access_until, created_at + interval '48 hours') > now() THEN true 
    ELSE false 
  END
WHERE published_at IS NULL OR early_access_until IS NULL;

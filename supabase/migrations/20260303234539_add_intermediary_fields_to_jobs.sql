/*
  # Add intermediary support fields to jobs table

  1. Changes
    - Add `poster_type` column to indicate if job is posted by direct employer or intermediary
    - Add `on_behalf_of` column for intermediaries to specify the client organization
    - Add `contact_person` column for intermediary contact details
    - Add `is_anonymous` column to allow anonymous job postings

  2. Description
    This migration enables the platform to support both direct employers and 
    intermediaries (detachering/bemiddelingsbureaus) posting jobs. Intermediaries 
    can post jobs on behalf of their clients and optionally keep the client 
    organization anonymous.

  3. Security
    - No changes to RLS policies needed as these are additional columns on existing table
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'jobs' AND column_name = 'poster_type'
  ) THEN
    ALTER TABLE jobs ADD COLUMN poster_type text DEFAULT 'DIRECT' CHECK (poster_type IN ('DIRECT', 'INTERMEDIARY'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'jobs' AND column_name = 'on_behalf_of'
  ) THEN
    ALTER TABLE jobs ADD COLUMN on_behalf_of text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'jobs' AND column_name = 'contact_person'
  ) THEN
    ALTER TABLE jobs ADD COLUMN contact_person text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'jobs' AND column_name = 'is_anonymous'
  ) THEN
    ALTER TABLE jobs ADD COLUMN is_anonymous boolean DEFAULT false;
  END IF;
END $$;

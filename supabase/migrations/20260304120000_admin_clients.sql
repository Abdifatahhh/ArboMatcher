/*
  # Admin Opdrachtgevers: client_type on employers + RLS for admin
  
  - Adds client_type to employers (direct | intermediair | detacheerder).
  - Blocked status remains on profiles.status ('BLOCKED' = geblokkeerd).
  - Adds RLS policy so admins can UPDATE employers (for type/edits).
  - Indexes for admin filtering.
*/

-- Add client_type to employers (opdrachtgever type)
ALTER TABLE employers
  ADD COLUMN IF NOT EXISTS client_type text NOT NULL DEFAULT 'direct';

-- Constraint: only allowed values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'employers_client_type_check'
  ) THEN
    ALTER TABLE employers
      ADD CONSTRAINT employers_client_type_check
      CHECK (client_type IN ('direct', 'intermediair', 'detacheerder'));
  END IF;
END $$;

-- Backfill existing rows to explicit default (no-op if already set)
UPDATE employers SET client_type = 'direct' WHERE client_type IS NULL;

-- Indexes for admin list filtering
CREATE INDEX IF NOT EXISTS idx_employers_client_type ON employers(client_type);

-- profiles.status already exists; we use 'BLOCKED' for blocked. Index for admin filter.
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- RLS: Admins can update any employer (for client_type and other admin edits)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'employers' AND policyname = 'Admins can update any employer'
  ) THEN
    CREATE POLICY "Admins can update any employer"
      ON employers FOR UPDATE
      TO authenticated
      USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN')
      )
      WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN')
      );
  END IF;
END $$;

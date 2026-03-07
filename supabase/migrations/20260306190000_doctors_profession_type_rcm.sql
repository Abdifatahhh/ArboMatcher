-- Add profession_type and rcm_number; allow big_number to be null for Casemanager verzuim.
-- Table is still "doctors" here; migration 20260306190200 renames it to professionals.

ALTER TABLE doctors ADD COLUMN IF NOT EXISTS profession_type text;
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS rcm_number text;

ALTER TABLE doctors ALTER COLUMN big_number DROP NOT NULL;
COMMENT ON COLUMN doctors.profession_type IS 'BEDRIJFSARTS | ARBO_ARTS | VERZEKERINGSARTS | CASEMANAGER_VERZUIM';
COMMENT ON COLUMN doctors.rcm_number IS 'Optional RCM number for Casemanager verzuim.';

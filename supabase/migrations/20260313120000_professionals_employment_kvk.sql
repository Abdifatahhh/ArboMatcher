-- Professional: employment type (Freelance/ZZP vs Loondienst) en KvK-gegevens voor ZZP.
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS employment_type text;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS kvk text;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS company_name text;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS billing_address text;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS website text;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS sector text;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS vestigingsnummer text;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS kvk_type text;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS rechtsvorm text;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS statutaire_naam text;

COMMENT ON COLUMN professionals.employment_type IS 'FREELANCE_ZZP | LOONDIENST';
COMMENT ON COLUMN professionals.company_name IS 'ZZP: bedrijfsnaam uit KvK';
COMMENT ON COLUMN professionals.kvk IS 'ZZP: KvK-nummer (8 cijfers)';

-- Alleen de enumwaarde toevoegen (moet in eigen transactie gecommit worden voordat ORGANISATIE gebruikt kan worden).
DO $$ BEGIN ALTER TYPE user_role ADD VALUE 'ORGANISATIE'; EXCEPTION WHEN duplicate_object THEN NULL; END $$;

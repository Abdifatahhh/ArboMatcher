-- Draai dit in Supabase SQL Editor om te zien of de cleanup-migratie (deels) is gedraaid.
-- Alleen SELECT, verandert niets.

SELECT 'user_role_new type' AS wat, EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_new')::text AS result
UNION ALL
SELECT 'user_role type', EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role')::text
UNION ALL
SELECT 'profiles.role type', COALESCE((SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'role'), 'kolom niet gevonden')
UNION ALL
SELECT 'profiles.role default', COALESCE((SELECT column_default FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'role'), 'geen')::text
UNION ALL
SELECT 'employers.client_type kolom', EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'employers' AND column_name = 'client_type')::text;

SELECT enumlabel AS user_role_waarden
FROM pg_enum e
JOIN pg_type t ON e.enumtypid = t.oid
WHERE t.typname = 'user_role'
ORDER BY enumsortorder;

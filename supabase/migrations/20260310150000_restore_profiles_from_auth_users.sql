-- Herstel profielen voor Auth-gebruikers die nog in Authentication staan maar geen profiel meer hebben
-- (bijv. na verwijderen via Admin vóór inzetten Edge Function). Zo verschijnen ze weer in Admin en
-- kunnen ze opnieuw verwijderd worden (incl. uit Auth).
INSERT INTO public.profiles (
  id,
  email,
  role,
  full_name,
  first_name,
  last_name,
  avatar_url,
  phone,
  status,
  onboarding_completed,
  created_at,
  updated_at
)
SELECT
  u.id,
  COALESCE(u.email, ''),
  'professional'::user_role,
  COALESCE(
    NULLIF(TRIM(u.raw_user_meta_data->>'full_name'), ''),
    u.email
  ),
  NULLIF(TRIM(u.raw_user_meta_data->>'first_name'), ''),
  NULLIF(TRIM(u.raw_user_meta_data->>'last_name'), ''),
  u.raw_user_meta_data->>'avatar_url',
  u.raw_user_meta_data->>'phone',
  'ACTIVE',
  false,
  COALESCE(u.created_at, now()),
  now()
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id);

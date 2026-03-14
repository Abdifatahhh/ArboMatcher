-- ============================================================
-- Seed: test professional account
-- Voer dit uit in de Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Stap 1: Maak een test-gebruiker aan via Supabase Auth
-- Ga naar Authentication > Users > Add user:
--   Email: test-professional@arbomatcher.nl
--   Password: Test1234!
--   Auto Confirm: ✓ (aan)

-- Stap 2: Na het aanmaken, kopieer de user UUID en vul hieronder in:
-- (Vervang 'REPLACE_WITH_USER_ID' met de echte UUID)

DO $$
DECLARE
  v_user_id uuid := 'REPLACE_WITH_USER_ID';
BEGIN
  -- Profile aanmaken
  INSERT INTO profiles (id, email, role, full_name, first_name, last_name, status, onboarding_completed)
  VALUES (
    v_user_id,
    'test-professional@arbomatcher.nl',
    'PROFESSIONAL',
    'Test Professional',
    'Test',
    'Professional',
    'ACTIVE',
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    role = 'PROFESSIONAL',
    status = 'ACTIVE',
    onboarding_completed = true;

  -- Professional profiel aanmaken
  INSERT INTO professionals (user_id, profession, big_number, verification_status, bio, specialties, regions, hourly_rate, plan)
  VALUES (
    v_user_id,
    'bedrijfsarts',
    'BIG-12345678',
    'VERIFIED',
    'Ervaren bedrijfsarts met 10+ jaar ervaring in verzuimbegeleiding en re-integratie.',
    ARRAY['Verzuimbegeleiding', 'Re-integratie', 'Preventief medisch onderzoek'],
    ARRAY['Noord-Holland', 'Zuid-Holland', 'Utrecht'],
    125,
    'FREE'
  )
  ON CONFLICT (user_id) DO UPDATE SET
    verification_status = 'VERIFIED',
    plan = 'FREE';

  RAISE NOTICE 'Test professional aangemaakt voor user %', v_user_id;
END $$;

-- One-off cleanup: verwijder restanten van een gebruiker die al in Supabase Auth is verwijderd.
-- Gebruik: run in SQL Editor en vervang het e-mailadres indien nodig.
-- Zoekt profiel op e-mail, verwijdert conversations (geen FK), daarna profile (CASCADE doet de rest).

DO $$
DECLARE
  v_profile_id uuid;
  v_email text := 'abdifatah.mm@gmail.com';
BEGIN
  SELECT id INTO v_profile_id FROM public.profiles WHERE LOWER(TRIM(email)) = LOWER(TRIM(v_email)) LIMIT 1;

  IF v_profile_id IS NULL THEN
    RAISE NOTICE 'Geen profiel gevonden met e-mail %. Niets om op te ruimen.', v_email;
    RETURN;
  END IF;

  DELETE FROM public.conversations WHERE v_profile_id = ANY(participant_ids);
  DELETE FROM public.profiles WHERE id = v_profile_id;

  RAISE NOTICE 'Opgeruimd: profiel en gekoppelde data voor %', v_email;
END $$;

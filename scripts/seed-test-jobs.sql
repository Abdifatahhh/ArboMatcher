-- ============================================================
-- Seed: test employer + 12 arbo-opdrachten (PUBLISHED)
-- Voer uit in Supabase Dashboard > SQL Editor
-- ============================================================

DO $$
DECLARE
  v_user_id uuid;
  v_employer_id uuid;
BEGIN
  -- Gebruik je bestaande account
  SELECT id INTO v_user_id FROM profiles WHERE email = 'abdifatah.mm@gmail.com';

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Profiel niet gevonden voor abdifatah.mm@gmail.com';
  END IF;

  -- Maak employer-record (als die nog niet bestaat)
  INSERT INTO employers (user_id, company_name, kvk, sector)
  VALUES (v_user_id, 'ArboMatcher Test BV', '12345678', 'Arbodienstverlening')
  ON CONFLICT (user_id) DO UPDATE SET company_name = 'ArboMatcher Test BV'
  RETURNING id INTO v_employer_id;

  RAISE NOTICE 'Employer ID: %', v_employer_id;

  -- 12 arbo-opdrachten
  INSERT INTO jobs (employer_id, title, description, region, remote_type, job_type, job_tier, hours_per_week, rate_min, rate_max, status, company_name, views_count, applications_count, poster_type, is_anonymous, created_at, updated_at)
  VALUES
    (v_employer_id, 'Bedrijfsarts – Verzuimbegeleiding', 'Wij zoeken een ervaren bedrijfsarts voor structurele verzuimbegeleiding bij een grote zorginstelling. U voert spreekuren, begeleidt langdurig verzuim en adviseert het management over preventie en re-integratie.', 'Amsterdam', 'ON_SITE', 'FREELANCE', 'PRO', 32, 130, 160, 'PUBLISHED', 'ArboNed', 57, 6, 'DIRECT', false, NOW() - interval '2 hours', NOW()),

    (v_employer_id, 'Arbo-arts – Preventief Medisch Onderzoek', 'Voor een arbodienst zoeken wij een arbo-arts voor het uitvoeren van preventief medisch onderzoek (PMO). U voert keuringen uit, analyseert gezondheidsrisico''s en adviseert organisaties over arbeidsomstandigheden.', 'Utrecht', 'ON_SITE', 'FREELANCE', 'GRATIS', 24, 100, 130, 'PUBLISHED', 'Zorg & Zekerheid', 29, 1, 'DIRECT', false, NOW() - interval '3 hours', NOW()),

    (v_employer_id, 'Casemanager Verzuim', 'Als Casemanager Verzuim begeleidt u medewerkers bij hun re-integratie na ziekte. U coördineert het verzuimproces, onderhoudt contact met alle betrokken partijen en bewaakt de Wet verbetering poortwachter.', 'Rotterdam', 'HYBRID', 'PAYROLL', 'GRATIS', 36, 55, 75, 'PUBLISHED', 'Vitaal Werkt', 42, 3, 'BUREAU', false, NOW() - interval '5 hours', NOW()),

    (v_employer_id, 'Bedrijfsarts – Arbodienst', 'Arbodienst zoekt een bedrijfsarts voor een breed klantenportfolio. U bent verantwoordelijk voor verzuimspreekuren, werkplekbezoeken, sociaal-medisch teamoverleg en het beoordelen van arbeidsongeschiktheid.', 'Den Haag', 'ON_SITE', 'FREELANCE', 'PRO', 40, 140, 170, 'PUBLISHED', 'PRO opdracht', 88, 4, 'DIRECT', false, NOW() - interval '8 hours', NOW()),

    (v_employer_id, 'Verzekeringsarts – UWV', 'Het UWV zoekt een verzekeringsarts voor het beoordelen van arbeidsongeschiktheid en het uitvoeren van sociaal-medische beoordelingen in het kader van de WIA, WAO en Ziektewet.', 'Eindhoven', 'ON_SITE', 'LOONDIENST', 'PRO', 36, 110, 140, 'PUBLISHED', 'UWV Partner', 34, 2, 'DIRECT', false, NOW() - interval '1 day', NOW()),

    (v_employer_id, 'Preventiemedewerker – RI&E Specialist', 'Wij zoeken een preventiemedewerker gespecialiseerd in het opstellen en uitvoeren van risico-inventarisaties en -evaluaties (RI&E). U adviseert werkgevers over veilige arbeidsomstandigheden.', 'Groningen', 'HYBRID', 'FREELANCE', 'GRATIS', 24, 65, 90, 'PUBLISHED', 'Achmea Health', 16, 0, 'BUREAU', false, NOW() - interval '1 day 3 hours', NOW()),

    (v_employer_id, 'Bedrijfsarts – GGZ Instelling', 'Voor een grote GGZ-instelling zoeken wij een bedrijfsarts met affiniteit voor psychische problematiek. U begeleidt medewerkers bij psychisch verzuim en adviseert over werkhervatting.', 'Tilburg', 'ON_SITE', 'FREELANCE', 'PRO', 24, 135, 165, 'PUBLISHED', 'GGZ Eindhoven', 47, 2, 'DIRECT', false, NOW() - interval '1 day 5 hours', NOW()),

    (v_employer_id, 'Arbeidshygiënist', 'Als Arbeidshygiënist onderzoekt u blootstelling aan gevaarlijke stoffen op de werkplek. U voert metingen uit, beoordeelt risico''s en adviseert over beheersmaatregelen conform de Arbowet.', 'Amersfoort', 'ON_SITE', 'PAYROLL', 'GRATIS', 32, 70, 95, 'PUBLISHED', 'Onderwijsgroep', 21, 1, 'BUREAU', false, NOW() - interval '2 days', NOW()),

    (v_employer_id, 'Re-integratiecoach', 'Wij zoeken een re-integratiecoach die cliënten begeleidt bij terugkeer naar werk na langdurige ziekte. U stelt re-integratieplannen op, coacht medewerkers en onderhoudt contact met werkgevers en behandelaars.', 'Breda', 'HYBRID', 'FREELANCE', 'GRATIS', 20, 50, 70, 'PUBLISHED', 'Werk Actief', 11, 0, 'DIRECT', false, NOW() - interval '2 days 2 hours', NOW()),

    (v_employer_id, 'Bedrijfsarts – Onderwijs', 'Onderwijsinstelling zoekt een bedrijfsarts voor het begeleiden van onderwijspersoneel. U voert spreekuren, adviseert schoolbesturen en draagt bij aan een gezond werkklimaat.', NULL, 'REMOTE', 'FREELANCE', 'PRO', 16, 125, 155, 'PUBLISHED', 'PRO opdracht', 23, 2, 'DIRECT', false, NOW() - interval '2 days 4 hours', NOW()),

    (v_employer_id, 'Arbo-adviseur – MKB', 'Als Arbo-adviseur ondersteunt u MKB-organisaties bij het opzetten en onderhouden van arbobeleid. U voert werkplekinspecties uit, adviseert over RI&E en begeleidt bij verzuimreductie.', 'Zwolle', 'ON_SITE', 'FREELANCE', 'GRATIS', 32, 60, 85, 'PUBLISHED', 'Caparis', 17, 1, 'BUREAU', false, NOW() - interval '3 days', NOW()),

    (v_employer_id, 'Bedrijfsarts – Industrie & Logistiek', 'Voor de industriële sector zoeken wij een bedrijfsarts met ervaring in fysiek belastend werk. U beoordeelt belastbaarheid, begeleidt bij beroepsziekten en adviseert over ergonomische aanpassingen.', 'Schiedam', 'ON_SITE', 'LOONDIENST', 'PRO', 40, 130, 160, 'PUBLISHED', 'Shell Health', 38, 3, 'DIRECT', false, NOW() - interval '3 days 2 hours', NOW());

  RAISE NOTICE '12 arbo-opdrachten succesvol aangemaakt!';
END $$;

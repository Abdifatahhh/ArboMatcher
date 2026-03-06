-- Orphan check 1: conversations waar een participant_id niet (meer) in profiles staat
SELECT 'conversations_met_ontbrekende_participant' AS check_name, count(*)::int AS aantal
FROM conversations c
WHERE EXISTS (
  SELECT 1 FROM unnest(c.participant_ids) AS pid
  WHERE NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = pid)
);

-- Orphan check 2: profiles zonder auth user
SELECT 'profiles_zonder_auth_user' AS check_name, count(*)::int AS aantal
FROM profiles p
WHERE NOT EXISTS (SELECT 1 FROM auth.users u WHERE u.id = p.id);

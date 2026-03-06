-- Read-only orphan check: aantal conversations met ontbrekende participant, en profiles zonder auth user.
CREATE OR REPLACE FUNCTION public.admin_check_orphans()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_conversations_orphan int;
  v_profiles_orphan int;
BEGIN
  SELECT count(*)::int INTO v_conversations_orphan
  FROM conversations c
  WHERE EXISTS (
    SELECT 1 FROM unnest(c.participant_ids) AS pid
    WHERE NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = pid)
  );

  SELECT count(*)::int INTO v_profiles_orphan
  FROM profiles p
  WHERE NOT EXISTS (SELECT 1 FROM auth.users u WHERE u.id = p.id);

  RETURN jsonb_build_object(
    'conversations_met_ontbrekende_participant', v_conversations_orphan,
    'profiles_zonder_auth_user', v_profiles_orphan,
    'ok', true
  );
END;
$$;

REVOKE ALL ON FUNCTION public.admin_check_orphans() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_check_orphans() TO service_role;
GRANT EXECUTE ON FUNCTION public.admin_check_orphans() TO postgres;

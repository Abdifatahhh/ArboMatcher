/*
  # Delete user data via RPC (zonder Edge Function)
  - Aanroepbaar door authenticated users; functie controleert zelf of caller ADMIN is.
  - Verwijdert alle applicatiedata (conversations + profile + CASCADE).
  - Auth user wordt NIET verwijderd (kan handmatig in Dashboard → Authentication → Users).
*/

CREATE OR REPLACE FUNCTION public.admin_delete_user_by_admin(p_target_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
  v_caller_role text;
  v_conversations_deleted int;
  v_messages_in_conversations int;
  v_profile_exists boolean;
  v_result jsonb;
BEGIN
  IF p_target_user_id IS NULL THEN
    RAISE EXCEPTION 'target_user_id is verplicht.' USING errcode = 'P0001';
  END IF;

  SELECT role INTO v_caller_role FROM public.profiles WHERE id = auth.uid();
  IF v_caller_role IS NULL OR v_caller_role != 'ADMIN' THEN
    RAISE EXCEPTION 'Alleen beheerders kunnen gebruikers verwijderen.' USING errcode = 'P0003';
  END IF;

  IF p_target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Je kunt je eigen account niet verwijderen.' USING errcode = 'P0004';
  END IF;

  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_target_user_id) INTO v_profile_exists;
  IF NOT v_profile_exists THEN
    RAISE EXCEPTION 'Profiel met id % bestaat niet.', p_target_user_id USING errcode = 'P0002';
  END IF;

  SELECT count(*)::int INTO v_messages_in_conversations
  FROM public.messages m
  WHERE m.conversation_id IN (
    SELECT id FROM public.conversations WHERE p_target_user_id = ANY(participant_ids)
  );

  WITH deleted AS (
    DELETE FROM public.conversations
    WHERE p_target_user_id = ANY(participant_ids)
    RETURNING id
  )
  SELECT count(*)::int INTO v_conversations_deleted FROM deleted;

  DELETE FROM public.profiles WHERE id = p_target_user_id;

  v_result := jsonb_build_object(
    'ok', true,
    'target_user_id', p_target_user_id,
    'conversations_deleted', v_conversations_deleted,
    'messages_in_deleted_conversations', v_messages_in_conversations
  );
  RETURN v_result;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'admin_delete_user_by_admin: % (code %)', SQLERRM, SQLSTATE USING errcode = SQLSTATE;
END;
$$;

COMMENT ON FUNCTION public.admin_delete_user_by_admin(uuid) IS
  'Verwijdert alle applicatiedata van een gebruiker. Alleen aanroepen als ADMIN. Auth user niet verwijderd (handmatig in Dashboard indien gewenst).';

REVOKE ALL ON FUNCTION public.admin_delete_user_by_admin(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_delete_user_by_admin(uuid) TO authenticated;

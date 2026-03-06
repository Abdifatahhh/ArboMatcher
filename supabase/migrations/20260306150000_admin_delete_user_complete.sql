/*
  # Centrale verwijdering van gebruiker en alle gekoppelde data

  - search_path expliciet (public, pg_catalog) tegen search_path-hijacking.
  - SECURITY DEFINER: alleen vaste schema-objecten, geen dynamische objectnamen.
  - Verwijdert eerst conversations waar de gebruiker in participant_ids zit; daarna profile (CASCADE).
  - Auth user wordt door de Edge Function verwijderd (alleen na ok=true van deze RPC).
*/

CREATE OR REPLACE FUNCTION public.admin_delete_user_data(p_target_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
  v_conversations_deleted int;
  v_messages_in_conversations int;
  v_profile_exists boolean;
  v_result jsonb;
BEGIN
  IF p_target_user_id IS NULL THEN
    RAISE EXCEPTION 'admin_delete_user_data: target_user_id is verplicht.'
      USING errcode = 'P0001';
  END IF;

  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_target_user_id) INTO v_profile_exists;
  IF NOT v_profile_exists THEN
    RAISE EXCEPTION 'admin_delete_user_data: profiel met id % bestaat niet.', p_target_user_id
      USING errcode = 'P0002';
  END IF;

  -- Aantal messages in conversations die we gaan verwijderen (voor logging)
  SELECT count(*)::int INTO v_messages_in_conversations
  FROM public.messages m
  WHERE m.conversation_id IN (
    SELECT id FROM public.conversations WHERE p_target_user_id = ANY(participant_ids)
  );

  -- 1. Verwijder conversations waar deze gebruiker in participant_ids zit (geen FK)
  --    CASCADE verwijdert de messages in die conversations
  WITH deleted AS (
    DELETE FROM public.conversations
    WHERE p_target_user_id = ANY(participant_ids)
    RETURNING id
  )
  SELECT count(*)::int INTO v_conversations_deleted FROM deleted;

  -- 2. Verwijder profile; CASCADE: employers, doctors, jobs, applications, invites,
  --    favorites, subscriptions, invoices, admin_delete_codes, messages (sender_id)
  DELETE FROM public.profiles WHERE id = p_target_user_id;

  v_result := jsonb_build_object(
    'ok', true,
    'target_user_id', p_target_user_id,
    'conversations_deleted', v_conversations_deleted,
    'messages_in_deleted_conversations', v_messages_in_conversations,
    'message', 'Profiel en alle gekoppelde data verwijderd. Auth user moet apart via Admin API worden verwijderd.'
  );
  RETURN v_result;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'admin_delete_user_data: % (code %)', SQLERRM, SQLSTATE
      USING errcode = SQLSTATE;
END;
$$;

COMMENT ON FUNCTION public.admin_delete_user_data(uuid) IS
  'Verwijdert applicatiedata van een gebruiker (conversations + profile + CASCADE). SECURITY DEFINER, veilig: vaste search_path, alleen service_role/postgres. Daarna auth.admin.deleteUser aanroepen.';

REVOKE ALL ON FUNCTION public.admin_delete_user_data(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.admin_delete_user_data(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.admin_delete_user_data(uuid) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_user_data(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.admin_delete_user_data(uuid) TO postgres;

-- Allow service role to read/delete codes (Edge Function uses it)
GRANT SELECT, DELETE ON public.admin_delete_codes TO service_role;

-- Extend code validity to 5 minutes
CREATE OR REPLACE FUNCTION public.admin_request_user_deletion(target_user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_role text;
  new_code text;
BEGIN
  SELECT role INTO admin_role FROM profiles WHERE id = auth.uid();
  IF admin_role IS NULL OR admin_role != 'ADMIN' THEN
    RAISE EXCEPTION 'Alleen beheerders kunnen deze actie uitvoeren.';
  END IF;
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Je kunt je eigen account niet verwijderen.';
  END IF;
  new_code := gen_random_uuid()::text;
  INSERT INTO admin_delete_codes (code, target_user_id, admin_id, expires_at)
  VALUES (new_code, target_user_id, auth.uid(), now() + interval '5 minutes');
  RETURN new_code;
END;
$$;

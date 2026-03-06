-- One-time codes for admin user deletion (avoids JWT verification in Edge Function)
CREATE TABLE IF NOT EXISTS public.admin_delete_codes (
  code text PRIMARY KEY,
  target_user_id uuid NOT NULL,
  admin_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL
);

REVOKE ALL ON public.admin_delete_codes FROM anon, authenticated;

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
  VALUES (new_code, target_user_id, auth.uid(), now() + interval '2 minutes');
  RETURN new_code;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_request_user_deletion(uuid) TO authenticated;

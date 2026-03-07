-- RPC: check if email is still available for registration (no existing profile).
-- Returns true if available, false if already in use. Callable by anon for register page.

CREATE OR REPLACE FUNCTION public.check_email_available(check_email text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE LOWER(TRIM(email)) = LOWER(TRIM(check_email))
  );
$$;

GRANT EXECUTE ON FUNCTION public.check_email_available(text) TO anon;
GRANT EXECUTE ON FUNCTION public.check_email_available(text) TO authenticated;

COMMENT ON FUNCTION public.check_email_available(text) IS 'Returns true if no profile exists with this email (for register validation).';

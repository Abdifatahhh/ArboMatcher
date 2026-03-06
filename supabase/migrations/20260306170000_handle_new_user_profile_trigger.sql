-- Create profile on signup so RLS does not block (no session yet when email confirmation is on).
-- Role is read from raw_user_meta_data; frontend passes options: { data: { role: 'ARTS' } }.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role user_role;
BEGIN
  v_role := CASE
    WHEN NEW.raw_user_meta_data->>'role' IN ('ARTS', 'OPDRACHTGEVER', 'ADMIN')
    THEN (NEW.raw_user_meta_data->>'role')::user_role
    ELSE 'OPDRACHTGEVER'::user_role
  END;

  INSERT INTO public.profiles (id, email, role, full_name, avatar_url, phone, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    v_role,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'phone',
    'ACTIVE'
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

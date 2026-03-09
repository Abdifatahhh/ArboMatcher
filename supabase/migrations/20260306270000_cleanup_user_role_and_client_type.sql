-- 1. user_role enum: remove company en intermediary (nieuwe enum, migreren, oude droppen).
-- 2. employers.client_type kolom verwijderen.

CREATE TYPE user_role_new AS ENUM ('OPDRACHTGEVER', 'ADMIN', 'professional', 'onboarding');

UPDATE profiles SET role = 'onboarding'::user_role WHERE role::text IN ('company', 'intermediary');
UPDATE profiles SET role = 'professional'::user_role WHERE role::text = 'ARTS';

DROP POLICY IF EXISTS "Authenticated users can view doctors" ON professionals;
DROP POLICY IF EXISTS "Admins can update doctor verification" ON professionals;
DROP POLICY IF EXISTS "Anyone can view published jobs" ON jobs;
DROP POLICY IF EXISTS "Admins can update any job" ON jobs;
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Admins can manage all subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can view own invoices" ON invoices;
DROP POLICY IF EXISTS "Admins can update any employer" ON employers;
DROP POLICY IF EXISTS "Admins can insert content_store" ON content_store;
DROP POLICY IF EXISTS "Admins can update content_store" ON content_store;
DROP POLICY IF EXISTS "Admins can delete content_store" ON content_store;

ALTER TABLE profiles ALTER COLUMN role DROP DEFAULT;

ALTER TABLE profiles
  ALTER COLUMN role TYPE user_role_new
  USING (role::text::user_role_new);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_role text;
  v_first text;
  v_last text;
  v_full text;
  v_role_enum user_role_new;
BEGIN
  v_role := NULLIF(TRIM(NEW.raw_user_meta_data->>'role'), '');
  v_first := NULLIF(TRIM(NEW.raw_user_meta_data->>'first_name'), '');
  v_last := NULLIF(TRIM(NEW.raw_user_meta_data->>'last_name'), '');
  v_full := NULLIF(TRIM(COALESCE(v_first, '') || ' ' || COALESCE(v_last, '')), '');

  v_role_enum := CASE
    WHEN v_role IN ('professional', 'ARTS') THEN 'professional'::user_role_new
    WHEN v_role = 'ADMIN' THEN 'ADMIN'::user_role_new
    WHEN v_role IN ('OPDRACHTGEVER', 'company', 'intermediary') THEN 'onboarding'::user_role_new
    ELSE 'onboarding'::user_role_new
  END;

  INSERT INTO public.profiles (
    id, email, role, full_name, first_name, last_name, avatar_url, phone, status, onboarding_completed
  ) VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    v_role_enum,
    COALESCE(v_full, NEW.raw_user_meta_data->>'full_name'),
    v_first,
    v_last,
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'phone',
    'ACTIVE',
    false
  );

  IF v_role_enum = 'professional' THEN
    BEGIN
      INSERT INTO public.professionals (user_id, verification_status, doctor_plan, specialties, regions)
      VALUES (NEW.id, 'UNVERIFIED'::verification_status, 'GRATIS', '{}', '{}');
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
  END IF;

  RETURN NEW;
EXCEPTION WHEN unique_violation THEN RETURN NEW;
END;
$$;

DROP TYPE user_role;

ALTER TYPE user_role_new RENAME TO user_role;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_role text;
  v_first text;
  v_last text;
  v_full text;
  v_role_enum user_role;
BEGIN
  v_role := NULLIF(TRIM(NEW.raw_user_meta_data->>'role'), '');
  v_first := NULLIF(TRIM(NEW.raw_user_meta_data->>'first_name'), '');
  v_last := NULLIF(TRIM(NEW.raw_user_meta_data->>'last_name'), '');
  v_full := NULLIF(TRIM(COALESCE(v_first, '') || ' ' || COALESCE(v_last, '')), '');

  v_role_enum := CASE
    WHEN v_role IN ('professional', 'ARTS') THEN 'professional'::user_role
    WHEN v_role = 'ADMIN' THEN 'ADMIN'::user_role
    WHEN v_role IN ('OPDRACHTGEVER', 'company', 'intermediary') THEN 'onboarding'::user_role
    ELSE 'onboarding'::user_role
  END;

  INSERT INTO public.profiles (
    id, email, role, full_name, first_name, last_name, avatar_url, phone, status, onboarding_completed
  ) VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    v_role_enum,
    COALESCE(v_full, NEW.raw_user_meta_data->>'full_name'),
    v_first,
    v_last,
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'phone',
    'ACTIVE',
    false
  );

  IF v_role_enum = 'professional' THEN
    BEGIN
      INSERT INTO public.professionals (user_id, verification_status, doctor_plan, specialties, regions)
      VALUES (NEW.id, 'UNVERIFIED'::verification_status, 'GRATIS', '{}', '{}');
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
  END IF;

  RETURN NEW;
EXCEPTION WHEN unique_violation THEN RETURN NEW;
END;
$$;

CREATE POLICY "Authenticated users can view doctors"
  ON professionals FOR SELECT
  TO authenticated
  USING (verification_status = 'VERIFIED' OR user_id = auth.uid() OR
         EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'));

CREATE POLICY "Admins can update doctor verification"
  ON professionals FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'));

CREATE POLICY "Anyone can view published jobs"
  ON jobs FOR SELECT
  TO authenticated
  USING (status = 'PUBLISHED' OR
         employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid()) OR
         EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'));

CREATE POLICY "Admins can update any job"
  ON jobs FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'));

CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR
         EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'));

CREATE POLICY "Admins can manage all subscriptions"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'));

CREATE POLICY "Users can view own invoices"
  ON invoices FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR
         EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'));

CREATE POLICY "Admins can update any employer"
  ON employers FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'));

CREATE POLICY "Admins can insert content_store"
  ON content_store FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'));

CREATE POLICY "Admins can update content_store"
  ON content_store FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'));

CREATE POLICY "Admins can delete content_store"
  ON content_store FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'));

ALTER TABLE employers DROP CONSTRAINT IF EXISTS employers_client_type_check;
DROP INDEX IF EXISTS idx_employers_client_type;
ALTER TABLE employers DROP COLUMN IF EXISTS client_type;

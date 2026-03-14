-- FIX: handle_new_user trigger voor productie
-- Draai dit in Supabase SQL Editor

-- 1. Voeg ORGANISATIE toe aan enum (als die nog niet bestaat)
DO $$ BEGIN ALTER TYPE user_role ADD VALUE 'ORGANISATIE'; EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. Migreer bestaande OPDRACHTGEVER → ORGANISATIE
UPDATE profiles SET role = 'ORGANISATIE'::user_role WHERE role::text = 'OPDRACHTGEVER';

-- 3. Fix de handle_new_user functie
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_role text;
  v_first text;
  v_last text;
  v_full text;
  v_role_enum user_role;
  v_has_plan_col boolean;
BEGIN
  v_role := NULLIF(TRIM(NEW.raw_user_meta_data->>'role'), '');
  v_first := NULLIF(TRIM(NEW.raw_user_meta_data->>'first_name'), '');
  v_last := NULLIF(TRIM(NEW.raw_user_meta_data->>'last_name'), '');
  v_full := NULLIF(TRIM(COALESCE(v_first, '') || ' ' || COALESCE(v_last, '')), '');

  v_role_enum := CASE
    WHEN v_role IN ('professional', 'ARTS') THEN 'professional'::user_role
    WHEN v_role = 'ADMIN' THEN 'ADMIN'::user_role
    WHEN v_role IN ('ORGANISATIE', 'organisatie', 'OPDRACHTGEVER', 'opdrachtgever', 'company', 'intermediary') THEN 'onboarding'::user_role
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
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'professionals' AND column_name = 'plan'
      ) INTO v_has_plan_col;

      IF v_has_plan_col THEN
        INSERT INTO public.professionals (user_id, verification_status, plan, specialties, regions)
        VALUES (NEW.id, 'UNVERIFIED'::verification_status, 'GRATIS', '{}', '{}');
      ELSE
        INSERT INTO public.professionals (user_id, verification_status, doctor_plan, specialties, regions)
        VALUES (NEW.id, 'UNVERIFIED'::verification_status, 'GRATIS', '{}', '{}');
      END IF;
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
  END IF;

  RETURN NEW;
EXCEPTION WHEN unique_violation THEN RETURN NEW;
END;
$$;

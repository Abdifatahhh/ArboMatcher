-- Onboarding terug naar 2 keuzes: Professional en Opdrachtgever. Verwijder organisaties (bedrijf/intermediair).

DROP TRIGGER IF EXISTS trg_organizations_prevent_kvk_change ON organizations;
DROP TABLE IF EXISTS organizations;
DROP FUNCTION IF EXISTS prevent_kvk_change();

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
    WHEN v_role = 'professional' THEN 'professional'::user_role
    WHEN v_role IN ('ARTS', 'ADMIN') THEN v_role::user_role
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

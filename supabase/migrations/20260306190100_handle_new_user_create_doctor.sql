-- When role=ARTS, also create doctors row from signup meta (profession_type, big_number, rcm_number).

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role user_role;
  v_big text;
  v_profession text;
  v_rcm text;
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

  IF v_role = 'ARTS' THEN
    BEGIN
      v_profession := NULLIF(TRIM(NEW.raw_user_meta_data->>'profession_type'), '');
      v_big := NULLIF(TRIM(NEW.raw_user_meta_data->>'big_number'), '');
      v_rcm := NULLIF(TRIM(NEW.raw_user_meta_data->>'rcm_number'), '');
      INSERT INTO public.doctors (
        user_id,
        big_number,
        profession_type,
        rcm_number,
        verification_status,
        doctor_plan,
        specialties,
        regions
      ) VALUES (
        NEW.id,
        v_big,
        v_profession,
        v_rcm,
        CASE WHEN v_big IS NOT NULL AND length(v_big) >= 8 THEN 'PENDING'::verification_status ELSE 'UNVERIFIED'::verification_status END,
        'BASIC',
        '{}',
        '{}'
      );
    EXCEPTION
      WHEN OTHERS THEN
        NULL;
    END;
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    RETURN NEW;
END;
$$;

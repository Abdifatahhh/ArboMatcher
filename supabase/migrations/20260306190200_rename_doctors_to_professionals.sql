-- Rename table doctors to professionals. FK columns (doctor_id) stay for compatibility.

ALTER TABLE doctors RENAME TO professionals;

ALTER INDEX IF EXISTS idx_doctors_user_id RENAME TO idx_professionals_user_id;
ALTER INDEX IF EXISTS idx_doctors_verification_status RENAME TO idx_professionals_verification_status;

COMMENT ON TABLE professionals IS 'Professional (arts) profiles: Bedrijfsarts, Arbo-arts, Verzekeringsarts, Casemanager verzuim.';
COMMENT ON COLUMN professionals.doctor_plan IS 'Plan: BASIC (default) or PRO.';

CREATE OR REPLACE FUNCTION check_application_48h_rule()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_job_tier text;
  v_job_created_at timestamptz;
  v_doctor_plan text;
  v_cutoff timestamptz;
BEGIN
  SELECT j.job_tier, j.created_at INTO v_job_tier, v_job_created_at FROM jobs j WHERE j.id = NEW.job_id;
  IF v_job_tier IS NULL THEN v_job_tier := 'STANDARD'; END IF;
  IF v_job_tier != 'PRO' THEN RETURN NEW; END IF;
  v_cutoff := now() - interval '48 hours';
  IF v_job_created_at >= v_cutoff THEN
    SELECT p.doctor_plan INTO v_doctor_plan FROM professionals p WHERE p.id = NEW.doctor_id;
    IF v_doctor_plan IS NULL THEN v_doctor_plan := 'BASIC'; END IF;
    IF v_doctor_plan != 'PRO' THEN
      RAISE EXCEPTION 'PRO_48H_RULE: Alleen PRO-artsen kunnen binnen 48 uur na plaatsing op PRO-opdrachten reageren.'
        USING errcode = 'P0001';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

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
      INSERT INTO public.professionals (
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

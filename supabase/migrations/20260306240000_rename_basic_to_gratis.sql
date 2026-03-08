-- Rename plan BASIC → GRATIS (free tier label: "Gratis kennismaken").

ALTER TABLE professionals DROP CONSTRAINT IF EXISTS doctors_doctor_plan_check;
ALTER TABLE professionals DROP CONSTRAINT IF EXISTS professionals_doctor_plan_check;
UPDATE professionals SET doctor_plan = 'GRATIS' WHERE doctor_plan = 'BASIC';
ALTER TABLE professionals ADD CONSTRAINT professionals_doctor_plan_check
  CHECK (doctor_plan IN ('GRATIS', 'PRO'));
ALTER TABLE professionals ALTER COLUMN doctor_plan SET DEFAULT 'GRATIS';
COMMENT ON COLUMN professionals.doctor_plan IS 'Plan: GRATIS (default, free) or PRO.';

ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_plan_check;
UPDATE subscriptions SET plan = 'GRATIS' WHERE plan = 'BASIC';
ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_plan_check
  CHECK (plan IN ('GRATIS', 'PRO'));

CREATE OR REPLACE FUNCTION check_application_48h_rule()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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
    IF v_doctor_plan IS NULL THEN v_doctor_plan := 'GRATIS'; END IF;
    IF v_doctor_plan != 'PRO' THEN
      RAISE EXCEPTION 'PRO_48H_RULE: Alleen PRO-artsen kunnen binnen 48 uur na plaatsing op PRO-opdrachten reageren.'
        USING errcode = 'P0001';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

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
    WHEN v_role IN ('professional', 'company', 'intermediary') THEN v_role::user_role
    WHEN v_role IN ('ARTS', 'ADMIN') THEN v_role::user_role
    WHEN v_role = 'OPDRACHTGEVER' THEN 'onboarding'::user_role
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

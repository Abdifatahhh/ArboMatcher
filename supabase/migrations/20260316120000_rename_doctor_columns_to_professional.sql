-- Rename remaining "doctor_" columns to "professional_" / "plan" for consistency.
-- The table was already renamed from "doctors" to "professionals" in 20260306190200.
-- This migration renames the FK columns and the plan column.

-- 1. professionals.doctor_plan → professionals.plan
ALTER TABLE professionals RENAME COLUMN doctor_plan TO plan;

-- 2. applications.doctor_id → applications.professional_id
ALTER TABLE applications RENAME COLUMN doctor_id TO professional_id;

-- 3. invites.doctor_id → invites.professional_id
ALTER TABLE invites RENAME COLUMN doctor_id TO professional_id;

-- 4. reviews.doctor_id → reviews.professional_id (if table exists)
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reviews' AND column_name = 'doctor_id'
  ) THEN
    ALTER TABLE reviews RENAME COLUMN doctor_id TO professional_id;
  END IF;
END $$;

-- 5. Update indexes that reference the old column names
ALTER INDEX IF EXISTS idx_applications_doctor_id RENAME TO idx_applications_professional_id;
ALTER INDEX IF EXISTS idx_invites_doctor_id RENAME TO idx_invites_professional_id;

-- 6. Update comments
COMMENT ON COLUMN professionals.plan IS 'Subscription plan: GRATIS (default) or PRO.';

-- 7. Recreate the 48h rule trigger function with new column names
CREATE OR REPLACE FUNCTION check_application_48h_rule()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_job_tier text;
  v_job_created_at timestamptz;
  v_plan text;
  v_cutoff timestamptz;
BEGIN
  SELECT j.job_tier, j.created_at INTO v_job_tier, v_job_created_at FROM jobs j WHERE j.id = NEW.job_id;
  IF v_job_tier IS NULL THEN v_job_tier := 'STANDARD'; END IF;
  IF v_job_tier != 'PRO' THEN RETURN NEW; END IF;
  v_cutoff := now() - interval '48 hours';
  IF v_job_created_at >= v_cutoff THEN
    SELECT p.plan INTO v_plan FROM professionals p WHERE p.id = NEW.professional_id;
    IF v_plan IS NULL THEN v_plan := 'GRATIS'; END IF;
    IF v_plan != 'PRO' THEN
      RAISE EXCEPTION 'PRO_48H_RULE: Alleen PRO-professionals kunnen binnen 48 uur na plaatsing op PRO-opdrachten reageren.'
        USING errcode = 'P0001';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- 8. Recreate handle_new_user with new column name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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
        user_id, big_number, profession_type, rcm_number,
        verification_status, plan, specialties, regions
      ) VALUES (
        NEW.id, v_big, v_profession, v_rcm,
        CASE WHEN v_big IS NOT NULL AND length(v_big) >= 8
          THEN 'PENDING'::verification_status
          ELSE 'UNVERIFIED'::verification_status
        END,
        'GRATIS', '{}', '{}'
      );
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN RETURN NEW;
END;
$$;

-- 9. Update RLS policies that reference old column names (if any)
-- These are safe no-ops if policies don't exist
DO $$ BEGIN
  -- Applications: update any policy referencing doctor_id
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'applications'
    AND qual::text LIKE '%doctor_id%'
  ) THEN
    RAISE NOTICE 'Manual check needed: RLS policies on applications still reference doctor_id';
  END IF;
END $$;

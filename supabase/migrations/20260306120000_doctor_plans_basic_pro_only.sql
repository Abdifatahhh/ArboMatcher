/*
  # Doctor subscription refactor: BASIC and PRO only
  
  ## Summary
  1. Doctor plan: only BASIC and PRO. Add doctor_plan to doctors, default BASIC.
  2. Job tier: add job_tier (PRO | STANDARD) for 48-hour rule; migrate from is_pro.
  3. Subscriptions: restrict plan to BASIC | PRO (doctor plans only; employer logic later).
  4. 48-hour rule: PRO jobs < 48h old → only PRO doctors can apply; enforced by trigger.
  5. Safe for existing data: backfill and defaults.
*/

-- =============================================================================
-- 1. DOCTORS: add doctor_plan (BASIC | PRO), default BASIC
-- =============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'doctors' AND column_name = 'doctor_plan'
  ) THEN
    ALTER TABLE doctors ADD COLUMN doctor_plan text DEFAULT 'BASIC';
  END IF;
END $$;

-- Constrain allowed values
ALTER TABLE doctors DROP CONSTRAINT IF EXISTS doctors_doctor_plan_check;
ALTER TABLE doctors ADD CONSTRAINT doctors_doctor_plan_check
  CHECK (doctor_plan IN ('BASIC', 'PRO'));

-- Backfill: existing doctors without doctor_plan or with old subscription_type/premium_status
UPDATE doctors
SET doctor_plan = CASE
  WHEN doctor_plan IS NOT NULL AND doctor_plan IN ('BASIC', 'PRO') THEN doctor_plan
  WHEN premium_status = true THEN 'PRO'
  ELSE 'BASIC'
END
WHERE doctor_plan IS NULL OR doctor_plan NOT IN ('BASIC', 'PRO');

UPDATE doctors SET doctor_plan = 'BASIC' WHERE doctor_plan IS NULL;

ALTER TABLE doctors ALTER COLUMN doctor_plan SET DEFAULT 'BASIC';
ALTER TABLE doctors ALTER COLUMN doctor_plan SET NOT NULL;

-- Optional: keep subscription_type/premium_status for backward compat but stop using for plan logic
-- (no drop in this migration so existing code keeps working until we remove references)

-- =============================================================================
-- 2. JOBS: add job_tier (PRO | STANDARD), migrate from is_pro
-- =============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'jobs' AND column_name = 'job_tier'
  ) THEN
    ALTER TABLE jobs ADD COLUMN job_tier text DEFAULT 'STANDARD';
  END IF;
END $$;

ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_job_tier_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_job_tier_check
  CHECK (job_tier IN ('PRO', 'STANDARD'));

-- Migrate from is_pro
UPDATE jobs SET job_tier = CASE WHEN is_pro = true THEN 'PRO' ELSE 'STANDARD' END
WHERE job_tier IS NULL OR job_tier NOT IN ('PRO', 'STANDARD');

UPDATE jobs SET job_tier = 'STANDARD' WHERE job_tier IS NULL;

ALTER TABLE jobs ALTER COLUMN job_tier SET DEFAULT 'STANDARD';
ALTER TABLE jobs ALTER COLUMN job_tier SET NOT NULL;

-- =============================================================================
-- 3. SUBSCRIPTIONS: restrict plan to BASIC | PRO (doctor plans)
-- =============================================================================
-- Update existing rows: map old plans to BASIC or PRO
UPDATE subscriptions
SET plan = CASE
  WHEN plan IN ('BASIC', 'PRO') THEN plan
  WHEN plan IN ('PREMIUM_DOCTOR', 'ENTERPRISE') THEN 'PRO'
  ELSE 'BASIC'
END
WHERE plan IS NOT NULL AND plan NOT IN ('BASIC', 'PRO');

UPDATE subscriptions SET plan = 'BASIC' WHERE plan IS NULL;

-- Add check constraint (drop if exists from previous run)
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_plan_check;
ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_plan_check
  CHECK (plan IN ('BASIC', 'PRO'));

-- =============================================================================
-- 4. 48-HOUR RULE: trigger on applications (block BASIC doctors on PRO jobs < 48h)
-- =============================================================================
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
  SELECT j.job_tier, j.created_at
  INTO v_job_tier, v_job_created_at
  FROM jobs j
  WHERE j.id = NEW.job_id;

  IF v_job_tier IS NULL THEN
    v_job_tier := 'STANDARD';
  END IF;

  IF v_job_tier != 'PRO' THEN
    RETURN NEW;
  END IF;

  v_cutoff := now() - interval '48 hours';
  IF v_job_created_at >= v_cutoff THEN
    SELECT d.doctor_plan INTO v_doctor_plan
    FROM doctors d
    WHERE d.id = NEW.doctor_id;

    IF v_doctor_plan IS NULL THEN
      v_doctor_plan := 'BASIC';
    END IF;

    IF v_doctor_plan != 'PRO' THEN
      RAISE EXCEPTION 'PRO_48H_RULE: Alleen PRO-artsen kunnen binnen 48 uur na plaatsing op PRO-opdrachten reageren. Na 48 uur wordt de opdracht standaard en kunt u reageren.'
        USING errcode = 'P0001';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_check_application_48h ON applications;
CREATE TRIGGER trigger_check_application_48h
  BEFORE INSERT ON applications
  FOR EACH ROW
  EXECUTE FUNCTION check_application_48h_rule();

-- =============================================================================
-- 5. Ensure doctors table has NOT NULL doctor_plan for new inserts (already set above)
-- =============================================================================
-- Done in section 1.

-- =============================================================================
-- 6. Index for 48h rule (optional; trigger already uses job_id and doctor_id)
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_jobs_job_tier_created_at ON jobs(job_tier, created_at);

COMMENT ON COLUMN doctors.doctor_plan IS 'Doctor plan: BASIC (default, free) or PRO. New doctors get BASIC.';
COMMENT ON COLUMN jobs.job_tier IS 'Job tier: PRO (early access for PRO doctors) or STANDARD. After 48h PRO behaves as STANDARD for applications.';

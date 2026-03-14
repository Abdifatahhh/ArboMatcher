-- Rename job_tier: STANDARD → GRATIS
-- PRO blijft PRO, STANDARD wordt GRATIS

-- 1. Drop oude constraint
ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_job_tier_check;

-- 2. Migreer bestaande data
UPDATE jobs SET job_tier = 'GRATIS' WHERE job_tier = 'STANDARD';

-- 3. Nieuwe constraint
ALTER TABLE jobs ADD CONSTRAINT jobs_job_tier_check
  CHECK (job_tier IN ('PRO', 'GRATIS'));

-- 4. Default aanpassen
ALTER TABLE jobs ALTER COLUMN job_tier SET DEFAULT 'GRATIS';

-- 5. 48h trigger updaten
CREATE OR REPLACE FUNCTION public.enforce_pro_48h_rule()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_job_tier text;
  v_job_created_at timestamptz;
  v_plan text;
BEGIN
  SELECT j.job_tier, j.created_at INTO v_job_tier, v_job_created_at FROM jobs j WHERE j.id = NEW.job_id;
  IF v_job_tier IS NULL THEN v_job_tier := 'GRATIS'; END IF;
  IF v_job_tier != 'PRO' THEN RETURN NEW; END IF;

  IF v_job_created_at > (now() - interval '48 hours') THEN
    SELECT p.plan INTO v_plan FROM professionals p WHERE p.user_id = NEW.user_id;
    IF v_plan IS NULL THEN v_plan := 'GRATIS'; END IF;
    IF v_plan != 'PRO' THEN
      RAISE EXCEPTION 'PRO_48H_RULE: Alleen PRO-professionals kunnen binnen 48 uur na plaatsing op PRO-opdrachten reageren.'
        USING HINT = 'Upgrade naar PRO of wacht tot de 48-uursperiode is verstreken.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

COMMENT ON COLUMN jobs.job_tier IS 'Job tier: PRO (early access for PRO professionals) or GRATIS. After 48h PRO behaves as GRATIS for applications.';

-- User-facing exception and comment: use "Professional" instead of "arts(en)".

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
      RAISE EXCEPTION 'PRO_48H_RULE: Alleen PRO-professionals kunnen binnen 48 uur na plaatsing op PRO-opdrachten reageren.'
        USING errcode = 'P0001';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

COMMENT ON TABLE professionals IS 'Professional profiles: Bedrijfsarts, Arbo-arts, Verzekeringsarts, Casemanager verzuim.';

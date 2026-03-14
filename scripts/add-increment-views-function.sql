-- Functie om views_count atomisch te verhogen (SECURITY DEFINER bypassed RLS)
-- Voer uit in Supabase Dashboard > SQL Editor

CREATE OR REPLACE FUNCTION increment_job_views(p_job_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE jobs SET views_count = COALESCE(views_count, 0) + 1 WHERE id = p_job_id;
END;
$$;

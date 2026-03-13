-- Ensure users can insert/update their own professionals row when completing onboarding.
-- INSERT: when they signed up with role 'onboarding' and no row was created by trigger.
-- UPDATE: when a row already exists (e.g. signup as professional), they must be able to set
-- big_number and verification_status = 'PENDING' so they appear under "Wachtend".
DROP POLICY IF EXISTS "Doctors can insert own profile" ON professionals;
CREATE POLICY "Professionals can insert own row"
  ON professionals FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Professionals can update own row"
  ON professionals FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

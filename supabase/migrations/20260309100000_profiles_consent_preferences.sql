-- Add consent_preferences JSONB to profiles (registration consent + extended settings)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'consent_preferences'
  ) THEN
    ALTER TABLE profiles ADD COLUMN consent_preferences jsonb DEFAULT NULL;
  END IF;
END $$;

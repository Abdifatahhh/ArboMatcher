/*
  # Add subscription type to doctors

  1. Changes
    - Adds `subscription_type` column to `doctors` table
    - Values: 'free', 'smart', 'flex'
    - Default is 'free'

  2. Notes
    - This supports the new pricing model:
      - free: Gratis kennismaken
      - smart: Freelance PRO Smart (159 EUR/jaar)
      - flex: Freelance PRO Flex (69 EUR/kwartaal)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'doctors' AND column_name = 'subscription_type'
  ) THEN
    ALTER TABLE doctors ADD COLUMN subscription_type text DEFAULT 'free';
  END IF;
END $$;
-- Registration & onboarding: 3 roles (professional, company, intermediary), profiles first/last name & onboarding_completed, organizations table, profession/BIG/RCM, KvK immutable.

DO $$ BEGIN ALTER TYPE user_role ADD VALUE 'professional'; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TYPE user_role ADD VALUE 'company'; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TYPE user_role ADD VALUE 'intermediary'; EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS first_name text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_name text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;
UPDATE profiles SET onboarding_completed = true WHERE onboarding_completed IS NULL;

ALTER TABLE professionals ADD COLUMN IF NOT EXISTS profession text;
COMMENT ON COLUMN professionals.profession IS 'bedrijfsarts | arbo_arts | verzekeringsarts | casemanager_verzuim';

CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  organization_type text NOT NULL CHECK (organization_type IN ('company', 'intermediary')),
  company_name text NOT NULL,
  kvk_number text NOT NULL,
  contact_person text,
  business_email text,
  phone text,
  website text,
  profile_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_organizations_profile_id ON organizations(profile_id);
CREATE INDEX IF NOT EXISTS idx_organizations_type ON organizations(organization_type);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own organization" ON organizations;
CREATE POLICY "Users can view own organization"
  ON organizations FOR SELECT TO authenticated USING (profile_id = auth.uid());
DROP POLICY IF EXISTS "Users can insert own organization" ON organizations;
CREATE POLICY "Users can insert own organization"
  ON organizations FOR INSERT TO authenticated WITH CHECK (profile_id = auth.uid());
DROP POLICY IF EXISTS "Users can update own organization" ON organizations;
CREATE POLICY "Users can update own organization"
  ON organizations FOR UPDATE TO authenticated USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());
DROP POLICY IF EXISTS "Admins can view all organizations" ON organizations;
CREATE POLICY "Admins can view all organizations"
  ON organizations FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'));

CREATE OR REPLACE FUNCTION prevent_kvk_change()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.kvk_number IS NOT NULL AND NEW.kvk_number IS DISTINCT FROM OLD.kvk_number THEN
    RAISE EXCEPTION 'KvK-nummer kan niet worden gewijzigd na het opslaan.';
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_organizations_prevent_kvk_change ON organizations;
CREATE TRIGGER trg_organizations_prevent_kvk_change
  BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION prevent_kvk_change();

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
    WHEN v_role IN ('ARTS', 'OPDRACHTGEVER', 'ADMIN') THEN v_role::user_role
    ELSE 'OPDRACHTGEVER'::user_role
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
      VALUES (NEW.id, 'UNVERIFIED'::verification_status, 'BASIC', '{}', '{}');
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
  END IF;

  RETURN NEW;
EXCEPTION WHEN unique_violation THEN RETURN NEW;
END;
$$;

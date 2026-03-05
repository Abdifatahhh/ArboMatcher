/*
  # Complete ArboMatcher Database Schema
  
  This migration creates all missing tables for the ArboMatcher platform.
  
  ## Tables Created
  1. employers - Company profiles for opdrachtgevers
  2. doctors - Medical professional profiles with BIG verification
  3. jobs - Job postings with all metadata
  4. applications - Doctor applications to jobs
  5. invites - Employer invitations to doctors
  6. favorites - User favorites (jobs or doctors)
  7. conversations - Chat threads between users
  8. messages - Individual chat messages
  9. reviews - Post-job reviews with ratings
  10. subscriptions - User subscription plans
  11. invoices - Payment invoices
  
  ## Security
  - RLS enabled on all tables
  - Role-based access policies
  - Authentication required for operations
*/

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create employers table
CREATE TABLE IF NOT EXISTS employers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  company_name text NOT NULL,
  kvk text,
  website text,
  sector text,
  billing_address text,
  billing_email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  big_number text NOT NULL,
  verification_status text DEFAULT 'UNVERIFIED',
  verification_reason text,
  bio text,
  specialties text[] DEFAULT '{}',
  regions text[] DEFAULT '{}',
  hourly_rate numeric(10,2),
  availability_text text,
  availability_calendar jsonb,
  cv_url text,
  premium_status boolean DEFAULT false,
  premium_until timestamptz,
  subscription_type text DEFAULT 'BASIC',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  employer_id uuid REFERENCES employers(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  region text,
  remote_type text DEFAULT 'ONSITE',
  job_type text DEFAULT 'TIJDELIJK',
  start_date date,
  duration_weeks integer,
  hours_per_week numeric(5,2),
  rate_min numeric(10,2),
  rate_max numeric(10,2),
  status text DEFAULT 'DRAFT',
  is_pro boolean DEFAULT false,
  company_name text,
  views_count integer DEFAULT 0,
  applications_count integer DEFAULT 0,
  poster_type text DEFAULT 'DIRECT',
  on_behalf_of text,
  contact_person text,
  is_anonymous boolean DEFAULT false,
  early_access_until timestamptz,
  early_access_for text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  message text,
  attachment_url text,
  status text DEFAULT 'PENDING',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(job_id, doctor_id)
);

-- Create invites table
CREATE TABLE IF NOT EXISTS invites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  employer_id uuid REFERENCES employers(id) ON DELETE CASCADE NOT NULL,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  message text,
  status text DEFAULT 'PENDING',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(job_id, doctor_id)
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  ref_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, type, ref_id)
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  participant_ids uuid[] NOT NULL,
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  text text NOT NULL,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  employer_id uuid REFERENCES employers(id) ON DELETE CASCADE NOT NULL,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  text text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(job_id, employer_id, doctor_id)
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  plan text NOT NULL,
  status text DEFAULT 'ACTIVE',
  renew_at timestamptz,
  provider_ref text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE SET NULL,
  amount numeric(10,2) NOT NULL,
  currency text DEFAULT 'EUR',
  status text DEFAULT 'DRAFT',
  pdf_url text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_employers_user_id ON employers(user_id);
CREATE INDEX IF NOT EXISTS idx_doctors_user_id ON doctors(user_id);
CREATE INDEX IF NOT EXISTS idx_doctors_verification_status ON doctors(verification_status);
CREATE INDEX IF NOT EXISTS idx_jobs_employer_id ON jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_doctor_id ON applications(doctor_id);
CREATE INDEX IF NOT EXISTS idx_invites_doctor_id ON invites(doctor_id);
CREATE INDEX IF NOT EXISTS idx_conversations_participants ON conversations USING gin(participant_ids);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);

-- Enable Row Level Security on all tables
ALTER TABLE employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- RLS Policies for employers
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can view employers') THEN
    CREATE POLICY "Authenticated users can view employers"
      ON employers FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Employers can update own profile') THEN
    CREATE POLICY "Employers can update own profile"
      ON employers FOR UPDATE
      TO authenticated
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Employers can insert own profile') THEN
    CREATE POLICY "Employers can insert own profile"
      ON employers FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- RLS Policies for doctors
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can view doctors') THEN
    CREATE POLICY "Authenticated users can view doctors"
      ON doctors FOR SELECT
      TO authenticated
      USING (verification_status = 'VERIFIED' OR user_id = auth.uid() OR 
             EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Doctors can update own profile') THEN
    CREATE POLICY "Doctors can update own profile"
      ON doctors FOR UPDATE
      TO authenticated
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Doctors can insert own profile') THEN
    CREATE POLICY "Doctors can insert own profile"
      ON doctors FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can update doctor verification') THEN
    CREATE POLICY "Admins can update doctor verification"
      ON doctors FOR UPDATE
      TO authenticated
      USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'))
      WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'));
  END IF;
END $$;

-- RLS Policies for jobs
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view published jobs') THEN
    CREATE POLICY "Anyone can view published jobs"
      ON jobs FOR SELECT
      TO authenticated
      USING (status = 'PUBLISHED' OR 
             employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid()) OR
             EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Employers can insert own jobs') THEN
    CREATE POLICY "Employers can insert own jobs"
      ON jobs FOR INSERT
      TO authenticated
      WITH CHECK (employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid()));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Employers can update own jobs') THEN
    CREATE POLICY "Employers can update own jobs"
      ON jobs FOR UPDATE
      TO authenticated
      USING (employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid()))
      WITH CHECK (employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid()));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can update any job') THEN
    CREATE POLICY "Admins can update any job"
      ON jobs FOR UPDATE
      TO authenticated
      USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'))
      WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'));
  END IF;
END $$;

-- RLS Policies for applications
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Doctors can view own applications') THEN
    CREATE POLICY "Doctors can view own applications"
      ON applications FOR SELECT
      TO authenticated
      USING (doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()) OR
             EXISTS (SELECT 1 FROM jobs j INNER JOIN employers e ON j.employer_id = e.id 
                     WHERE j.id = applications.job_id AND e.user_id = auth.uid()));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Doctors can insert applications') THEN
    CREATE POLICY "Doctors can insert applications"
      ON applications FOR INSERT
      TO authenticated
      WITH CHECK (doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Employers can update applications') THEN
    CREATE POLICY "Employers can update applications"
      ON applications FOR UPDATE
      TO authenticated
      USING (EXISTS (SELECT 1 FROM jobs j INNER JOIN employers e ON j.employer_id = e.id 
                     WHERE j.id = applications.job_id AND e.user_id = auth.uid()))
      WITH CHECK (EXISTS (SELECT 1 FROM jobs j INNER JOIN employers e ON j.employer_id = e.id 
                          WHERE j.id = applications.job_id AND e.user_id = auth.uid()));
  END IF;
END $$;

-- RLS Policies for invites
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view relevant invites') THEN
    CREATE POLICY "Users can view relevant invites"
      ON invites FOR SELECT
      TO authenticated
      USING (doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()) OR
             employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid()));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Employers can insert invites') THEN
    CREATE POLICY "Employers can insert invites"
      ON invites FOR INSERT
      TO authenticated
      WITH CHECK (employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid()));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Doctors can update invite status') THEN
    CREATE POLICY "Doctors can update invite status"
      ON invites FOR UPDATE
      TO authenticated
      USING (doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()))
      WITH CHECK (doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()));
  END IF;
END $$;

-- RLS Policies for favorites
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own favorites') THEN
    CREATE POLICY "Users can view own favorites"
      ON favorites FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own favorites') THEN
    CREATE POLICY "Users can insert own favorites"
      ON favorites FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete own favorites') THEN
    CREATE POLICY "Users can delete own favorites"
      ON favorites FOR DELETE
      TO authenticated
      USING (user_id = auth.uid());
  END IF;
END $$;

-- RLS Policies for conversations
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Participants can view own conversations') THEN
    CREATE POLICY "Participants can view own conversations"
      ON conversations FOR SELECT
      TO authenticated
      USING (auth.uid() = ANY(participant_ids));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert conversations') THEN
    CREATE POLICY "Users can insert conversations"
      ON conversations FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = ANY(participant_ids));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Participants can update conversations') THEN
    CREATE POLICY "Participants can update conversations"
      ON conversations FOR UPDATE
      TO authenticated
      USING (auth.uid() = ANY(participant_ids))
      WITH CHECK (auth.uid() = ANY(participant_ids));
  END IF;
END $$;

-- RLS Policies for messages
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Participants can view messages') THEN
    CREATE POLICY "Participants can view messages"
      ON messages FOR SELECT
      TO authenticated
      USING (EXISTS (SELECT 1 FROM conversations 
                     WHERE conversations.id = messages.conversation_id 
                     AND auth.uid() = ANY(conversations.participant_ids)));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert messages') THEN
    CREATE POLICY "Users can insert messages"
      ON messages FOR INSERT
      TO authenticated
      WITH CHECK (sender_id = auth.uid() AND
                  EXISTS (SELECT 1 FROM conversations 
                          WHERE conversations.id = conversation_id 
                          AND auth.uid() = ANY(conversations.participant_ids)));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own messages') THEN
    CREATE POLICY "Users can update own messages"
      ON messages FOR UPDATE
      TO authenticated
      USING (sender_id = auth.uid())
      WITH CHECK (sender_id = auth.uid());
  END IF;
END $$;

-- RLS Policies for reviews
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view reviews') THEN
    CREATE POLICY "Anyone can view reviews"
      ON reviews FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Employers can insert reviews') THEN
    CREATE POLICY "Employers can insert reviews"
      ON reviews FOR INSERT
      TO authenticated
      WITH CHECK (employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid()));
  END IF;
END $$;

-- RLS Policies for subscriptions
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own subscriptions') THEN
    CREATE POLICY "Users can view own subscriptions"
      ON subscriptions FOR SELECT
      TO authenticated
      USING (user_id = auth.uid() OR 
             EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own subscriptions') THEN
    CREATE POLICY "Users can insert own subscriptions"
      ON subscriptions FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own subscriptions') THEN
    CREATE POLICY "Users can update own subscriptions"
      ON subscriptions FOR UPDATE
      TO authenticated
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage all subscriptions') THEN
    CREATE POLICY "Admins can manage all subscriptions"
      ON subscriptions FOR UPDATE
      TO authenticated
      USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'))
      WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'));
  END IF;
END $$;

-- RLS Policies for invoices
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own invoices') THEN
    CREATE POLICY "Users can view own invoices"
      ON invoices FOR SELECT
      TO authenticated
      USING (user_id = auth.uid() OR 
             EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'System can insert invoices') THEN
    CREATE POLICY "System can insert invoices"
      ON invoices FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

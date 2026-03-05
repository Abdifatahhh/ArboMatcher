/*
  # ArboMatcher Platform Database Schema

  Complete database schema for ArboMatcher.nl - freelance marketplace for bedrijfsartsen
  
  ## Tables Created
  
  1. **profiles**
     - Extended user profile information
     - Links to auth.users
     - Stores role (OPDRACHTGEVER, ARTS, ADMIN)
     - Common fields: full_name, avatar_url, phone
  
  2. **employers**
     - Company profiles for opdrachtgevers
     - company_name, kvk, website, sector
     - Billing information
  
  3. **doctors**
     - Medical professional profiles
     - BIG number (required)
     - Verification status (UNVERIFIED, PENDING, VERIFIED, REJECTED)
     - Specialties, regions, hourly rate
     - Availability calendar data
     - CV upload URL
     - Premium membership status
  
  4. **jobs**
     - Job postings by employers
     - Location, remote type, duration
     - Rate range, start date
     - Status (DRAFT, PUBLISHED, CLOSED)
  
  5. **applications**
     - Doctor applications to jobs
     - Motivation message, attachments
     - Status tracking
  
  6. **invites**
     - Employer invitations to doctors
     - Status tracking
  
  7. **favorites**
     - User favorites (jobs or doctors)
     - Type discriminator
  
  8. **conversations**
     - Chat threads between users
     - Optional job context
  
  9. **messages**
     - Individual messages in conversations
     - Read receipts
  
  10. **reviews**
      - Post-job reviews
      - 1-5 star rating system
  
  11. **subscriptions**
      - User subscription plans
      - Plan types: BASIC, PRO, ENTERPRISE, PREMIUM_DOCTOR
  
  12. **invoices**
      - Payment invoices
      - PDF storage
  
  ## Security
  
  - RLS enabled on all tables
  - Role-based access policies
  - Authentication required for most operations
  - Ownership and membership checks in policies
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('OPDRACHTGEVER', 'ARTS', 'ADMIN');
CREATE TYPE verification_status AS ENUM ('UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED');
CREATE TYPE job_status AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED');
CREATE TYPE application_status AS ENUM ('PENDING', 'SHORTLISTED', 'REJECTED', 'ACCEPTED');
CREATE TYPE invite_status AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');
CREATE TYPE subscription_plan AS ENUM ('BASIC', 'PRO', 'ENTERPRISE', 'PREMIUM_DOCTOR');
CREATE TYPE subscription_status AS ENUM ('ACTIVE', 'CANCELLED', 'EXPIRED');
CREATE TYPE invoice_status AS ENUM ('DRAFT', 'PAID', 'FAILED');
CREATE TYPE favorite_type AS ENUM ('JOB', 'DOCTOR');
CREATE TYPE job_type AS ENUM ('TIJDELIJK', 'INTERIM', 'VAST', 'PROJECT');
CREATE TYPE remote_type AS ENUM ('REMOTE', 'HYBRID', 'ONSITE');

-- 1. Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  full_name text,
  avatar_url text,
  phone text,
  email text NOT NULL,
  status text DEFAULT 'ACTIVE',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Employers table
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

-- 3. Doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  big_number text NOT NULL,
  verification_status verification_status DEFAULT 'UNVERIFIED',
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
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  employer_id uuid REFERENCES employers(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  region text,
  remote_type remote_type DEFAULT 'ONSITE',
  job_type job_type DEFAULT 'TIJDELIJK',
  start_date date,
  duration_weeks integer,
  hours_per_week numeric(5,2),
  rate_min numeric(10,2),
  rate_max numeric(10,2),
  status job_status DEFAULT 'DRAFT',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 5. Applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  message text,
  attachment_url text,
  status application_status DEFAULT 'PENDING',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(job_id, doctor_id)
);

-- 6. Invites table
CREATE TABLE IF NOT EXISTS invites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  employer_id uuid REFERENCES employers(id) ON DELETE CASCADE NOT NULL,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  message text,
  status invite_status DEFAULT 'PENDING',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(job_id, doctor_id)
);

-- 7. Favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type favorite_type NOT NULL,
  ref_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, type, ref_id)
);

-- 8. Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  participant_ids uuid[] NOT NULL,
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- 9. Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  text text NOT NULL,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 10. Reviews table
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

-- 11. Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  plan subscription_plan NOT NULL,
  status subscription_status DEFAULT 'ACTIVE',
  renew_at timestamptz,
  provider_ref text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 12. Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE SET NULL,
  amount numeric(10,2) NOT NULL,
  currency text DEFAULT 'EUR',
  status invoice_status DEFAULT 'DRAFT',
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
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
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

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for employers
CREATE POLICY "Authenticated users can view employers"
  ON employers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Employers can update own profile"
  ON employers FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Employers can insert own profile"
  ON employers FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for doctors
CREATE POLICY "Authenticated users can view verified doctors"
  ON doctors FOR SELECT
  TO authenticated
  USING (verification_status = 'VERIFIED' OR user_id = auth.uid() OR 
         EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'));

CREATE POLICY "Doctors can update own profile"
  ON doctors FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Doctors can insert own profile"
  ON doctors FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update doctor verification"
  ON doctors FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'));

-- RLS Policies for jobs
CREATE POLICY "Anyone can view published jobs"
  ON jobs FOR SELECT
  TO authenticated
  USING (status = 'PUBLISHED' OR 
         employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid()) OR
         EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'));

CREATE POLICY "Employers can insert own jobs"
  ON jobs FOR INSERT
  TO authenticated
  WITH CHECK (employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid()));

CREATE POLICY "Employers can update own jobs"
  ON jobs FOR UPDATE
  TO authenticated
  USING (employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid()))
  WITH CHECK (employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update any job"
  ON jobs FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'));

-- RLS Policies for applications
CREATE POLICY "Doctors can view own applications"
  ON applications FOR SELECT
  TO authenticated
  USING (doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()) OR
         EXISTS (SELECT 1 FROM jobs j INNER JOIN employers e ON j.employer_id = e.id 
                 WHERE j.id = applications.job_id AND e.user_id = auth.uid()));

CREATE POLICY "Doctors can insert applications"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()));

CREATE POLICY "Employers can update applications for their jobs"
  ON applications FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM jobs j INNER JOIN employers e ON j.employer_id = e.id 
                 WHERE j.id = applications.job_id AND e.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM jobs j INNER JOIN employers e ON j.employer_id = e.id 
                      WHERE j.id = applications.job_id AND e.user_id = auth.uid()));

-- RLS Policies for invites
CREATE POLICY "Doctors and employers can view relevant invites"
  ON invites FOR SELECT
  TO authenticated
  USING (doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()) OR
         employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid()));

CREATE POLICY "Employers can insert invites"
  ON invites FOR INSERT
  TO authenticated
  WITH CHECK (employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid()));

CREATE POLICY "Doctors can update invite status"
  ON invites FOR UPDATE
  TO authenticated
  USING (doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()))
  WITH CHECK (doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()));

-- RLS Policies for favorites
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for conversations
CREATE POLICY "Participants can view own conversations"
  ON conversations FOR SELECT
  TO authenticated
  USING (auth.uid() = ANY(participant_ids));

CREATE POLICY "Users can insert conversations"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = ANY(participant_ids));

CREATE POLICY "Participants can update conversations"
  ON conversations FOR UPDATE
  TO authenticated
  USING (auth.uid() = ANY(participant_ids))
  WITH CHECK (auth.uid() = ANY(participant_ids));

-- RLS Policies for messages
CREATE POLICY "Participants can view messages in their conversations"
  ON messages FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM conversations 
                 WHERE conversations.id = messages.conversation_id 
                 AND auth.uid() = ANY(conversations.participant_ids)));

CREATE POLICY "Users can insert messages in their conversations"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid() AND
              EXISTS (SELECT 1 FROM conversations 
                      WHERE conversations.id = conversation_id 
                      AND auth.uid() = ANY(conversations.participant_ids)));

CREATE POLICY "Users can update own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (sender_id = auth.uid())
  WITH CHECK (sender_id = auth.uid());

-- RLS Policies for reviews
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Employers can insert reviews for their jobs"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (employer_id IN (SELECT id FROM employers WHERE user_id = auth.uid()));

-- RLS Policies for subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR 
         EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'));

CREATE POLICY "Users can insert own subscriptions"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own subscriptions"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all subscriptions"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'));

-- RLS Policies for invoices
CREATE POLICY "Users can view own invoices"
  ON invoices FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR 
         EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'));

CREATE POLICY "System can insert invoices"
  ON invoices FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all invoices"
  ON invoices FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'));
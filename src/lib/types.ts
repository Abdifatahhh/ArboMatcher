export type UserRole = 'OPDRACHTGEVER' | 'ADMIN' | 'professional' | 'onboarding';
export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
export type JobStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED';
export type { JobReviewStatus } from './jobReviewTypes';
export type ApplicationStatus = 'PENDING' | 'SHORTLISTED' | 'REJECTED' | 'ACCEPTED';
export type InviteStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';
export type DoctorPlan = 'GRATIS' | 'PRO';
export type SubscriptionPlan = 'GRATIS' | 'PRO';
export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
export type InvoiceStatus = 'DRAFT' | 'PAID' | 'FAILED';
export type FavoriteType = 'JOB' | 'DOCTOR';
export type { ContractForm, RemoteType } from './opdrachtConstants';
export type JobTier = 'PRO' | 'STANDARD';
export type PosterType = 'DIRECT' | 'INTERMEDIARY';

export interface ConsentPreferences {
  main: boolean;
  inform_candidate: boolean;
  share_profile_cv: boolean;
  products_services: boolean;
  share_sister_companies: boolean;
  newsletter: boolean;
  feedback_reviews: boolean;
  relevant_content: boolean;
}

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  first_name?: string | null;
  last_name?: string | null;
  avatar_url: string | null;
  phone: string | null;
  email: string;
  status: string;
  onboarding_completed?: boolean;
  account_bevestigd_email_sent?: boolean;
  consent_preferences?: ConsentPreferences | null;
  created_at: string;
  updated_at: string;
}

export interface Employer {
  id: string;
  user_id: string;
  company_name: string;
  kvk: string | null;
  website: string | null;
  sector: string | null;
  billing_address: string | null;
  billing_email: string | null;
  created_at: string;
  updated_at: string;
}

export type ProfessionType = 'BEDRIJFSARTS' | 'ARBO_ARTS' | 'VERZEKERINGSARTS' | 'CASEMANAGER_VERZUIM' | 'POB';

export type ProfessionValue = 'bedrijfsarts' | 'arbo_arts' | 'verzekeringsarts' | 'casemanager_verzuim' | 'pob';

export interface Doctor {
  id: string;
  user_id: string;
  big_number: string | null;
  profession: ProfessionValue | null;
  profession_type: ProfessionType | null;
  rcm_number: string | null;
  verification_status: VerificationStatus;
  verification_reason: string | null;
  bio: string | null;
  specialties: string[];
  regions: string[];
  hourly_rate: number | null;
  availability_text: string | null;
  availability_calendar: any;
  cv_url: string | null;
  doctor_plan: DoctorPlan;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  employer_id: string;
  title: string;
  description: string;
  region: string | null;
  remote_type: RemoteType;
  job_type: string;
  job_tier: JobTier;
  start_date: string | null;
  duration_weeks: number | null;
  hours_per_week: number | null;
  rate_min: number | null;
  rate_max: number | null;
  status: JobStatus;
  company_name: string | null;
  views_count: number;
  applications_count: number;
  poster_type: PosterType;
  on_behalf_of: string | null;
  contact_person: string | null;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
  review_status?: string;
  submitted_at?: string | null;
  approved_at?: string | null;
  approved_by?: string | null;
  published_at?: string | null;
  published_by?: string | null;
  rejected_at?: string | null;
  rejected_by?: string | null;
  rejection_reason?: string | null;
  changes_requested_at?: string | null;
  changes_requested_by?: string | null;
  changes_requested_reason?: string | null;
  review_notes?: string | null;
  structure_score?: number | null;
  ai_score?: number | null;
  overall_score?: number | null;
  ai_status?: string | null;
  ai_feedback_summary?: string | null;
  ai_strengths?: string[] | null;
  ai_improvements?: string[] | null;
  ai_warnings?: string[] | null;
  ai_suggested_changes?: string[] | null;
  ai_last_reviewed_at?: string | null;
  target_profession?: string | null;
}

export interface Application {
  id: string;
  job_id: string;
  doctor_id: string;
  message: string | null;
  attachment_url: string | null;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
}

export interface Invite {
  id: string;
  job_id: string;
  employer_id: string;
  doctor_id: string;
  message: string | null;
  status: InviteStatus;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  type: FavoriteType;
  ref_id: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  job_id: string | null;
  participant_ids: string[];
  last_message_at: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  text: string;
  read_at: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  job_id: string;
  employer_id: string;
  doctor_id: string;
  rating: number;
  text: string | null;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  renew_at: string | null;
  provider_ref: string | null;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  subscription_id: string | null;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  pdf_url: string | null;
  created_at: string;
}

export interface ContentStoreRow {
  key: string;
  value: unknown;
  updated_at: string;
}

export interface JobReviewHistoryRow {
  id: string;
  job_id: string;
  action: string;
  old_status: string | null;
  new_status: string;
  note: string | null;
  metadata: Record<string, unknown>;
  created_by: string | null;
  created_at: string;
}

export interface JobAdminNoteRow {
  id: string;
  job_id: string;
  note: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
        Relationships: [];
      };
      employers: {
        Row: Employer;
        Insert: Omit<Employer, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Employer, 'id' | 'created_at'>>;
        Relationships: [];
      };
      professionals: {
        Row: Doctor;
        Insert: Omit<Doctor, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Doctor, 'id' | 'created_at'>>;
        Relationships: [];
      };
      jobs: {
        Row: Job;
        Insert: Omit<Job, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Job, 'id' | 'created_at'>>;
        Relationships: [];
      };
      applications: {
        Row: Application;
        Insert: Omit<Application, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Application, 'id' | 'created_at'>>;
        Relationships: [];
      };
      invites: {
        Row: Invite;
        Insert: Omit<Invite, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Invite, 'id' | 'created_at'>>;
        Relationships: [];
      };
      favorites: {
        Row: Favorite;
        Insert: Omit<Favorite, 'id' | 'created_at'>;
        Update: Partial<Omit<Favorite, 'id' | 'created_at'>>;
        Relationships: [];
      };
      conversations: {
        Row: Conversation;
        Insert: Omit<Conversation, 'id' | 'created_at'>;
        Update: Partial<Omit<Conversation, 'id' | 'created_at'>>;
        Relationships: [];
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, 'id' | 'created_at'>;
        Update: Partial<Omit<Message, 'id' | 'created_at'>>;
        Relationships: [];
      };
      reviews: {
        Row: Review;
        Insert: Omit<Review, 'id' | 'created_at'>;
        Update: Partial<Omit<Review, 'id' | 'created_at'>>;
        Relationships: [];
      };
      subscriptions: {
        Row: Subscription;
        Insert: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Subscription, 'id' | 'created_at'>>;
        Relationships: [];
      };
      invoices: {
        Row: Invoice;
        Insert: Omit<Invoice, 'id' | 'created_at'>;
        Update: Partial<Omit<Invoice, 'id' | 'created_at'>>;
        Relationships: [];
      };
      content_store: {
        Row: ContentStoreRow;
        Insert: { key: string; value: unknown; updated_at?: string };
        Update: { value?: unknown; updated_at?: string };
        Relationships: [];
      };
      job_review_history: {
        Row: JobReviewHistoryRow;
        Insert: Omit<JobReviewHistoryRow, 'id' | 'created_at'>;
        Update: Partial<Omit<JobReviewHistoryRow, 'id' | 'created_at'>>;
        Relationships: [];
      };
      job_admin_notes: {
        Row: JobAdminNoteRow;
        Insert: Omit<JobAdminNoteRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<JobAdminNoteRow, 'id' | 'created_at'>>;
        Relationships: [];
      };
    };
    Views: Record<string, { Row: Record<string, unknown>; Relationships: [] }>;
    Functions: Record<string, { Args: Record<string, unknown>; Returns: unknown }>;
  };
}

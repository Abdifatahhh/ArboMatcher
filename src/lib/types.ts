export type UserRole = 'OPDRACHTGEVER' | 'ARTS' | 'ADMIN';
export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
export type JobStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED';
export type ApplicationStatus = 'PENDING' | 'SHORTLISTED' | 'REJECTED' | 'ACCEPTED';
export type InviteStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';
export type SubscriptionPlan = 'BASIC' | 'PRO' | 'ENTERPRISE' | 'PREMIUM_DOCTOR';
export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
export type InvoiceStatus = 'DRAFT' | 'PAID' | 'FAILED';
export type FavoriteType = 'JOB' | 'DOCTOR';
export type JobType = 'TIJDELIJK' | 'INTERIM' | 'VAST' | 'PROJECT';
export type RemoteType = 'REMOTE' | 'HYBRID' | 'ONSITE';
export type PosterType = 'DIRECT' | 'INTERMEDIARY';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  email: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export type ClientType = 'direct' | 'intermediair' | 'detacheerder';

export interface Employer {
  id: string;
  user_id: string;
  company_name: string;
  kvk: string | null;
  website: string | null;
  sector: string | null;
  billing_address: string | null;
  billing_email: string | null;
  client_type?: ClientType;
  created_at: string;
  updated_at: string;
}

export interface Doctor {
  id: string;
  user_id: string;
  big_number: string;
  verification_status: VerificationStatus;
  verification_reason: string | null;
  bio: string | null;
  specialties: string[];
  regions: string[];
  hourly_rate: number | null;
  availability_text: string | null;
  availability_calendar: any;
  cv_url: string | null;
  premium_status: boolean;
  premium_until: string | null;
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
  job_type: JobType;
  start_date: string | null;
  duration_weeks: number | null;
  hours_per_week: number | null;
  rate_min: number | null;
  rate_max: number | null;
  status: JobStatus;
  is_pro: boolean;
  company_name: string | null;
  views_count: number;
  applications_count: number;
  poster_type: PosterType;
  on_behalf_of: string | null;
  contact_person: string | null;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
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
      doctors: {
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
    };
    Views: Record<string, { Row: Record<string, unknown>; Relationships: [] }>;
    Functions: Record<string, { Args: Record<string, unknown>; Returns: unknown }>;
  };
}

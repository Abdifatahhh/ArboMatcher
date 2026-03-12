/**
 * Schema mapping for Admin Organisaties (clients).
 * Derived from actual tables: profiles, employers, jobs.
 */

/** Table that holds accounts/profiles (organisaties have role ORGANISATIE here) */
export const PROFILES_TABLE = 'profiles' as const;

/** Table that holds company data for organisaties; linked by user_id → profiles.id */
export const EMPLOYERS_TABLE = 'employers' as const;

/** Table that holds jobs/opdrachten; linked by employer_id → employers.id */
export const JOBS_TABLE = 'jobs' as const;

/** FK on jobs pointing to employers */
export const JOBS_EMPLOYER_FK = 'employer_id' as const;

/** FK on employers pointing to profiles */
export const EMPLOYERS_USER_FK = 'user_id' as const;

/** Column that determines user role (ORGANISATIE | professional | ADMIN) */
export const PROFILES_ROLE_COLUMN = 'role' as const;

/** Blocked status: we use profiles.status; value 'BLOCKED' = geblokkeerd */
export const PROFILES_STATUS_COLUMN = 'status' as const;

/** UI-facing field labels and display names */
export const ADMIN_CLIENTS_UI = {
  displayCompanyName: 'company_name',
  displayContactName: 'full_name',
  displayEmail: 'email',
  displayPhone: 'phone',
  displayCreatedAt: 'created_at',
  blockedFieldName: PROFILES_STATUS_COLUMN,
  jobsTableName: JOBS_TABLE,
  jobsClientFKFieldName: JOBS_EMPLOYER_FK,
} as const;

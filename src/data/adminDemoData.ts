import type { Profile, Doctor, Job, Employer, Application, Subscription } from '../lib/types';

const now = new Date().toISOString();
const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

export const demoProfiles: Profile[] = [
  {
    id: 'demo-user-1',
    role: 'ARTS',
    full_name: 'Dr. Lisa van der Berg',
    avatar_url: null,
    phone: '06-12345678',
    email: 'lisa.vandenberg@voorbeeld.nl',
    status: 'ACTIVE',
    created_at: lastWeek,
    updated_at: now,
  },
  {
    id: 'demo-user-2',
    role: 'ARTS',
    full_name: 'Dr. Mark de Vries',
    avatar_url: null,
    phone: '06-87654321',
    email: 'mark.devries@voorbeeld.nl',
    status: 'ACTIVE',
    created_at: lastWeek,
    updated_at: now,
  },
  {
    id: 'demo-user-3',
    role: 'OPDRACHTGEVER',
    full_name: 'Jan Jansen',
    avatar_url: null,
    phone: '06-11223344',
    email: 'jan.jansen@bedrijf.nl',
    status: 'ACTIVE',
    created_at: lastWeek,
    updated_at: now,
  },
  {
    id: 'demo-user-4',
    role: 'OPDRACHTGEVER',
    full_name: 'Marie van Dam',
    avatar_url: null,
    phone: '06-55443322',
    email: 'm.vandam@verzekeraar.nl',
    status: 'ACTIVE',
    created_at: lastWeek,
    updated_at: now,
  },
  {
    id: 'demo-user-5',
    role: 'OPDRACHTGEVER',
    full_name: 'Peter Bakker',
    avatar_url: null,
    phone: '06-99887766',
    email: 'p.bakker@detacheerder.nl',
    status: 'ACTIVE',
    created_at: lastWeek,
    updated_at: now,
  },
  {
    id: 'demo-user-6',
    role: 'OPDRACHTGEVER',
    full_name: 'Sophie de Groot',
    avatar_url: null,
    phone: '06-44332211',
    email: 's.degroot@intermediair.nl',
    status: 'BLOCKED',
    created_at: lastWeek,
    updated_at: now,
  },
  {
    id: 'demo-user-7',
    role: 'intermediary',
    full_name: 'Thomas Intermediair',
    avatar_url: null,
    phone: '06-66778899',
    email: 'thomas@intermediair.nl',
    status: 'ACTIVE',
    created_at: lastWeek,
    updated_at: now,
  },
  {
    id: 'demo-user-8',
    role: 'intermediary',
    full_name: 'Emma Bemiddeling',
    avatar_url: null,
    phone: '06-10101010',
    email: 'emma@bemiddeling.nl',
    status: 'ACTIVE',
    created_at: lastWeek,
    updated_at: now,
  },
];

export const demoEmployers: Employer[] = [
  {
    id: 'demo-employer-1',
    user_id: 'demo-user-3',
    company_name: 'ArboZorg Nederland B.V.',
    kvk: '12345678',
    website: 'https://arbovoorbeeld.nl',
    sector: 'Arbodiensten',
    billing_address: 'Hoofdstraat 1, 1000 AA Amsterdam',
    billing_email: 'facturatie@arbovoorbeeld.nl',
    client_type: 'direct',
    created_at: lastWeek,
    updated_at: now,
  },
  {
    id: 'demo-employer-2',
    user_id: 'demo-user-4',
    company_name: 'Zeker Verzekeringen N.V.',
    kvk: '87654321',
    website: 'https://zeker.nl',
    sector: 'Verzekeringen',
    billing_address: 'Verzekeringsweg 50, 3500 AB Utrecht',
    billing_email: 'arbodienst@zeker.nl',
    client_type: 'direct',
    created_at: lastWeek,
    updated_at: now,
  },
  {
    id: 'demo-employer-3',
    user_id: 'demo-user-5',
    company_name: 'Medisch Detachering B.V.',
    kvk: '11223344',
    website: 'https://medischdetachering.nl',
    sector: 'Detachering',
    billing_address: 'Kantoorpark 12, 5000 AA Eindhoven',
    billing_email: 'facturatie@medischdetachering.nl',
    client_type: 'detacheerder',
    created_at: lastWeek,
    updated_at: now,
  },
  {
    id: 'demo-employer-4',
    user_id: 'demo-user-6',
    company_name: 'ArboBemiddeling Partners',
    kvk: '55667788',
    website: 'https://arbobemiddeling.nl',
    sector: 'Bemiddeling',
    billing_address: 'Bemiddellaan 7, 3000 AB Rotterdam',
    billing_email: 'admin@arbobemiddeling.nl',
    client_type: 'intermediair',
    created_at: lastWeek,
    updated_at: now,
  },
];

export const demoDoctors: (Doctor & { profiles: Profile | null })[] = [
  {
    id: 'demo-doctor-1',
    user_id: 'demo-user-1',
    big_number: '19901234567',
    verification_status: 'VERIFIED',
    verification_reason: null,
    bio: 'Ervaren bedrijfsarts met focus op verzuimbegeleiding en PMO. Werkzaam in regio Randstad.',
    specialties: ['Bedrijfsgeneeskunde', 'Verzuimbegeleiding', 'PMO'],
    regions: ['Amsterdam', 'Haarlem', 'Zaanstad'],
    hourly_rate: 125,
    availability_text: 'Beschikbaar 3 dagen per week, start per direct.',
    availability_calendar: null,
    cv_url: null,
    doctor_plan: 'PRO',
    created_at: lastWeek,
    updated_at: now,
    profiles: demoProfiles[0],
  },
  {
    id: 'demo-doctor-2',
    user_id: 'demo-user-2',
    big_number: '19887654321',
    verification_status: 'PENDING',
    verification_reason: null,
    bio: 'Verzekeringsarts met ervaring in WIA- en WAO-beoordelingen.',
    specialties: ['Verzekeringsgeneeskunde', 'WIA'],
    regions: ['Utrecht', 'Hilversum'],
    hourly_rate: 140,
    availability_text: 'Beschikbaar vanaf 1 april.',
    availability_calendar: null,
    cv_url: null,
    doctor_plan: 'GRATIS',
    created_at: lastWeek,
    updated_at: now,
    profiles: demoProfiles[1],
  },
];

export const demoJobs: (Job & { employers: Employer })[] = [
  {
    id: 'demo-job-1',
    employer_id: 'demo-employer-1',
    title: 'Bedrijfsarts voor grote arbodienst regio Amsterdam',
    description: 'Wij zoeken een ervaren bedrijfsarts voor verzuimbegeleiding en PMO. Marktconform tarief, flexibele werktijden.',
    region: 'Noord-Holland',
    remote_type: 'HYBRID',
    job_type: 'VAST',
    start_date: null,
    duration_weeks: 52,
    hours_per_week: 24,
    rate_min: 100,
    rate_max: 130,
    status: 'PUBLISHED',
    job_tier: 'PRO',
    company_name: 'ArboZorg Nederland B.V.',
    views_count: 42,
    applications_count: 5,
    poster_type: 'DIRECT',
    on_behalf_of: null,
    contact_person: 'Jan Jansen',
    is_anonymous: false,
    created_at: lastWeek,
    updated_at: now,
    employers: demoEmployers[0],
  },
  {
    id: 'demo-job-2',
    employer_id: 'demo-employer-1',
    title: 'Interim verzekeringsarts (concept)',
    description: 'Conceptopdracht – nog niet gepubliceerd.',
    region: 'Landelijk',
    remote_type: 'REMOTE',
    job_type: 'INTERIM',
    start_date: null,
    duration_weeks: 12,
    hours_per_week: 16,
    rate_min: 110,
    rate_max: 140,
    status: 'DRAFT',
    job_tier: 'STANDARD',
    company_name: 'ArboZorg Nederland B.V.',
    views_count: 0,
    applications_count: 0,
    poster_type: 'DIRECT',
    on_behalf_of: null,
    contact_person: null,
    is_anonymous: false,
    created_at: now,
    updated_at: now,
    employers: demoEmployers[0],
  },
  {
    id: 'demo-job-3',
    employer_id: 'demo-employer-1',
    title: 'Verzekeringsarts WIA-beoordelingen',
    description: 'Landelijke verzekeraar zoekt verzekeringsarts voor WIA-beoordelingen. Parttime of fulltime bespreekbaar.',
    region: 'Utrecht',
    remote_type: 'REMOTE',
    job_type: 'INTERIM',
    start_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    duration_weeks: 26,
    hours_per_week: 32,
    rate_min: 120,
    rate_max: 150,
    status: 'PUBLISHED',
    job_tier: 'STANDARD',
    company_name: 'ArboZorg Nederland B.V.',
    views_count: 18,
    applications_count: 2,
    poster_type: 'DIRECT',
    on_behalf_of: null,
    contact_person: null,
    is_anonymous: false,
    created_at: now,
    updated_at: now,
    employers: demoEmployers[0],
  },
  {
    id: 'demo-job-4',
    employer_id: 'demo-employer-1',
    title: 'Gesloten opdracht – bedrijfsarts (afgerond)',
    description: 'Deze opdracht is afgesloten.',
    region: 'Zuid-Holland',
    remote_type: 'ONSITE',
    job_type: 'VAST',
    start_date: null,
    duration_weeks: 0,
    hours_per_week: 0,
    rate_min: null,
    rate_max: null,
    status: 'CLOSED',
    job_tier: 'STANDARD',
    company_name: 'ArboZorg Nederland B.V.',
    views_count: 88,
    applications_count: 12,
    poster_type: 'DIRECT',
    on_behalf_of: null,
    contact_person: null,
    is_anonymous: false,
    created_at: lastWeek,
    updated_at: now,
    employers: demoEmployers[0],
  },
];


/** Demo opdrachtgevers voor admin lijst (employer + profile + jobs_count). Gebruikt wanneer DB leeg is. */
export type DemoClientRow = { employer: Employer; profile: Profile; jobs_count: number };

function buildDemoOpdrachtgevers(): DemoClientRow[] {
  const profileById = Object.fromEntries(demoProfiles.filter((p) => p.role === 'OPDRACHTGEVER').map((p) => [p.id, p]));
  return demoEmployers.map((employer) => {
    const profile = profileById[employer.user_id];
    const jobs_count = demoJobs.filter((j) => j.employer_id === employer.id).length;
    return { employer, profile, jobs_count };
  });
}

export const demoOpdrachtgevers: DemoClientRow[] = buildDemoOpdrachtgevers();

export const demoApplications: (Application & { jobs: Job | null; professionals: (Doctor & { profiles: Profile | null }) | null })[] = [
  {
    id: 'demo-app-1',
    job_id: 'demo-job-1',
    doctor_id: 'demo-doctor-1',
    message: 'Graag wil ik reageren op deze opdracht. Ik heb 10 jaar ervaring en ben per direct beschikbaar.',
    attachment_url: null,
    status: 'SHORTLISTED',
    created_at: lastWeek,
    updated_at: now,
    jobs: demoJobs[0],
    professionals: demoDoctors[0],
  },
  {
    id: 'demo-app-2',
    job_id: 'demo-job-1',
    doctor_id: 'demo-doctor-2',
    message: 'Interesse in deze functie. Beschikbaar vanaf april.',
    attachment_url: null,
    status: 'PENDING',
    created_at: now,
    updated_at: now,
    jobs: demoJobs[0],
    professionals: demoDoctors[1],
  },
];

/** Demo artsen voor admin lijst (doctor + profile + applications_count). */
export type DemoDoctorRow = { doctor: Doctor & { profiles: Profile | null }; profile: Profile; applications_count: number };

function buildDemoDoctorsList(): DemoDoctorRow[] {
  return demoDoctors.map((doctor) => {
    const profile = doctor.profiles ?? (demoProfiles.find((p) => p.id === doctor.user_id) as Profile);
    const applications_count = demoApplications.filter((a) => a.doctor_id === doctor.id).length;
    return { doctor, profile, applications_count };
  });
}

export const demoDoctorsList: DemoDoctorRow[] = buildDemoDoctorsList();

export const demoSubscriptions: (Subscription & { profiles: Profile | null })[] = [
  {
    id: 'demo-sub-1',
    user_id: 'demo-user-1',
    plan: 'PRO',
    status: 'ACTIVE',
    renew_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    provider_ref: null,
    created_at: lastWeek,
    updated_at: now,
    profiles: demoProfiles[0],
  },
  {
    id: 'demo-sub-2',
    user_id: 'demo-user-3',
    plan: 'PRO',
    status: 'ACTIVE',
    renew_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    provider_ref: null,
    created_at: lastWeek,
    updated_at: now,
    profiles: demoProfiles[2],
  },
];

export const demoStats = {
  pendingVerifications: 1,
  totalUsers: 3,
  totalDoctors: 2,
  activeJobs: 2,
  totalApplications: 2,
  activeSubscriptions: 2,
  draftJobs: 1,
  closedJobs: 1,
  pendingApplications: 1,
  newUsersToday: 1,
  newUsersWeek: 2,
  newJobsToday: 0,
  newJobsWeek: 2,
  newApplicationsToday: 1,
  newApplicationsWeek: 2,
};

export type ActivityItem = {
  id: string;
  type: 'user' | 'verification' | 'job' | 'application';
  title: string;
  subtitle?: string;
  link: string;
  created_at: string;
};

function toActivityItems(): ActivityItem[] {
  const items: ActivityItem[] = [];
  demoProfiles.forEach((p) => {
    items.push({
      id: `user-${p.id}`,
      type: 'user',
      title: p.full_name || p.email,
      subtitle: `Nieuwe gebruiker · ${p.role}`,
      link: `/admin/gebruikers/${p.id}`,
      created_at: p.created_at,
    });
  });
  demoDoctors.filter((d) => d.verification_status === 'PENDING').forEach((d) => {
    const name = d.profiles?.full_name || 'Arts';
    items.push({
      id: `verification-${d.id}`,
      type: 'verification',
      title: `Verificatie aangevraagd: ${name}`,
      subtitle: `BIG ${d.big_number}`,
      link: `/admin/artsen/${d.id}`,
      created_at: d.created_at,
    });
  });
  demoJobs.forEach((j) => {
    items.push({
      id: `job-${j.id}`,
      type: 'job',
      title: j.title,
      subtitle: `${j.status} · ${j.company_name || 'Opdracht'}`,
      link: `/admin/opdrachten`,
      created_at: j.created_at,
    });
  });
  demoApplications.forEach((a) => {
    const docName = a.professionals?.profiles?.full_name || 'Arts';
    const jobTitle = a.jobs?.title || 'Opdracht';
    items.push({
      id: `app-${a.id}`,
      type: 'application',
      title: `Sollicitatie: ${docName} op "${jobTitle}"`,
      subtitle: a.status,
      link: `/admin/reacties`,
      created_at: a.created_at,
    });
  });
  return items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 15);
}

export const demoActivity: ActivityItem[] = toActivityItems();

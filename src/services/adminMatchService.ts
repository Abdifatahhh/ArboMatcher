/**
 * Admin: match professionals to opdrachten (suggested candidates).
 * Respects consent: only include when canIncludeInSuggestedMatch; show name/CV only when canShareProfileCvInSuggestedMatch.
 */

import { supabase } from '../lib/supabase';
import type { Job, Doctor, Profile, Employer } from '../lib/types';
import { canIncludeInSuggestedMatch, canShareProfileCvInSuggestedMatch } from '../lib/consentSuggestions';

export interface JobWithEmployer {
  job: Job;
  employer: Employer | null;
}

export interface MatchedProfessional {
  professional: Doctor & { profiles: Profile | null };
  profile: Profile;
  matchScore: number;
  matchReasons: string[];
  canShareProfileCv: boolean;
}

export interface MatchResult {
  job: Job;
  employer: Employer | null;
  employerEmail: string | null;
  matches: MatchedProfessional[];
}

const PUBLISHED = 'PUBLISHED';

function normalize(s: string | null | undefined): string[] {
  if (!s || !s.trim()) return [];
  return s
    .toLowerCase()
    .split(/[\s,;]+/)
    .map((x) => x.trim())
    .filter(Boolean);
}

function scoreMatch(
  job: Job,
  professional: Doctor & { profiles: Profile | null }
): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;
  const jobRegions = normalize(job.region);
  const jobTypes = [...normalize(job.job_type), ...normalize(job.target_profession ?? '')];
  const proRegions = (professional.regions ?? []).map((r) => r.toLowerCase().trim());
  const proSpecialties = (professional.specialties ?? []).map((s) => s.toLowerCase().trim());
  const proProfession = (professional.profession_type ?? '').toLowerCase().trim();
  if (proProfession) jobTypes.push(proProfession);

  if (jobRegions.length > 0) {
    const overlap = jobRegions.some((r) => proRegions.some((pr) => pr.includes(r) || r.includes(pr)));
    if (overlap) {
      score += 2;
      reasons.push('Regio match');
    }
  } else {
    score += 1;
    reasons.push('Geen regio-eis');
  }

  const specialtyMatch = jobTypes.some(
    (jt) =>
      proSpecialties.some((s) => s.includes(jt) || jt.includes(s)) ||
      (proProfession && (jt.includes(proProfession) || proProfession.includes(jt)))
  );
  if (specialtyMatch) {
    score += 2;
    reasons.push('Specialisme match');
  } else if (jobTypes.length === 0) {
    score += 1;
  }

  if (professional.verification_status === 'VERIFIED') {
    score += 1;
    reasons.push('BIG geverifieerd');
  }

  return { score, reasons };
}

export async function listPublishedJobsForMatch(): Promise<JobWithEmployer[]> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*, employers(*)')
    .eq('status', PUBLISHED)
    .order('created_at', { ascending: false });

  if (error) throw error;
  const rows = (data ?? []) as (Job & { employers: Employer | null })[];
  return rows.map((r) => ({ job: r as Job, employer: r.employers ?? null }));
}

export async function getMatchesForJob(jobId: string): Promise<MatchResult | null> {
  const { data: jobRow, error: jobErr } = await supabase
    .from('jobs')
    .select('*, employers(*)')
    .eq('id', jobId)
    .maybeSingle();

  if (jobErr || !jobRow) return null;
  const job = jobRow as Job & { employers: Employer | null };
  const employer = job.employers ?? null;

  let employerEmail: string | null = null;
  if (employer?.user_id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', employer.user_id)
      .maybeSingle();
    employerEmail = (profile as { email?: string } | null)?.email ?? null;
  }

  const { data: applicants } = await supabase
    .from('applications')
    .select('doctor_id')
    .eq('job_id', jobId);
  const applicantIds = new Set((applicants ?? []).map((a: { doctor_id: string }) => a.doctor_id));

  const { data: pros, error: prosErr } = await supabase
    .from('professionals')
    .select('*, profiles!inner(*)')
    .eq('profiles.status', 'ACTIVE');

  if (prosErr) throw prosErr;
  const list = (pros ?? []) as (Doctor & { profiles: Profile | null })[];
  const withConsent = list.filter((r) => r.profiles && canIncludeInSuggestedMatch(r.profiles));
  const filtered = withConsent.filter((r) => !applicantIds.has(r.id));

  const matched: MatchedProfessional[] = filtered.map((r) => {
    const { score, reasons } = scoreMatch(job as Job, r);
    return {
      professional: r,
      profile: r.profiles!,
      matchScore: score,
      matchReasons: reasons,
      canShareProfileCv: canShareProfileCvInSuggestedMatch(r.profiles!),
    };
  });

  matched.sort((a, b) => b.matchScore - a.matchScore);

  return {
    job: job as Job,
    employer,
    employerEmail,
    matches: matched,
  };
}

export function buildSummaryForOrganisation(result: MatchResult, baseUrl: string): string {
  const { job, employer, matches } = result;
  const company = employer?.company_name ?? job.company_name ?? 'Organisatie';
  const lines: string[] = [
    `Beste ${company},`,
    '',
    `Bij uw opdracht "${job.title}" hebben we de volgende kandidaten die mogelijk aansluiten:`,
    '',
  ];
  const withName = matches.filter((m) => m.canShareProfileCv);
  const anonymousCount = matches.length - withName.length;
  if (withName.length > 0) {
    withName.forEach((m) => {
      const name = m.profile.full_name || 'Professional';
      const extra = m.matchReasons.length ? ` (${m.matchReasons.join(', ')})` : '';
      lines.push(`- ${name}${extra}`);
    });
  }
  if (anonymousCount > 0) {
    lines.push(`- ${anonymousCount} extra professional(s) die matchen (geen profiel gedeeld)`);
  }
  lines.push('', 'U kunt in het platform reageren of kandidaten uitnodigen.', `Opdracht: ${baseUrl}/opdrachten/${job.id}`, '');
  return lines.join('\n');
}

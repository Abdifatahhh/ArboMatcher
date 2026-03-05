/**
 * Admin Artsen (doctors) service.
 * Tables: doctors, profiles, applications.
 */

import { supabase } from '../lib/supabase';
import type { Doctor, Profile } from '../lib/types';

export type VerificationFilter = '' | 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
export type StatusFilter = '' | 'ACTIVE' | 'BLOCKED';

export interface AdminDoctorRow {
  doctor: Doctor & { profiles: Profile | null };
  profile: Profile;
  applications_count: number;
}

export interface ListDoctorsParams {
  verification?: VerificationFilter;
  status?: StatusFilter;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface ListDoctorsResult {
  data: AdminDoctorRow[];
  total: number;
}

const PAGE_SIZE_DEFAULT = 20;

/**
 * List artsen: doctors with profile (role ARTS).
 * Filters: verification_status, profiles.status, search (full_name, email, big_number).
 * Application counts in one extra query (no N+1).
 */
export async function listDoctors(params: ListDoctorsParams): Promise<ListDoctorsResult> {
  const { verification, status, search, page = 1, pageSize = PAGE_SIZE_DEFAULT } = params;

  let query = supabase
    .from('doctors')
    .select('*, profiles!inner(*)', { count: 'exact' })
    .eq('profiles.role', 'ARTS');

  if (verification && verification !== '') {
    query = query.eq('verification_status', verification);
  }
  if (status && status !== '') {
    query = query.eq('profiles.status', status);
  }
  if (search && search.trim() !== '') {
    const term = `%${search.trim()}%`;
    query = query.or(`big_number.ilike.${term},profiles.full_name.ilike.${term},profiles.email.ilike.${term}`);
  }

  query = query.order('created_at', { ascending: false });
  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data: rows, count, error } = await query;

  if (error) throw error;

  const list = (rows as (Doctor & { profiles: Profile | null })[]) || [];
  const total = count ?? 0;
  const withProfile = list.filter((r) => r.profiles != null);
  const doctorIds = withProfile.map((r) => r.id);

  let appCounts: Record<string, number> = {};
  if (doctorIds.length > 0) {
    const { data: appRows } = await supabase
      .from('applications')
      .select('doctor_id')
      .in('doctor_id', doctorIds);
    (appRows || []).forEach((r: { doctor_id: string }) => {
      appCounts[r.doctor_id] = (appCounts[r.doctor_id] ?? 0) + 1;
    });
  }

  const data: AdminDoctorRow[] = withProfile.map((r) => ({
    doctor: r,
    profile: r.profiles as Profile,
    applications_count: appCounts[r.id] ?? 0,
  }));

  return { data, total };
}

/**
 * Get one arts by doctor id.
 */
export async function getDoctorById(id: string): Promise<AdminDoctorRow | null> {
  const { data: doctor, error } = await supabase
    .from('doctors')
    .select('*, profiles(*)')
    .eq('id', id)
    .maybeSingle();

  if (error || !doctor) return null;
  const row = doctor as Doctor & { profiles: Profile | null };
  if (!row.profiles || row.profiles.role !== 'ARTS') return null;

  const { count } = await supabase
    .from('applications')
    .select('id', { count: 'exact', head: true })
    .eq('doctor_id', id);

  return {
    doctor: row,
    profile: row.profiles,
    applications_count: count ?? 0,
  };
}

/**
 * Toggle blocked: set profiles.status to BLOCKED or ACTIVE.
 */
export async function toggleDoctorBlocked(doctorId: string): Promise<{ error: Error | null }> {
  const row = await getDoctorById(doctorId);
  if (!row) return { error: new Error('Arts niet gevonden') };
  const newStatus = row.profile.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED';
  const { error } = await supabase.from('profiles').update({ status: newStatus }).eq('id', row.profile.id);
  return { error: error ?? null };
}

export interface ApplicationWithJob {
  id: string;
  status: string;
  created_at: string;
  jobs: { id: string; title: string } | null;
}

/**
 * List applications for one doctor (for detail page).
 */
export async function listDoctorApplications(
  doctorId: string,
  params: { page?: number; pageSize?: number } = {}
): Promise<{ data: ApplicationWithJob[]; total: number }> {
  const { page = 1, pageSize = 10 } = params;
  const from = (page - 1) * pageSize;

  const { data: apps, count, error } = await supabase
    .from('applications')
    .select('id, status, created_at, jobs(id, title)', { count: 'exact' })
    .eq('doctor_id', doctorId)
    .order('created_at', { ascending: false })
    .range(from, from + pageSize - 1);

  if (error) throw error;
  const list = (apps || []) as ApplicationWithJob[];
  return { data: list, total: count ?? 0 };
}

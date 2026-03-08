/**
 * Admin Abonnementen service.
 * List subscriptions with profile, filters (plan, status), search, pagination.
 */

import { supabase } from '../lib/supabase';
import type { Subscription, Profile } from '../lib/types';

export type SubscriptionPlan = 'GRATIS' | 'PRO';
export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED' | 'EXPIRED';

export interface AdminSubscriptionRow {
  subscription: Subscription;
  profile: Profile | null;
}

export interface ListSubscriptionsParams {
  plan?: SubscriptionPlan | '';
  status?: SubscriptionStatus | '';
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface ListSubscriptionsResult {
  data: AdminSubscriptionRow[];
  total: number;
}

const PAGE_SIZE_DEFAULT = 20;

export async function listSubscriptions(params: ListSubscriptionsParams): Promise<ListSubscriptionsResult> {
  const { plan, status, search, page = 1, pageSize = PAGE_SIZE_DEFAULT } = params;

  let query = supabase
    .from('subscriptions')
    .select('*, profiles(*)', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (plan && plan !== '') {
    query = query.eq('plan', plan);
  }
  if (status && status !== '') {
    query = query.eq('status', status);
  }
  if (search && search.trim() !== '') {
    const term = search.trim();
    const { data: profileRows } = await supabase
      .from('profiles')
      .select('id')
      .or(`email.ilike.%${term}%,full_name.ilike.%${term}%`);
    const userIds = (profileRows ?? []).map((r) => r.id);
    if (userIds.length === 0) return { data: [], total: 0 };
    query = query.in('user_id', userIds);
  }

  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data: rows, count, error } = await query;

  if (error) throw error;

  const list = (rows as (Subscription & { profiles: Profile | null })[]) ?? [];
  const data: AdminSubscriptionRow[] = list.map((r) => ({
    subscription: r as Subscription,
    profile: r.profiles ?? null,
  }));

  return { data, total: count ?? 0 };
}

export async function updateSubscription(
  id: string,
  updates: { plan?: SubscriptionPlan; status?: SubscriptionStatus; renew_at?: string | null }
): Promise<{ error: Error | null }> {
  const { error } = await supabase.from('subscriptions').update(updates).eq('id', id);
  return { error: error ?? null };
}

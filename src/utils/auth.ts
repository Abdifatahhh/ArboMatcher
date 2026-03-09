/**
 * Auth error categorization and profile get-or-create.
 */

import { AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Profile, UserRole, ConsentPreferences } from '../lib/types';

export type AuthErrorCategory =
  | 'invalid_credentials'
  | 'email_not_confirmed'
  | 'email_already_exists'
  | 'too_many_requests'
  | 'network_error'
  | 'permission_denied'
  | 'schema_error'
  | 'user_not_found'
  | 'unknown';

export interface AuthDiagnostic {
  timestamp: string;
  hostname: string;
  action: string;
  step: 'auth' | 'profile_fetch' | 'profile_create';
  status?: number;
  errorCode?: string;
  errorMessage?: string;
  category: AuthErrorCategory;
}

export interface CategorizedError {
  category: AuthErrorCategory;
  userMessage: string;
  technicalMessage: string;
}

export function categorizeAuthError(error: unknown, step: AuthDiagnostic['step'] = 'auth'): CategorizedError {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorCode = (error as AuthError)?.code || '';
  const status = (error as AuthError)?.status;

  const diagnostic: AuthDiagnostic = {
    timestamp: new Date().toISOString(),
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
    action: 'signInWithPassword',
    step,
    status,
    errorCode,
    errorMessage,
    category: 'unknown',
  };

  let result: CategorizedError;

  if (errorMessage.toLowerCase().includes('invalid login credentials') ||
      errorMessage.toLowerCase().includes('invalid email or password') ||
      errorCode === 'invalid_credentials') {
    diagnostic.category = 'invalid_credentials';
    result = {
      category: 'invalid_credentials',
      userMessage: 'Onjuiste e-mail of wachtwoord. Controleer uw gegevens en probeer opnieuw.',
      technicalMessage: errorMessage,
    };
  } else if (errorMessage.toLowerCase().includes('email not confirmed') ||
             errorCode === 'email_not_confirmed') {
    diagnostic.category = 'email_not_confirmed';
    result = {
      category: 'email_not_confirmed',
      userMessage: 'Uw e-mailadres is nog niet bevestigd. Controleer uw inbox.',
      technicalMessage: errorMessage,
    };
  } else if (errorMessage.toLowerCase().includes('already registered') ||
             errorMessage.toLowerCase().includes('already been registered') ||
             errorMessage.toLowerCase().includes('email already in use') ||
             errorMessage.toLowerCase().includes('user already exists') ||
             errorCode === 'user_already_exists') {
    diagnostic.category = 'email_already_exists';
    result = {
      category: 'email_already_exists',
      userMessage: 'Dit e-mailadres is al in gebruik. Log in of gebruik wachtwoord vergeten.',
      technicalMessage: errorMessage,
    };
  } else if (status === 429 || errorMessage.toLowerCase().includes('too many requests')) {
    diagnostic.category = 'too_many_requests';
    result = {
      category: 'too_many_requests',
      userMessage: 'Te veel pogingen. Wacht een minuut en probeer opnieuw.',
      technicalMessage: errorMessage,
    };
  } else if (errorMessage.toLowerCase().includes('fetch') ||
             errorMessage.toLowerCase().includes('network') ||
             errorMessage.toLowerCase().includes('failed to fetch') ||
             errorMessage.toLowerCase().includes('connection')) {
    diagnostic.category = 'network_error';
    result = {
      category: 'network_error',
      userMessage: 'Kan geen verbinding maken met de server. Controleer uw internetverbinding.',
      technicalMessage: errorMessage,
    };
  } else if (errorMessage.toLowerCase().includes('permission') ||
             errorMessage.toLowerCase().includes('rls') ||
             errorMessage.toLowerCase().includes('policy') ||
             errorCode === '42501') {
    diagnostic.category = 'permission_denied';
    result = {
      category: 'permission_denied',
      userMessage: 'Geen toegang tot deze gegevens. Neem contact op met de beheerder.',
      technicalMessage: `Permission/RLS error: ${errorMessage}`,
    };
  } else if (errorMessage.toLowerCase().includes('schema') ||
             errorMessage.toLowerCase().includes('relation') ||
             errorMessage.toLowerCase().includes('does not exist') ||
             errorMessage.toLowerCase().includes('table') ||
             errorCode === '42P01') {
    diagnostic.category = 'schema_error';
    result = {
      category: 'schema_error',
      userMessage: 'Er is een configuratieprobleem met de database. Neem contact op met de beheerder.',
      technicalMessage: `Schema/table error: ${errorMessage}`,
    };
  } else if (errorMessage.toLowerCase().includes('user not found')) {
    diagnostic.category = 'user_not_found';
    result = {
      category: 'user_not_found',
      userMessage: 'Gebruiker niet gevonden. Controleer uw e-mailadres.',
      technicalMessage: errorMessage,
    };
  } else {
    diagnostic.category = 'unknown';
    result = {
      category: 'unknown',
      userMessage: `Inloggen mislukt: ${errorMessage}`,
      technicalMessage: errorMessage,
    };
  }

  console.error('[Auth Diagnostic]', diagnostic);

  return result;
}

export async function getOrCreateProfile(
  userId: string,
  email: string,
  defaultRole: UserRole = 'professional',
  userMetadata?: Record<string, unknown>
): Promise<{ profile: Profile | null; error: CategorizedError | null }> {
  try {
    const { data: existingProfile, error: selectError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (selectError) {
      const categorized = categorizeAuthError(selectError, 'profile_fetch');
      return { profile: null, error: categorized };
    }

    if (existingProfile) {
      const needName = (existingProfile.full_name == null || existingProfile.full_name === '') && userMetadata?.full_name;
      const needPhone = (existingProfile.phone == null || existingProfile.phone === '') && userMetadata?.phone;
      const needConsent = userMetadata?.consent_preferences != null;
      if (needName || needPhone || needConsent) {
        const updates: { full_name?: string; phone?: string; consent_preferences?: ConsentPreferences } = {};
        if (needName) updates.full_name = String(userMetadata.full_name);
        if (needPhone) updates.phone = String(userMetadata.phone);
        if (needConsent) updates.consent_preferences = userMetadata.consent_preferences as ConsentPreferences;
        const { data: updated, error: updateErr } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', userId)
          .select()
          .single();
        if (!updateErr && updated) return { profile: updated, error: null };
      }
      return { profile: existingProfile, error: null };
    }

    const fullName = userMetadata?.full_name ?? (userMetadata?.first_name && userMetadata?.last_name
      ? `${userMetadata.first_name} ${userMetadata.last_name}`.trim()
      : null);
    const consent = (userMetadata?.consent_preferences as ConsentPreferences | undefined) ?? null;

    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email,
        role: defaultRole,
        full_name: fullName || null,
        avatar_url: null,
        phone: (userMetadata?.phone as string) || null,
        status: 'ACTIVE',
        consent_preferences: consent,
      })
      .select()
      .single();

    if (insertError) {
      const categorized = categorizeAuthError(insertError, 'profile_create');
      return { profile: null, error: categorized };
    }

    return { profile: newProfile, error: null };
  } catch (err) {
    const categorized = categorizeAuthError(err, 'profile_fetch');
    return { profile: null, error: categorized };
  }
}

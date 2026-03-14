/**
 * Business/platform emails via send-email Edge Function (Resend).
 * Auth emails (signup, reset, magic link, invite) go via Send Email Hook → send-auth-email.
 */

import { supabase } from '../lib/supabase';

export type EmailTemplate =
  | 'welcome'
  | 'new_application'
  | 'new_invite'
  | 'opdracht_geplaatst'
  | 'profiel_goedgekeurd'
  | 'profiel_afgewezen'
  | 'factuur'
  | 'account_bevestigd'
  | 'reactie_geaccepteerd'
  | 'reactie_afgewezen'
  | 'opdracht_verlopen'
  | 'herinnering_profiel'
  | 'nieuw_bericht'
  | 'abonnement_verlopen';

export interface SendTemplateEmailParams {
  to: string;
  template: EmailTemplate;
  data?: Record<string, string>;
}

export interface SendEmailResult {
  ok: boolean;
  error?: string;
  id?: string;
}

export async function sendTemplateEmail(params: SendTemplateEmailParams): Promise<SendEmailResult> {
  const { data, error } = await supabase.functions.invoke('send-email', {
    body: {
      to: params.to,
      template: params.template,
      data: params.data ?? {},
    },
  });
  if (error) return { ok: false, error: error.message };
  if (data?.error) return { ok: false, error: data.error };
  return { ok: true, id: data?.id };
}

// --- Bestaande templates ---

export async function sendWelcomeEmail(to: string, name?: string): Promise<SendEmailResult> {
  return sendTemplateEmail({ to, template: 'welcome', data: name ? { name } : {} });
}

export async function sendNewApplicationEmail(to: string, jobTitle: string, applicantName: string): Promise<SendEmailResult> {
  return sendTemplateEmail({
    to,
    template: 'new_application',
    data: { jobTitle, applicantName },
  });
}

export async function sendNewInviteEmail(to: string, jobTitle: string, inviterName: string): Promise<SendEmailResult> {
  return sendTemplateEmail({
    to,
    template: 'new_invite',
    data: { jobTitle, inviterName },
  });
}

export async function sendOpdrachtGeplaatstEmail(to: string, jobTitle: string): Promise<SendEmailResult> {
  return sendTemplateEmail({ to, template: 'opdracht_geplaatst', data: { jobTitle } });
}

export async function sendProfielGoedgekeurdEmail(to: string, name?: string): Promise<SendEmailResult> {
  return sendTemplateEmail({ to, template: 'profiel_goedgekeurd', data: name ? { name } : {} });
}

export async function sendFactuurEmail(to: string, factuurNr?: string): Promise<SendEmailResult> {
  return sendTemplateEmail({ to, template: 'factuur', data: factuurNr ? { factuurNr, invoiceNumber: factuurNr } : {} });
}

export async function sendAccountBevestigdEmail(to: string, name?: string): Promise<SendEmailResult> {
  return sendTemplateEmail({ to, template: 'account_bevestigd', data: name ? { name } : {} });
}

// --- Nieuwe templates ---

export async function sendProfielAfgewezenEmail(to: string, name?: string, reason?: string): Promise<SendEmailResult> {
  const data: Record<string, string> = {};
  if (name) data.name = name;
  if (reason) data.reason = reason;
  return sendTemplateEmail({ to, template: 'profiel_afgewezen', data });
}

export async function sendReactieGeaccepteerdEmail(to: string, jobTitle: string, employerName?: string): Promise<SendEmailResult> {
  const data: Record<string, string> = { jobTitle };
  if (employerName) data.employerName = employerName;
  return sendTemplateEmail({ to, template: 'reactie_geaccepteerd', data });
}

export async function sendReactieAfgewezenEmail(to: string, jobTitle: string): Promise<SendEmailResult> {
  return sendTemplateEmail({ to, template: 'reactie_afgewezen', data: { jobTitle } });
}

export async function sendOpdrachtVerlopenEmail(to: string, jobTitle: string): Promise<SendEmailResult> {
  return sendTemplateEmail({ to, template: 'opdracht_verlopen', data: { jobTitle } });
}

export async function sendHerinneringProfielEmail(to: string, name?: string): Promise<SendEmailResult> {
  return sendTemplateEmail({ to, template: 'herinnering_profiel', data: name ? { name } : {} });
}

export async function sendNieuwBerichtEmail(to: string, senderName: string): Promise<SendEmailResult> {
  return sendTemplateEmail({ to, template: 'nieuw_bericht', data: { senderName } });
}

export async function sendAbonnementVerlopenEmail(to: string, planName?: string, expiryDate?: string): Promise<SendEmailResult> {
  const data: Record<string, string> = {};
  if (planName) data.planName = planName;
  if (expiryDate) data.expiryDate = expiryDate;
  return sendTemplateEmail({ to, template: 'abonnement_verlopen', data });
}

/** Trigger from /verificatie-gelukt; sends "Account bevestigd" once per user (tracked in profile). */
export async function triggerAccountBevestigdEmail(): Promise<SendEmailResult> {
  const { data, error } = await supabase.functions.invoke('trigger-account-bevestigd-email', {
    method: 'POST',
  });
  if (error) return { ok: false, error: error.message };
  if (data?.error) return { ok: false, error: data.error };
  return { ok: true, id: data?.id };
}

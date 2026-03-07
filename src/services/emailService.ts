/**
 * Aanroep van de send-email Edge Function (Resend).
 * Stel RESEND_API_KEY in Supabase Edge Function secrets in.
 */

import { supabase } from '../lib/supabase';

export type EmailTemplate = 'welcome' | 'new_application' | 'new_invite';

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

/**
 * Verify Send Email Hook request using Standard Webhooks (Supabase Auth Hooks).
 * Secret from dashboard: "v1,whsec_<base64>". Library expects the key part.
 */
import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";

export interface AuthHookPayload {
  user: {
    id: string;
    email?: string;
    phone?: string;
    user_metadata?: Record<string, unknown>;
  };
  email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: string;
    site_url: string;
    token_new: string;
    token_hash_new: string;
    old_email?: string;
    old_phone?: string;
  };
}

export function getHookSecret(envSecret: string | undefined): string {
  if (!envSecret) return "";
  return envSecret.replace(/^v1,whsec_/, "");
}

export function verifyHook(
  rawBody: string,
  headers: Headers,
  secret: string
): AuthHookPayload {
  const wh = new Webhook(secret);
  const headersObj = Object.fromEntries(headers.entries());
  return wh.verify(rawBody, headersObj) as AuthHookPayload;
}

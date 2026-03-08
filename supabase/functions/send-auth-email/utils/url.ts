/**
 * Build Supabase Auth verify URL for email links (confirm, reset, magic link, invite).
 * See: https://supabase.com/docs/guides/auth/auth-hooks/send-email-hook
 */
export function buildVerifyUrl(params: {
  siteUrl: string;
  tokenHash: string;
  emailActionType: string;
  redirectTo?: string;
}): string {
  const { siteUrl, tokenHash, emailActionType, redirectTo } = params;
  const base = siteUrl.replace(/\/$/, "");
  const url = new URL("/auth/v1/verify", base);
  url.searchParams.set("token", tokenHash);
  url.searchParams.set("type", emailActionType);
  if (redirectTo && redirectTo.trim()) {
    url.searchParams.set("redirect_to", redirectTo.trim());
  }
  return url.toString();
}

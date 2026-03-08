/**
 * Send email via Resend. Used only by send-auth-email (auth hook).
 */
const RESEND_API = "https://api.resend.com/emails";

export interface SendOptions {
  to: string[];
  subject: string;
  html: string;
  from: string;
  replyTo?: string;
}

export async function sendWithResend(
  apiKey: string,
  options: SendOptions
): Promise<{ id?: string; error?: string }> {
  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: options.from,
      to: options.to,
      reply_to: options.replyTo,
      subject: options.subject,
      html: options.html,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { error: (data as { message?: string }).message ?? "Resend send failed" };
  }
  return { id: (data as { id?: string }).id };
}

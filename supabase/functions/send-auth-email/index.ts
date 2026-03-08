import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { verifyHook, getHookSecret, type AuthHookPayload } from "./utils/verify.ts";
import { sendWithResend } from "./utils/resend.ts";
import { buildVerifyUrl } from "./utils/url.ts";
import { renderVerifyEmail } from "./templates/verify-email.ts";
import { renderResetPassword } from "./templates/reset-password.ts";
import { renderMagicLink } from "./templates/magic-link.ts";
import { renderInvite } from "./templates/invite.ts";

const FROM = "ArboMatcher <noreply@arbomatcher.nl>";
const REPLY_TO = "support@arbomatcher.nl";

type ActionType =
  | "signup"
  | "recovery"
  | "magiclink"
  | "invite"
  | "email_change"
  | "reauthentication";

function getTemplate(
  actionType: string,
  payload: AuthHookPayload
): { subject: string; html: string } | null {
  const { email_data } = payload;
  const siteUrl = (email_data.site_url ?? "").replace(/\/$/, "");
  const redirectTo = email_data.redirect_to ?? "";
  const token = email_data.token ?? "";
  const tokenHash = email_data.token_hash ?? "";

  const verifyUrl = buildVerifyUrl({
    siteUrl,
    tokenHash,
    emailActionType: actionType,
    redirectTo,
  });

  switch (actionType) {
    case "signup":
      return renderVerifyEmail({ confirmUrl: verifyUrl, token });
    case "recovery":
      return renderResetPassword({ resetUrl: verifyUrl, token });
    case "magiclink":
      return renderMagicLink({ magicUrl: verifyUrl, token });
    case "invite":
      return renderInvite({ acceptUrl: verifyUrl, token, siteUrl });
    case "email_change":
    case "reauthentication": {
      const r = renderMagicLink({ magicUrl: verifyUrl, token });
      r.subject =
        actionType === "email_change"
          ? "Bevestig wijziging e-mailadres – ArboMatcher"
          : "Bevestig inloggen – ArboMatcher";
      return r;
    }
    default:
      return null;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, svix-id, svix-timestamp, svix-signature",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  console.log("[send-auth-email] POST received");
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const hookSecretRaw = Deno.env.get("SEND_EMAIL_HOOK_SECRET");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "RESEND_API_KEY not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
  const hookSecret = getHookSecret(hookSecretRaw);
  if (!hookSecret) {
    return new Response(
      JSON.stringify({ error: "SEND_EMAIL_HOOK_SECRET not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let payload: AuthHookPayload;
  try {
    const rawBody = await req.text();
    payload = verifyHook(rawBody, req.headers, hookSecret);
  } catch (err) {
    console.error("[send-auth-email] Hook verification failed:", err);
    return new Response(
      JSON.stringify({ error: "Invalid or missing webhook signature" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const email = payload.user?.email ?? payload.user?.user_metadata?.email;
  if (!email || typeof email !== "string") {
    return new Response(
      JSON.stringify({ error: "No recipient email in payload" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const actionType = (payload.email_data?.email_action_type ?? "") as ActionType;
  const supported: ActionType[] = [
    "signup",
    "recovery",
    "magiclink",
    "invite",
    "email_change",
    "reauthentication",
  ];
  if (!supported.includes(actionType)) {
    return new Response(
      JSON.stringify({ error: `Unsupported email_action_type: ${actionType}` }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const rendered = await getTemplate(actionType, payload);
  if (!rendered) {
    return new Response(
      JSON.stringify({ error: "No template for this action type" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const result = await sendWithResend(apiKey, {
    from: FROM,
    replyTo: REPLY_TO,
    to: [email],
    subject: rendered.subject,
    html: rendered.html,
  });

  if (result.error) {
    console.error("[send-auth-email] Resend error:", result.error);
    return new Response(
      JSON.stringify({ error: result.error }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  console.log("[send-auth-email] Email sent to", email, "type", actionType);
  return new Response(JSON.stringify({}), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

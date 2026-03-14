import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const C = {
  primary: "#059669",
  text: "#0F172A",
  textMuted: "#334155",
  bg: "#f0fdf4",
  white: "#ffffff",
  border: "#e2e8f0",
  footer: "#64748b",
} as const;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Authorization required" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!supabaseUrl || !supabaseAnonKey || !resendKey) {
    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error: userError } = await supabase.auth.getUser(token);
  if (userError || !user?.email) {
    return new Response(JSON.stringify({ error: "Invalid or expired session" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("account_bevestigd_email_sent")
    .eq("id", user.id)
    .single();

  if (profile?.account_bevestigd_email_sent) {
    return new Response(JSON.stringify({ ok: true, alreadySent: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const appUrl = Deno.env.get("PUBLIC_APP_URL") ?? "https://arbomatcher.nl";
  const name = (user.user_metadata?.full_name ?? user.user_metadata?.first_name ?? "").trim();

  const html = `<!DOCTYPE html>
<html lang="nl" xmlns="http://www.w3.org/1999/xhtml">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">
<title>ArboMatcher</title>
<style>
@media only screen and (max-width:600px){
  .email-container{padding:16px !important}
  .email-card{padding:24px 20px !important}
  .email-heading{font-size:20px !important}
  .email-cta{padding:14px 24px !important;font-size:15px !important}
}
</style>
</head>
<body style="margin:0;padding:0;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:${C.bg};-webkit-font-smoothing:antialiased">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg}">
<tr><td class="email-container" style="padding:32px 16px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto">
    <tr><td style="padding:0 0 24px;text-align:center">
      <span style="font-size:22px;font-weight:800;color:${C.text};letter-spacing:-0.3px">Arbo</span><span style="font-size:22px;font-weight:800;color:${C.primary};letter-spacing:-0.3px">Matcher</span>
    </td></tr>
    <tr><td class="email-card" style="background:${C.white};border-radius:16px;padding:40px 36px;box-shadow:0 1px 4px rgba(0,0,0,.06);border:1px solid ${C.border}">
      <h1 class="email-heading" style="margin:0 0 16px;font-size:24px;font-weight:700;color:${C.text};line-height:1.3">Account bevestigd</h1>
      <p style="margin:0 0 8px;font-size:16px;line-height:1.6;color:${C.textMuted}">${name ? `Beste ${name}, ` : ""}Uw e-mailadres is bevestigd en uw account is actief.</p>
      <p style="margin:0 0 8px;font-size:16px;line-height:1.6;color:${C.textMuted}">Maak uw profiel compleet om op opdrachten te kunnen reageren of om opdrachten te plaatsen.</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 0"><tr>
        <td style="border-radius:12px;background:${C.primary}">
          <a href="${appUrl}/login" class="email-cta" style="display:inline-block;padding:16px 32px;color:${C.white};text-decoration:none;font-weight:600;font-size:16px;line-height:1;border-radius:12px">Inloggen en profiel voltooien</a>
        </td>
      </tr></table>
    </td></tr>
    <tr><td style="padding:24px 0 0;text-align:center">
      <p style="margin:0 0 8px;font-size:12px;color:${C.footer};line-height:1.6">ArboMatcher B.V. — Het platform voor arbo-professionals</p>
      <p style="margin:0;font-size:12px;color:${C.footer};line-height:1.6">Vragen? <a href="mailto:support@arbomatcher.nl" style="color:${C.primary};text-decoration:underline">support@arbomatcher.nl</a></p>
    </td></tr>
  </table>
</td></tr>
</table>
</body></html>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "ArboMatcher <noreply@arbomatcher.nl>",
      reply_to: "support@arbomatcher.nl",
      to: [user.email],
      subject: "Uw account is bevestigd – ArboMatcher",
      html,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return new Response(
      JSON.stringify({ error: (err as { message?: string }).message ?? "Email send failed" }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ account_bevestigd_email_sent: true })
    .eq("id", user.id);
  if (updateError) {
    console.error("Failed to set account_bevestigd_email_sent:", updateError);
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});

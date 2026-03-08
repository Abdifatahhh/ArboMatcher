import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

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
<html lang="nl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;font-family:Inter,sans-serif;background:#f4faf4;padding:24px">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,.08);border:1px solid #e2e8f0">
    <div style="margin-bottom:24px"><span style="font-size:20px;font-weight:700;color:#4FA151">ArboMatcher</span></div>
    <h1 style="margin:0 0 16px;font-size:22px;color:#0f172a">Account bevestigd</h1>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.5;color:#334155">${name ? `Beste ${name}, ` : ""}Je e-mailadres is bevestigd. Je account is actief.</p>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.5;color:#334155">Maak je profiel compleet om op opdrachten te kunnen reageren of om opdrachten te plaatsen. Log in en vul je gegevens in op je dashboard.</p>
    <p style="margin:0"><a href="${appUrl}/login" style="display:inline-block;padding:14px 28px;background:#4fa151;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">Inloggen en profiel afmaken</a></p>
    <p style="margin:32px 0 0;font-size:12px;color:#64748b;line-height:1.5">ArboMatcher – het platform voor arbo-professionals. Vragen? <a href="mailto:support@arbomatcher.nl" style="color:#4FA151">support@arbomatcher.nl</a></p>
  </div>
</body>
</html>`;

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
      subject: "Je account is bevestigd – ArboMatcher",
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

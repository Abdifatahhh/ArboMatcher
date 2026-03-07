import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const RESEND_API = "https://api.resend.com/emails";

function htmlLayout(body: string, preheader?: string): string {
  return `<!DOCTYPE html>
<html lang="nl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;font-family:Inter,sans-serif;background:#f4faf4;padding:24px">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,.08)">
    <p style="margin:0 0 24px;font-size:14px;color:#64748b">${preheader ?? "ArboMatcher"}</p>
    ${body}
    <p style="margin:24px 0 0;font-size:12px;color:#94a3b8">ArboMatcher – het platform voor bedrijfsartsen en arbo-professionals</p>
  </div>
</body>
</html>`;
}

function renderWelcome(name: string): { subject: string; html: string } {
  const subject = "Welkom bij ArboMatcher";
  const body = `
    <h1 style="margin:0 0 16px;font-size:22px;color:#0f172a">Welkom${name ? `, ${name}` : ""}</h1>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.5;color:#334155">Je account is actief. Log in op ArboMatcher om je profiel af te maken en opdrachten te bekijken of te plaatsen.</p>
    <p style="margin:0"><a href="{{BASE_URL}}/login" style="display:inline-block;padding:12px 24px;background:#4fa151;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">Inloggen</a></p>
  `;
  return { subject, html: htmlLayout(body.replace("{{BASE_URL}}", Deno.env.get("PUBLIC_APP_URL") ?? "https://arbomatcher.nl"), "Je kunt nu inloggen.") };
}

function renderNewApplication(data: Record<string, string>): { subject: string; html: string } {
  const jobTitle = data.jobTitle ?? "een opdracht";
  const applicantName = data.applicantName ?? "Een professional";
  const subject = `Nieuwe reactie op "${jobTitle}"`;
  const base = Deno.env.get("PUBLIC_APP_URL") ?? "https://arbomatcher.nl";
  const body = `
    <h1 style="margin:0 0 16px;font-size:22px;color:#0f172a">Nieuwe reactie</h1>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.5;color:#334155">${applicantName} heeft gereageerd op je opdracht <strong>${jobTitle}</strong>.</p>
    <p style="margin:0"><a href="${base}/opdrachtgever/kandidaten" style="display:inline-block;padding:12px 24px;background:#4fa151;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">Bekijk kandidaten</a></p>
  `;
  return { subject, html: htmlLayout(body, "Nieuwe reactie op je opdracht.") };
}

function renderNewInvite(data: Record<string, string>): { subject: string; html: string } {
  const jobTitle = data.jobTitle ?? "een opdracht";
  const inviterName = data.inviterName ?? "Een opdrachtgever";
  const subject = `Uitnodiging voor "${jobTitle}"`;
  const base = Deno.env.get("PUBLIC_APP_URL") ?? "https://arbomatcher.nl";
  const body = `
    <h1 style="margin:0 0 16px;font-size:22px;color:#0f172a">Uitnodiging ontvangen</h1>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.5;color:#334155">${inviterName} nodigt je uit om te reageren op de opdracht <strong>${jobTitle}</strong>.</p>
    <p style="margin:0"><a href="${base}/arts/uitnodigingen" style="display:inline-block;padding:12px 24px;background:#4fa151;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">Bekijk uitnodigingen</a></p>
  `;
  return { subject, html: htmlLayout(body, "Nieuwe uitnodiging voor een opdracht.") };
}

function renderTemplate(template: string, data: Record<string, string>): { subject: string; html: string } | null {
  switch (template) {
    case "welcome":
      return renderWelcome(data.name ?? data.recipientName ?? "");
    case "new_application":
      return renderNewApplication(data);
    case "new_invite":
      return renderNewInvite(data);
    default:
      return null;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Alleen POST toegestaan." }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "RESEND_API_KEY is niet geconfigureerd." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const from = Deno.env.get("RESEND_FROM") ?? "ArboMatcher <onboarding@resend.dev>";

  try {
    const body = (await req.json().catch(() => ({}))) as {
      to?: string | string[];
      template?: string;
      data?: Record<string, string>;
      subject?: string;
      html?: string;
    };

    const to = body.to;
    if (!to || (Array.isArray(to) && to.length === 0)) {
      return new Response(
        JSON.stringify({ error: "Velden 'to' (e-mailadres) is verplicht." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let subject: string;
    let html: string;

    if (body.template) {
      const rendered = renderTemplate(body.template, body.data ?? {});
      if (!rendered) {
        return new Response(
          JSON.stringify({ error: `Onbekend template: ${body.template}. Geldig: welcome, new_application, new_invite` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      subject = rendered.subject;
      html = rendered.html;
    } else if (typeof body.subject === "string" && typeof body.html === "string") {
      subject = body.subject;
      html = body.html;
    } else {
      return new Response(
        JSON.stringify({ error: "Geef 'template' + optioneel 'data', of 'subject' + 'html'." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const res = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      }),
    });

    const resJson = await res.json().catch(() => ({}));
    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: resJson.message ?? resJson.error ?? "Verzenden mislukt.", details: resJson }),
        { status: res.status >= 400 ? res.status : 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true, id: resJson.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Serverfout." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

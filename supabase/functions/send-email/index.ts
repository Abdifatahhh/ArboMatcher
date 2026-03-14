import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const RESEND_API = "https://api.resend.com/emails";
const FROM_DEFAULT = "ArboMatcher <noreply@arbomatcher.nl>";
const REPLY_TO_DEFAULT = "support@arbomatcher.nl";

const C = {
  primary: "#059669",
  text: "#0F172A",
  textMuted: "#334155",
  bg: "#f0fdf4",
  white: "#ffffff",
  border: "#e2e8f0",
  footer: "#64748b",
} as const;

function htmlLayout(body: string, preheader?: string): string {
  return `<!DOCTYPE html>
<html lang="nl" xmlns="http://www.w3.org/1999/xhtml">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">
<title>ArboMatcher</title>
${preheader ? `<span style="display:none;font-size:0;color:${C.bg};line-height:0;max-height:0;max-width:0;opacity:0;overflow:hidden">${preheader}</span>` : ""}
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
      ${body}
    </td></tr>
    <tr><td style="padding:24px 0 0;text-align:center">
      <p style="margin:0 0 8px;font-size:12px;color:${C.footer};line-height:1.6">ArboMatcher B.V. — Het platform voor arbo-professionals</p>
      <p style="margin:0;font-size:12px;color:${C.footer};line-height:1.6">Vragen? <a href="mailto:support@arbomatcher.nl" style="color:${C.primary};text-decoration:underline">support@arbomatcher.nl</a></p>
    </td></tr>
  </table>
</td></tr>
</table>
</body></html>`;
}

function cta(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 0"><tr>
    <td style="border-radius:12px;background:${C.primary}">
      <a href="${href}" class="email-cta" style="display:inline-block;padding:16px 32px;color:${C.white};text-decoration:none;font-weight:600;font-size:16px;line-height:1;border-radius:12px">${label}</a>
    </td>
  </tr></table>`;
}

function heading(text: string): string {
  return `<h1 class="email-heading" style="margin:0 0 16px;font-size:24px;font-weight:700;color:${C.text};line-height:1.3">${text}</h1>`;
}

function para(text: string): string {
  return `<p style="margin:0 0 8px;font-size:16px;line-height:1.6;color:${C.textMuted}">${text}</p>`;
}

function footnote(text: string): string {
  return `<p style="margin:24px 0 0;font-size:13px;color:${C.footer};line-height:1.5">${text}</p>`;
}

function baseUrl(): string {
  return Deno.env.get("PUBLIC_APP_URL") ?? "https://arbomatcher.nl";
}

function renderWelcome(name: string): { subject: string; html: string } {
  const body = `
    ${heading(`Welkom${name ? `, ${name}` : ""}`)}
    ${para("Uw account is actief. Log in op ArboMatcher om uw profiel af te maken en opdrachten te bekijken of te plaatsen.")}
    ${cta(`${baseUrl()}/login`, "Inloggen")}
  `;
  return { subject: "Welkom bij ArboMatcher", html: htmlLayout(body, "Uw account is actief — log nu in.") };
}

function renderNewApplication(data: Record<string, string>): { subject: string; html: string } {
  const jobTitle = data.jobTitle ?? "een opdracht";
  const applicantName = data.applicantName ?? "Een professional";
  const body = `
    ${heading("Nieuwe reactie")}
    ${para(`${applicantName} heeft gereageerd op uw opdracht <strong>${jobTitle}</strong>.`)}
    ${cta(`${baseUrl()}/opdrachtgever/kandidaten`, "Bekijk kandidaten")}
  `;
  return { subject: `Nieuwe reactie op "${jobTitle}"`, html: htmlLayout(body, "Nieuwe reactie op uw opdracht.") };
}

function renderNewInvite(data: Record<string, string>): { subject: string; html: string } {
  const jobTitle = data.jobTitle ?? "een opdracht";
  const inviterName = data.inviterName ?? "Een organisatie";
  const body = `
    ${heading("Uitnodiging ontvangen")}
    ${para(`${inviterName} nodigt u uit om te reageren op de opdracht <strong>${jobTitle}</strong>.`)}
    ${cta(`${baseUrl()}/professional/uitnodigingen`, "Bekijk uitnodigingen")}
  `;
  return { subject: `Uitnodiging voor "${jobTitle}"`, html: htmlLayout(body, "Nieuwe uitnodiging voor een opdracht.") };
}

function renderOpdrachtGeplaatst(data: Record<string, string>): { subject: string; html: string } {
  const jobTitle = data.jobTitle ?? "Uw opdracht";
  const body = `
    ${heading("Opdracht geplaatst")}
    ${para(`Uw opdracht <strong>${jobTitle}</strong> staat live. Professionals kunnen nu reageren.`)}
    ${cta(`${baseUrl()}/opdrachtgever/opdrachten`, "Bekijk opdrachten")}
  `;
  return { subject: `Opdracht "${jobTitle}" is geplaatst`, html: htmlLayout(body, "Uw opdracht staat live.") };
}

function renderProfielGoedgekeurd(data: Record<string, string>): { subject: string; html: string } {
  const name = data.name ?? data.recipientName ?? "";
  const body = `
    ${heading("Profiel goedgekeurd")}
    ${para(`${name ? `Beste ${name}, ` : ""}Uw profiel is goedgekeurd. U kunt nu volledig deelnemen aan het platform.`)}
    ${cta(`${baseUrl()}/login`, "Inloggen")}
  `;
  return { subject: "Uw profiel is goedgekeurd – ArboMatcher", html: htmlLayout(body, "Profiel goedgekeurd.") };
}

function renderFactuur(data: Record<string, string>): { subject: string; html: string } {
  const factuurNr = data.factuurNr ?? data.invoiceNumber ?? "";
  const body = `
    ${heading("Factuur beschikbaar")}
    ${para(`Er is een nieuwe factuur voor u beschikbaar${factuurNr ? `: <strong>${factuurNr}</strong>` : ""}.`)}
    ${cta(`${baseUrl()}/account/facturen`, "Bekijk facturen")}
  `;
  return { subject: factuurNr ? `Factuur ${factuurNr} – ArboMatcher` : "Nieuwe factuur – ArboMatcher", html: htmlLayout(body, "Factuur beschikbaar.") };
}

function renderAccountBevestigd(data: Record<string, string>): { subject: string; html: string } {
  const name = data.name ?? data.recipientName ?? "";
  const body = `
    ${heading("Account bevestigd")}
    ${para(`${name ? `Beste ${name}, ` : ""}Uw e-mailadres is bevestigd en uw account is actief.`)}
    ${para("Maak uw profiel compleet om op opdrachten te kunnen reageren of om opdrachten te plaatsen.")}
    ${cta(`${baseUrl()}/login`, "Inloggen en profiel voltooien")}
  `;
  return { subject: "Uw account is bevestigd – ArboMatcher", html: htmlLayout(body, "Account bevestigd. Maak uw profiel compleet.") };
}

function renderProfielAfgewezen(data: Record<string, string>): { subject: string; html: string } {
  const name = data.name ?? data.recipientName ?? "";
  const reason = data.reason ?? "";
  const body = `
    ${heading("Profiel niet goedgekeurd")}
    ${para(`${name ? `Beste ${name}, ` : ""}Na beoordeling van uw profiel kunnen wij dit helaas nog niet goedkeuren.`)}
    ${reason ? para(`<strong>Reden:</strong> ${reason}`) : ""}
    ${para("U kunt uw profiel aanpassen en opnieuw indienen. Neem gerust contact op als u vragen heeft.")}
    ${cta(`${baseUrl()}/login`, "Profiel aanpassen")}
  `;
  return { subject: "Uw profiel is niet goedgekeurd – ArboMatcher", html: htmlLayout(body, "Pas uw profiel aan en dien opnieuw in.") };
}

function renderReactieGeaccepteerd(data: Record<string, string>): { subject: string; html: string } {
  const jobTitle = data.jobTitle ?? "een opdracht";
  const employerName = data.employerName ?? "De organisatie";
  const body = `
    ${heading("Reactie geaccepteerd")}
    ${para(`Goed nieuws! ${employerName} heeft uw reactie op <strong>${jobTitle}</strong> geaccepteerd.`)}
    ${para("U kunt nu in contact treden om de verdere details te bespreken.")}
    ${cta(`${baseUrl()}/professional/reacties`, "Bekijk details")}
  `;
  return { subject: `Uw reactie op "${jobTitle}" is geaccepteerd`, html: htmlLayout(body, "Uw reactie is geaccepteerd!") };
}

function renderReactieAfgewezen(data: Record<string, string>): { subject: string; html: string } {
  const jobTitle = data.jobTitle ?? "een opdracht";
  const body = `
    ${heading("Update over uw reactie")}
    ${para(`Helaas is uw reactie op <strong>${jobTitle}</strong> niet geselecteerd.`)}
    ${para("Er zijn regelmatig nieuwe opdrachten beschikbaar. Bekijk het aanbod en reageer op opdrachten die bij u passen.")}
    ${cta(`${baseUrl()}/professional/opdrachten`, "Bekijk opdrachten")}
  `;
  return { subject: `Update over uw reactie op "${jobTitle}"`, html: htmlLayout(body, "Bekijk nieuwe opdrachten.") };
}

function renderOpdrachtVerlopen(data: Record<string, string>): { subject: string; html: string } {
  const jobTitle = data.jobTitle ?? "Uw opdracht";
  const body = `
    ${heading("Opdracht verlopen")}
    ${para(`Uw opdracht <strong>${jobTitle}</strong> is verlopen en niet meer zichtbaar voor professionals.`)}
    ${para("U kunt de opdracht verlengen of een nieuwe opdracht plaatsen.")}
    ${cta(`${baseUrl()}/opdrachtgever/opdrachten`, "Opdrachten beheren")}
  `;
  return { subject: `Opdracht "${jobTitle}" is verlopen`, html: htmlLayout(body, "Uw opdracht is verlopen.") };
}

function renderHerinneringProfiel(data: Record<string, string>): { subject: string; html: string } {
  const name = data.name ?? data.recipientName ?? "";
  const body = `
    ${heading("Uw profiel is nog niet compleet")}
    ${para(`${name ? `Beste ${name}, ` : ""}U heeft zich aangemeld bij ArboMatcher, maar uw profiel is nog niet volledig ingevuld.`)}
    ${para("Een compleet profiel vergroot uw zichtbaarheid en de kans om gematcht te worden met relevante opdrachten.")}
    ${cta(`${baseUrl()}/login`, "Profiel voltooien")}
  `;
  return { subject: "Vergeet niet uw profiel te voltooien – ArboMatcher", html: htmlLayout(body, "Maak uw profiel compleet.") };
}

function renderNieuwBericht(data: Record<string, string>): { subject: string; html: string } {
  const senderName = data.senderName ?? "Iemand";
  const body = `
    ${heading("Nieuw bericht ontvangen")}
    ${para(`U heeft een nieuw bericht ontvangen van <strong>${senderName}</strong> op ArboMatcher.`)}
    ${cta(`${baseUrl()}/inbox`, "Bericht bekijken")}
  `;
  return { subject: `Nieuw bericht van ${senderName} – ArboMatcher`, html: htmlLayout(body, "U heeft een nieuw bericht.") };
}

function renderAbonnementVerlopen(data: Record<string, string>): { subject: string; html: string } {
  const planName = data.planName ?? "Uw abonnement";
  const expiryDate = data.expiryDate ?? "";
  const body = `
    ${heading("Abonnement verloopt binnenkort")}
    ${para(`${planName} verloopt${expiryDate ? ` op <strong>${expiryDate}</strong>` : " binnenkort"}.`)}
    ${para("Verleng uw abonnement om zonder onderbreking toegang te houden tot alle functies van ArboMatcher.")}
    ${cta(`${baseUrl()}/account/abonnement`, "Abonnement verlengen")}
  `;
  return { subject: "Uw abonnement verloopt binnenkort – ArboMatcher", html: htmlLayout(body, "Verleng uw abonnement.") };
}

function renderTemplate(template: string, data: Record<string, string>): { subject: string; html: string } | null {
  switch (template) {
    case "welcome":
      return renderWelcome(data.name ?? data.recipientName ?? "");
    case "new_application":
      return renderNewApplication(data);
    case "new_invite":
      return renderNewInvite(data);
    case "opdracht_geplaatst":
      return renderOpdrachtGeplaatst(data);
    case "profiel_goedgekeurd":
      return renderProfielGoedgekeurd(data);
    case "profiel_afgewezen":
      return renderProfielAfgewezen(data);
    case "factuur":
      return renderFactuur(data);
    case "account_bevestigd":
      return renderAccountBevestigd(data);
    case "reactie_geaccepteerd":
      return renderReactieGeaccepteerd(data);
    case "reactie_afgewezen":
      return renderReactieAfgewezen(data);
    case "opdracht_verlopen":
      return renderOpdrachtVerlopen(data);
    case "herinnering_profiel":
      return renderHerinneringProfiel(data);
    case "nieuw_bericht":
      return renderNieuwBericht(data);
    case "abonnement_verlopen":
      return renderAbonnementVerlopen(data);
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

  const from = Deno.env.get("RESEND_FROM") ?? FROM_DEFAULT;
  const replyTo = Deno.env.get("RESEND_REPLY_TO") ?? REPLY_TO_DEFAULT;

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
        JSON.stringify({ error: "Veld 'to' (e-mailadres) is verplicht." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let subject: string;
    let html: string;

    if (body.template) {
      const rendered = renderTemplate(body.template, body.data ?? {});
      if (!rendered) {
        return new Response(
          JSON.stringify({ error: `Onbekend template: ${body.template}. Geldig: welcome, new_application, new_invite, opdracht_geplaatst, profiel_goedgekeurd, profiel_afgewezen, factuur, account_bevestigd, reactie_geaccepteerd, reactie_afgewezen, opdracht_verlopen, herinnering_profiel, nieuw_bericht, abonnement_verlopen` }),
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
        reply_to: replyTo,
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

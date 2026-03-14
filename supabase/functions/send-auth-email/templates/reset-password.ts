import { wrapBody, ctaButton, LAYOUT } from "./layout.ts";

export function renderResetPassword(params: {
  resetUrl: string;
  token: string;
}): { subject: string; html: string } {
  const { resetUrl } = params;
  const body = `
    <h1 class="email-heading" style="margin:0 0 16px;font-size:24px;font-weight:700;color:${LAYOUT.text};line-height:1.3">Wachtwoord opnieuw instellen</h1>
    <p style="margin:0 0 8px;font-size:16px;line-height:1.6;color:${LAYOUT.textMuted}">U heeft een verzoek ingediend om uw wachtwoord te wijzigen. Klik op de knop hieronder om een nieuw wachtwoord in te stellen.</p>
    ${ctaButton(resetUrl, "Nieuw wachtwoord instellen")}
    <p style="margin:24px 0 0;font-size:13px;color:${LAYOUT.footer};line-height:1.5">Heeft u dit niet aangevraagd? Dan kunt u deze e-mail negeren. Uw wachtwoord blijft ongewijzigd.</p>
  `;
  return {
    subject: "Wachtwoord opnieuw instellen – ArboMatcher",
    html: wrapBody(body, "Stel uw wachtwoord opnieuw in"),
  };
}

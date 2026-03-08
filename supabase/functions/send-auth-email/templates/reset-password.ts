import { wrapBody, ctaButton, LAYOUT } from "./layout.ts";

export function renderResetPassword(params: {
  resetUrl: string;
  token: string;
}): { subject: string; html: string } {
  const { resetUrl } = params;
  const body = `
    <h1 style="margin:0 0 16px;font-size:22px;color:${LAYOUT.text}">Wachtwoord opnieuw instellen</h1>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.5;color:${LAYOUT.textMuted}">Je hebt een verzoek gedaan om je wachtwoord te wijzigen. Klik op de knop om een nieuw wachtwoord in te stellen.</p>
    ${ctaButton(resetUrl, "Wachtwoord instellen")}
    <p style="margin:24px 0 0;font-size:14px;color:${LAYOUT.textMuted}">Als je dit niet hebt aangevraagd, kun je deze e-mail negeren. Je wachtwoord blijft dan ongewijzigd.</p>
  `;
  return {
    subject: "Wachtwoord opnieuw instellen – ArboMatcher",
    html: wrapBody(body, "Stel je wachtwoord opnieuw in"),
  };
}

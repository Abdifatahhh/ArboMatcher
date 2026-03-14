import { wrapBody, ctaButton, LAYOUT } from "./layout.ts";

export function renderVerifyEmail(params: {
  confirmUrl: string;
  token: string;
}): { subject: string; html: string } {
  const { confirmUrl } = params;
  const body = `
    <h1 class="email-heading" style="margin:0 0 16px;font-size:24px;font-weight:700;color:${LAYOUT.text};line-height:1.3">Bevestig uw e-mailadres</h1>
    <p style="margin:0 0 8px;font-size:16px;line-height:1.6;color:${LAYOUT.textMuted}">Welkom bij ArboMatcher. Klik op de knop hieronder om uw e-mailadres te bevestigen en uw account te activeren.</p>
    ${ctaButton(confirmUrl, "E-mailadres bevestigen")}
    <p style="margin:24px 0 0;font-size:13px;color:${LAYOUT.footer};line-height:1.5">Heeft u geen account aangemaakt? Dan kunt u deze e-mail negeren.</p>
  `;
  return {
    subject: "Bevestig uw e-mailadres – ArboMatcher",
    html: wrapBody(body, "Bevestig uw e-mailadres voor ArboMatcher"),
  };
}

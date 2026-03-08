import { wrapBody, ctaButton, LAYOUT } from "./layout.ts";

export function renderVerifyEmail(params: {
  confirmUrl: string;
  token: string;
}): { subject: string; html: string } {
  const { confirmUrl } = params;
  const body = `
    <h1 style="margin:0 0 16px;font-size:22px;color:${LAYOUT.text}">Bevestig je e-mailadres</h1>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.5;color:${LAYOUT.textMuted}">Welkom bij ArboMatcher. Klik op de knop hieronder om je account te bevestigen.</p>
    ${ctaButton(confirmUrl, "Bevestig e-mailadres")}
    <p style="margin:24px 0 0;font-size:14px;color:${LAYOUT.textMuted}">Als je geen account hebt aangemaakt, kun je deze e-mail negeren.</p>
  `;
  return {
    subject: "Bevestig je e-mailadres – ArboMatcher",
    html: wrapBody(body, "Bevestig je e-mailadres voor ArboMatcher"),
  };
}

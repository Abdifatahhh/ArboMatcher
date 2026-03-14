import { wrapBody, ctaButton, LAYOUT } from "./layout.ts";

export function renderMagicLink(params: {
  magicUrl: string;
  token: string;
}): { subject: string; html: string } {
  const { magicUrl } = params;
  const body = `
    <h1 class="email-heading" style="margin:0 0 16px;font-size:24px;font-weight:700;color:${LAYOUT.text};line-height:1.3">Uw inloglink</h1>
    <p style="margin:0 0 8px;font-size:16px;line-height:1.6;color:${LAYOUT.textMuted}">Klik op de knop hieronder om direct in te loggen op ArboMatcher. Deze link is eenmalig geldig.</p>
    ${ctaButton(magicUrl, "Inloggen")}
    <p style="margin:24px 0 0;font-size:13px;color:${LAYOUT.footer};line-height:1.5">Heeft u niet om deze link gevraagd? Dan kunt u deze e-mail negeren.</p>
  `;
  return {
    subject: "Uw inloglink – ArboMatcher",
    html: wrapBody(body, "Log in met deze link"),
  };
}

import { wrapBody, ctaButton, LAYOUT } from "./layout.ts";

export function renderMagicLink(params: {
  magicUrl: string;
  token: string;
}): { subject: string; html: string } {
  const { magicUrl } = params;
  const body = `
    <h1 style="margin:0 0 16px;font-size:22px;color:${LAYOUT.text}">Inloglink</h1>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.5;color:${LAYOUT.textMuted}">Klik op de knop hieronder om direct in te loggen op ArboMatcher. Deze link is eenmalig geldig.</p>
    ${ctaButton(magicUrl, "Inloggen")}
    <p style="margin:24px 0 0;font-size:14px;color:${LAYOUT.textMuted}">Als je niet om deze link hebt gevraagd, kun je deze e-mail negeren.</p>
  `;
  return {
    subject: "Je inloglink – ArboMatcher",
    html: wrapBody(body, "Log in met deze link"),
  };
}

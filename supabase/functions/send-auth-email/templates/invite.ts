import { wrapBody, ctaButton, LAYOUT } from "./layout.ts";

export function renderInvite(params: {
  acceptUrl: string;
  token: string;
  siteUrl: string;
}): { subject: string; html: string } {
  const { acceptUrl } = params;
  const body = `
    <h1 class="email-heading" style="margin:0 0 16px;font-size:24px;font-weight:700;color:${LAYOUT.text};line-height:1.3">U bent uitgenodigd</h1>
    <p style="margin:0 0 8px;font-size:16px;line-height:1.6;color:${LAYOUT.textMuted}">U bent uitgenodigd om een account aan te maken op ArboMatcher. Klik op de knop hieronder om de uitnodiging te accepteren en uw account in te richten.</p>
    ${ctaButton(acceptUrl, "Uitnodiging accepteren")}
    <p style="margin:24px 0 0;font-size:13px;color:${LAYOUT.footer};line-height:1.5">Deze uitnodiging is gekoppeld aan dit e-mailadres. Negeer deze e-mail als u niet verwacht werd uitgenodigd.</p>
  `;
  return {
    subject: "Uitnodiging voor ArboMatcher",
    html: wrapBody(body, "Accepteer uw uitnodiging voor ArboMatcher"),
  };
}

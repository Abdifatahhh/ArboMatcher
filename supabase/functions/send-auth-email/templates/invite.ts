import { wrapBody, ctaButton, LAYOUT } from "./layout.ts";

export function renderInvite(params: {
  acceptUrl: string;
  token: string;
  siteUrl: string;
}): { subject: string; html: string } {
  const { acceptUrl } = params;
  const body = `
    <h1 style="margin:0 0 16px;font-size:22px;color:${LAYOUT.text}">Je bent uitgenodigd</h1>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.5;color:${LAYOUT.textMuted}">Je bent uitgenodigd om een account aan te maken op ArboMatcher. Klik op de knop om de uitnodiging te accepteren en je account in te richten.</p>
    ${ctaButton(acceptUrl, "Uitnodiging accepteren")}
    <p style="margin:24px 0 0;font-size:14px;color:${LAYOUT.textMuted}">Deze uitnodiging is gekoppeld aan dit e-mailadres. Negeer deze e-mail als je niet verwacht werd uitgenodigd.</p>
  `;
  return {
    subject: "Uitnodiging voor ArboMatcher",
    html: wrapBody(body, "Accepteer je uitnodiging voor ArboMatcher"),
  };
}

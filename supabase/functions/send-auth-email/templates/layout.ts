/**
 * Shared ArboMatcher email layout: modern, zakelijk, betrouwbaar.
 * Kleuren: primary #4FA151, primary-dark #3E8E45, text #0f172a, gray #334155.
 */
export const LAYOUT = {
  primary: "#4FA151",
  primaryDark: "#3E8E45",
  text: "#0F172A",
  textMuted: "#334155",
  bg: "#f4faf4",
  white: "#ffffff",
  border: "#e2e8f0",
  footer: "#64748b",
} as const;

export function wrapBody(body: string, preheader?: string): string {
  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>ArboMatcher</title>
  ${preheader ? `<meta name="description" content="${preheader.replace(/"/g, "&quot;")}">` : ""}
</head>
<body style="margin:0;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:${LAYOUT.bg};padding:24px">
  <div style="max-width:560px;margin:0 auto;background:${LAYOUT.white};border-radius:12px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,.08);border:1px solid ${LAYOUT.border}">
    <div style="margin-bottom:24px">
      <span style="font-size:20px;font-weight:700;color:${LAYOUT.primary}">ArboMatcher</span>
    </div>
    ${body}
    <p style="margin:32px 0 0;font-size:12px;color:${LAYOUT.footer};line-height:1.5">
      ArboMatcher – het platform voor arbo-professionals.<br>
      Vragen? Mail naar <a href="mailto:support@arbomatcher.nl" style="color:${LAYOUT.primary}">support@arbomatcher.nl</a>
    </p>
  </div>
</body>
</html>`;
}

export function ctaButton(href: string, label: string): string {
  return `<p style="margin:24px 0 0"><a href="${href}" style="display:inline-block;padding:14px 28px;background:${LAYOUT.primary};color:${LAYOUT.white};text-decoration:none;border-radius:8px;font-weight:600;font-size:16px">${label}</a></p>`;
}

export function otpCode(token: string): string {
  return `<p style="margin:16px 0 0;font-size:14px;color:${LAYOUT.textMuted}">Of gebruik deze code: <strong style="font-size:18px;letter-spacing:2px;color:${LAYOUT.text}">${token}</strong></p>`;
}

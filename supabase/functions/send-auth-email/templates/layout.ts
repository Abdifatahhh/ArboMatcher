/**
 * Shared ArboMatcher email layout.
 * Emerald brand, responsive, professional.
 */
export const LAYOUT = {
  primary: "#059669",
  primaryDark: "#047857",
  text: "#0F172A",
  textMuted: "#334155",
  bg: "#f0fdf4",
  white: "#ffffff",
  border: "#e2e8f0",
  footer: "#64748b",
  cardBg: "#ffffff",
} as const;

export function wrapBody(body: string, preheader?: string): string {
  return `<!DOCTYPE html>
<html lang="nl" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>ArboMatcher</title>
  ${preheader ? `<!--[if !mso]><!--><span style="display:none;font-size:0;color:#f0fdf4;line-height:0;max-height:0;max-width:0;opacity:0;overflow:hidden">${preheader}</span><!--<![endif]-->` : ""}
  <style>
    @media only screen and (max-width: 600px) {
      .email-container { padding: 16px !important; }
      .email-card { padding: 24px 20px !important; }
      .email-heading { font-size: 20px !important; }
      .email-cta { padding: 14px 24px !important; font-size: 15px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:${LAYOUT.bg};-webkit-font-smoothing:antialiased">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${LAYOUT.bg}">
    <tr>
      <td class="email-container" style="padding:32px 16px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto">
          <!-- Logo -->
          <tr>
            <td style="padding:0 0 24px;text-align:center">
              <span style="font-size:22px;font-weight:800;color:${LAYOUT.text};letter-spacing:-0.3px">Arbo</span><span style="font-size:22px;font-weight:800;color:${LAYOUT.primary};letter-spacing:-0.3px">Matcher</span>
            </td>
          </tr>
          <!-- Card -->
          <tr>
            <td class="email-card" style="background:${LAYOUT.cardBg};border-radius:16px;padding:40px 36px;box-shadow:0 1px 4px rgba(0,0,0,.06);border:1px solid ${LAYOUT.border}">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 0;text-align:center">
              <p style="margin:0 0 8px;font-size:12px;color:${LAYOUT.footer};line-height:1.6">
                ArboMatcher B.V. — Het platform voor arbo-professionals
              </p>
              <p style="margin:0;font-size:12px;color:${LAYOUT.footer};line-height:1.6">
                Vragen? <a href="mailto:support@arbomatcher.nl" style="color:${LAYOUT.primary};text-decoration:underline">support@arbomatcher.nl</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function ctaButton(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 0">
    <tr>
      <td style="border-radius:12px;background:${LAYOUT.primary}">
        <a href="${href}" class="email-cta" style="display:inline-block;padding:16px 32px;color:${LAYOUT.white};text-decoration:none;font-weight:600;font-size:16px;line-height:1;border-radius:12px">${label}</a>
      </td>
    </tr>
  </table>`;
}

export function otpCode(token: string): string {
  return `<p style="margin:16px 0 0;font-size:14px;color:${LAYOUT.textMuted}">Of gebruik deze code: <strong style="font-size:20px;letter-spacing:3px;color:${LAYOUT.text};font-family:monospace">${token}</strong></p>`;
}
